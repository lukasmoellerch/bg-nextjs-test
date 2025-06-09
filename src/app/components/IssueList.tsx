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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  async function handleStatusChange(id: number, status: 'open' | 'in_progress' | 'closed') {
    startTransition(async () => {
      optimisticUpdate({ type: 'status', id, status });
      await updateIssueStatus(id, status);
    });
  }

  async function handleDelete(id: number) {
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

  if (issues.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No issues yet. Create your first issue above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div key={issue.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          {editingIssue === issue.id ? (
            <div className="space-y-4">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-lg font-medium border border-gray-300 rounded px-3 py-2"
              />
              <RichTextEditor
                content={editDescription}
                onChange={setEditDescription}
                placeholder="Edit description..."
              />
              <div className="flex items-center justify-between">
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditCancel}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditSave(issue.id!)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-lg">{issue.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </div>
                  
                  {expandedIssue === issue.id && (
                    <div className="mt-3 prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: issue.description || '<p>No description</p>' }} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id!)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {expandedIssue === issue.id ? 'Collapse' : 'Expand'}
                  </button>
                  <button
                    onClick={() => handleEditStart(issue)}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id!, e.target.value as 'open' | 'in_progress' | 'closed')}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    disabled={isPending}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(issue.id!)}
                    className="text-sm text-red-600 hover:text-red-700"
                    disabled={isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Created: {new Date(issue.created_at).toLocaleDateString()} | 
                Updated: {new Date(issue.updated_at).toLocaleDateString()}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}