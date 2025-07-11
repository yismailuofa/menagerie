import { AnimalSelector } from "@/components/habit/AnimalSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useHabits, type Habit } from "@/contexts/HabitContext";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(50, "Habit name must be less than 50 characters"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Please select a valid color"),
  animal: z.string().min(1, "Please select an animal"),
});

type FormData = z.infer<typeof formSchema>;

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  isOpen,
  onClose,
  habit,
}) => {
  const { updateHabit } = useHabits();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#88aaee",
      animal: "CluckingChicken",
    },
  });

  // Update form when habit changes
  useEffect(() => {
    if (habit) {
      form.reset({
        name: habit.name,
        color: habit.color,
        animal: habit.animal,
      });
    }
  }, [habit, form]);

  const onSubmit = (data: FormData) => {
    if (!habit) return;

    updateHabit(habit.id, {
      name: data.name,
      color: data.color,
      animal: data.animal,
    });

    onClose();
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter habit name..."
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Give your habit a clear and motivating name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={field.value}
                        onChange={field.onChange}
                        className="cursor-pointer w-8 h-8"
                        id="color"
                      />
                      <label htmlFor="color">
                        <span className="text-sm font-mono text-muted-foreground">
                          {field.value}
                        </span>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="animal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Animal</FormLabel>
                  <FormControl>
                    <AnimalSelector
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose an animal to represent your habit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
