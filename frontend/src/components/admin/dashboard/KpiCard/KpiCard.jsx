import React from 'react';
import { Skeleton } from 'antd';
import './KpiCard.css';

/**
 * Reusable KPI Card Component
 * Displays marketplace aggregate metrics.
 * In Phase 1: Displays "—" or skeleton per specifications (NO fake data).
 */
const KpiCard = ({
  title,
  value = '—',
  icon,
  iconBgColor = '#eef3ff',
  iconColor = '#3665f3',
  footnote = '—',
  loading = false,
}) => {
  return (
    <div className="ebay-kpi-card">
      <div className="kpi-top">
        <span className="kpi-title">{title}</span>
        {icon && (
          <div
            className="kpi-icon-wrapper"
            style={{ backgroundColor: iconBgColor, color: iconColor }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="kpi-body">
        {loading ? (
          <Skeleton.Input active size="small" style={{ width: 100, height: 32 }} />
        ) : (
          <span className="kpi-value">{value}</span>
        )}
      </div>

      <div className="kpi-footer">
        <span className="kpi-footnote">{footnote}</span>
      </div>
    </div>
  );
};

export default KpiCard;
