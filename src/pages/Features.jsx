import React, { useState, useEffect } from 'react';
import { Feature } from "@/api/entities";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const columns = {
  backlog: { name: 'Backlog', color: 'bg-gray-500' },
  planning: { name: 'Planning', color: 'bg-blue-500' },
  in_development: { name: 'In Development', color: 'bg-purple-500' },
  testing: { name: 'Testing', color: 'bg-yellow-500' },
  completed: { name: 'Completed', color: 'bg-green-500' },
};

const priorities = {
  critical: 'border-red-500',
  high: 'border-orange-500',
  medium: 'border-yellow-500',
  low: 'border-blue-500'
};

const FeatureCard = ({ feature, index }) => (
  <Draggable draggableId={feature.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`p-4 mb-3 bg-gray-800 rounded-lg border-l-4 ${priorities[feature.priority]} ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-md'} transition-all`}
      >
        <p className="font-semibold text-white mb-2">{feature.title}</p>
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{feature.description}</p>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <Badge variant="secondary" className="capitalize text-xs bg-gray-700 text-gray-300">{feature.platform}</Badge>
          {feature.assignee && <span>{feature.assignee}</span>}
        </div>
      </div>
    )}
  </Draggable>
);

export default function FeaturesPage() {
  const [features, setFeatures] = useState([]);
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');

  useEffect(() => {
    loadFeatures();
  }, [currentRegion]);

  const loadFeatures = async () => {
    const data = await Feature.filter({ region: [currentRegion, 'both'] }, '-created_date');
    setFeatures(data);
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
    
    await Feature.update(featureId, { status: newStatus });
  };
  
  const getFeaturesByStatus = (status) => features.filter(f => f.status === status);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Features & Roadmap</h1>
          <p className="text-gray-400">Plan and track new features from idea to launch.</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white"><Plus className="w-4 h-4 mr-2" /> New Feature Idea</Button>
      </div>

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
                      <FeatureCard key={feature.id} feature={feature} index={index} />
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