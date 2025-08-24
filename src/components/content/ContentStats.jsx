
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, HelpCircle, List, TrendingUp } from "lucide-react";

export default function ContentStats({ content }) {
  const stats = {
    total: content.length,
    published: content.filter(c => c.status === 'published').length,
    drafts: content.filter(c => c.status === 'draft').length,
    lessons: content.filter(c => c.type === 'lesson').length,
    quizzes: content.filter(c => c.type === 'quiz').length,
    articles: content.filter(c => c.type === 'article').length
  };

  const statCards = [
    {
      title: "Total Content",
      value: stats.total,
      icon: FileText,
      color: "text-blue-400",
      description: `${stats.published} published, ${stats.drafts} drafts`
    },
    {
      title: "Lessons",
      value: stats.lessons,
      icon: BookOpen,
      color: "text-green-400",
      description: "Learning modules"
    },
    {
      title: "Quizzes",
      value: stats.quizzes,
      icon: HelpCircle,
      color: "text-purple-400",
      description: "Practice exercises"
    },
    {
      title: "Articles",
      value: stats.articles,
      icon: List,
      color: "text-amber-400",
      description: "Educational content"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-gray-800/50 border-gray-700/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
