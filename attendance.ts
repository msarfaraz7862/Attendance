export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  classId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  timestamp: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  subject: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}