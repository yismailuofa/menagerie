import { getAnimalAssets, getAnimalForHabit } from "@/lib/animalUtils";
import { useMemo } from "react";

interface AnimatedAnimalProps {
  habitName: string;
  animal?: string; // Add optional animal prop
  x: number;
  y: number;
  size: number;
  isMoving: boolean;
  color: string;
  facingLeft: boolean;
  isDead?: boolean;
}

export default function AnimatedAnimal({
  habitName,
  animal,
  x,
  y,
  size,
  isMoving,
  color,
  facingLeft,
  isDead = false,
}: AnimatedAnimalProps) {
  // Determine which animal to use for this habit
  const { gifSrc, pngSrc } = useMemo(() => {
    const animalName = animal || getAnimalForHabit(habitName); // Use custom animal or fallback to hash-based
    return getAnimalAssets(animalName);
  }, [habitName, animal]);

  // Container style handles positioning. Image + caption are children.
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: x - size / 2,
    top: y - size / 2,
    width: size,
    pointerEvents: "none", // Click-through
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    userSelect: "none",
  };

  const imgStyle: React.CSSProperties = {
    width: size,
    height: size,
    transition: isMoving ? undefined : "filter 200ms",
    filter: isDead ? "none" : isMoving ? "none" : "grayscale(50%)",
    objectFit: "contain",
    transform: facingLeft ? "scaleX(-1)" : "scaleX(1)",
    imageRendering: "pixelated", // Prevent blurriness when scaling
  };

  const captionStyle: React.CSSProperties = {
    fontSize: 12,
    lineHeight: "12px",
    marginTop: 2,
    color: "white",
    backgroundColor: isDead ? "#666" : color,
    padding: "2px 4px",
    borderRadius: "4px",
    textShadow:
      "0 0 8px rgba(0,0,0,0.6), 0 0 4px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,1)",
    whiteSpace: "nowrap",
  };

  const sleepIndicatorStyle: React.CSSProperties = {
    position: "absolute",
    top: "-20%",
    right: "-10%",
    fontSize: 16,
    textShadow: "0 0 4px rgba(0,0,0,0.5)",
    animation: "sleep-float 2s ease-in-out infinite",
  };

  // Use rip.png for dead habits, otherwise use the animal animation
  const imageSrc = isDead ? "/rip.png" : isMoving ? gifSrc : pngSrc;
  const displayText = isDead ? `💀 ${habitName}` : habitName;

  return (
    <div style={containerStyle}>
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={imageSrc}
          alt={isDead ? "Dead habit" : habitName}
          style={imgStyle}
          draggable={false}
        />
        {/* Sleep indicator - show when not moving and not dead */}
        {!isMoving && !isDead && <div style={sleepIndicatorStyle}>💤</div>}
      </div>
      <span style={captionStyle}>{displayText}</span>
    </div>
  );
}
