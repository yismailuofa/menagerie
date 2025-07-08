import { useHabits } from "@/contexts/HabitContext";
import { useEffect, useRef, useState } from "react";

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
}

export default function Playground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const { habits } = useHabits();
  const [shapes, setShapes] = useState<AnimatedShape[]>([]);
  const shapesRef = useRef<AnimatedShape[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: rect.width - 32, // Account for padding
          height: rect.height - 32,
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
      habit.entries.forEach((entry) => {
        newShapes.push({
          id: `${habit.id}-${entry.id}`,
          habitId: habit.id,
          entryId: entry.id,
          x: Math.random() * (canvasSize.width - 30) + 15,
          y: Math.random() * (canvasSize.height - 30) + 15,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          color: habit.color,
          name: habit.name,
        });
      });
    });

    setShapes(newShapes);
    shapesRef.current = newShapes;
  }, [habits, canvasSize]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const updatedShapes = shapesRef.current.map((shape) => {
        let newX = shape.x + shape.vx;
        let newY = shape.y + shape.vy;
        let newVx = shape.vx;
        let newVy = shape.vy;

        // Bounce off walls
        if (newX <= 15 || newX >= canvas.width - 15) {
          newVx = -newVx;
          newX = Math.max(15, Math.min(canvas.width - 15, newX));
        }
        if (newY <= 15 || newY >= canvas.height - 15) {
          newVy = -newVy;
          newY = Math.max(15, Math.min(canvas.height - 15, newY));
        }

        // Draw the shape
        ctx.fillStyle = shape.color;
        ctx.beginPath();
        ctx.arc(newX, newY, 12, 0, 2 * Math.PI);
        ctx.fill();

        // Draw the name
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(shape.name, newX, newY - 20);

        return {
          ...shape,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      });

      shapesRef.current = updatedShapes;
      animationRef.current = requestAnimationFrame(animate);
    };

    if (shapesRef.current.length > 0) {
      animate();
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
      className="border-2 w-full h-full rounded-md p-4 bg-card"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="w-full h-full bg-background rounded-md"
      />
    </div>
  );
}
