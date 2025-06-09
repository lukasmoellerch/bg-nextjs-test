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
      <div className="card-elevated cursor-pointer transition-all duration-300 hover:scale-[1.01]" onClick={() => setIsExpanded(true)}>
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            +
          </div>
          <div>
            <h3 className="text-headline font-medium text-gray-900">Create new issue</h3>
            <p className="text-subheadline text-gray-500 mt-1">
              Describe a problem, feature request, or improvement
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="card-elevated p-0 overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-headline font-medium text-gray-900">New Issue</h3>
          </div>

          {/* Title Input */}
          <div className="px-6 py-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title..."
              className="input border-0 bg-transparent text-title-3 font-medium placeholder:text-gray-400 px-0 focus:ring-0 focus:shadow-none"
              autoFocus
            />
          </div>

          {/* Rich Text Editor */}
          <div className="px-0">
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Describe the issue in detail..."
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label htmlFor="priority" className="text-subheadline font-medium text-gray-700">
                Priority:
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="input select border-gray-200 bg-white py-2 px-3 text-sm min-w-[100px]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="btn btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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