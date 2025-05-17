
import { useEffect, useState } from 'react';
import { Activity, ArrowDown, ArrowUp, BarChart3, Eye, MessageSquare, ThumbsUp, Users } from 'lucide-react';
import { supabase, dbService, Message } from '@/lib/supabase';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [statsData, setStatsData] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    avgSessionTime: '0m 0s',
    unreadMessages: 0
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch messages
        const messagesData = await dbService.getMessages();
        setMessages(messagesData.slice(0, 4)); // Show only 4 most recent messages
        
        // Count unread messages
        const unreadCount = messagesData.filter(msg => !msg.read).length;
        
        // Get basic analytics
        // In a real app, this would be more sophisticated
        const { count: visitCount } = await supabase
          .from('site_visits')
          .select('*', { count: 'exact', head: true });
          
        const { count: uniqueCount } = await supabase
          .from('site_visits')
          .select('*', { count: 'exact', head: true })
          .is('user_agent', null);
        
        setStatsData({
          totalVisits: visitCount || 0,
          uniqueVisitors: uniqueCount || 0,
          avgSessionTime: '3m 45s', // This would be calculated in a real app
          unreadMessages: unreadCount
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const stats = [
    {
      title: "Total Views",
      value: statsData.totalVisits.toString(),
      change: "+14%",
      trend: "up",
      icon: <Eye size={24} />
    },
    {
      title: "Unique Visitors",
      value: statsData.uniqueVisitors.toString(),
      change: "+5.3%",
      trend: "up",
      icon: <Users size={24} />
    },
    {
      title: "Avg. Session",
      value: statsData.avgSessionTime,
      change: "-0.8%",
      trend: "down",
      icon: <Activity size={24} />
    },
    {
      title: "Messages",
      value: statsData.unreadMessages.toString(),
      change: "+28%",
      trend: "up",
      icon: <MessageSquare size={24} />
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Dashboard</h1>
        
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 rounded-lg bg-portfolio-dark border border-portfolio-dark/60 text-portfolio-gray">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          
          <button className="btn-primary py-2">
            Export
          </button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6 hover:border-portfolio-blue/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-portfolio-gray">
                {stat.icon}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                stat.trend === 'up' 
                  ? 'text-green-400 bg-green-400/10' 
                  : 'text-red-400 bg-red-400/10'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUp size={14} className="mr-1" />
                ) : (
                  <ArrowDown size={14} className="mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</h3>
            <p className="text-portfolio-gray mt-1">{stat.title}</p>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Traffic Overview</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-portfolio-blue mr-2"></span>
                <span className="text-sm text-portfolio-gray">Visitors</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-indigo-500/70 mr-2"></span>
                <span className="text-sm text-portfolio-gray">Page Views</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <div className="text-portfolio-gray flex flex-col items-center">
              <BarChart3 size={48} className="mb-4 opacity-50" />
              <p>Analytics chart would appear here</p>
              <p className="text-sm opacity-70">(Connect to analytics service for visualization)</p>
            </div>
          </div>
        </div>
        
        <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Popular Content</h3>
            <button className="text-portfolio-blue text-sm hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { title: "Customer Churn Prediction", views: 1423, likes: 28 },
              { title: "Sentiment Analysis Dashboard", views: 1128, likes: 19 },
              { title: "Predictive Maintenance System", views: 908, likes: 15 },
              { title: "Medical Image Classification", views: 723, likes: 12 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-portfolio-darkest transition-colors">
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{item.title}</h4>
                  <div className="flex items-center text-portfolio-gray text-sm">
                    <div className="flex items-center mr-4">
                      <Eye size={14} className="mr-1" />
                      {item.views}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp size={14} className="mr-1" />
                      {item.likes}
                    </div>
                  </div>
                </div>
                <span className="text-portfolio-gray/50 text-sm">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Messages */}
      <div className="bg-portfolio-dark border border-portfolio-dark/60 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Recent Messages</h3>
          <button className="text-portfolio-blue text-sm hover:underline">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-portfolio-dark/60">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-portfolio-gray uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-portfolio-gray uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-portfolio-dark/40">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-portfolio-gray">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-portfolio-blue mr-3"></div>
                      Loading messages...
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-portfolio-gray">
                    No messages found
                  </td>
                </tr>
              ) : (
                messages.map((message, index) => (
                  <tr key={message.id} className="hover:bg-portfolio-darkest transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{message.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-portfolio-gray">{message.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-portfolio-gray">{message.subject}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-portfolio-gray">
                      {new Date(message.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-portfolio-blue hover:text-white transition-colors">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
