import CreateButton from "./components/habit/CreateButton";
import { HabitList } from "./components/habit/HabitList";
import Playground from "./components/playground/Playground";
import { ThemeProvider } from "./components/theme/theme-provider";
import { HabitProvider } from "./contexts/HabitContext";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HabitProvider>
        <div className="container mx-auto flex flex-col items-center h-full w-screen bg-background p-4 gap-4">
          <CreateButton />
          <HabitList />
          <div className="h-[70vh] w-full">
            <Playground />
          </div>
        </div>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;
