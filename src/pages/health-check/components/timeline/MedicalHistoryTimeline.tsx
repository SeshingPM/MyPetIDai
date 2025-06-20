
import React, { useState, useMemo } from 'react';
import { useHealth } from '@/contexts/health';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarClock, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subMonths } from 'date-fns';
import TimelineView from './TimelineView';
import TimelineFilters from './TimelineFilters';
import TimelineStats from './TimelineStats';
import { MedicalEvent } from '@/utils/types';

interface MedicalHistoryTimelineProps {
  petId: string;
  petName?: string;
  onAddEvent: () => void;
  onEditEvent?: (event: MedicalEvent) => void;
}

const MedicalHistoryTimeline: React.FC<MedicalHistoryTimelineProps> = ({ 
  petId, 
  petName,
  onAddEvent,
  onEditEvent
}) => {
  const { getMedicalEventsForPet, loading } = useHealth();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("timeline");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  
  // Get all events for the current pet
  const allPetEvents = getMedicalEventsForPet(petId);
  
  // Get unique event types
  const uniqueEventTypes = useMemo(() => {
    const types = new Set(allPetEvents.map(event => event.eventType));
    return Array.from(types);
  }, [allPetEvents]);
  
  // Apply filters
  const filteredEvents = useMemo(() => {
    let filtered = [...allPetEvents];
    
    // Filter by event type
    if (selectedEventType !== "all") {
      filtered = filtered.filter(event => event.eventType === selectedEventType);
    }
    
    // Filter by date range
    const now = new Date();
    if (dateRange !== "all") {
      let monthsToSubtract = 12;
      if (dateRange === "6months") monthsToSubtract = 6;
      if (dateRange === "3months") monthsToSubtract = 3;
      
      const cutoffDate = subMonths(now, monthsToSubtract);
      filtered = filtered.filter(event => new Date(event.eventDate) >= cutoffDate);
    }
    
    // Always sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }, [allPetEvents, selectedEventType, dateRange]);
  
  const handleSelectEvent = (eventId: string) => {
    // Toggle selection if clicking the same event
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    } else {
      setSelectedEventId(eventId);
      
      // If editing is enabled and an event is selected, find the event and prepare for editing
      if (onEditEvent) {
        const event = allPetEvents.find(e => e.id === eventId);
        if (event) {
          // Double-click (or long tap) to edit - simulate with a slight delay
          const timer = setTimeout(() => {
            onEditEvent(event);
            setSelectedEventId(null);
          }, 300);
          
          return () => clearTimeout(timer);
        }
      }
    }
  };
  
  const resetFilters = () => {
    setSelectedEventType("all");
    setDateRange("all");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (allPetEvents.length === 0) {
    return (
      <EmptyState
        icon={<CalendarClock className="h-12 w-12 text-gray-400" />}
        title="No medical events recorded"
        description="Track important health events like surgeries, diagnoses, or injuries."
        action={
          <Button onClick={onAddEvent} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Medical Event
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Medical History</h3>
        <Button size="sm" onClick={onAddEvent}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Tabs defaultValue="timeline" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="timeline">
            <CalendarClock className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart2 className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-4">
          <TimelineFilters
            eventTypes={uniqueEventTypes}
            selectedEventType={selectedEventType}
            onSelectEventType={setSelectedEventType}
            dateRange={dateRange}
            onSelectDateRange={setDateRange}
            onResetFilters={resetFilters}
          />
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-gray-500">No events match your current filters</p>
              <Button variant="link" onClick={resetFilters} className="mt-2">
                Reset Filters
              </Button>
            </div>
          ) : (
            <TimelineView 
              events={filteredEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
            />
          )}
        </TabsContent>
        
        <TabsContent value="stats">
          <TimelineStats events={allPetEvents} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalHistoryTimeline;
