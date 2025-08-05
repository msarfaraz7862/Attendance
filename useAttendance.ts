import { useState, useEffect } from 'react';
import { Student, AttendanceRecord, AttendanceSession } from '../types/attendance';
import { Class } from '../components/ClassManager';


export const useAttendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load attendance records from localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem('classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }

    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }

    const savedRecords = localStorage.getItem('attendanceRecords');
    if (savedRecords) {
      setAttendanceRecords(JSON.parse(savedRecords));
    }

    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      setCurrentSession(JSON.parse(savedSession));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // Save to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    if (currentSession) {
      localStorage.setItem('currentSession', JSON.stringify(currentSession));
    } else {
      localStorage.removeItem('currentSession');
    }
  }, [currentSession]);

  // Class management functions
  const addClass = (classData: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, classData: Omit<Class, 'id'>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...classData, id } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    // Also remove students from this class
    setStudents(prev => prev.filter(s => s.classId !== id));
  };

  // Student management functions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentData: Omit<Student, 'id'>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...studentData, id } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    // Also remove attendance records for this student
    setAttendanceRecords(prev => prev.filter(r => r.studentId !== id));
  };

  // Get filtered students based on selected class
  const getFilteredStudents = () => {
    if (!selectedClass) return students;
    return students.filter(student => student.classId === selectedClass);
  };

  const startSession = (subject: string) => {
    const now = new Date();
    const session: AttendanceSession = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      subject,
      startTime: now.toISOString(),
      endTime: '',
      isActive: true,
    };
    setCurrentSession(session);
  };

  const endSession = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: new Date().toISOString(),
        isActive: false,
      };
      setCurrentSession(null);
    }
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!currentSession) return;

    setLoading(true);
    
    // Remove existing record for today if any
    const today = new Date().toISOString().split('T')[0];
    const filteredRecords = attendanceRecords.filter(
      record => !(record.studentId === studentId && record.date === today)
    );

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId,
      date: today,
      status,
      timestamp: new Date().toISOString(),
    };

    setAttendanceRecords([...filteredRecords, newRecord]);
    
    setTimeout(() => setLoading(false), 300); // Simulate API call
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.filter(record => record.date === today);
  };

  const getStudentAttendanceStatus = (studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const record = attendanceRecords.find(
      record => record.studentId === studentId && record.date === today
    );
    return record?.status || null;
  };

  const getAttendanceStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(record => record.date === today);
    const filteredStudents = getFilteredStudents();
    
    const present = todayRecords.filter(record => record.status === 'present').length;
    const absent = todayRecords.filter(record => record.status === 'absent').length;
    const late = todayRecords.filter(record => record.status === 'late').length;
    const total = filteredStudents.length;
    const unmarked = total - todayRecords.length;

    return { present, absent, late, unmarked, total };
  };

  return {
    students: getFilteredStudents(),
    allStudents: students,
    classes,
    selectedClass,
    attendanceRecords,
    currentSession,
    loading,
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
    getTodayAttendance,
    getStudentAttendanceStatus,
    getAttendanceStats,
  };
};