import { db } from '@/lib/db';
import { issues } from '@/lib/schema';
import IssueList from '@/app/components/IssueList';
import CreateIssueForm from '@/app/components/CreateIssueForm';

export default async function Home() {
  // Fetch issues on the server
  const allIssues = await db.select().from(issues).all();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-display font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Issue Tracker
            </h1>
            <p className="text-callout text-gray-600 max-w-2xl mx-auto">
              Track, organize, and resolve issues with beautiful rich text descriptions. 
              Built with precision and care.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-6 text-center">
              <div className="text-title-2 font-semibold text-gray-900 mb-1">
                {allIssues.length}
              </div>
              <div className="text-caption text-gray-500">Total Issues</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-title-2 font-semibold text-green-600 mb-1">
                {allIssues.filter(i => i.status === 'open').length}
              </div>
              <div className="text-caption text-gray-500">Open</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-title-2 font-semibold text-orange-600 mb-1">
                {allIssues.filter(i => i.status === 'in_progress').length}
              </div>
              <div className="text-caption text-gray-500">In Progress</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-title-2 font-semibold text-gray-600 mb-1">
                {allIssues.filter(i => i.status === 'closed').length}
              </div>
              <div className="text-caption text-gray-500">Closed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Create Issue Section */}
        <div className="mb-12">
          <CreateIssueForm />
        </div>

        {/* Issues List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-title-2 font-semibold text-gray-900">
              All Issues
            </h2>
            {allIssues.length > 0 && (
              <div className="flex items-center gap-4 text-footnote text-gray-500">
                <span>{allIssues.filter(i => i.status === 'open').length} open</span>
                <span>•</span>
                <span>{allIssues.filter(i => i.status === 'closed').length} closed</span>
              </div>
            )}
          </div>
          
          <IssueList initialIssues={allIssues} />
        </div>
      </div>
    </div>
  );
}
