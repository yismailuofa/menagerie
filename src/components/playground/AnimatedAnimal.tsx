import { getAnimalAssetDir, getAnimalForHabit } from "@/lib/animalUtils";
import { useMemo } from "react";

interface AnimatedAnimalProps {
  habitName: string;
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
  x,
  y,
  size,
  isMoving,
  color,
  facingLeft,
  isDead = false,
}: AnimatedAnimalProps) {
  // Determine which animal to use for this habit deterministically
  const { gifSrc, pngSrc } = useMemo(() => {
    const animalName = getAnimalForHabit(habitName);
    const dirName = getAnimalAssetDir(animalName);

    // Build the asset path. All assets live under public/assets.
    const baseDir = "Basic Animal Animations";
    const basePath = `/assets/${encodeURIComponent(
      baseDir
    )}/${encodeURIComponent(dirName)}/${animalName}`;

    return {
      gifSrc: `${basePath}.gif`,
      pngSrc: `${basePath}.png`,
    };
  }, [habitName]);

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

  // Use rip.png for dead habits, otherwise use the animal animation
  const imageSrc = isDead ? "/rip.png" : isMoving ? gifSrc : pngSrc;
  const displayText = isDead ? `💀 ${habitName}` : habitName;

  return (
    <div style={containerStyle}>
      <img
        src={imageSrc}
        alt={isDead ? "Dead habit" : habitName}
        style={imgStyle}
        draggable={false}
      />
      <span style={captionStyle}>{displayText}</span>
    </div>
  );
}
