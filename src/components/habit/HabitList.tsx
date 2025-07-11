import { Button } from "@/components/ui/button";
import { HealthBar } from "@/components/ui/health-bar";
import type { Habit } from "@/contexts/HabitContext";
import { useHabits } from "@/contexts/HabitContext";
import {
  formatCadence,
  getNextExpectedCompletion,
  isHabitOverdue,
} from "@/lib/habitHealthUtils";
import { Check, Clock, Edit, Heart, Trash2 } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../theme/ThemeToggle";
import CreateButton from "./CreateButton";
import { EditHabitModal } from "./EditHabitModal";

export const HabitList: React.FC = () => {
  const { habits, addHabitEntry, deleteHabit } = useHabits();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleCompleteHabit = (habitId: string) => {
    addHabitEntry(habitId);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(habitId);
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleCloseEditModal = () => {
    setEditingHabit(null);
  };

  const getButtonText = (habit: any) => {
    if (habit.isDead) {
      return "Revive";
    }
    return "Log habit";
  };

  const getButtonIcon = (habit: any) => {
    if (habit.isDead) {
      return <Heart size={16} className="fill-white" />;
    }
    return <Check size={16} />;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center  mb-4">
        <h3 className="text-lg font-semibold">Your Habits</h3>
        <div className="flex gap-2">
          <ThemeToggle />
          <CreateButton />
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {habits.length === 0 ? (
          <p>No habits yet. Create your first habit!</p>
        ) : (
          habits.map((habit) => {
            const nextCompletion = getNextExpectedCompletion(habit);
            const overdue = isHabitOverdue(habit);

            return (
              <div
                key={habit.id}
                className={`flex-shrink-0 w-64 flex flex-col gap-3 p-3 border rounded-md bg-card`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border border-input"
                    style={{
                      backgroundColor: habit.isDead ? "#666" : habit.color,
                    }}
                  />
                  <span
                    className={`font-medium truncate ${
                      habit.isDead ? "text-muted-foreground" : ""
                    }`}
                  >
                    {habit.isDead ? `💀 ${habit.name}` : habit.name}
                  </span>
                  <div className="ml-auto flex gap-1">
                    <Button
                      onClick={() => handleEditHabit(habit)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-muted-foreground hover:text-primary"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteHabit(habit.id)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                <HealthBar
                  health={habit.health}
                  isDead={habit.isDead}
                  className="mb-2"
                />

                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Every {formatCadence(habit.cadence)}</span>
                  </div>
                  <div>
                    {habit.entries.length} entries • Created{" "}
                    {habit.createdAt.toLocaleDateString()}
                  </div>
                  {!habit.isDead && (
                    <div
                      className={`text-xs ${
                        overdue ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {overdue
                        ? "Overdue!"
                        : `Next: ${nextCompletion.toLocaleString()}`}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleCompleteHabit(habit.id)}
                  variant={habit.isDead ? "destructive" : "outline"}
                  size="sm"
                  className="group w-full mt-auto"
                >
                  {getButtonIcon(habit)}
                  {getButtonText(habit)}
                </Button>
              </div>
            );
          })
        )}
      </div>

      <EditHabitModal
        isOpen={!!editingHabit}
        onClose={handleCloseEditModal}
        habit={editingHabit}
      />
    </div>
  );
};
