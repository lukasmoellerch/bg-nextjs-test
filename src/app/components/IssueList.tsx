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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open': return 'badge badge-open';
      case 'in_progress': return 'badge badge-in-progress';
      case 'closed': return 'badge badge-closed';
      default: return 'badge badge-closed';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'badge badge-high';
      case 'medium': return 'badge badge-medium';
      case 'low': return 'badge badge-low';
      default: return 'badge badge-medium';
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
      <div className="card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-headline font-medium text-gray-900 mb-2">No issues yet</h3>
        <p className="text-subheadline text-gray-500">
          Create your first issue to get started tracking problems and improvements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => (
        <div 
          key={issue.id} 
          className={`card overflow-hidden transition-all duration-300 ${expandedIssue === issue.id ? 'card-elevated' : ''}`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {editingIssue === issue.id ? (
            <div className="p-0">
              {/* Edit Header */}
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                <h4 className="text-headline font-medium text-gray-900">Edit Issue</h4>
              </div>

              {/* Edit Form */}
              <div className="p-6 space-y-6">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input text-title-3 font-medium"
                  placeholder="Issue title..."
                />
                
                <RichTextEditor
                  content={editDescription}
                  onChange={setEditDescription}
                  placeholder="Edit description..."
                />
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <label className="text-subheadline font-medium text-gray-700">Priority:</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="input select border-gray-200 bg-white py-2 px-3 text-sm min-w-[100px]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleEditCancel}
                      className="btn btn-ghost px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditSave(issue.id!)}
                      className="btn btn-primary px-6 py-2"
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-headline font-medium text-gray-900 truncate">{issue.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={getStatusBadgeClass(issue.status)}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span className={getPriorityBadgeClass(issue.priority)}>
                        {issue.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-caption text-gray-500">
                    <span>Created {formatDate(issue.created_at)}</span>
                    {issue.updated_at !== issue.created_at && (
                      <>
                        <span>•</span>
                        <span>Updated {formatDate(issue.updated_at)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id!)}
                    className="btn btn-ghost px-3 py-2 text-sm"
                  >
                    {expandedIssue === issue.id ? 'Collapse' : 'Expand'}
                  </button>
                  
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id!, e.target.value as 'open' | 'in_progress' | 'closed')}
                    className="input select border-gray-200 bg-white py-2 px-3 text-sm min-w-[120px]"
                    disabled={isPending}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <button
                    onClick={() => handleEditStart(issue)}
                    className="btn btn-ghost px-3 py-2 text-sm"
                    title="Edit issue"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(issue.id!)}
                    className="btn btn-destructive px-3 py-2 text-sm"
                    disabled={isPending}
                    title="Delete issue"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedIssue === issue.id && (
                <div className="animate-slide-up">
                  <div className="border-t border-gray-100 pt-6 mt-4">
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: issue.description || '<p class="text-gray-500 italic">No description provided.</p>' 
                      }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}