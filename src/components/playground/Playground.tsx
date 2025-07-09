import { useHabits } from "@/contexts/HabitContext";
import { useEffect, useRef, useState } from "react";
import AnimatedAnimal from "./AnimatedAnimal";

interface AnimatedShape {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  name: string;
  habitId: string;
  entryId: string;
  isMoving: boolean;
  movementTimer: number;
  pauseTimer: number;
  size: number; // Diameter of the rendered animal
  facingLeft: boolean; // Track which direction the animal is facing
}

export default function Playground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const { habits } = useHabits();
  const [shapes, setShapes] = useState<AnimatedShape[]>([]);
  const shapesRef = useRef<AnimatedShape[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Base size for a single (unmerged) entry
  const BASE_SIZE = 40;

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: rect.width - 60, // Account for padding
          height: rect.height - 60,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize shapes when habits change - create one shape per habit entry
  useEffect(() => {
    const newShapes: AnimatedShape[] = [];

    habits.forEach((habit) => {
      const totalEntries = habit.entries.length;

      const groupsOfTen = Math.floor(totalEntries / 10);

      // 1. Create ONE consolidated shape representing all full groups of 10
      if (groupsOfTen > 0) {
        const size = BASE_SIZE * (1 + 0.1 * groupsOfTen); // 10% larger per group of ten
        newShapes.push({
          id: `${habit.id}-grouped-tens`,
          habitId: habit.id,
          entryId: `grouped-tens`,
          x: Math.random() * (canvasSize.width - size) + size / 2,
          y: Math.random() * (canvasSize.height - size) + size / 2,
          vx: (Math.random() - 0.5) * 60,
          vy: (Math.random() - 0.5) * 60,
          color: habit.color,
          name: habit.name,
          isMoving: true,
          movementTimer: Math.random() * 3000 + 2000,
          pauseTimer: 0,
          size,
          facingLeft: false, // Default facing right
        });
      }

      // 2. Create individual shapes for any remaining entries (<10)
      const remainingEntries = habit.entries.slice(groupsOfTen * 10);
      remainingEntries.forEach((entry) => {
        const size = BASE_SIZE;
        newShapes.push({
          id: `${habit.id}-${entry.id}`,
          habitId: habit.id,
          entryId: entry.id,
          x: Math.random() * (canvasSize.width - size) + size / 2,
          y: Math.random() * (canvasSize.height - size) + size / 2,
          vx: (Math.random() - 0.5) * 60,
          vy: (Math.random() - 0.5) * 60,
          color: habit.color,
          name: habit.name,
          isMoving: true,
          movementTimer: Math.random() * 3000 + 2000,
          pauseTimer: 0,
          size,
          facingLeft: false, // Default facing right
        });
      });
    });

    setShapes(newShapes);
    shapesRef.current = newShapes;
  }, [habits, canvasSize]);

  // Animation loop
  useEffect(() => {
    if (!containerRef.current) return;

    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const updatedShapes = shapesRef.current.map((shape) => {
        const deltaSeconds = deltaTime / 1000; // convert to seconds

        let newX = shape.x;
        let newY = shape.y;
        let newVx = shape.vx;
        let newVy = shape.vy;
        let newIsMoving = shape.isMoving;
        let newMovementTimer = shape.movementTimer;
        let newPauseTimer = shape.pauseTimer;
        let newFacingLeft = shape.facingLeft;

        // Update timers
        if (shape.isMoving) {
          newMovementTimer -= deltaTime;
          if (newMovementTimer <= 0) {
            // Switch to pause mode
            newIsMoving = false;
            newPauseTimer = Math.random() * 2000 + 1000; // 1-3 seconds pause
          }
        } else {
          newPauseTimer -= deltaTime;
          if (newPauseTimer <= 0) {
            // Switch back to movement mode
            newIsMoving = true;
            newMovementTimer = Math.random() * 3000 + 2000; // 2-5 seconds movement
            // Optionally change direction
            newVx = (Math.random() - 0.5) * 60;
            newVy = (Math.random() - 0.5) * 60;
            // Update facing direction based on new velocity
            newFacingLeft = newVx < 0;
          }
        }

        // Move only if in movement mode
        if (newIsMoving) {
          const halfSize = shape.size / 2;

          newX = shape.x + newVx * deltaSeconds;
          newY = shape.y + newVy * deltaSeconds;

          // Bounce off walls
          if (newX <= halfSize || newX >= canvasSize.width - halfSize) {
            newVx = -newVx;
            // Update facing direction when bouncing horizontally
            newFacingLeft = newVx < 0;
            newX = Math.max(
              halfSize,
              Math.min(canvasSize.width - halfSize, newX)
            );
          }
          if (newY <= halfSize || newY >= canvasSize.height - halfSize) {
            newVy = -newVy;
            newY = Math.max(
              halfSize,
              Math.min(canvasSize.height - halfSize, newY)
            );
          }
        }

        return {
          ...shape,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          isMoving: newIsMoving,
          movementTimer: newMovementTimer,
          pauseTimer: newPauseTimer,
          facingLeft: newFacingLeft,
        };
      });

      shapesRef.current = updatedShapes;
      setShapes([...updatedShapes]); // Trigger re-render for React components
      animationRef.current = requestAnimationFrame(animate);
    };

    if (shapesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shapes.length, canvasSize]);

  return (
    <div
      ref={containerRef}
      className="border-2 w-full h-full rounded-md p-4 bg-card relative overflow-hidden"
    >
      <div
        className="w-full h-full bg-background rounded-md relative"
        style={{
          backgroundImage: "url('/grass.png')",
          backgroundRepeat: "repeat",
        }}
      >
        {shapes.map((shape) => (
          <AnimatedAnimal
            key={shape.id}
            habitName={shape.name}
            x={shape.x}
            y={shape.y}
            size={shape.size}
            isMoving={shape.isMoving}
            color={shape.color}
            facingLeft={shape.facingLeft}
          />
        ))}
      </div>
    </div>
  );
}
