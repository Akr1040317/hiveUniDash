import React, { useState, useEffect } from 'react';
import { Feature } from "@/api/entities";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Plus, User, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const columns = {
  backlog: { name: 'Backlog', color: 'bg-gray-500' },
  planning: { name: 'Planning', color: 'bg-blue-500' },
  in_development: { name: 'In Development', color: 'bg-purple-500' },
  testing: { name: 'Testing', color: 'bg-yellow-500' },
  completed: { name: 'Completed', color: 'bg-green-500' },
};

const categories = {
  software: { 
    name: 'Software', 
    color: 'bg-blue-600', 
    textColor: 'text-blue-100',
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-500'
  },
  content: { 
    name: 'Content', 
    color: 'bg-green-600', 
    textColor: 'text-green-100',
    bgColor: 'bg-green-900/30',
    borderColor: 'border-green-500'
  },
  marketing: { 
    name: 'Marketing', 
    color: 'bg-purple-600', 
    textColor: 'text-purple-100',
    bgColor: 'bg-purple-900/30',
    borderColor: 'border-purple-500'
  }
};

const assignees = [
  {
    email: 'arastogi@hivespelling.com',
    name: 'Akshat',
    color: 'bg-orange-500',
    textColor: 'text-orange-100'
  },
  {
    email: 'erastogi@hivespelling.com',
    name: 'Ekansh',
    color: 'bg-blue-500',
    textColor: 'text-blue-100'
  }
];

const FeatureCard = ({ feature, index, onUpdateFeature }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryInfo = () => {
    return categories[feature.category] || categories.software;
  };

  const getAssigneeInfo = () => {
    return assignees.find(a => a.email === feature.assignee);
  };

  const handleAssigneeChange = async (newAssignee) => {
    try {
      await onUpdateFeature(feature.id, { assignee: newAssignee });
    } catch (error) {
      console.error('Error updating feature assignee:', error);
    }
  };

  const handleCategoryChange = async (newCategory) => {
    try {
      await onUpdateFeature(feature.id, { category: newCategory });
    } catch (error) {
      console.error('Error updating feature category:', error);
    }
  };

  const categoryInfo = getCategoryInfo();
  const assigneeInfo = getAssigneeInfo();
  const isAssigned = assigneeInfo !== undefined;

  return (
    <Draggable draggableId={feature.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 rounded-lg border-l-4 ${categoryInfo.borderColor} ${categoryInfo.bgColor} ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-md'} transition-all`}
        >
          <div className="flex justify-between items-start mb-3">
            <p className="font-semibold text-white flex-1 mr-2 text-sm leading-tight">{feature.title}</p>
            
            {/* Category Badge - Clickable Dropdown */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`${categoryInfo.color} ${categoryInfo.textColor} text-xs font-medium px-2 py-1 cursor-pointer hover:opacity-80 transition-opacity rounded-md flex items-center`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {categoryInfo.name}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700 z-50">
                  {Object.entries(categories).map(([key, info]) => (
                    <DropdownMenuItem 
                      key={key}
                      onClick={() => handleCategoryChange(key)}
                      className="focus:bg-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                        <span className="text-white">{info.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-3">
            <p className="text-xs text-gray-300 leading-relaxed">{feature.description}</p>
          </div>

          {/* Due Date */}
          {feature.dueDate && (
            <div className="mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>Due: {new Date(feature.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* Assignee */}
          <div className="mb-3">
            <p className="text-xs text-gray-300 font-medium mb-1">Assignee:</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`h-6 px-2 text-xs border-gray-600 hover:opacity-80 transition-opacity ${
                    isAssigned 
                      ? `${assigneeInfo.color} ${assigneeInfo.textColor}` 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <User className="w-3 h-3 mr-1" />
                  {isAssigned ? assigneeInfo.name : 'Unassigned'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-gray-800 border-gray-700">
                <DropdownMenuItem 
                  onClick={() => handleAssigneeChange('Unassigned')}
                  className="focus:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-white">Unassigned</span>
                  </div>
                </DropdownMenuItem>
                {assignees.map((assignee) => (
                  <DropdownMenuItem 
                    key={assignee.email}
                    onClick={() => handleAssigneeChange(assignee.email)}
                    className="focus:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${assignee.color}`}></div>
                      <span className="text-white">{assignee.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const CreateFeatureDialog = ({ onFeatureCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'software',
    assignee: 'Unassigned',
    dueDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Feature.create(formData);
      setFormData({
        title: '',
        description: '',
        category: 'software',
        assignee: 'Unassigned',
        dueDate: ''
      });
      setIsOpen(false);
      onFeatureCreated();
    } catch (error) {
      console.error('Error creating feature:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Feature
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Feature</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-300">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-gray-300">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {Object.entries(categories).map(([key, info]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    {info.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignee" className="text-gray-300">Assignee</Label>
            <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="Unassigned" className="text-white">Unassigned</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.email} value={assignee.email} className="text-white">
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-gray-300">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
              Create Feature
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function FeaturesPage() {
  const [features, setFeatures] = useState([]);
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadFeatures();
  }, [currentRegion]);

  const loadFeatures = async () => {
    try {
      const data = await Feature.filter({}, '-created_at');
      setFeatures(data);
    } catch (error) {
      console.error('Error loading features:', error);
      setFeatures([]);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    
    const featureId = result.draggableId;
    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const updatedFeatures = features.map(f => 
      f.id === featureId ? { ...f, status: newStatus } : f
    );
    setFeatures(updatedFeatures);
    
    try {
      setIsUpdating(true);
      // Persist change to Firebase
      await Feature.update(featureId, { status: newStatus });
    } catch (error) {
      console.error('Error updating feature status:', error);
      // Revert optimistic update on error
      setFeatures(features);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateFeature = async (featureId, updateData) => {
    try {
      setIsUpdating(true);
      await Feature.update(featureId, updateData);
      
      // Update local state
      setFeatures(prevFeatures => 
        prevFeatures.map(feature => 
          feature.id === featureId ? { ...feature, ...updateData } : feature
        )
      );
    } catch (error) {
      console.error('Error updating feature:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getFeaturesByStatus = (status) => features.filter(f => f.status === status);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Features & Roadmap</h1>
          <p className="text-gray-400">Plan and track new features from idea to launch.</p>
        </div>
        <CreateFeatureDialog onFeatureCreated={loadFeatures} />
      </div>

      {isUpdating && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-blue-400 text-sm">Updating feature status...</p>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Object.entries(columns).map(([status, column]) => (
            <div key={status} className="bg-gray-800/50 rounded-lg">
              <div className={`p-4 border-b-2 border-gray-700/50 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h2 className="font-semibold text-white">{column.name}</h2>
                </div>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">{getFeaturesByStatus(status).length}</Badge>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-4 min-h-[300px]"
                  >
                    {getFeaturesByStatus(status).map((feature, index) => (
                      <FeatureCard 
                        key={feature.id} 
                        feature={feature} 
                        index={index}
                        onUpdateFeature={handleUpdateFeature}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}