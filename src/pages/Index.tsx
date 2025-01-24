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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Download } from "lucide-react";

const generateSampleData = () => {
  const habits = [
    "Slept 7h or more",
    "Workout 15m or more",
    "Yoga, Stretching or Core 10m or more",
    "Cold shower 1m or more",
    "Proteins above 150g",
    "No addictive products (alcohol or else)",
    "Meditation for 5m or more",
    "German for 5m or more",
    "Flashcards for 5m or more",
    "Books for 5m or more",
    "Free Learning or MarketWatch",
    "Certified training for 15m or more",
    "Screens & Social under 1h",
    "Morning Self-Care & Cleaning routine",
    "Breathwork for 5m or more",
    "Was I kind (4 agreements)?",
    "Bed time routine (self-care & massage)"
  ];

  const startDate = new Date(2023, 0, 1); // Start from January 1, 2023
  const endDate = new Date(); // Today's date
  let currentDate = new Date(startDate);

  let csvData = "date,habit\n";

  while (currentDate <= endDate) {
    const formattedDate = format(currentDate, "yyyy-MM-dd");
    const numHabits = Math.floor(Math.random() * habits.length) + 1; // Random number of habits completed each day
    const completedHabits = habits.sort(() => 0.5 - Math.random()).slice(0, numHabits);

    completedHabits.forEach(habit => {
      csvData += `${formattedDate},"${habit}"\n`;
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return csvData;
};

const dateRangeOptions = {
  "1week": { label: "Last Week", days: 7 },
  "2weeks": { label: "Last 2 Weeks", days: 14 },
  "1month": { label: "Last Month", days: 30 },
  "3months": { label: "Last 3 Months", days: 90 },
  "6months": { label: "Last 6 Months", days: 180 },
  "1year": { label: "Last Year", days: 365 },
} as const;

const Index = () => {
  const [habits, setHabits] = useState(() => parseCSVData(generateSampleData()));
  const [dateRange, setDateRange] = useState<keyof typeof dateRangeOptions>("1month");

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

  const handleDownloadSample = () => {
    const sampleData = generateSampleData();
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_habits.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startDate = subDays(new Date(), dateRangeOptions[dateRange].days);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-primary mb-6">Habit Tracker Dashboard</h1>
          
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>How to use this dashboard</AlertTitle>
            <AlertDescription>
              Upload your CSV file with habit data to view your completion rates and current streaks. 
              The CSV should have two columns: 'date' (YYYY-MM-DD) and 'habit'. 
              Use the date range selector to adjust the time period for the completion rates.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h2 className="text-2xl font-semibold">Completion Rates</h2>
                  <p className="text-sm text-gray-600 mt-1">Percentage of days each habit was completed within the selected date range.</p>
                </div>
                <div className="flex items-center gap-4">
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("csv-upload")?.click()}
                    >
                      Upload CSV
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadSample}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Sample CSV
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
              </div>
              <CompletionRates habits={habits} startDate={startDate} />
            </div>
            
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Current Streaks</h2>
                <p className="text-sm text-gray-600 mt-1">Number of consecutive days each habit has been maintained up to today.</p>
              </div>
              <StreaksView habits={habits} startDate={startDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
