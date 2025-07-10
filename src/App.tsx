import { HabitList } from "./components/habit/HabitList";
import Playground from "./components/playground/Playground";
import { ThemeProvider } from "./components/theme/theme-provider";
import { HabitProvider } from "./contexts/HabitContext";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HabitProvider>
        <div className="container mx-auto flex flex-col items-center h-screen w-screen bg-background p-8 gap-1">
          <div className="flex-shrink-0 w-full">
            <HabitList />
          </div>
          <div className="flex-1 w-full min-h-0 overflow-hidden">
            <Playground />
          </div>
        </div>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;
