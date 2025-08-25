import React, { useState, useEffect } from 'react';
import { Event, Feature, Bug, Quiz } from '@/api/entities';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, parseISO } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Users, Tag, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import calComService from '@/lib/calcomService';

const eventColors = {
  feature: 'bg-purple-500',
  bug: 'bg-red-500',
  webinar: 'bg-blue-500',
  deadline: 'bg-orange-500',
  meeting: 'bg-green-500',
  content: 'bg-indigo-500',
  quiz: 'bg-pink-500',
  calcom: 'bg-teal-500', // New color for Cal.com events
  other: 'bg-gray-500',
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allEvents, setAllEvents] = useState([]);
  const [currentRegion] = useState(localStorage.getItem('hive_region') || 'us');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [showCalComEvents, setShowCalComEvents] = useState(true);
  const [isLoadingCalCom, setIsLoadingCalCom] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'other',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    attendees: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadAllEvents();
  }, [currentRegion, showCalComEvents]);

  const loadAllEvents = async () => {
    try {
      // Load features with due dates
      const features = await Feature.filter({ region: [currentRegion, 'both'] });
      const featureEvents = features
        .filter(f => f.dueDate)
        .map(f => ({
          id: `feature-${f.id}`,
          title: f.title,
          description: f.description,
          type: 'feature',
          startDate: f.dueDate,
          endDate: f.dueDate,
          startTime: '09:00',
          endTime: '17:00',
          location: 'Dashboard',
          attendees: 'Team',
          priority: 'medium',
          originalData: f,
          category: f.category
        }));

      // Load bugs with due dates
      const bugs = await Bug.filter({ region: [currentRegion, 'both'] });
      const bugEvents = bugs
        .filter(b => b.dueDate)
        .map(b => ({
          id: `bug-${b.id}`,
          title: b.subject || b.title || 'Bug',
          description: b.description,
          type: 'bug',
          startDate: b.dueDate,
          endDate: b.dueDate,
          startTime: '09:00',
          endTime: '17:00',
          location: 'Dashboard',
          attendees: 'Team',
          priority: b.severity?.includes('Critical') ? 'high' : 'medium',
          originalData: b,
          severity: b.severity
        }));

      // Load quizzes (webinars)
      const quizzes = await Quiz.filter({ region: [currentRegion, 'both'] });
      const quizEvents = quizzes
        .filter(q => q.type === 'webinar' || q.quizName?.toLowerCase().includes('webinar'))
        .map(q => ({
          id: `quiz-${q.id}`,
          title: q.quizName,
          description: 'Spelling Bee Webinar',
          type: 'webinar',
          startDate: new Date().toISOString().split('T')[0], // Default to today
          endDate: new Date().toISOString().split('T')[0],
          startTime: '14:00',
          endTime: '15:00',
          location: 'Virtual',
          attendees: 'Students & Parents',
          priority: 'medium',
          originalData: q
        }));

      // Load custom events
      const customEvents = await Event.filter({ region: [currentRegion, 'both'] });
      const eventEvents = customEvents
        .filter(e => e.start_date)
        .map(e => ({
          id: `event-${e.id}`,
          title: e.title,
          description: e.description,
          type: e.type || 'other',
          startDate: e.start_date,
          endDate: e.end_date || e.start_date,
          startTime: e.start_time || '09:00',
          endTime: e.end_time || '17:00',
          location: e.location || 'TBD',
          attendees: e.attendees || 'Team',
          priority: e.priority || 'medium',
          originalData: e
        }));

      // Load Cal.com bookings if enabled
      let calComEvents = [];
      if (showCalComEvents) {
        setIsLoadingCalCom(true);
        try {
          const startOfMonthDate = startOfMonth(currentMonth);
          const endOfMonthDate = endOfMonth(currentMonth);
          
          calComEvents = await calComService.getBookingsForDateRange(
            format(startOfMonthDate, 'yyyy-MM-dd'),
            format(endOfMonthDate, 'yyyy-MM-dd')
          );
        } catch (error) {
          console.error('Error loading Cal.com events:', error);
        } finally {
          setIsLoadingCalCom(false);
        }
      }

      const combined = [...featureEvents, ...bugEvents, ...quizEvents, ...eventEvents, ...calComEvents];
      setAllEvents(combined);
    } catch (error) {
      console.error('Error loading events:', error);
      setAllEvents([]);
    }
  };

  const eventsForDay = (day) => {
    return allEvents.filter(e => {
      const eventDate = format(parseISO(e.startDate), 'yyyy-MM-dd');
      const dayDate = format(day, 'yyyy-MM-dd');
      return eventDate === dayDate;
    });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        type: eventForm.type,
        start_date: eventForm.startDate,
        end_date: eventForm.endDate,
        start_time: eventForm.startTime,
        end_time: eventForm.endTime,
        location: eventForm.location,
        attendees: eventForm.attendees,
        priority: eventForm.priority,
        region: currentRegion
      };

      await Event.create(eventData);
      
      // Reset form and reload events
      setEventForm({
        title: '',
        description: '',
        type: 'other',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        location: '',
        attendees: '',
        priority: 'medium'
      });
      setIsEventDialogOpen(false);
      loadAllEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const getEventDisplayInfo = (event) => {
    const color = eventColors[event.type] || eventColors.other;
    const icon = event.type === 'feature' ? Tag : 
                 event.type === 'bug' ? Tag : 
                 event.type === 'webinar' ? Users : 
                 event.type === 'deadline' ? Clock : 
                 event.type === 'calcom' ? ExternalLink : 
                 CalendarIcon;
    
    return { color, icon };
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
        {days.map(day => {
          const dayEvents = eventsForDay(day);
          return (
            <div
              key={day.toString()}
              className={`p-2 rounded-lg border border-gray-800 h-32 flex flex-col ${
                !isSameMonth(day, monthStart) ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-800'
              } ${isToday(day) ? 'border-amber-500' : ''}`}
            >
              <span className={`font-medium ${isToday(day) ? 'text-amber-400' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="flex-1 overflow-y-auto text-xs mt-1 space-y-1">
                {dayEvents.map(event => {
                  const { color, icon: Icon } = getEventDisplayInfo(event);
                  return (
                    <div key={event.id} className={`p-1 rounded ${color} text-white truncate flex items-center gap-1`}>
                      <Icon className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{event.title}</span>
                    </div>
                  );
                })}
                {dayEvents.length === 0 && (
                  <div className="text-gray-500 text-center py-2">
                    <span className="text-xs">No events</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const regionInfo = {
    us: { name: "United States", color: "bg-blue-400" },
    dubai: { name: "UAE Prepcenter", color: "bg-amber-400" }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gray-900 min-h-screen text-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className={`w-3 h-3 rounded-full ${regionInfo[currentRegion].color}`} />
            <h1 className="text-3xl font-bold text-white">
              {regionInfo[currentRegion].name} Calendar
            </h1>
          </div>
          <p className="text-gray-400">View all events, deadlines, and schedules in one place.</p>
        </div>
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Event Title</Label>
                  <Input
                    id="title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-gray-300">Event Type</Label>
                  <Select value={eventForm.type} onValueChange={(value) => setEventForm({ ...eventForm, type: value })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="content">Content Review</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <Textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white ${
                          !eventForm.startDate && "text-gray-400"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventForm.startDate ? format(parseISO(eventForm.startDate), "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                      <CalendarComponent
                        mode="single"
                        selected={eventForm.startDate ? parseISO(eventForm.startDate) : undefined}
                        onSelect={(date) => setEventForm({ ...eventForm, startDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                        initialFocus
                        className="bg-gray-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-gray-300">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal bg-gray-700 border-gray-600 text-white ${
                          !eventForm.endDate && "text-gray-400"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventForm.endDate ? format(parseISO(eventForm.endDate), "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                      <CalendarComponent
                        mode="single"
                        selected={eventForm.endDate ? parseISO(eventForm.endDate) : undefined}
                        onSelect={(date) => setEventForm({ ...eventForm, endDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                        initialFocus
                        className="bg-gray-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-gray-300">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={eventForm.startTime}
                    onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-gray-300">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-gray-300">Location</Label>
                  <Input
                    id="location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Virtual, Office, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                  <Select value={eventForm.priority} onValueChange={(value) => setEventForm({ ...eventForm, priority: value })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="attendees" className="text-gray-300">Attendees</Label>
                <Input
                  id="attendees"
                  value={eventForm.attendees}
                  onChange={(e) => setEventForm({ ...eventForm, attendees: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Team, Students, etc."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  Create Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Event Legend */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Event Types</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showCalCom"
                  checked={showCalComEvents}
                  onChange={(e) => setShowCalComEvents(e.target.checked)}
                  className="w-4 h-4 text-teal-600 bg-gray-700 border-gray-600 rounded focus:ring-teal-500 focus:ring-2"
                />
                <Label htmlFor="showCalCom" className="text-sm text-gray-300">
                  Show Cal.com Events
                </Label>
              </div>
              {isLoadingCalCom && (
                <div className="text-sm text-teal-400">Loading Cal.com...</div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(eventColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="text-sm text-gray-300 capitalize">{type}</span>
                {type === 'calcom' && (
                  <span className="text-xs text-teal-400">(External)</span>
                )}
              </div>
            ))}
          </div>
          {showCalComEvents && (
            <div className="mt-3 p-2 bg-teal-500/10 border border-teal-500/20 rounded text-xs text-teal-300">
              <p>💡 <strong>Cal.com Events:</strong> Events are fetched via our secure API route. 
              If you see mock data, check the browser console for connection status.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Calendar */}
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