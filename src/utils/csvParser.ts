export interface HabitEntry {
  date: string;
  habit: string;
}

export const parseCSVData = (csvContent: string): Record<string, string[]> => {
  const lines = csvContent.split('\n');
  const habits: Record<string, string[]> = {};

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [date, habit] = line.split(',').map(val => val.replace(/"/g, '').trim());
    
    if (!habits[habit]) {
      habits[habit] = [];
    }
    habits[habit].push(date);
  }

  return habits;
};