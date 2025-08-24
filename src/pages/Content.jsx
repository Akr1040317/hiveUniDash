
import React, { useState, useEffect } from "react";
import { Content } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  HelpCircle,
  BookOpen,
  List,
  Edit,
  Eye,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { motion } from "framer-motion";

import ContentForm from "../components/content/ContentForm";
import ContentStats from "../components/content/ContentStats";

export default function ContentPage() {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');

  useEffect(() => {
    loadContent();
  }, [currentRegion]);

  useEffect(() => {
    filterContent();
  }, [content, searchTerm, statusFilter, typeFilter]);

  const loadContent = async () => {
    setIsLoading(true);
    const data = await Content.filter({ region: currentRegion }, '-created_date');
    setContent(data);
    setIsLoading(false);
  };

  const filterContent = () => {
    let filtered = content;

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(c => c.type === typeFilter);
    }

    setFilteredContent(filtered);
  };

  const handleSubmit = async (contentData) => {
    const dataWithRegion = { ...contentData, region: currentRegion };
    
    if (editingContent) {
      await Content.update(editingContent.id, dataWithRegion);
    } else {
      await Content.create(dataWithRegion);
    }
    
    setShowForm(false);
    setEditingContent(null);
    loadContent();
  };

  const handleEdit = (contentItem) => {
    setEditingContent(contentItem);
    setShowForm(true);
  };

  const getTypeIcon = (type) => {
    const icons = {
      lesson: BookOpen,
      quiz: HelpCircle,
      article: FileText,
      word_list: List,
      mini_lesson: BookOpen
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      review: "bg-blue-500/20 text-blue-300 border-blue-500/30", 
      published: "bg-green-500/20 text-green-300 border-green-500/30",
      archived: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return (
      <Badge className={`capitalize ${variants[status]}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Management</h1>
          <p className="text-gray-400">Create and manage lessons, quizzes, articles, and word lists</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Stats */}
      <ContentStats content={content} />

      {/* Content Form Modal */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            className="bg-gray-900 border border-gray-700/50 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <ContentForm
              content={editingContent}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingContent(null);
              }}
              currentRegion={currentRegion}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 focus:border-amber-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-900 border-gray-700">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all" className="focus:bg-gray-700">All Status</SelectItem>
                <SelectItem value="draft" className="focus:bg-gray-700">Draft</SelectItem>
                <SelectItem value="review" className="focus:bg-gray-700">In Review</SelectItem>
                <SelectItem value="published" className="focus:bg-gray-700">Published</SelectItem>
                <SelectItem value="archived" className="focus:bg-gray-700">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-900 border-gray-700">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="all" className="focus:bg-gray-700">All Types</SelectItem>
                <SelectItem value="lesson" className="focus:bg-gray-700">Lessons</SelectItem>
                <SelectItem value="quiz" className="focus:bg-gray-700">Quizzes</SelectItem>
                <SelectItem value="article" className="focus:bg-gray-700">Articles</SelectItem>
                <SelectItem value="word_list" className="focus:bg-gray-700">Word Lists</SelectItem>
                <SelectItem value="mini_lesson" className="focus:bg-gray-700">Mini Lessons</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-gray-700/50 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Content</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Author</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                  <TableHead className="text-gray-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((contentItem) => (
                  <TableRow key={contentItem.id} className="border-b-gray-800 hover:bg-gray-800">
                    <TableCell className="max-w-xs">
                      <div>
                        <div className="font-medium text-white truncate">{contentItem.title}</div>
                        <div className="text-sm text-gray-400 truncate">
                          {contentItem.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-300">
                        {getTypeIcon(contentItem.type)}
                        <span className="capitalize">{contentItem.type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(contentItem.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-300">{contentItem.author || 'Unassigned'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-400">
                        {format(new Date(contentItem.created_date), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                          <DropdownMenuItem onClick={() => handleEdit(contentItem)} className="focus:bg-gray-700">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-gray-700">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredContent.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No content found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by creating your first piece of content"
                }
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20">
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
