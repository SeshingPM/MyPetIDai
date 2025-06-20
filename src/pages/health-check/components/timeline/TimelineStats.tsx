
import React from 'react';
import { MedicalEvent } from '@/utils/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Stethoscope, AlertTriangle, Scissors, Pill, FileText } from 'lucide-react';

interface TimelineStatsProps {
  events: MedicalEvent[];
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  checkup: '#3b82f6', // blue
  emergency: '#ef4444', // red
  procedure: '#8b5cf6', // purple
  vaccination: '#22c55e', // green
  medication: '#f59e0b', // amber
  other: '#6b7280', // gray
};

const EVENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  checkup: <Stethoscope className="h-4 w-4" />,
  emergency: <AlertTriangle className="h-4 w-4" />,
  procedure: <Scissors className="h-4 w-4" />,
  vaccination: <Stethoscope className="h-4 w-4" />,
  medication: <Pill className="h-4 w-4" />,
  other: <FileText className="h-4 w-4" />,
};

const TimelineStats: React.FC<TimelineStatsProps> = ({ events }) => {
  // Count occurrences of each event type
  const eventTypeCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {});

  // Convert to data for the pie chart
  const data = Object.entries(eventTypeCounts).map(([name, value]) => ({
    name,
    value,
    color: EVENT_TYPE_COLORS[name] || EVENT_TYPE_COLORS.other,
    icon: EVENT_TYPE_ICONS[name] || EVENT_TYPE_ICONS.other
  }));

  // Calculate totals and most frequent event
  const totalEvents = events.length;
  let mostFrequentEvent = { type: '', count: 0 };
  
  for (const [type, count] of Object.entries(eventTypeCounts)) {
    if (count > mostFrequentEvent.count) {
      mostFrequentEvent = { type, count };
    }
  }

  // If no events, show empty state
  if (totalEvents === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        No event data available
      </div>
    );
  }

  const chartConfig = {
    ...Object.keys(EVENT_TYPE_COLORS).reduce((config, key) => {
      config[key] = { color: EVENT_TYPE_COLORS[key] };
      return config;
    }, {} as Record<string, { color: string }>)
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Medical Events Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="border rounded-md p-3 bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Total Events</p>
          <p className="text-xl font-semibold">{totalEvents}</p>
        </div>
        
        <div className="border rounded-md p-3 bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Most Frequent</p>
          <p className="text-xl font-semibold capitalize">
            {mostFrequentEvent.type || 'None'}
          </p>
        </div>
        
        <div className="border rounded-md p-3 bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Event Types</p>
          <p className="text-xl font-semibold">{Object.keys(eventTypeCounts).length}</p>
        </div>
      </div>
      
      <div className="h-52">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <ChartTooltipContent>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
                        <span className="capitalize">{data.name}</span>
                        <span>: {data.value}</span>
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = outerRadius * 1.2;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fontSize={10}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fill="#6b7280"
                  >
                    {data[index].name.charAt(0).toUpperCase() + data[index].name.slice(1)} ({value})
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default TimelineStats;
