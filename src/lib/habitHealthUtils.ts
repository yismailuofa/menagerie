import type { Habit } from "@/contexts/HabitContext";

export interface HealthCheckResult {
  health: number;
  isDead: boolean;
  hasChanged: boolean;
}

/**
 * Checks and updates a habit's health based on its cadence and last completion time
 */
export function checkHabitHealth(habit: Habit): HealthCheckResult {
  const now = new Date();
  const timeSinceLastCompletion =
    now.getTime() - habit.lastCompletedAt.getTime();
  const cadenceMs = habit.cadence * 1000; // Convert seconds to milliseconds

  // If habit is already dead, no change needed
  if (habit.isDead) {
    return {
      health: habit.health,
      isDead: true,
      hasChanged: false,
    };
  }

  // If within cadence period, maintain current health
  if (timeSinceLastCompletion < cadenceMs) {
    return {
      health: habit.health,
      isDead: false,
      hasChanged: false,
    };
  }

  // If past one cadence period but less than two, reduce to half health
  if (timeSinceLastCompletion < cadenceMs * 2) {
    const newHealth = Math.max(0, habit.health * 0.5);
    return {
      health: newHealth,
      isDead: false,
      hasChanged: habit.health !== newHealth,
    };
  }

  // If past two cadence periods, habit dies
  return {
    health: 0,
    isDead: true,
    hasChanged: !habit.isDead || habit.health !== 0,
  };
}

/**
 * Checks all habits and returns updated versions if their health changed
 */
export function checkAllHabitsHealth(habits: Habit[]): Habit[] {
  return habits.map((habit) => {
    const healthCheck = checkHabitHealth(habit);

    if (healthCheck.hasChanged) {
      return {
        ...habit,
        health: healthCheck.health,
        isDead: healthCheck.isDead,
      };
    }

    return habit;
  });
}

/**
 * Revives a dead habit with full health but clears its streak
 */
export function reviveHabit(habit: Habit): Habit {
  if (!habit.isDead) {
    return habit;
  }

  return {
    ...habit,
    health: 100,
    isDead: false,
    // Clear the streak by keeping only the most recent entry
    entries: habit.entries.slice(-1),
  };
}

/**
 * Formats cadence in seconds to human-readable string
 */
export function formatCadence(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}w`;
}

/**
 * Gets the next expected completion time for a habit
 */
export function getNextExpectedCompletion(habit: Habit): Date {
  return new Date(habit.lastCompletedAt.getTime() + habit.cadence * 1000);
}

/**
 * Checks if a habit is overdue (past its cadence)
 */
export function isHabitOverdue(habit: Habit): boolean {
  const now = new Date();
  const nextCompletion = getNextExpectedCompletion(habit);
  return now > nextCompletion && !habit.isDead;
}
