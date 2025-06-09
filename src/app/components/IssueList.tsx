'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { updateIssueStatus, deleteIssue, updateIssue } from '../actions';
import type { Issue } from '@/lib/schema';
import RichTextEditor from './RichTextEditor';

interface IssueListProps {
  initialIssues: Issue[];
}

export default function IssueList({ initialIssues }: IssueListProps) {
  const [isPending, startTransition] = useTransition();
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [editingIssue, setEditingIssue] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [issues, optimisticUpdate] = useOptimistic(
    initialIssues,
    (state: Issue[], update: { type: 'status' | 'delete' | 'edit'; id: number; status?: string; title?: string; description?: string; priority?: string }) => {
      if (update.type === 'status') {
        return state.map(issue =>
          issue.id === update.id
            ? { ...issue, status: update.status as 'open' | 'in_progress' | 'closed' }
            : issue
        );
      } else if (update.type === 'delete') {
        return state.filter(issue => issue.id !== update.id);
      } else if (update.type === 'edit') {
        return state.map(issue =>
          issue.id === update.id
            ? { ...issue, title: update.title!, description: update.description!, priority: update.priority! as 'low' | 'medium' | 'high' }
            : issue
        );
      }
      return state;
    }
  );

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'closed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  async function handleStatusChange(id: number, status: 'open' | 'in_progress' | 'closed') {
    startTransition(async () => {
      optimisticUpdate({ type: 'status', id, status });
      await updateIssueStatus(id, status);
    });
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    
    startTransition(async () => {
      optimisticUpdate({ type: 'delete', id });
      await deleteIssue(id);
    });
  }

  function handleEditStart(issue: Issue) {
    setEditingIssue(issue.id!);
    setEditTitle(issue.title);
    setEditDescription(issue.description);
    setEditPriority(issue.priority);
    setExpandedIssue(null);
  }

  async function handleEditSave(id: number) {
    startTransition(async () => {
      optimisticUpdate({ 
        type: 'edit', 
        id, 
        title: editTitle, 
        description: editDescription, 
        priority: editPriority 
      });
      await updateIssue(id, editTitle, editDescription, editPriority);
      setEditingIssue(null);
    });
  }

  function handleEditCancel() {
    setEditingIssue(null);
    setEditTitle('');
    setEditDescription('');
    setEditPriority('medium');
  }

  function formatDate(date: Date | string | number) {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: new Date(date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No issues yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Create your first issue to get started tracking problems and improvements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue, index) => (
        <div 
          key={issue.id} 
          className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
            expandedIssue === issue.id ? 'shadow-xl' : ''
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {editingIssue === issue.id ? (
            <div>
              {/* Edit Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h4 className="text-xl font-semibold text-gray-900">Edit Issue</h4>
              </div>

              {/* Edit Form */}
              <div className="p-8 space-y-6">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-2xl font-semibold border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Issue title..."
                />
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <RichTextEditor
                    content={editDescription}
                    onChange={setEditDescription}
                    placeholder="Edit description..."
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Priority:</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleEditCancel}
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditSave(issue.id!)}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Issue Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 truncate">{issue.title}</h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyles(issue.status)}`}>
                      {issue.status.replace('_', ' ').charAt(0).toUpperCase() + issue.status.slice(1).replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${getPriorityStyles(issue.priority)}`}>
                      <span>{getPriorityIcon(issue.priority)}</span>
                      {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Created {formatDate(issue.created_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id!)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    {expandedIssue === issue.id ? 'Collapse' : 'View Details'}
                  </button>
                  
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id!, e.target.value as 'open' | 'in_progress' | 'closed')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    disabled={isPending}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <button
                    onClick={() => handleEditStart(issue)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                    title="Edit issue"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(issue.id!)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                    disabled={isPending}
                    title="Delete issue"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedIssue === issue.id && (
                <div className="animate-in mt-6 pt-6 border-t border-gray-100">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <div dangerouslySetInnerHTML={{ 
                      __html: issue.description || '<p class="text-gray-500 italic">No description provided.</p>' 
                    }} />
                  </div>
                  
                  {issue.updated_at !== issue.created_at && (
                    <div className="mt-4 text-sm text-gray-500">
                      Last updated {formatDate(issue.updated_at)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}