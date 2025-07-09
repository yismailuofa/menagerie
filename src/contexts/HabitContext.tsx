import { checkAllHabitsHealth } from "@/lib/habitHealthUtils";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface HabitEntry {
  id: string;
  date: Date;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  entries: HabitEntry[];
  cadence: number; // in seconds
  health: number; // 0-100
  isDead: boolean;
  lastCompletedAt: Date;
}

interface HabitContextType {
  habits: Habit[];
  createHabit: (name: string, color: string, cadence: number) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  addHabitEntry: (habitId: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};

interface HabitProviderProps {
  children: ReactNode;
}

const HABITS_STORAGE_KEY = "menagerie_habits";

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load habits from localStorage on component mount
  useEffect(() => {
    try {
      const savedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        // Convert date strings back to Date objects
        const habitsWithDates = parsedHabits.map((habit: any) => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
          lastCompletedAt: new Date(habit.lastCompletedAt || habit.createdAt),
          // Set defaults for new fields if they don't exist (backward compatibility)
          cadence: habit.cadence || 86400, // default to daily
          health: habit.health ?? 100, // default to full health
          isDead: habit.isDead ?? false,
          entries: habit.entries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
          })),
        }));
        setHabits(habitsWithDates);
      }
    } catch (error) {
      console.error("Error loading habits from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save habits to localStorage whenever habits state changes (but not on initial load)
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits to localStorage:", error);
    }
  }, [habits, isLoaded]);

  // Periodic health check - runs every 30 seconds
  useEffect(() => {
    if (!isLoaded) return;

    const healthCheckInterval = setInterval(() => {
      setHabits((currentHabits) => {
        const updatedHabits = checkAllHabitsHealth(currentHabits);
        return updatedHabits;
      });
    }, 10000); // Check every 10 seconds

    // Initial health check
    setHabits((currentHabits) => checkAllHabitsHealth(currentHabits));

    return () => clearInterval(healthCheckInterval);
  }, [isLoaded]);

  const createHabit = (name: string, color: string, cadence: number) => {
    const now = new Date();
    const initialEntry: HabitEntry = {
      id: crypto.randomUUID(),
      date: now,
    };

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: now,
      entries: [initialEntry], // Initialize with a new entry
      cadence,
      health: 100,
      isDead: false,
      lastCompletedAt: now,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const addHabitEntry = (habitId: string) => {
    const newEntry: HabitEntry = {
      id: crypto.randomUUID(),
      date: new Date(),
    };

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          return {
            ...habit,
            entries: habit.isDead ? [newEntry] : [...habit.entries, newEntry],
            lastCompletedAt: new Date(),
            health: 100,
            isDead: false,
          };
        }
        return habit;
      })
    );
  };

  return (
    <HabitContext.Provider
      value={{ habits, createHabit, updateHabit, deleteHabit, addHabitEntry }}
    >
      {children}
    </HabitContext.Provider>
  );
};
