import { HabitCard } from "./HabitCard";

interface HabitGridProps {
  habits: Record<string, string[]>;
  currentDate: string;
}

export const HabitGrid = ({ habits, currentDate }: HabitGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(habits).map(([habit, dates]) => (
        <HabitCard
          key={habit}
          habit={habit}
          completedDates={dates}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};