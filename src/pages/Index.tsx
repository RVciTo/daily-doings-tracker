import { useState } from "react";
import { HeatmapChart } from "@/components/HeatmapChart";
import { StreaksView } from "@/components/StreaksView";
import { CompletionRates } from "@/components/CompletionRates";
import { parseCSVData } from "@/utils/csvParser";
import { Button } from "@/components/ui/button";
import { format, subDays, subWeeks, subMonths, isAfter } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const generateSampleData = () => {
  const baseData = `date,habit
${format(subDays(new Date(), 7), 'yyyy-MM-dd')},"Slept 7h or more"
${format(subDays(new Date(), 7), 'yyyy-MM-dd')},"Workout 15m or more"
${format(subDays(new Date(), 7), 'yyyy-MM-dd')},"Yoga, Stretching or Core 10m or more"
${format(subDays(new Date(), 7), 'yyyy-MM-dd')},"Cold shower 1m or more"
${format(subDays(new Date(), 7), 'yyyy-MM-dd')},"Meditation for 5m or more"
${format(subDays(new Date(), 6), 'yyyy-MM-dd')},"Slept 7h or more"
${format(subDays(new Date(), 6), 'yyyy-MM-dd')},"Morning Self-Care & Cleaning routine"
${format(subDays(new Date(), 6), 'yyyy-MM-dd')},"Yoga, Stretching or Core 10m or more"
${format(subDays(new Date(), 6), 'yyyy-MM-dd')},"Cold shower 1m or more"
${format(subDays(new Date(), 6), 'yyyy-MM-dd')},"Meditation for 5m or more"
${format(subDays(new Date(), 5), 'yyyy-MM-dd')},"Slept 7h or more"
${format(subDays(new Date(), 5), 'yyyy-MM-dd')},"Morning Self-Care & Cleaning routine"
${format(subDays(new Date(), 5), 'yyyy-MM-dd')},"Workout 15m or more"
${format(subDays(new Date(), 5), 'yyyy-MM-dd')},"Cold shower 1m or more"
${format(subDays(new Date(), 4), 'yyyy-MM-dd')},"Morning Self-Care & Cleaning routine"
${format(subDays(new Date(), 4), 'yyyy-MM-dd')},"Yoga, Stretching or Core 10m or more"
${format(subDays(new Date(), 4), 'yyyy-MM-dd')},"Workout 15m or more"
${format(subDays(new Date(), 4), 'yyyy-MM-dd')},"Meditation for 5m or more"
${format(subDays(new Date(), 3), 'yyyy-MM-dd')},"Slept 7h or more"
${format(subDays(new Date(), 3), 'yyyy-MM-dd')},"Morning Self-Care & Cleaning routine"
${format(subDays(new Date(), 3), 'yyyy-MM-dd')},"Yoga, Stretching or Core 10m or more"
${format(subDays(new Date(), 3), 'yyyy-MM-dd')},"Workout 15m or more"
${format(subDays(new Date(), 2), 'yyyy-MM-dd')},"Slept 7h or more"
${format(subDays(new Date(), 2), 'yyyy-MM-dd')},"Morning Self-Care & Cleaning routine"
${format(subDays(new Date(), 2), 'yyyy-MM-dd')},"Yoga, Stretching or Core 10m or more"
${format(subDays(new Date(), 1), 'yyyy-MM-dd')},"Morning Self-Care & Cleaning routine"
${format(subDays(new Date(), 1), 'yyyy-MM-dd')},"Yoga, Stretching or Core 10m or more"
${format(subDays(new Date(), 1), 'yyyy-MM-dd')},"Workout 15m or more"
${format(new Date(), 'yyyy-MM-dd')},"Slept 7h or more"
${format(new Date(), 'yyyy-MM-dd')},"Morning Self-Care & Cleaning routine"
${format(new Date(), 'yyyy-MM-dd')},"Meditation for 5m or more"`;

  return baseData;
};

const dateRangeOptions = {
  "1week": { label: "Last Week", days: 7 },
  "2weeks": { label: "Last 2 Weeks", days: 14 },
  "1month": { label: "Last Month", days: 30 },
} as const;

const Index = () => {
  const [habits, setHabits] = useState(() => parseCSVData(generateSampleData()));
  const [dateRange, setDateRange] = useState<keyof typeof dateRangeOptions>("1week");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setHabits(parseCSVData(text));
    };
    reader.readAsText(file);
  };

  const startDate = subDays(new Date(), dateRangeOptions[dateRange].days);

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-primary">Habit Reports</h1>
          <div className="flex gap-4 items-center">
            <Select
              value={dateRange}
              onValueChange={(value: keyof typeof dateRangeOptions) => {
                setDateRange(value);
                setSelectedDate(undefined);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dateRangeOptions).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" onClick={() => setIsCalendarOpen(true)}>
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setDateRange("1week");
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => isAfter(date, new Date())}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              onClick={() => document.getElementById("csv-upload")?.click()}
            >
              Upload CSV
            </Button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
        
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="streaks">Streaks</TabsTrigger>
            <TabsTrigger value="completion">Completion Rates</TabsTrigger>
          </TabsList>
          <TabsContent value="heatmap">
            <HeatmapChart habits={habits} startDate={startDate} />
          </TabsContent>
          <TabsContent value="streaks">
            <StreaksView habits={habits} startDate={startDate} />
          </TabsContent>
          <TabsContent value="completion">
            <CompletionRates habits={habits} startDate={startDate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
