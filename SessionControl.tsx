import React, { useState } from 'react';
import { Play, Square, BookOpen } from 'lucide-react';
import { AttendanceSession } from '../types/attendance';

interface SessionControlProps {
  currentSession: AttendanceSession | null;
  onStartSession: (subject: string) => void;
  onEndSession: () => void;
}

export const SessionControl: React.FC<SessionControlProps> = ({
  currentSession,
  onStartSession,
  onEndSession,
}) => {
  const [subject, setSubject] = useState('');
  const [showStartForm, setShowStartForm] = useState(false);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim()) {
      onStartSession(subject.trim());
      setSubject('');
      setShowStartForm(false);
    }
  };

  if (currentSession) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Session Active: {currentSession.subject}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Started at {new Date(currentSession.startTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={onEndSession}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Square className="h-4 w-4 mr-2" />
            End Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
      {!showStartForm ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Active Session</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Start a new attendance session to begin marking attendance</p>
          <button
            onClick={() => setShowStartForm(true)}
            className="flex items-center mx-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="h-4 w-4 mr-2" />
            Start New Session
          </button>
        </div>
      ) : (
        <form onSubmit={handleStartSession} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject/Class Name
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Computer Science 101"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </button>
            <button
              type="button"
              onClick={() => setShowStartForm(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};