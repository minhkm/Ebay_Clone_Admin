import React, { useState, useEffect, useCallback } from 'react';
import { Radio, Skeleton, Alert, Button } from 'antd';
import {
  LineChartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  AppstoreAddOutlined,
  WarningOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import adminDashboardApi from '../../../../services/adminDashboardApi';
import { formatCurrencyVND, formatNumberVN } from '../../../../utils/currencyFormatter';
import './AnalyticsPanel.css';

/**
 * Analytics Panel Component (Phase 3)
 * Displays time-series metrics: Revenue, Orders, New Users, and New Listings.
 * Fully powered by MongoDB aggregation.
 */
const AnalyticsPanel = () => {
  const [period, setPeriod] = useState('month');
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalNewUsers: 0,
    totalNewListings: 0,
  });

  const fetchAnalytics = useCallback(async (selectedPeriod) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminDashboardApi.getAnalytics(selectedPeriod);
      if (res && res.success && res.data && Array.isArray(res.data.series)) {
        setChartData(res.data.series);

        // Calculate total summary for the active period
        const totalRev = res.data.series.reduce((sum, item) => sum + (item.revenue || 0), 0);
        const totalOrd = res.data.series.reduce((sum, item) => sum + (item.orders || 0), 0);
        const totalUsers = res.data.series.reduce((sum, item) => sum + (item.newUsers || 0), 0);
        const totalListings = res.data.series.reduce((sum, item) => sum + (item.newListings || 0), 0);

        setSummary({
          totalRevenue: Math.round(totalRev * 100) / 100,
          totalOrders: totalOrd,
          totalNewUsers: totalUsers,
          totalNewListings: totalListings,
        });
      } else {
        throw new Error(res?.message || 'Failed to load analytics series');
      }
    } catch (err) {
      console.error('[AnalyticsPanel] fetch error:', err);
      setError(err.message || 'Unable to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(period);
  }, [fetchAnalytics, period]);

  // Metric visual configuration
  const metricConfigs = {
    revenue: {
      key: 'revenue',
      title: 'Revenue',
      icon: <DollarOutlined />,
      color: '#0064d2',
      gradientId: 'colorRevenue',
      valueFormatter: (val) => formatCurrencyVND(val),
      summaryValue: formatCurrencyVND(summary.totalRevenue),
    },
    orders: {
      key: 'orders',
      title: 'Orders',
      icon: <ShoppingOutlined />,
      color: '#fa8c16',
      gradientId: 'colorOrders',
      valueFormatter: (val) => `${formatNumberVN(val)} đơn`,
      summaryValue: formatNumberVN(summary.totalOrders),
    },
    newUsers: {
      key: 'newUsers',
      title: 'New Users',
      icon: <UserAddOutlined />,
      color: '#52c41a',
      gradientId: 'colorUsers',
      valueFormatter: (val) => `${formatNumberVN(val)} người`,
      summaryValue: formatNumberVN(summary.totalNewUsers),
    },
    newListings: {
      key: 'newListings',
      title: 'New Listings',
      icon: <AppstoreAddOutlined />,
      color: '#722ed1',
      gradientId: 'colorListings',
      valueFormatter: (val) => `${formatNumberVN(val)} tin`,
      summaryValue: formatNumberVN(summary.totalNewListings),
    },
  };

  const currentConfig = metricConfigs[activeMetric] || metricConfigs.revenue;

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="ebay-chart-tooltip">
          <div className="tooltip-header">{data.label || label}</div>
          <div className="tooltip-body">
            <div className="tooltip-row revenue-row">
              <span className="tooltip-dot" style={{ backgroundColor: '#0064d2' }} />
              <span className="tooltip-name">Revenue:</span>
              <span className="tooltip-val">{formatCurrencyVND(data.revenue)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-dot" style={{ backgroundColor: '#fa8c16' }} />
              <span className="tooltip-name">Orders:</span>
              <span className="tooltip-val">{formatNumberVN(data.orders)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-dot" style={{ backgroundColor: '#52c41a' }} />
              <span className="tooltip-name">New Users:</span>
              <span className="tooltip-val">{formatNumberVN(data.newUsers)}</span>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-dot" style={{ backgroundColor: '#722ed1' }} />
              <span className="tooltip-name">New Listings:</span>
              <span className="tooltip-val">{formatNumberVN(data.newListings)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis tick values
  const formatYAxisTick = (val) => {
    if (activeMetric === 'revenue') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M ₫`;
      if (val >= 1000) return `${(val / 1000).toFixed(0)}k ₫`;
      return `${val} ₫`;
    }
    return formatNumberVN(val);
  };

  return (
    <div className="ebay-card analytics-panel">
      {/* Header with Title & Period Selector */}
      <div className="ebay-card-header analytics-header">
        <div className="analytics-title-group">
          <div className="analytics-icon-badge">
            <LineChartOutlined />
          </div>
          <div>
            <h3 className="ebay-card-title">Revenue & Marketplace Analytics</h3>
            <p className="analytics-subtitle">Time-series aggregation from real MongoDB transactions</p>
          </div>
        </div>

        <div className="analytics-controls">
          <Radio.Group
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            size="small"
            className="ebay-period-selector"
            disabled={loading}
          >
            <Radio.Button value="day">Day</Radio.Button>
            <Radio.Button value="week">Week</Radio.Button>
            <Radio.Button value="month">Month</Radio.Button>
            <Radio.Button value="quarter">Quarter</Radio.Button>
          </Radio.Group>
        </div>
      </div>

      {/* Metric Tabs Bar */}
      <div className="analytics-metrics-tabbar">
        {Object.values(metricConfigs).map((cfg) => {
          const isActive = activeMetric === cfg.key;
          return (
            <button
              type="button"
              key={cfg.key}
              className={`metric-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveMetric(cfg.key)}
            >
              <div className="tab-left">
                <span className="tab-icon" style={{ color: cfg.color }}>
                  {cfg.icon}
                </span>
                <span className="tab-title">{cfg.title}</span>
              </div>
              <div className="tab-value" style={{ color: isActive ? cfg.color : undefined }}>
                {loading ? <Skeleton.Input active size="small" style={{ width: 60, height: 20 }} /> : cfg.summaryValue}
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas Area */}
      <div className="analytics-chart-container">
        {error && !loading ? (
          <div className="analytics-error-box">
            <Alert
              type="error"
              showIcon
              icon={<WarningOutlined />}
              message="Unable to load analytics data"
              description={
                <div className="error-retry-row">
                  <span>{error}</span>
                  <Button
                    size="small"
                    type="primary"
                    danger
                    icon={<ReloadOutlined />}
                    onClick={() => fetchAnalytics(period)}
                  >
                    Retry
                  </Button>
                </div>
              }
            />
          </div>
        ) : loading ? (
          <div className="chart-loading-box">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={chartData}
                margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id={currentConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  stroke="#8c8c8c"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  dy={6}
                />
                <YAxis
                  stroke="#8c8c8c"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={formatYAxisTick}
                  width={75}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={currentConfig.key}
                  stroke={currentConfig.color}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${currentConfig.gradientId})`}
                  activeDot={{ r: 6, stroke: currentConfig.color, strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;
