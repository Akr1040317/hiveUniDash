import React, { useState, useEffect } from 'react';
import { Bug } from "@/api/entities";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Flag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const columns = {
  new: { name: 'New', color: 'bg-blue-500' },
  in_progress: { name: 'In Progress', color: 'bg-purple-500' },
  testing: { name: 'Testing', color: 'bg-yellow-500' },
  resolved: { name: 'Resolved', color: 'bg-green-500' },
};

const severityLevels = {
  'Critical - System down': { 
    label: 'Critical', 
    color: 'bg-red-500', 
    textColor: 'text-red-100',
    borderColor: 'border-red-500'
  },
  'High - Major functionality broken': { 
    label: 'High', 
    color: 'bg-orange-500', 
    textColor: 'text-orange-100',
    borderColor: 'border-orange-500'
  },
  'Medium - Affects functionality': { 
    label: 'Medium', 
    color: 'bg-yellow-500', 
    textColor: 'text-yellow-100',
    borderColor: 'border-yellow-500'
  },
  'Low - Minor issue': { 
    label: 'Low', 
    color: 'bg-blue-500', 
    textColor: 'text-blue-100',
    borderColor: 'border-blue-500'
  }
};

const assignees = [
  'arastogi@hivespelling.com',
  'erastogi@hivespelling.com'
];

const BugCard = ({ bug, index, currentRegion, onUpdateBug }) => {
  // Handle different data structures for US vs Dubai
  const getBugTitle = () => {
    if (currentRegion === 'dubai') {
      return bug.subject || bug.description?.substring(0, 50) + '...' || 'No title';
    }
    return bug.title || 'No title';
  };

  const getBugPriority = () => {
    if (currentRegion === 'dubai') {
      return bug.severity || 'Low - Minor issue';
    }
    return bug.priority || 'low';
  };

  const getBugReporter = () => {
    if (currentRegion === 'dubai') {
      return bug.name || bug.email || 'Anonymous';
    }
    return bug.reporter || 'Anonymous';
  };

  const getBugPlatform = () => {
    if (currentRegion === 'dubai') {
      return bug.device || bug.browser || 'Unknown';
    }
    return bug.platform || 'Unknown';
  };

  const getBugDescription = () => {
    if (currentRegion === 'dubai') {
      return bug.description || 'No description provided';
    }
    return bug.description || 'No description provided';
  };

  const getBugSteps = () => {
    if (currentRegion === 'dubai') {
      return bug.stepsToReproduce || 'No steps provided';
    }
    return bug.stepsToReproduce || 'No steps provided';
  };

  const getBugExpectedBehavior = () => {
    if (currentRegion === 'dubai') {
      return bug.expectedBehavior || 'No expected behavior specified';
    }
    return bug.expectedBehavior || 'No expected behavior specified';
  };

  const getBugActualBehavior = () => {
    if (currentRegion === 'dubai') {
      return bug.actualBehavior || 'No actual behavior specified';
    }
    return bug.actualBehavior || 'No actual behavior specified';
  };

  const handleSeverityChange = async (newSeverity) => {
    try {
      await onUpdateBug(bug.id, { severity: newSeverity });
    } catch (error) {
      console.error('Error updating bug severity:', error);
    }
  };

  const handleAssigneeChange = async (newAssignee) => {
    try {
      await onUpdateBug(bug.id, { assignee: newAssignee });
    } catch (error) {
      console.error('Error updating bug assignee:', error);
    }
  };

  const priorityClass = severityLevels[getBugPriority()]?.borderColor || 'border-gray-500';
  const severityInfo = severityLevels[getBugPriority()];
  const currentAssignee = bug.assignee || 'Unassigned';

  return (
    <Draggable draggableId={bug.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 bg-gray-800 rounded-lg border-l-4 ${priorityClass} ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-md'} transition-all min-h-[280px]`}
        >
          <div className="flex justify-between items-start mb-3">
            <p className="font-semibold text-white flex-1 mr-2 text-sm leading-tight">{getBugTitle()}</p>
            
            {/* Severity Flag - Clickable Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge 
                  className={`${severityInfo?.color} ${severityInfo?.textColor} text-xs font-medium px-2 py-1 cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  <Flag className="w-3 h-3 mr-1" />
                  {severityInfo?.label}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                {Object.entries(severityLevels).map(([level, info]) => (
                  <DropdownMenuItem 
                    key={level}
                    onClick={() => handleSeverityChange(level)}
                    className="focus:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                      <span className="text-white">{info.label}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Description */}
          <div className="mb-3">
            <p className="text-xs text-gray-300 font-medium mb-1">Description:</p>
            <p className="text-xs text-gray-400 leading-relaxed">{getBugDescription()}</p>
          </div>

          {/* Steps to Reproduce */}
          <div className="mb-3">
            <p className="text-xs text-gray-300 font-medium mb-1">Steps to Reproduce:</p>
            <p className="text-xs text-gray-400 leading-relaxed">{getBugSteps()}</p>
          </div>

          {/* Expected vs Actual Behavior */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-gray-300 font-medium mb-1">Expected:</p>
              <p className="text-xs text-gray-400 leading-relaxed">{getBugExpectedBehavior()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-300 font-medium mb-1">Actual:</p>
              <p className="text-xs text-gray-400 leading-relaxed">{getBugActualBehavior()}</p>
            </div>
          </div>
          
          {/* Platform and Reporter */}
          <div className="flex justify-between items-center mb-3">
            <Badge variant="secondary" className="capitalize text-xs bg-gray-700 text-gray-300">
              {getBugPlatform()}
            </Badge>
            <span className="text-xs text-gray-400">{getBugReporter()}</span>
          </div>

          {/* Assignee */}
          <div className="mb-3">
            <p className="text-xs text-gray-300 font-medium mb-1">Assignee:</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 px-2 text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300"
                >
                  <User className="w-3 h-3 mr-1" />
                  {currentAssignee === 'Unassigned' ? 'Unassigned' : currentAssignee.split('@')[0]}
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
                    key={assignee}
                    onClick={() => handleAssigneeChange(assignee)}
                    className="focus:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{assignee.split('@')[0]}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Timestamp */}
          {currentRegion === 'dubai' && bug.timestamp && (
            <div className="text-xs text-gray-500">
              Reported: {new Date(bug.timestamp.toDate ? bug.timestamp.toDate() : bug.timestamp).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default function BugsPage() {
  const [bugs, setBugs] = useState([]);
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadBugs();
  }, [currentRegion]);

  const loadBugs = async () => {
    try {
      const data = await Bug.filter({}, '-timestamp');
      setBugs(data);
    } catch (error) {
      console.error('Error loading bugs:', error);
      setBugs([]);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    
    const bugId = result.draggableId;
    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const updatedBugs = bugs.map(b => 
      b.id === bugId ? { ...b, status: newStatus } : b
    );
    setBugs(updatedBugs);
    
    try {
      setIsUpdating(true);
      // Persist change to Firebase
      await Bug.update(bugId, { status: newStatus });
    } catch (error) {
      console.error('Error updating bug status:', error);
      // Revert optimistic update on error
      setBugs(bugs);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateBug = async (bugId, updateData) => {
    try {
      setIsUpdating(true);
      await Bug.update(bugId, updateData);
      
      // Update local state
      setBugs(prevBugs => 
        prevBugs.map(bug => 
          bug.id === bugId ? { ...bug, ...updateData } : bug
        )
      );
    } catch (error) {
      console.error('Error updating bug:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getBugsByStatus = (status) => bugs.filter(b => b.status === status);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Bug Tracker</h1>
          <p className="text-gray-400">
            {currentRegion === 'dubai' 
              ? 'Manage and track issues from UAE Prepcenter feedback system.' 
              : 'Manage and track issues across platforms.'
            }
          </p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> 
          {currentRegion === 'dubai' ? 'View Feedback' : 'Report Bug'}
        </Button>
      </div>

      {isUpdating && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <p className="text-blue-400 text-sm">Updating bug status...</p>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(columns).map(([status, column]) => (
            <div key={status} className="bg-gray-800/50 rounded-lg">
              <div className={`p-4 border-b-2 border-gray-700/50 flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <h2 className="font-semibold text-white">{column.name}</h2>
                </div>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">{getBugsByStatus(status).length}</Badge>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-4 min-h-[400px]"
                  >
                    {getBugsByStatus(status).map((bug, index) => (
                      <BugCard 
                        key={bug.id} 
                        bug={bug} 
                        index={index} 
                        currentRegion={currentRegion}
                        onUpdateBug={handleUpdateBug}
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