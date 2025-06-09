'use client';

import { useState } from 'react';
import { createIssue } from '../actions';
import RichTextEditor from './RichTextEditor';

export default function CreateIssueForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    
    await createIssue(trimmedTitle, description, priority);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsExpanded(false);
  }

  function handleCancel() {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsExpanded(false);
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
      >
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Create new issue
            </h3>
            <p className="text-gray-600 mt-1">
              Describe a problem, feature request, or improvement
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="animate-in slide-in-from-top duration-300 ease-out">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">New Issue</h3>
          </div>

          {/* Title Input */}
          <div className="px-8 py-6 border-b border-gray-100">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title..."
              className="w-full text-2xl font-semibold placeholder-gray-400 outline-none focus:placeholder-gray-300 transition-colors"
              autoFocus
            />
          </div>

          {/* Rich Text Editor */}
          <div className="border-b border-gray-100">
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Provide detailed information about the issue..."
            />
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label htmlFor="priority" className="text-sm font-medium text-gray-700">
                Priority:
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all"
              >
                Create Issue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}