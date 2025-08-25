import React, { useState, useEffect } from 'react';
import { Bug } from "@/api/entities";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columns = {
  new: { name: 'New', color: 'bg-blue-500' },
  in_progress: { name: 'In Progress', color: 'bg-purple-500' },
  testing: { name: 'Testing', color: 'bg-yellow-500' },
  resolved: { name: 'Resolved', color: 'bg-green-500' },
};

const priorities = {
  'Critical - System down': 'border-red-500',
  'High - Major functionality broken': 'border-orange-500',
  'Medium - Affects functionality': 'border-yellow-500',
  'Low - Minor issue': 'border-blue-500'
};

const BugCard = ({ bug, index, currentRegion }) => {
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

  const priorityClass = priorities[getBugPriority()] || 'border-gray-500';

  return (
    <Draggable draggableId={bug.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 bg-gray-800 rounded-lg border-l-4 ${priorityClass} ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-md'} transition-all`}
        >
          <p className="font-semibold text-white mb-2">{getBugTitle()}</p>
          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{getBugDescription()}</p>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <Badge variant="secondary" className="capitalize text-xs bg-gray-700 text-gray-300">{getBugPlatform()}</Badge>
            <span>{getBugReporter()}</span>
          </div>
          {currentRegion === 'dubai' && bug.timestamp && (
            <div className="text-xs text-gray-500 mt-2">
              {new Date(bug.timestamp.toDate ? bug.timestamp.toDate() : bug.timestamp).toLocaleDateString()}
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
      // Persist change
      await Bug.update(bugId, { status: newStatus });
    } catch (error) {
      console.error('Error updating bug status:', error);
      // Revert optimistic update on error
      setBugs(bugs);
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
                    className="p-4 min-h-[300px]"
                  >
                    {getBugsByStatus(status).map((bug, index) => (
                      <BugCard key={bug.id} bug={bug} index={index} currentRegion={currentRegion} />
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