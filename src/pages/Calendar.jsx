import React, { useState, useEffect } from 'react';
import { Event } from '@/api/entities';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const eventColors = {
  meeting: 'bg-blue-500',
  deadline: 'bg-red-500',
  release: 'bg-green-500',
  content_review: 'bg-purple-500',
  team_sync: 'bg-yellow-500',
  other: 'bg-gray-500',
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');

  useEffect(() => {
    loadEvents();
  }, [currentRegion]);

  const loadEvents = async () => {
    const data = await Event.filter({ region: [currentRegion, 'both'] });
    setEvents(data);
  };
  
  const eventsForDay = (day) => {
    return events.filter(e => format(new Date(e.start_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="bg-gray-800 border-gray-700 hover:bg-gray-700">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="bg-gray-800 border-gray-700 hover:bg-gray-700">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-400 mb-2">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 grid-rows-5 gap-1">
        {days.map(day => (
          <div
            key={day.toString()}
            className={`p-2 rounded-lg border border-gray-800 h-28 flex flex-col ${
              !isSameMonth(day, monthStart) ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-800'
            } ${isToday(day) ? 'border-amber-500' : ''}`}
          >
            <span className={`font-medium ${isToday(day) ? 'text-amber-400' : ''}`}>
              {format(day, 'd')}
            </span>
            <div className="flex-1 overflow-y-auto text-xs mt-1 space-y-1">
              {eventsForDay(day).map(event => (
                <div key={event.id} className={`p-1 rounded ${eventColors[event.type]} text-white truncate`}>
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Calendar</h1>
          <p className="text-gray-400">Keep track of meetings, deadlines, and releases.</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white"><Plus className="w-4 h-4 mr-2" /> New Event</Button>
      </div>
      
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-6">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </CardContent>
      </Card>
    </div>
  );
}