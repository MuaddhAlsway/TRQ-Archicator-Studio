import { FolderOpen, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { useAdmin } from './AdminContext';

export function AdminDashboard() {
  const { projects, contacts, pricingRequests } = useAdmin();

  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length, 
      icon: FolderOpen,
      color: 'bg-blue-500',
    },
    { 
      label: 'Published', 
      value: projects.filter(p => p.status === 'published').length, 
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    { 
      label: 'New Messages', 
      value: contacts.filter(c => c.status === 'new').length, 
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
    { 
      label: 'Pricing Requests', 
      value: pricingRequests.filter(p => p.status === 'new').length, 
      icon: FileText,
      color: 'bg-purple-500',
    },
  ];

  const recentContacts = contacts.slice(0, 5);
  const recentPricing = pricingRequests.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl tracking-wide mb-6 sm:mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                  <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                </div>
                <span className="text-2xl sm:text-3xl font-light">{stat.value}</span>
              </div>
              <p className="text-black/60 text-sm sm:text-base">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Recent Contact Messages */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-black/5">
            <h2 className="text-lg sm:text-xl tracking-wide">Recent Messages</h2>
          </div>
          <div className="divide-y divide-black/5">
            {recentContacts.length === 0 ? (
              <p className="p-4 sm:p-6 text-black/60 text-sm sm:text-base">No messages yet</p>
            ) : (
              recentContacts.map((contact) => (
                <div key={contact.id} className="p-3 sm:p-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-medium text-sm sm:text-base truncate">{contact.name}</span>
                    <span className={`text-xs px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ${
                      contact.status === 'new' ? 'bg-orange-100 text-orange-700' :
                      contact.status === 'read' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-black/60 truncate">{contact.message}</p>
                  <p className="text-xs text-black/40 mt-1">{contact.date}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Pricing Requests */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-black/5">
            <h2 className="text-lg sm:text-xl tracking-wide">Recent Pricing Requests</h2>
          </div>
          <div className="divide-y divide-black/5">
            {recentPricing.length === 0 ? (
              <p className="p-4 sm:p-6 text-black/60 text-sm sm:text-base">No pricing requests yet</p>
            ) : (
              recentPricing.map((request) => (
                <div key={request.id} className="p-3 sm:p-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="font-medium text-sm sm:text-base truncate">{request.name}</span>
                    <span className={`text-xs px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ${
                      request.status === 'new' ? 'bg-orange-100 text-orange-700' :
                      request.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                      request.status === 'quoted' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-black/60">{request.projectType} - {request.budget}</p>
                  <p className="text-xs text-black/40 mt-1">{request.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
