import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, BookOpen, CheckSquare, Clock, TrendingUp } from 'lucide-react';

// Mock Data
const dailyActiveUsers = [
  { date: 'Jan 1', users: 1200 }, { date: 'Jan 2', users: 1800 }, { date: 'Jan 3', users: 1500 },
  { date: 'Jan 4', users: 2100 }, { date: 'Jan 5', users: 2400 }, { date: 'Jan 6', users: 2200 },
  { date: 'Jan 7', users: 2800 },
];

const contentEngagement = [
  { name: 'Lessons', completions: 4000, 'avg. time (min)': 15 },
  { name: 'Quizzes', completions: 8200, 'avg. time (min)': 8 },
  { name: 'Articles', completions: 2500, 'avg. time (min)': 5 },
];

const userRetention = [
  { week: 'W1', retention: 85 }, { week: 'W2', retention: 72 }, { week: 'W3', retention: 65 },
  { week: 'W4', retention: 68 }, { week: 'W5', retention: 58 }, { week: 'W6', retention: 55 },
];

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <Card className="bg-gray-800/50 border-gray-700/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      <p className="text-xs text-green-400 flex items-center gap-1">
        <TrendingUp className="h-3 w-3"/>
        {change} from last month
      </p>
    </CardContent>
  </Card>
);

export default function AnalyticsPage() {
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400">Deep dive into your app's performance metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Daily Active Users" value="2,800" change="+20.1%" icon={Users} color="text-blue-400" />
        <StatCard title="Lesson Completions" value="4,302" change="+12.5%" icon={BookOpen} color="text-green-400" />
        <StatCard title="Quiz Attempts" value="9,123" change="+18.3%" icon={CheckSquare} color="text-purple-400" />
        <StatCard title="Avg. Session Time" value="12m 45s" change="+5.2%" icon={Clock} color="text-amber-400" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Daily Active Users (DAU)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyActiveUsers}>
                <defs>
                  <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorDau)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-white">Content Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend wrapperStyle={{fontSize: "12px"}}/>
                <Bar dataKey="completions" fill="#8B5CF6" name="Completions" />
                <Bar dataKey="avg. time (min)" fill="#F59E0B" name="Avg. Time (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}