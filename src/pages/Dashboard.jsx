
import React, { useState, useEffect } from "react";
import { Content, Bug, Feature, Analytics } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  FileText,
  Bug as BugIcon,
  Zap,
  Users,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    content: { total: 0, published: 0, drafts: 0 },
    bugs: { total: 0, open: 0, critical: 0 },
    features: { total: 0, inProgress: 0, completed: 0 },
    analytics: []
  });
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');
  const [recentContent, setRecentContent] = useState([]);
  const [criticalBugs, setCriticalBugs] = useState([]);
  const [upcomingDueDates, setUpcomingDueDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [currentRegion]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load content stats
      const allContent = await Content.filter({ region: currentRegion });
      const contentStats = {
        total: allContent.length,
        published: allContent.filter(c => c.status === 'published').length,
        drafts: allContent.filter(c => c.status === 'draft').length
      };

      // Load bug stats
      const allBugs = await Bug.filter({ region: [currentRegion, 'both'] });
      const bugStats = {
        total: allBugs.length,
        open: allBugs.filter(b => b.status === 'open' || b.status === 'new').length,
        critical: allBugs.filter(b => b.severity === 'Critical - System down').length
      };

      // Load feature stats from planning collection
      const allFeatures = await Feature.filter({ region: [currentRegion, 'both'] });
      const featureStats = {
        total: allFeatures.length,
        inProgress: allFeatures.filter(f => f.status === 'in_development').length,
        completed: allFeatures.filter(f => f.status === 'completed').length
      };

      // Load recent content
      const recent = await Content.filter({ region: currentRegion }, '-created_date', 5);
      
      // Load critical bugs (using severity instead of priority)
      const critical = await Bug.filter({ 
        region: [currentRegion, 'both'],
        severity: 'Critical - System down',
        status: ['new', 'open', 'in_progress']
      }, '-timestamp', 3);

      // Load upcoming due dates from planning collection (features) and bugs
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      const bugsWithDueDates = allBugs.filter(b => b.dueDate && new Date(b.dueDate) <= thirtyDaysFromNow);
      const featuresWithDueDates = allFeatures.filter(f => f.dueDate && new Date(f.dueDate) <= thirtyDaysFromNow);
      
      const allDueDates = [...bugsWithDueDates, ...featuresWithDueDates]
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

      setStats({
        content: contentStats,
        bugs: bugStats,
        features: featureStats,
        analytics: [] // Empty array - no mock data
      });
      setRecentContent(recent);
      setCriticalBugs(critical);
      setUpcomingDueDates(allDueDates);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const regionInfo = {
    us: { name: "United States", color: "bg-blue-400" },
    dubai: { name: "Dubai", color: "bg-amber-400" }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className={`w-3 h-3 rounded-full ${regionInfo[currentRegion].color}`} />
            <h1 className="text-3xl font-bold text-white">
              {regionInfo[currentRegion].name} Dashboard
            </h1>
          </div>
          <p className="text-gray-400">
            Welcome back! Here's what's happening with Hive today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to={createPageUrl("Content")}>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20">
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Total Content</CardTitle>
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{stats.content.total}</div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{stats.content.published} published</span>
              <span>{stats.content.drafts} drafts</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Open Bugs</CardTitle>
              <BugIcon className="w-5 h-5 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{stats.bugs.open}</div>
             <div className="flex items-center gap-2 text-xs">
              {stats.bugs.critical > 0 && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 border-red-500/30">
                  {stats.bugs.critical} critical
                </Badge>
              )}
              <span className="text-gray-400">of {stats.bugs.total} total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Features In Progress</CardTitle>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{stats.features.inProgress}</div>
             <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{stats.features.completed} done</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Column - Deadlines & Due Dates */}
        <div className="space-y-6">
          {/* Feature Deadlines */}
          {upcomingDueDates.filter(item => item.type !== 'Bug').length > 0 && (
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Feature Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingDueDates
                  .filter(item => item.type !== 'Bug')
                  .slice(0, 3)
                  .map((feature) => (
                    <div key={feature.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div className="font-medium text-sm text-white mb-1">
                        {feature.title}
                      </div>
                      {feature.description && (
                        <div className="text-xs text-gray-400 mb-2 line-clamp-2">
                          {feature.description}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <Badge 
                          variant="secondary" 
                          className="text-xs capitalize bg-purple-500/20 text-purple-300 border-purple-500/30"
                        >
                          {feature.category || 'Feature'}
                        </Badge>
                        <span className="text-yellow-400 font-medium">
                          Due: {new Date(feature.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                <Link to={createPageUrl("Features")}>
                  <Button variant="outline" size="sm" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200">
                    View All Features
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Due Dates */}
          {upcomingDueDates.length > 0 && (
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Upcoming Due Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingDueDates.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div>
                      <div className="font-medium text-sm text-white">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.type === 'Bug' ? 'Bug' : 'Feature'} due on {new Date(item.dueDate).toLocaleDateString()}</div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs capitalize bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    >
                      {item.type}
                    </Badge>
                  </div>
                ))}
                <Link to={createPageUrl("Bugs")}>
                  <Button variant="outline" size="sm" className="w-full border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200">
                    View All Due Dates
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Weekly Activity Chart */}
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>Weekly Activity</span>
                <Link to={createPageUrl("Analytics")}>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.analytics.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={stats.analytics}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorUsers)"
                      name="Active Users"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lessons" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorLessons)"
                      name="Lessons Completed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <p className="text-sm">No activity data available</p>
                  <p className="text-xs text-gray-600 mt-1">Create some content to see analytics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Important Bugs */}
        <div className="space-y-6">
          {/* Important Bugs */}
          {criticalBugs.length > 0 && (
            <Card className="border-red-500/30 bg-red-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Bugs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {criticalBugs.map((bug) => (
                  <div key={bug.id} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="font-medium text-red-300 text-sm mb-2">
                      {bug.subject || bug.title || 'Bug'}
                    </div>
                    {bug.description && (
                      <div className="text-xs text-red-400 mb-2 line-clamp-2">
                        {bug.description}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-red-400">
                        <span className="font-medium">Severity:</span> {bug.severity || 'Unknown'}
                      </div>
                      {bug.dueDate && (
                        <div className="text-red-400">
                          <span className="font-medium">Due:</span> {new Date(bug.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Link to={createPageUrl("Bugs")}>
                  <Button variant="outline" size="sm" className="w-full border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-red-200">
                    View All Bugs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Webinars, Notes & Content */}
        <div className="space-y-6">
          {/* Recent Content */}
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base text-white">
                <span>Recent Content</span>
                <Link to={createPageUrl("Content")}>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentContent.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-3 border border-gray-700/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-white">{content.title}</div>
                    <div className="text-xs text-gray-400 capitalize">{content.type.replace('_', ' ')}</div>
                  </div>
                  <Badge 
                    variant={content.status === 'published' ? 'default' : 'secondary'}
                    className={`text-xs capitalize ${
                      content.status === 'published' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      content.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    }`}
                  >
                    {content.status}
                  </Badge>
                </div>
              ))}
              {recentContent.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">No recent content</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
