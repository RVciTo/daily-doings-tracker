import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, RectangleChart, Rectangle } from "recharts";
import { format, eachDayOfInterval, startOfDay, endOfDay } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeatmapChartProps {
  habits: Record<string, string[]>;
  startDate: Date;
}

export const HeatmapChart = ({ habits, startDate }: HeatmapChartProps) => {
  const isMobile = useIsMobile();
  const endDate = new Date();

  // Create data points for the heatmap
  const data = Object.entries(habits).flatMap(([habit, dates]) => {
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    return dateRange.map(date => {
      const count = dates.filter(d => 
        startOfDay(new Date(d)).getTime() === startOfDay(date).getTime()
      ).length;
      return {
        habit,
        date,
        value: count,
      };
    });
  });

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
          <div className="text-xs font-semibold">
            Completed: {data.value} time{data.value !== 1 ? 's' : ''}
          </div>
        </Card>
      );
    }
    return null;
  };

  const getColor = (value: number) => {
    const intensity = Math.min(value * 60, 255);
    return `rgb(76, ${intensity}, 149)`;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Habit Completion Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full overflow-x-auto">
          <div className="min-w-[800px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RectangleChart
                data={data}
                margin={{ 
                  top: 20, 
                  right: 20, 
                  bottom: 20, 
                  left: isMobile ? 100 : 200 
                }}
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
                  width={isMobile ? 80 : 180}
                  interval={0}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Rectangle
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.8}
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => (
                    <Rectangle
                      key={`cell-${index}`}
                      fill={getColor(entry.value)}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Rectangle>
              </RectangleChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
