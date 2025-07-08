import { getAnimalAssetDir, getAnimalForHabit } from "@/lib/animalUtils";
import { useMemo } from "react";

interface AnimatedAnimalProps {
  habitName: string;
  x: number;
  y: number;
  size: number;
  isMoving: boolean;
}

export default function AnimatedAnimal({
  habitName,
  x,
  y,
  size,
  isMoving,
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
    filter: isMoving ? "none" : "grayscale(50%)",
    objectFit: "cover",
  };

  const captionStyle: React.CSSProperties = {
    fontSize: 12,
    lineHeight: "12px",
    marginTop: 2,
    color: "white",
    textShadow:
      "0 0 8px rgba(0,0,0,0.6), 0 0 4px rgba(0,0,0,1), 0 0 2px rgba(0,0,0,1)",
    whiteSpace: "nowrap",
  };

  return (
    <div style={containerStyle}>
      <img
        src={isMoving ? gifSrc : pngSrc}
        alt={habitName}
        style={imgStyle}
        draggable={false}
      />
      <span style={captionStyle}>{habitName}</span>
    </div>
  );
}
