import React from 'react';
import { Calendar, GraduationCap, Settings, BarChart3 } from 'lucide-react';
import { useAttendance } from './hooks/useAttendance';
import { useTheme } from './hooks/useTheme';
import { AttendanceStats } from './components/AttendanceStats';
import { SessionControl } from './components/SessionControl';
import { StudentList } from './components/StudentList';
import { ThemeToggle } from './components/ThemeToggle';
import { ClassManager } from './components/ClassManager';
import { StudentManager } from './components/StudentManager';
import { AttendanceHistory } from './components/AttendanceHistory';

function App() {
  const [activeTab, setActiveTab] = React.useState<'attendance' | 'manage' | 'history'>('attendance');
  const {
    students,
    allStudents,
    classes,
    selectedClass,
    currentSession,
    loading,
    attendanceRecords,
    setSelectedClass,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    startSession,
    endSession,
    markAttendance,
    getStudentAttendanceStatus,
    getAttendanceStats,
  } = useAttendance();

  const stats = getAttendanceStats();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance System</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage student attendance efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{today}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'attendance'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <GraduationCap className="h-4 w-4 inline mr-2" />
                Attendance
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Manage
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Statistics
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Class Filter */}
            {classes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Class
                </label>
                <select
                  value={selectedClass || ''}
                  onChange={(e) => setSelectedClass(e.target.value || null)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Classes</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name} - Section {classItem.section}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Session Control */}
            <SessionControl
              currentSession={currentSession}
              onStartSession={startSession}
              onEndSession={endSession}
            />

            {/* Attendance Stats */}
            <AttendanceStats stats={stats} />

            {/* Student List */}
            <StudentList
              students={students}
              getStudentStatus={getStudentAttendanceStatus}
              onMarkAttendance={markAttendance}
              loading={loading}
              sessionActive={!!currentSession}
            />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClassManager
              classes={classes}
              selectedClass={selectedClass}
              onAddClass={addClass}
              onUpdateClass={updateClass}
              onDeleteClass={deleteClass}
              onSelectClass={setSelectedClass}
            />
            <StudentManager
              students={allStudents}
              classes={classes}
              onAddStudent={addStudent}
              onUpdateStudent={updateStudent}
              onDeleteStudent={deleteStudent}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <AttendanceHistory
            attendanceRecords={attendanceRecords}
            students={allStudents}
            classes={classes}
          />
        )}
      </div>
    </div>
  );
}

export default App;
