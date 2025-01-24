import { useState } from "react";
import { HabitGrid } from "@/components/HabitGrid";
import { HeatmapChart } from "@/components/HeatmapChart";
import { parseCSVData } from "@/utils/csvParser";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const sampleData = `date,habit
2024-11-01,"Slept 7h or more"
2024-11-01,"Workout 15m or more"
2024-11-01,"Yoga, Stretching or Core 10m or more"
2024-11-01,"Cold shower 1m or more"
2024-11-01,"Proteins above 150g"
2024-11-01,"No addictive products (alcohol or else)"
2024-11-01,"Meditation for 5m or more"
2024-11-01,"German for 5m or more"
2024-11-01,"Flashcards for 5m or more"
2024-11-01,"Books for 5m or more"
2024-11-01,"Free Learning or MarketWatch"
2024-11-01,"Certified training for 15m or more"
2024-11-01,"Screens & Social under 1h"
2024-11-01,"Morning Self-Care & Cleaning routine"
2024-11-01,"Breathwork for 5m or more"
2024-11-01,"Was I kind (4 agreements)?"
2024-11-01,"Bed time routine (self-care & massage)"
2024-11-02,"Slept 7h or more"
2024-11-02,"Morning Self-Care & Cleaning routine"
2024-11-02,"Yoga, Stretching or Core 10m or more"
2024-11-02,"Cold shower 1m or more"
2024-11-02,"Meditation for 5m or more"
2024-11-02,"German for 5m or more"
2024-11-02,"Books for 5m or more"
2024-11-02,"Free Learning or MarketWatch"
2024-11-02,"Certified training for 15m or more"
2024-11-02,"Was I kind (4 agreements)?"
2024-11-02,"No addictive products (alcohol or else)"
2024-11-03,"Slept 7h or more"
2024-11-03,"Morning Self-Care & Cleaning routine"
2024-11-03,"Yoga, Stretching or Core 10m or more"
2024-11-03,"Workout 15m or more"
2024-11-03,"Cold shower 1m or more"
2024-11-03,"Meditation for 5m or more"
2024-11-03,"German for 5m or more"
2024-11-03,"Flashcards for 5m or more"
2024-11-03,"Books for 5m or more"
2024-11-03,"Breathwork for 5m or more"
2024-11-03,"Free Learning or MarketWatch"
2024-11-03,"Certified training for 15m or more"
2024-11-03,"Was I kind (4 agreements)?"
2024-11-04,"Morning Self-Care & Cleaning routine"
2024-11-04,"Yoga, Stretching or Core 10m or more"
2024-11-04,"Workout 15m or more"
2024-11-04,"Cold shower 1m or more"
2024-11-04,"Meditation for 5m or more"
2024-11-04,"German for 5m or more"
2024-11-04,"Books for 5m or more"
2024-11-04,"Breathwork for 5m or more"
2024-11-04,"Free Learning or MarketWatch"
2024-11-04,"Was I kind (4 agreements)?"
2024-11-05,"Slept 7h or more"
2024-11-05,"Morning Self-Care & Cleaning routine"
2024-11-05,"Yoga, Stretching or Core 10m or more"
2024-11-05,"Workout 15m or more"
2024-11-05,"Cold shower 1m or more"
2024-11-05,"Meditation for 5m or more"
2024-11-05,"German for 5m or more"
2024-11-05,"Flashcards for 5m or more"
2024-11-05,"Breathwork for 5m or more"
2024-11-05,"Free Learning or MarketWatch"
2024-11-06,"Slept 7h or more"
2024-11-06,"Morning Self-Care & Cleaning routine"
2024-11-06,"Yoga, Stretching or Core 10m or more"
2024-11-06,"Cold shower 1m or more"
2024-11-06,"Meditation for 5m or more"
2024-11-06,"German for 5m or more"
2024-11-06,"Books for 5m or more"
2024-11-06,"Was I kind (4 agreements)?"
2024-11-07,"Morning Self-Care & Cleaning routine"
2024-11-07,"Yoga, Stretching or Core 10m or more"
2024-11-07,"Workout 15m or more"
2024-11-07,"Cold shower 1m or more"
2024-11-07,"Meditation for 5m or more"
2024-11-07,"German for 5m or more"
2024-11-07,"Flashcards for 5m or more"
2024-11-07,"Books for 5m or more"
2024-11-07,"Breathwork for 5m or more"
2024-11-07,"Free Learning or MarketWatch"`;

const Index = () => {
  const [habits, setHabits] = useState(() => parseCSVData(sampleData));
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