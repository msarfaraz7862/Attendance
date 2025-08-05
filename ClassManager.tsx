import React, { useState } from 'react';
import { Plus, Edit2, Trash2, School } from 'lucide-react';

export interface Class {
  id: string;
  name: string;
  section: string;
}

interface ClassManagerProps {
  classes: Class[];
  selectedClass: string | null;
  onAddClass: (classData: Omit<Class, 'id'>) => void;
  onUpdateClass: (id: string, classData: Omit<Class, 'id'>) => void;
  onDeleteClass: (id: string) => void;
  onSelectClass: (classId: string | null) => void;
}

export const ClassManager: React.FC<ClassManagerProps> = ({
  classes,
  selectedClass,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onSelectClass,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({ name: '', section: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.section.trim()) {
      if (editingClass) {
        onUpdateClass(editingClass.id, formData);
        setEditingClass(null);
      } else {
        onAddClass(formData);
      }
      setFormData({ name: '', section: '' });
      setShowForm(false);
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({ name: classItem.name, section: classItem.section });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClass(null);
    setFormData({ name: '', section: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <School className="h-5 w-5 mr-2" />
          Class Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Class
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Class Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Grade 10"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Section
              </label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="e.g., A"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingClass ? 'Update' : 'Add'} Class
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        <div
          onClick={() => onSelectClass(null)}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedClass === null
              ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
          } border`}
        >
          <div className="font-medium text-gray-900 dark:text-white">All Classes</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">View all students</div>
        </div>
        
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            onClick={() => onSelectClass(classItem.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedClass === classItem.id
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            } border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {classItem.name} - Section {classItem.section}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(classItem);
                  }}
                  className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClass(classItem.id);
                  }}
                  className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};