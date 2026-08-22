import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ReturnRequest from '../models/ReturnRequest.js';
import Dispute from '../models/Dispute.js';
import Store from '../models/Store.js';

const TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Service to retrieve Admin Dashboard Overview KPIs (Phase 2)
 */
export const getOverviewService = async () => {
  const [totalUsers, totalListings, totalOrders, revenueResult] = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({}),
    Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]),
  ]);

  const rawRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
  const totalRevenue = Math.round(rawRevenue * 100) / 100;

  return {
    totalUsers,
    totalListings,
    totalOrders,
    totalRevenue,
  };
};

/**
 * Service to retrieve Order Overview status counts (Phase 4)
 */
export const getOrderOverviewService = async () => {
  const statusCountsAgg = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const countsMap = new Map(statusCountsAgg.map((item) => [item._id, item.count]));

  const pending = countsMap.get('pending') || 0;
  const processing = countsMap.get('processing') || 0;
  const shipping = countsMap.get('shipping') || 0;
  const shipped = countsMap.get('shipped') || 0;
  const cancelled = countsMap.get('cancelled') || 0;
  const returned = countsMap.get('returned') || 0;

  const total = statusCountsAgg.reduce((sum, item) => sum + item.count, 0);

  return {
    pending,
    processing,
    shipping,
    shipped,
    cancelled,
    returned,
    total,
  };
};

/**
 * Service to retrieve User Overview statistics (Phase 5)
 */
export const getUserOverviewService = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalUsers, buyers, sellers, newUsers, admins] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: 'buyer' }),
    User.countDocuments({ role: 'seller' }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.countDocuments({ role: 'admin' }),
  ]);

  return {
    totalUsers,
    buyers,
    sellers,
    newUsers,
    admins,
  };
};

/**
 * Service to retrieve Attention Required items (Phase 6)
 */
export const getAttentionRequiredService = async () => {
  const [returnCount, returnDocs, disputeCount, disputeDocs, pendingStoreCount] = await Promise.all([
    ReturnRequest.countDocuments({ status: { $in: ['pending', 'open', 'under_review'] } }),
    ReturnRequest.find({ status: { $in: ['pending', 'open', 'under_review'] } })
      .populate('userId', 'username fullname email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Dispute.countDocuments({ status: { $in: ['open', 'under_review', 'new', 'processing'] } }),
    Dispute.find({ status: { $in: ['open', 'under_review', 'new', 'processing'] } })
      .populate('raisedBy', 'username fullname email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Store.countDocuments({ status: 'pending' }),
  ]);

  const returnRequestsItems = returnDocs.map((doc) => ({
    id: doc._id.toString(),
    orderItemId: doc.orderItemId?.toString() || '—',
    buyerName: doc.userId?.fullname || doc.userId?.username || '—',
    reason: doc.reason || '—',
    status: doc.status || 'pending',
    createdAt: doc.createdAt,
  }));

  const disputeItems = disputeDocs.map((doc) => ({
    id: doc._id.toString(),
    orderItemId: doc.orderItemId?.toString() || '—',
    raisedByName: doc.raisedBy?.fullname || doc.raisedBy?.username || '—',
    description: doc.description || '—',
    status: doc.status || 'open',
    resolution: doc.resolution || null,
    createdAt: doc.createdAt,
  }));

  const total = returnCount + disputeCount + pendingStoreCount;

  return {
    returnRequests: {
      count: returnCount,
      items: returnRequestsItems,
    },
    activeDisputes: {
      count: disputeCount,
      items: disputeItems,
    },
    reportedProducts: {
      count: 0,
      items: [],
    },
    reportedReviews: {
      count: 0,
      items: [],
    },
    pendingSellerApprovals: {
      count: pendingStoreCount,
      items: [],
    },
    total,
  };
};

/**
 * Helper to generate continuous time slots for each period type
 */
function generateTimeSlots(period, startDate, endDate) {
  const slots = [];
  const current = new Date(startDate);

  if (period === 'day') {
    while (current <= endDate) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      const label = `${dd}/${mm}`;

      slots.push({ key, label, start: key });
      current.setDate(current.getDate() + 1);
    }
  } else if (period === 'week') {
    while (current <= endDate) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      
      const endOfWeek = new Date(current);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      const endDd = String(endOfWeek.getDate()).padStart(2, '0');
      const endMm = String(endOfWeek.getMonth() + 1).padStart(2, '0');
      const label = `${dd}/${mm} - ${endDd}/${endMm}`;

      slots.push({ key, label, start: key });
      current.setDate(current.getDate() + 7);
    }
  } else if (period === 'month') {
    while (current <= endDate) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const key = `${yyyy}-${mm}`;
      const label = `T${Number(mm)}/${yyyy}`;

      slots.push({ key, label, start: `${key}-01` });
      current.setMonth(current.getMonth() + 1);
    }
  } else if (period === 'quarter') {
    while (current <= endDate) {
      const yyyy = current.getFullYear();
      const q = Math.floor(current.getMonth() / 3) + 1;
      const key = `${yyyy}-Q${q}`;
      const label = `Quý ${q}/${yyyy}`;

      slots.push({ key, label, start: `${yyyy}-${String((q - 1) * 3 + 1).padStart(2, '0')}-01` });
      current.setMonth(current.getMonth() + 3);
    }
  }

  return slots;
}

/**
 * Service to aggregate revenue, orders, newUsers, newListings over time (Phase 3)
 */
export const getAnalyticsService = async (period = 'month') => {
  const validPeriods = ['day', 'week', 'month', 'quarter'];
  if (!validPeriods.includes(period)) {
    throw new Error(`Invalid period "${period}". Valid options: ${validPeriods.join(', ')}`);
  }

  const now = new Date();
  let startDate;
  let endDate = new Date(now);
  let groupExpression;

  if (period === 'day') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0);
    groupExpression = {
      $dateToString: { date: '$createdAt', timezone: TIMEZONE, format: '%Y-%m-%d' },
    };
  } else if (period === 'week') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 12 * 7, 0, 0, 0, 0);
    groupExpression = {
      $dateToString: { date: '$createdAt', timezone: TIMEZONE, format: '%Y-%m-%d' },
    };
  } else if (period === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 13, 1, 0, 0, 0, 0);
    groupExpression = {
      $dateToString: { date: '$createdAt', timezone: TIMEZONE, format: '%Y-%m' },
    };
  } else if (period === 'quarter') {
    const currentQ = Math.floor(now.getMonth() / 3);
    startDate = new Date(now.getFullYear() - 2, currentQ * 3, 1, 0, 0, 0, 0);
    groupExpression = {
      $concat: [
        { $toString: { $year: { date: '$createdAt', timezone: TIMEZONE } } },
        '-Q',
        {
          $toString: {
            $ceil: {
              $divide: [{ $month: { date: '$createdAt', timezone: TIMEZONE } }, 3],
            },
          },
        },
      ],
    };
  }

  const [ordersAgg, usersAgg, productsAgg] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupExpression,
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $ne: ['$status', 'cancelled'] }, '$totalPrice', 0],
            },
          },
        },
      },
    ]),
    User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupExpression,
          newUsers: { $sum: 1 },
        },
      },
    ]),
    Product.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupExpression,
          newListings: { $sum: 1 },
        },
      },
    ]),
  ]);

  const ordersMap = new Map(ordersAgg.map((item) => [item._id, item]));
  const usersMap = new Map(usersAgg.map((item) => [item._id, item]));
  const productsMap = new Map(productsAgg.map((item) => [item._id, item]));

  const slots = generateTimeSlots(period, startDate, endDate);

  const series = slots.map((slot) => {
    let orderData = ordersMap.get(slot.key);
    let userData = usersMap.get(slot.key);
    let productData = productsMap.get(slot.key);

    if (period === 'week') {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slotStart);
      slotEnd.setDate(slotEnd.getDate() + 7);

      let weekOrders = 0;
      let weekRev = 0;
      let weekUsers = 0;
      let weekProducts = 0;

      for (const [dateStr, o] of ordersMap.entries()) {
        const d = new Date(dateStr);
        if (d >= slotStart && d < slotEnd) {
          weekOrders += o.orders || 0;
          weekRev += o.revenue || 0;
        }
      }
      for (const [dateStr, u] of usersMap.entries()) {
        const d = new Date(dateStr);
        if (d >= slotStart && d < slotEnd) {
          weekUsers += u.newUsers || 0;
        }
      }
      for (const [dateStr, p] of productsMap.entries()) {
        const d = new Date(dateStr);
        if (d >= slotStart && d < slotEnd) {
          weekProducts += p.newListings || 0;
        }
      }

      return {
        label: slot.label,
        start: slot.start,
        revenue: Math.round(weekRev * 100) / 100,
        orders: weekOrders,
        newUsers: weekUsers,
        newListings: weekProducts,
      };
    }

    return {
      label: slot.label,
      start: slot.start,
      revenue: orderData?.revenue ? Math.round(orderData.revenue * 100) / 100 : 0,
      orders: orderData?.orders || 0,
      newUsers: userData?.newUsers || 0,
      newListings: productData?.newListings || 0,
    };
  });

  return {
    period,
    range: {
      from: startDate.toISOString(),
      to: endDate.toISOString(),
    },
    series,
  };
};

export default {
  getOverviewService,
  getOrderOverviewService,
  getUserOverviewService,
  getAttentionRequiredService,
  getAnalyticsService,
};
