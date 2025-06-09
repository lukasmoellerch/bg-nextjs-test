import { db } from '@/lib/db';
import { issues } from '@/lib/schema';
import IssueList from '@/app/components/IssueList';
import CreateIssueForm from '@/app/components/CreateIssueForm';

export default async function Home() {
  // Fetch issues on the server
  const allIssues = await db.select().from(issues).all();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Issue Tracker</h1>
          <p className="text-gray-600">Track and manage issues with rich text descriptions</p>
        </div>

        {/* Create issue form */}
        <CreateIssueForm />

        {/* Issue list */}
        <IssueList initialIssues={allIssues} />

        {/* Status summary */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Total: {allIssues.length} issue{allIssues.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-4">
              <span>Open: {allIssues.filter(i => i.status === 'open').length}</span>
              <span>In Progress: {allIssues.filter(i => i.status === 'in_progress').length}</span>
              <span>Closed: {allIssues.filter(i => i.status === 'closed').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
