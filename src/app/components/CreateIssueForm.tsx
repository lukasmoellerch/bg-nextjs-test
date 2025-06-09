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
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <span className="text-gray-500">+ Create new issue...</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="border border-gray-300 rounded-lg p-4 space-y-4">
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Issue title..."
            className="w-full text-lg font-medium border-none outline-none resize-none"
            autoFocus
          />
        </div>

        <div>
          <RichTextEditor
            content={description}
            onChange={setDescription}
            placeholder="Describe the issue..."
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Priority:
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Issue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}