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
  animal: string; // Add animal to shape
  habitId: string;
  entryId: string;
  isMoving: boolean;
  movementTimer: number;
  pauseTimer: number;
  size: number; // Diameter of the rendered animal
  facingLeft: boolean; // Track which direction the animal is facing
  isDead: boolean; // Track if the habit is dead
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
        // Account for border (2px each side), padding (4*0.25rem = 1rem each side), and inner padding
        const borderAndPadding = 4 + 32 + 32; // 2px border + 2rem padding + 2rem inner padding
        setCanvasSize({
          width: Math.max(200, rect.width - borderAndPadding),
          height: Math.max(200, rect.height - borderAndPadding),
        });
      }
    };

    // Use ResizeObserver for better resize detection
    const resizeObserver = new ResizeObserver(handleResize);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial size calculation
    handleResize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Initialize shapes when habits change - create one shape per habit entry
  useEffect(() => {
    const newShapes: AnimatedShape[] = [];

    // Ensure we have valid canvas dimensions for positioning
    const safeCanvasWidth = Math.max(200, canvasSize.width);
    const safeCanvasHeight = Math.max(200, canvasSize.height);

    habits.forEach((habit) => {
      const totalEntries = habit.entries.length;
      const groupsOfTen = Math.floor(totalEntries / 10);

      // 1. Create ONE consolidated shape representing all full groups of 10
      if (groupsOfTen > 0) {
        const size = BASE_SIZE * (1 + 0.1 * groupsOfTen); // 10% larger per group of ten
        const halfSize = size / 2;

        const vx = (Math.random() - 0.5) * 100;
        const vy = (Math.random() - 0.5) * 100;

        // Ensure initial position is within bounds
        const maxX = Math.max(halfSize, safeCanvasWidth - halfSize);
        const maxY = Math.max(halfSize, safeCanvasHeight - halfSize);

        newShapes.push({
          id: `${habit.id}-grouped-tens`,
          habitId: habit.id,
          entryId: `grouped-tens`,
          x: Math.random() * (maxX - halfSize) + halfSize,
          y: Math.random() * (maxY - halfSize) + halfSize,
          vx,
          vy,
          color: habit.color,
          name: habit.name,
          animal: habit.animal,
          isMoving: !habit.isDead, // Dead habits don't move
          movementTimer: Math.random() * 3000 + 2000,
          pauseTimer: 0,
          size,
          facingLeft: vx < 0, // Default facing right
          isDead: habit.isDead,
        });
      }

      // 2. Create individual shapes for any remaining entries (<10)
      const remainingEntries = habit.entries.slice(groupsOfTen * 10);
      remainingEntries.forEach((entry) => {
        const size = BASE_SIZE;
        const halfSize = size / 2;
        const vx = (Math.random() - 0.5) * 100;
        const vy = (Math.random() - 0.5) * 100;

        // Ensure initial position is within bounds
        const maxX = Math.max(halfSize, safeCanvasWidth - halfSize);
        const maxY = Math.max(halfSize, safeCanvasHeight - halfSize);

        newShapes.push({
          id: `${habit.id}-${entry.id}`,
          habitId: habit.id,
          entryId: entry.id,
          x: Math.random() * (maxX - halfSize) + halfSize,
          y: Math.random() * (maxY - halfSize) + halfSize,
          vx,
          vy,
          color: habit.color,
          name: habit.name,
          animal: habit.animal,
          isMoving: !habit.isDead, // Dead habits don't move
          movementTimer: Math.random() * 3000 + 2000,
          pauseTimer: 0,
          size,
          facingLeft: vx < 0, // Default facing right
          isDead: habit.isDead,
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
        // Skip animation for dead habits
        if (shape.isDead) {
          return shape;
        }

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
            newVx = (Math.random() - 0.5) * 100;
            newVy = (Math.random() - 0.5) * 100;
            // Update facing direction based on new velocity
            newFacingLeft = newVx < 0;
          }
        }

        // Move only if in movement mode
        if (newIsMoving) {
          const halfSize = shape.size / 2;

          newX = shape.x + newVx * deltaSeconds;
          newY = shape.y + newVy * deltaSeconds;

          // Ensure we have valid canvas dimensions
          const maxWidth = Math.max(100, canvasSize.width);
          const maxHeight = Math.max(100, canvasSize.height);

          // Bounce off walls with proper boundary checking
          if (newX <= halfSize || newX >= maxWidth - halfSize) {
            newVx = -newVx;
            // Update facing direction when bouncing horizontally
            newFacingLeft = newVx < 0;
            newX = Math.max(halfSize, Math.min(maxWidth - halfSize, newX));
          }
          if (newY <= halfSize || newY >= maxHeight - halfSize) {
            newVy = -newVy;
            newY = Math.max(halfSize, Math.min(maxHeight - halfSize, newY));
          }

          // Additional safety check to ensure animals never go outside bounds
          newX = Math.max(halfSize, Math.min(maxWidth - halfSize, newX));
          newY = Math.max(halfSize, Math.min(maxHeight - halfSize, newY));
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
            animal={shape.animal}
            x={shape.x}
            y={shape.y}
            size={shape.size}
            isMoving={shape.isMoving}
            color={shape.color}
            facingLeft={shape.facingLeft}
            isDead={shape.isDead}
          />
        ))}
      </div>
    </div>
  );
}
