import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { CreateHabitModal } from "./CreateHabitModal";

export default function CreateButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsModalOpen(true)}>
        <CirclePlusIcon />
        Add Habit
      </Button>

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
