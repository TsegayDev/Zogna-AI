'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { date: '2024-01-01', users: 2000 },
  { date: '2024-02-01', users: 2200 },
  { date: '2024-03-01', users: 3400 },
  { date: '2024-04-01', users: 3800 },
  { date: '2024-05-01', users: 4200 },
  { date: '2024-06-01', users: 5100 },
  { date: '2024-07-01', users: 5500 },
];

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--primary))',
  },
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
               <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Line
                dataKey="users"
                type="monotone"
                stroke="var(--color-users)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
