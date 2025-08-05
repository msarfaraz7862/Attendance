import React from 'react';
import { Users, UserCheck, UserX, Clock, AlertCircle } from 'lucide-react';

interface AttendanceStatsProps {
  stats: {
    present: number;
    absent: number;
    late: number;
    unmarked: number;
    total: number;
  };
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ stats }) => {
  const { present, absent, late, unmarked, total } = stats;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <UserCheck className="h-8 w-8 text-green-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Present</p>
            <p className="text-2xl font-semibold text-green-600">{present}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <UserX className="h-8 w-8 text-red-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Absent</p>
            <p className="text-2xl font-semibold text-red-600">{absent}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-yellow-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Late</p>
            <p className="text-2xl font-semibold text-yellow-600">{late}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <AlertCircle className="h-8 w-8 text-orange-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unmarked</p>
            <p className="text-2xl font-semibold text-orange-600">{unmarked}</p>
          </div>
        </div>
      </div>
    </div>
  );
};