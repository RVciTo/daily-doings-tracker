import { useState } from "react";
import { HabitGrid } from "@/components/HabitGrid";
import { parseCSVData } from "@/utils/csvParser";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const sampleData = `date,habit
2024-11-01,"Slept 7h or more"
2024-11-01,"Workout 15m or more"
2024-11-02,"Slept 7h or more"
2024-11-02,"Workout 15m or more"`;

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
          <h1 className="text-3xl font-bold text-primary">Habit Tracker</h1>
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
        
        <HabitGrid habits={habits} currentDate={currentDate} />
      </div>
    </div>
  );
};

export default Index;