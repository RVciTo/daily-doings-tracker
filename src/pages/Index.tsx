import { useState } from "react";
import { StreaksView } from "@/components/StreaksView";
import { CompletionRates } from "@/components/CompletionRates";
import { parseCSVData } from "@/utils/csvParser";
import { Button } from "@/components/ui/button";
import { format, subDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="container py-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Habit Tracker Dashboard</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Completion Rates</h2>
          <div className="flex items-center gap-4 mb-4">
            <Select
              value={dateRange}
              onValueChange={(value: keyof typeof dateRangeOptions) => setDateRange(value)}
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
          <CompletionRates habits={habits} startDate={startDate} />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Streaks</h2>
          <StreaksView habits={habits} startDate={startDate} />
        </div>
      </div>
    </div>
  );
};

export default Index;
