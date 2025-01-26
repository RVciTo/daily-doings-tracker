import { Progress } from "@/components/ui/progress";
import { eachDayOfInterval, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface HealthStatsProps {
  healthData: Record<string, string[]>;
  startDate: Date; // This should be the date the user selects in the Health date picker
}

/** Known reference values for each log. */
const referenceValues: Record<string, number> = {
  "Active Calories": 800,
  "Body Fat Percentage": 10,
  "Caffeine": 350,
  "Calcium": 1000,
  "VO2 Max": 50,
  "Cycling Distance": 60,
  "Exercise Time": 70,
  "Heart Rate Variability": 80,
  "Iron": 8,
  "Magnesium": 420,
  "Protein": 150,
  "Resting Calories": 2000,
  "Resting Heart Rate": 50,
  "Running Power": 200,
  "Running Speed": 12,
  "Selenium": 55,
  "Swimming Distance": 1,
  "Vitamin B6": 1.3,
  "Vitamin B12": 2.4,
  "Vitamin D": 15,
  "Walking + Running Distance": 30,
  "Water": 3000,
  "Zinc": 11,
  "Carbohydrates": 310,
  "Total Fat": 100,
};

/** Unit mapping for Y-axis labels. */
const unitMapping: Record<string, string> = {
  "Active Calories": "kcal",
  "Resting Calories": "kcal",
  "Protein": "g",
  "Water": "ml",
  "Total Fat": "g",
  "Body Fat Percentage": "%",
  "Carbohydrates": "g",
  "Caffeine": "mg",
  "Calcium": "mg",
  "VO2 Max": "mL/kg/min",
  "Cycling Distance": "km",
  "Exercise Time": "minutes",
  "Heart Rate Variability": "ms",
  "Iron": "mg",
  "Magnesium": "mg",
  "Resting Heart Rate": "bpm",
  "Running Power": "watts",
  "Running Speed": "km/h",
  "Selenium": "mcg",
  "Swimming Distance": "km",
  "Vitamin B6": "mg",
  "Vitamin B12": "mcg",
  "Vitamin D": "IU",
  "Walking + Running Distance": "km",
  "Zinc": "mg",
};

function getUnitLabel(log: string) {
  return unitMapping[log] || "";
}

export const HealthStats = ({ healthData, startDate }: HealthStatsProps) => {
  /** Filter function to keep data within the selected date range. */
  const filterDatesInRange = (dates: string[]) => {
    return dates.filter(entry => {
      const [d] = entry.split(",");
      const entryDate = parseISO(d);
      return entryDate >= startDate && entryDate <= new Date();
    });
  };

  /** Calculate the completion rate for the selected date range. */
  const calculateCompletionRate = (dates: string[]) => {
    const daysInRange = eachDayOfInterval({
      start: startDate,
      end: new Date(),
    }).length;

    // Only count entries within [startDate, today].
    const validEntries = filterDatesInRange(dates).length;

    return Math.round((validEntries / daysInRange) * 100);
  };

  /** Sort logs by ascending completion rate. */
  const sortedHealthData = Object.entries(healthData)
    .map(([log, dates]) => ({
      log,
      dates,
      completionRate: calculateCompletionRate(dates),
    }))
    .sort((a, b) => a.completionRate - b.completionRate);

  /** Prepares the chart data, filtering by date range. */
  const getChartData = (dates: string[]) => {
    const validEntries = filterDatesInRange(dates);
    return validEntries.map(entry => {
      const parts = entry.split(",");
      return {
        date: parts[0], // "YYYY-MM-DD"
        value: parseFloat(parts[2]) || 0,
      };
    });
  };

  /** Computes min, max, avg only for nonzero values within the date range. */
  const calculateStats = (dates: string[]) => {
    const validEntries = filterDatesInRange(dates);
    const values = validEntries
      .map(entry => parseFloat(entry.split(",")[2]))
      // Exclude 0, NaN from stats
      .filter(v => v && !isNaN(v));

    if (values.length === 0) {
      return { minValue: 0, maxValue: 0, avgValue: 0 };
    }
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    return { minValue, maxValue, avgValue };
  };

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-4">
      <div className="space-y-4">
        {sortedHealthData.map(({ log, dates }) => {
          const { minValue, maxValue, avgValue } = calculateStats(dates);
          const chartData = getChartData(dates);

          // Add reference line only if there's a known reference value
          const refVal = referenceValues[log];

          return (
            <div key={log} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{log}</span>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: getUnitLabel(log),
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    {refVal !== undefined && (
                      <ReferenceLine
                        y={refVal}
                        stroke="red"
                        strokeDasharray="3 3"
                        label={`Ref: ${refVal}${getUnitLabel(log)}`}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="value"
                      name={log} // so legend shows the log name
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-sm">
                <span>Min: {minValue}</span>
                <span>Max: {maxValue}</span>
                <span>Avg: {avgValue.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
