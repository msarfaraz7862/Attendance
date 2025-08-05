import React, { useState } from 'react';
import { Calendar, BarChart3, TrendingUp, User } from 'lucide-react';
import { AttendanceRecord, Student } from '../types/attendance';
import { Class } from './ClassManager';

interface AttendanceHistoryProps {
  attendanceRecords: AttendanceRecord[];
  students: Student[];
  classes: Class[];
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  attendanceRecords,
  students,
  classes,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.classId === selectedClass);

  const filteredRecords = attendanceRecords.filter(record => {
    const student = students.find(s => s.id === record.studentId);
    if (!student) return false;
    
    if (selectedClass !== 'all' && student.classId !== selectedClass) return false;
    if (selectedStudent !== 'all' && record.studentId !== selectedStudent) return false;
    
    return true;
  });

  const getStudentStats = (studentId: string) => {
    const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
    const total = studentRecords.length;
    const present = studentRecords.filter(r => r.status === 'present').length;
    const late = studentRecords.filter(r => r.status === 'late').length;
    const absent = studentRecords.filter(r => r.status === 'absent').length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, late, absent, attendanceRate };
  };

  const getClassStats = (classId: string) => {
    const classStudents = students.filter(s => s.classId === classId);
    const classRecords = attendanceRecords.filter(r => 
      classStudents.some(s => s.id === r.studentId)
    );
    
    const total = classRecords.length;
    const present = classRecords.filter(r => r.status === 'present').length;
    const late = classRecords.filter(r => r.status === 'late').length;
    const absent = classRecords.filter(r => r.status === 'absent').length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, late, absent, attendanceRate, studentCount: classStudents.length };
  };

  const getOverallStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, late, absent, attendanceRate };
  };

  const getClassName = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? `${classItem.name} - ${classItem.section}` : 'Unknown Class';
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const overallStats = getOverallStats();

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Overall Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{overallStats.total}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Records</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{overallStats.present}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{overallStats.late}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Late</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{overallStats.absent}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{overallStats.attendanceRate}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Class-wise Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Class-wise Statistics
        </h2>
        <div className="space-y-4">
          {classes.map((classItem) => {
            const stats = getClassStats(classItem.id);
            return (
              <div key={classItem.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {getClassName(classItem.id)}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.studentCount} students
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{stats.total}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Records</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{stats.present}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Present</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-600">{stats.late}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Late</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-600">{stats.absent}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Absent</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">{stats.attendanceRate}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Rate</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Attendance Records
        </h2>
        
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudent('all');
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Classes</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {getClassName(classItem.id)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Students</option>
              {filteredStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.rollNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student-wise Statistics */}
        {selectedStudent !== 'all' && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              {getStudentName(selectedStudent)} Statistics
            </h3>
            {(() => {
              const stats = getStudentStats(selectedStudent);
              return (
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{stats.total}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{stats.present}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Present</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-600">{stats.late}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Late</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-600">{stats.absent}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Absent</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">{stats.attendanceRate}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Rate</div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Class</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const student = students.find(s => s.id === record.studentId);
                return (
                  <tr key={record.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {student ? `${student.name} (${student.rollNumber})` : 'Unknown'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {student ? getClassName(student.classId) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : record.status === 'late'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No attendance records found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};