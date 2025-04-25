import { format, isAfter, isBefore, isEqual, eachDayOfInterval, parseISO } from "date-fns";

interface StreaksViewProps {
  habits: Record<string, string[]>;
  startDate: Date;
}

export const StreaksView = ({ habits, startDate }: StreaksViewProps) => {
  const calculateCurrentStreak = (dates: string[]) => {
    const sortedDates = [...dates]
      .map(date => parseISO(date))
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

  const getStreakColor = (streak: number) => {
    if (streak === 0) {
      return "bg-red-100 border-red-200 text-red-700"; // Red for no streak
    } else if (streak < 15) {
      return "bg-yellow-100 border-yellow-200 text-yellow-700"; // Yellow for building streak
    } else {
      return "bg-green-100 border-green-200 text-green-700"; // Green for strong streak
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) {
      return "🔄"; // Reset/start over
    } else if (streak < 15) {
      return "🔥"; // Building streak
    } else {
      return "⭐"; // Strong streak
    }
  };

  const sortedHabits = Object.entries(habits)
    .map(([habit, dates]) => ({
      habit,
      dates,
      currentStreak: calculateCurrentStreak(dates)
    }))
    .sort((a, b) => b.currentStreak - a.currentStreak); // Sort by streak, highest first

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedHabits.map(({ habit, currentStreak }) => {
          const streakColor = getStreakColor(currentStreak);
          const emoji = getStreakEmoji(currentStreak);
          
          return (
            <div 
              key={habit} 
              className={`relative border rounded-lg p-4 transition-all duration-200 ${streakColor} hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm mb-2 pr-6 truncate" title={habit}>
                  {habit}
                </h3>
                <span className="text-lg" title="Streak Status">
                  {emoji}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{currentStreak}</span>
                <span className="text-sm opacity-75">days</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
