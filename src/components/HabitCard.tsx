import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface HabitCardProps {
  habit: string;
  completedDates: string[];
  currentDate: string;
}

export const HabitCard = ({ habit, completedDates, currentDate }: HabitCardProps) => {
  const isCompleted = completedDates.includes(currentDate);

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{habit}</CardTitle>
        {isCompleted ? (
          <Check className="h-4 w-4 text-secondary" />
        ) : (
          <X className="h-4 w-4 text-gray-300" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Streak: {completedDates.length} days
        </div>
      </CardContent>
    </Card>
  );
};
