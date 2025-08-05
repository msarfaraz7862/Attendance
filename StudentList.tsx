import React from 'react';
import { UserCheck, UserX, Clock, User } from 'lucide-react';
import { Student } from '../types/attendance';

interface StudentListProps {
  students: Student[];
  getStudentStatus: (studentId: string) => 'present' | 'absent' | 'late' | null;
  onMarkAttendance: (studentId: string, status: 'present' | 'absent' | 'late') => void;
  loading: boolean;
  sessionActive: boolean;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  getStudentStatus,
  onMarkAttendance,
  loading,
  sessionActive,
}) => {
  const getStatusColor = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'late' | null) => {
    switch (status) {
      case 'present':
        return <UserCheck className="h-4 w-4" />;
      case 'absent':
        return <UserX className="h-4 w-4" />;
      case 'late':
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (!sessionActive) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No Active Session</p>
          <p className="text-sm">Start a session to begin marking attendance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Attendance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Click on a status button to mark attendance</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {students.map((student) => {
          const status = getStudentStatus(student.id);
          return (
            <div key={student.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {student.rollNumber} • {student.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className="ml-1 capitalize">{status || 'unmarked'}</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onMarkAttendance(student.id, 'present')}
                      disabled={loading}
                      className={`p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 ${
                        status === 'present' ? 'bg-green-100' : ''
                      }`}
                      title="Mark Present"
                    >
                      <UserCheck className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onMarkAttendance(student.id, 'late')}
                      disabled={loading}
                      className={`p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 ${
                        status === 'late' ? 'bg-yellow-100' : ''
                      }`}
                      title="Mark Late"
                    >
                      <Clock className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onMarkAttendance(student.id, 'absent')}
                      disabled={loading}
                      className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 ${
                        status === 'absent' ? 'bg-red-100' : ''
                      }`}
                      title="Mark Absent"
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {students.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No students found. Add students in the Manage tab to get started.
        </div>
      )}
    </div>
  );
};