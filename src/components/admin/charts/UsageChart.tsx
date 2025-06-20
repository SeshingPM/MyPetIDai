
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  users: number;
  pets: number;
}

export const UsageChart = ({ data }: { data: ChartData[] }) => {
  const chartConfig = {
    users: { 
      label: "Users",
      color: "#8884d8"
    },
    pets: { 
      label: "Pets",
      color: "#82ca9d"
    }
  };
  
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No data available for selected period
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>Usage Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="var(--color-users)" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="pets" 
              stroke="var(--color-pets)" 
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
