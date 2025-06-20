
import React from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { MedicalEvent } from '@/utils/types';
import { CalendarClock, Stethoscope, AlertTriangle, Scissors, Pill, FileText, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimelineViewProps {
  events: MedicalEvent[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string) => void;
}

// Map event types to icons and colors
const EVENT_TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  checkup: { icon: <Stethoscope className="h-4 w-4" />, color: 'bg-blue-100 text-blue-600 border-blue-200' },
  emergency: { icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-red-100 text-red-600 border-red-200' },
  procedure: { icon: <Scissors className="h-4 w-4" />, color: 'bg-purple-100 text-purple-600 border-purple-200' },
  vaccination: { icon: <Stethoscope className="h-4 w-4" />, color: 'bg-green-100 text-green-600 border-green-200' },
  medication: { icon: <Pill className="h-4 w-4" />, color: 'bg-amber-100 text-amber-600 border-amber-200' },
  other: { icon: <FileText className="h-4 w-4" />, color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

// Get config for an event type, with fallback
const getEventConfig = (eventType: string) => {
  return EVENT_TYPE_CONFIG[eventType] || EVENT_TYPE_CONFIG.other;
};

const TimelineView: React.FC<TimelineViewProps> = ({ events, selectedEventId, onSelectEvent }) => {
  // Group events by year for the timeline
  const eventsByYear = events.reduce<Record<string, MedicalEvent[]>>((acc, event) => {
    const year = new Date(event.eventDate).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(eventsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="space-y-8 relative">
      {sortedYears.map((year) => (
        <div key={year} className="relative">
          <div className="sticky top-0 z-10 mb-2 bg-white/90 backdrop-blur-sm py-1">
            <h3 className="text-lg font-medium text-gray-900">{year}</h3>
          </div>
          
          <div className="relative ml-6 space-y-6 pb-2">
            {/* Timeline connecting line */}
            <div className="absolute top-0 bottom-0 left-3 w-0.5 -ml-3 bg-gray-200"></div>
            
            {eventsByYear[year]
              .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
              .map((event, index) => {
                const config = getEventConfig(event.eventType);
                const isSelected = selectedEventId === event.id;
                
                return (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute left-3 -ml-3 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center",
                      config.color.split(' ')[0]
                    )}>
                      {config.icon}
                    </div>
                    
                    {/* Event card */}
                    <div 
                      className={cn(
                        "ml-8 rounded-lg border p-4 transition-colors cursor-pointer group", 
                        isSelected 
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => onSelectEvent(event.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              config.color
                            )}>
                              {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {format(parseISO(event.eventDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className={cn(
                                  "rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100", 
                                  isSelected ? "opacity-100" : ""
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectEvent(event.id);
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5 text-gray-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Click to edit event</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      {isSelected && (
                        <div className="mt-3 space-y-2">
                          {event.description && (
                            <p className="text-sm text-gray-700">{event.description}</p>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {event.provider && (
                              <div>
                                <span className="text-gray-500">Provider:</span>{' '}
                                <span className="text-gray-900">{event.provider}</span>
                              </div>
                            )}
                            {event.cost !== undefined && event.cost !== null && (
                              <div>
                                <span className="text-gray-500">Cost:</span>{' '}
                                <span className="text-gray-900">${event.cost.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;
