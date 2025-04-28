import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

export const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  bgColor = 'bg-white' 
}: DashboardCardProps) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-sm p-6 flex items-center`}>
      <div className="mr-4 bg-[#f8f0e9] rounded-lg p-3">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        
        {trend && (
          <p className={`text-xs flex items-center mt-2 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            <span className="text-gray-500 ml-1">vs last month</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;