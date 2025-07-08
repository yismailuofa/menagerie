import { Button } from "@/components/ui/button";
import { useHabits } from "@/contexts/HabitContext";
import { Check, Trash2 } from "lucide-react";

export const HabitList: React.FC = () => {
  const { habits, addHabitEntry, deleteHabit } = useHabits();

  const handleCompleteHabit = (habitId: string) => {
    addHabitEntry(habitId);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(habitId);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Your Habits</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {habits.length === 0 ? (
          <p>No habits yet. Create your first habit!</p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="flex-shrink-0 w-64 flex flex-col gap-3 p-3 border rounded-md bg-card"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border border-input"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="font-medium truncate">{habit.name}</span>
                <Button
                  onClick={() => handleDeleteHabit(habit.id)}
                  variant="ghost"
                  size="sm"
                  className="ml-auto p-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {habit.entries.length} entries • Created{" "}
                {habit.createdAt.toLocaleDateString()}
              </div>
              <Button
                onClick={() => handleCompleteHabit(habit.id)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Check size={16} />
                Add entry
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
