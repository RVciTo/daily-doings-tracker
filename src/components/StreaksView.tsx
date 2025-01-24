import { format, isAfter, isBefore, isEqual, eachDayOfInterval } from "date-fns";

interface StreaksViewProps {
  habits: Record<string, string[]>;
  startDate: Date;
}

export const StreaksView = ({ habits, startDate }: StreaksViewProps) => {
  const calculateCurrentStreak = (dates: string[]) => {
    const sortedDates = [...dates]
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let currentDate = new Date();
    
    // If no activity today, check if there was activity yesterday
    if (!sortedDates.some(date => 
      isEqual(date.setHours(0,0,0,0), currentDate.setHours(0,0,0,0)))) {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
    }

    for (const date of sortedDates) {
      if (isEqual(date.setHours(0,0,0,0), currentDate.setHours(0,0,0,0))) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(habits).map(([habit, dates]) => {
        const currentStreak = calculateCurrentStreak(dates);
        return (
          <div key={habit} className="bg-accent rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-sm mb-2">{habit}</h3>
            <p className="text-2xl font-bold">{currentStreak} days</p>
          </div>
        );
      })}
    </div>
  );
};
