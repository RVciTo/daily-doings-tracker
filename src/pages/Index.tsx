import { useState } from "react";
import { HabitGrid } from "@/components/HabitGrid";
import { HeatmapChart } from "@/components/HeatmapChart";
import { parseCSVData } from "@/utils/csvParser";
import { Button } from "@/components/ui/button";
import { format, subDays } from "date-fns";

// Generate sample data with dates relative to today
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

const Index = () => {
  const [habits, setHabits] = useState(() => parseCSVData(generateSampleData()));
  const currentDate = format(new Date(), "yyyy-MM-dd");

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

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Habit Reports</h1>
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
        
        <HeatmapChart habits={habits} />
        <HabitGrid habits={habits} currentDate={currentDate} />
      </div>
    </div>
  );
};

export default Index;