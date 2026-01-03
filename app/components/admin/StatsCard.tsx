// src/components/admin/StatsCard.tsx

'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color = 'blue',
}) => {
  const isPositive = trend && trend >= 0;
  
  const colorClasses = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    purple: 'border-l-purple-500',
    orange: 'border-l-orange-500',
  };

  const trendColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-500',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-gray-600 font-medium uppercase tracking-wide">{title}</h3>
        </div>
        <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          {icon}
        </div>
      </div>

      <p className="text-3xl font-bold text-gray-800 mb-3">{value}</p>

      {trend !== undefined && (
        <div className={`flex items-center gap-2 text-sm font-medium ${
          isPositive ? trendColorClasses.positive : trendColorClasses.negative
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {Math.abs(trend)}% {trendLabel || 'from last month'}
          </span>
        </div>
      )}
    </div>
  );
};

