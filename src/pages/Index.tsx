import { useState, useEffect } from "react";
import { StreaksView } from "@/components/StreaksView";
import { CompletionRates } from "@/components/CompletionRates";
// import { HealthStats } from "@/components/HealthStats";
import { QuoteDisplay } from "@/components/QuoteDisplay";
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
import { InfoIcon } from "lucide-react";

const dateRangeOptions = {
  "1week": { label: "Last Week", days: 7 },
  "2weeks": { label: "Last 2 Weeks", days: 14 },
  "1month": { label: "Last Month", days: 30 },
  "3months": { label: "Last 3 Months", days: 90 },
  "6months": { label: "Last 6 Months", days: 180 },
  "1year": { label: "Last Year", days: 365 },
} as const;

const Index = () => {
  // -----------------------------
  // STATE
  // -----------------------------
  const [habits, setHabits] = useState<Record<string, string[]>>({});
  // const [healthData, setHealthData] = useState<Record<string, string[]>>({});

  // HABITS date range
  const [dateRange, setDateRange] = useState<keyof typeof dateRangeOptions>("1month");
  const startDate = subDays(new Date(), dateRangeOptions[dateRange].days);

  // Removed health date range state

  // -----------------------------
  // EFFECT: LOAD CSVs
  // -----------------------------
  useEffect(() => {
    // Load HABITS data from Dropbox link
    fetch("https://www.dl.dropboxusercontent.com/scl/fi/gom5fu8tx9ib9c747r6ag/test.csv?rlkey=245hysi00jfc823krmwz2hmk0&st=ch239w7x")
      .then((response) => response.text())
      .then((data) => {
        setHabits(parseCSVData(data));
      })
      .catch((error) => console.error("Error loading habits data:", error));

    // Removed health data loading
  }, []);

  // -----------------------------
  // CSV UPLOAD HANDLERS
  // -----------------------------
  const handleHabitsFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setHabits(parseCSVData(text));
    };
    reader.readAsText(file);
  };

  // Removed health file upload handler

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-primary mb-6">Habit Tracker Dashboard</h1>

          <QuoteDisplay />

          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>How to use this dashboard</AlertTitle>
            <AlertDescription>
              Upload your CSV file with habit data to view your completion rates and current streaks.
              The CSV should have two columns: <code>date</code> (YYYY-MM-DD) and <code>habit</code>.
              Use the date range selector to adjust the time period for the completion rates.
            </AlertDescription>
          </Alert>

          {/* ----------------------------------------
              HABITS SECTION
          ---------------------------------------- */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h2 className="text-2xl font-semibold">Completion Rates</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Percentage of days each habit was completed within the selected date range.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Select
                    value={dateRange}
                    onValueChange={(value: keyof typeof dateRangeOptions) => setDateRange(value)}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
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
                      onClick={() => document.getElementById("csv-upload-habits")?.click()}
                    >
                      Upload CSV
                    </Button>
                    <input
                      id="csv-upload-habits"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleHabitsFileUpload}
                    />
                  </div>
                </div>
              </div>
              <CompletionRates habits={habits} startDate={startDate} />
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Current Streaks</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Number of consecutive days each habit has been maintained up to today.
                </p>
              </div>
              <StreaksView habits={habits} startDate={startDate} />
            </div>
          </div>

          {/* Removed Health Stats Section */}
        </div>
      </div>
    </div>
  );
};

export default Index;
