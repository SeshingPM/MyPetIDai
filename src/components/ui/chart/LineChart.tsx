
import React from 'react';
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer } from './chart-container';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      tension?: number;
    }>;
  };
  className?: string;
}

export const LineChart = ({ data, className }: LineChartProps) => {
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
      theme: { light: dataset.borderColor || '#16a34a' },
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <ChartContainer config={config} className={className}>
      <RechartsLineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        {data.datasets.map((dataset, index) => (
          <Line
            key={index}
            dataKey={dataset.label}
            stroke={dataset.borderColor}
            strokeWidth={2}
            dot={{ r: 3 }}
            type="monotone"
            activeDot={{ r: 6 }}
            // We need to use the supported props from Recharts
            // 'tension' isn't directly supported, but 'type' with 'monotone' creates a similar effect
            // The curve smoothness is controlled by the 'type' property
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};
