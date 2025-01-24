import { Progress } from "@/components/ui/progress";
import { eachDayOfInterval, parseISO } from "date-fns";

interface CompletionRatesProps {
  habits: Record<string, string[]>;
  startDate: Date;
}

export const CompletionRates = ({ habits, startDate }: CompletionRatesProps) => {
  const calculateCompletionRate = (dates: string[]) => {
    const daysInRange = eachDayOfInterval({
      start: startDate,
      end: new Date(),
    }).length;

    const datesInRange = dates.filter(
      date => parseISO(date) >= startDate && parseISO(date) <= new Date()
    ).length;

    return Math.round((datesInRange / daysInRange) * 100);
  };

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-4">
      <div className="space-y-4">
        {Object.entries(habits).map(([habit, dates]) => {
          const completionRate = calculateCompletionRate(dates);
          return (
            <div key={habit} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{habit}</span>
                <span className="text-muted-foreground">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
