
import React from 'react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer } from './chart-container';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string;
    }>;
  };
  className?: string;
}

export const BarChart = ({ data, className }: BarChartProps) => {
  // Transform the data format to the one expected by Recharts
  const chartData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { label };
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    return dataPoint;
  });

  // Set up config for the chart
  const config = data.datasets.reduce((acc, dataset) => {
    acc[dataset.label] = {
      label: dataset.label,
      theme: { light: dataset.backgroundColor || '#2563eb' },
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <ChartContainer config={config} className={className}>
      <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        {data.datasets.map((dataset, index) => (
          <Bar
            key={index}
            dataKey={dataset.label}
            fill={dataset.backgroundColor}
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};
