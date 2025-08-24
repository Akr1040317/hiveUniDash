
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Card components are imported but their structure usage changes
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Added for ReactQuill dark theme compatibility

export default function ContentForm({ content, onSubmit, onCancel, currentRegion }) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    type: content?.type || 'lesson',
    status: content?.status || 'draft',
    difficulty: content?.difficulty || 'beginner',
    description: content?.description || '',
    content_body: content?.content_body || '',
    author: content?.author || '',
    tags: content?.tags?.join(', ') || '',
    publish_date: content?.publish_date || '',
    word_count: content?.word_count || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    // If called from a form's onSubmit, e will be a SyntheticEvent
    // If called from a button's onClick, e will also be a SyntheticEvent
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    setIsSubmitting(true);

    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      word_count: formData.content_body.length
    };

    await onSubmit(submitData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Dark theme specific styles for ReactQuill */}
      <style>{`
        .dark .ql-toolbar {
          border-color: #4a5568 !important;
        }
        .dark .ql-container {
          border-color: #4a5568 !important;
        }
        .dark .ql-editor {
          color: #d1d5db;
        }
        .dark .ql-snow .ql-stroke {
          stroke: #9ca3af;
        }
        .dark .ql-snow .ql-picker-label {
          color: #9ca3af;
        }
        .dark .ql-snow .ql-picker-options {
          background-color: #2d3748;
          border-color: #4a5568;
        }
      `}</style>
      
      {/* Replaced CardHeader with a div */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700/50">
        <CardTitle className="text-white">
          {content ? 'Edit Content' : 'Create New Content'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-gray-400 hover:text-white hover:bg-gray-700">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Replaced CardContent with a div for scrollable form area */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Form still uses onSubmit for enter key submission */}
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Changed gap to gap-6 */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Introduction to Latin Roots"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-300">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="lesson" className="focus:bg-gray-700">Lesson</SelectItem>
                  <SelectItem value="quiz" className="focus:bg-gray-700">Quiz</SelectItem>
                  <SelectItem value="article" className="focus:bg-gray-700">Article</SelectItem>
                  <SelectItem value="word_list" className="focus:bg-gray-700">Word List</SelectItem>
                  <SelectItem value="mini_lesson" className="focus:bg-gray-700">Mini Lesson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Changed gap to gap-6 */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-300">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="draft" className="focus:bg-gray-700">Draft</SelectItem>
                  <SelectItem value="review" className="focus:bg-gray-700">In Review</SelectItem>
                  <SelectItem value="published" className="focus:bg-gray-700">Published</SelectItem>
                  <SelectItem value="archived" className="focus:bg-gray-700">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-gray-300">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="beginner" className="focus:bg-gray-700">Beginner</SelectItem>
                  <SelectItem value="intermediate" className="focus:bg-gray-700">Intermediate</SelectItem>
                  <SelectItem value="advanced" className="focus:bg-gray-700">Advanced</SelectItem>
                  <SelectItem value="national" className="focus:bg-gray-700">National Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author" className="text-gray-300">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Content author"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief summary of the content"
              rows={3}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Content Body */}
          <div className="space-y-2">
            <Label className="text-gray-300">Content Body</Label>
            <div className="border border-gray-700 rounded-md">
              <ReactQuill
                theme="snow"
                value={formData.content_body}
                onChange={(value) => handleInputChange('content_body', value)}
                placeholder="Write your content here..."
                className="bg-gray-800 text-white" // Added text-white for quill editor in dark mode
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>

          {/* Tags and Publish Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Changed gap to gap-6 */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-300">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="etymology, greek, roots"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publish_date" className="text-gray-300">Publish Date</Label>
              <Input
                id="publish_date"
                type="date"
                value={formData.publish_date}
                onChange={(e) => handleInputChange('publish_date', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Form Actions (Replaced original Button div) */}
      <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-gray-700/50">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} // This button directly calls handleSubmit. The form's onSubmit handles submissions initiated by 'enter' key.
          disabled={isSubmitting}
          className="bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving...' : content ? 'Update Content' : 'Create Content'}
        </Button>
      </div>
    </>
  );
}
