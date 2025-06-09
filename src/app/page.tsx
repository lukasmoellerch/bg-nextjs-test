import { db } from '@/lib/db';
import { issues } from '@/lib/schema';
import IssueList from '@/app/components/IssueList';
import CreateIssueForm from '@/app/components/CreateIssueForm';

export default async function Home() {
  // Fetch issues on the server
  const allIssues = await db.select().from(issues).all();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
              Issue Tracker
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Track, organize, and resolve issues with powerful rich text descriptions. 
              Built for teams who value clarity and efficiency.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-gray-900">
                  {allIssues.length}
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">Total Issues</div>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-green-600">
                  {allIssues.filter(i => i.status === 'open').length}
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">Open</div>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-amber-600">
                  {allIssues.filter(i => i.status === 'in_progress').length}
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">In Progress</div>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-600 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-gray-600">
                  {allIssues.filter(i => i.status === 'closed').length}
                </div>
                <div className="text-sm font-medium text-gray-500 mt-1">Closed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Create Issue Section */}
        <div className="mb-12">
          <CreateIssueForm />
        </div>

        {/* Issues List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              All Issues
            </h2>
            {allIssues.length > 0 && (
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {allIssues.filter(i => i.status === 'open').length} open
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  {allIssues.filter(i => i.status === 'closed').length} closed
                </span>
              </div>
            )}
          </div>
          
          <IssueList initialIssues={allIssues} />
        </div>
      </div>
    </div>
  );
}
