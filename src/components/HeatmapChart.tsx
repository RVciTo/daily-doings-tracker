import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, ScatterChart, Scatter, Cell } from "recharts";
import { format, parseISO, eachDayOfInterval, subDays } from "date-fns";

interface HeatmapChartProps {
  habits: Record<string, string[]>;
}

export const HeatmapChart = ({ habits }: HeatmapChartProps) => {
  // Get the date range (last 30 days)
  const endDate = new Date();
  const startDate = subDays(endDate, 30);
  
  // Create data points for the heatmap
  const data = Object.entries(habits).flatMap(([habit, dates]) => 
    dates.map(date => ({
      habit,
      date: parseISO(date),
      value: 1,
    }))
  ).filter(item => item.date >= startDate && item.date <= endDate);

  // Get unique habits for Y-axis
  const uniqueHabits = [...new Set(data.map(item => item.habit))];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card className="p-2 shadow-lg">
          <div className="text-sm font-medium">{data.habit}</div>
          <div className="text-xs text-muted-foreground">
            {format(data.date, 'PPP')}
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Habit Completion Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 200 }}
            >
              <XAxis
                dataKey="date"
                name="Date"
                tickFormatter={(date) => format(date, 'MM/dd')}
                type="number"
                domain={[startDate.getTime(), endDate.getTime()]}
                tickCount={7}
              />
              <YAxis
                dataKey="habit"
                type="category"
                width={180}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                data={data}
                fill="#4C1D95"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="#4C1D95"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};