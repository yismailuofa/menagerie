// Available animals from the assets folder
export const AVAILABLE_ANIMALS = [
  "CluckingChicken",
  "CoralCrab",
  "CroakingToad",
  "DaintyPig",
  "HonkingGoose",
  "LeapingFrog",
  "MadBoar",
  "MeowingCat",
  "PasturingSheep",
  "SlowTurtle",
  "SnowFox",
  "SpikeyPorcupine",
  "StinkySkunk",
  "TimberWolf",
  "TinyChick",
];

// Convert CamelCase animal name to a directory name with spaces, e.g. "TimberWolf" -> "Timber Wolf"
export function getAnimalAssetDir(animalName: string): string {
  // Insert a space before every capital letter that follows a lowercase letter
  return animalName.replace(/([a-z])([A-Z])/g, "$1 $2");
}

// Simple hash function to consistently map habit names to animals
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Get a consistent animal for a given habit name
export function getAnimalForHabit(habitName: string): string {
  const hash = hashString(habitName);
  const index = hash % AVAILABLE_ANIMALS.length;
  return AVAILABLE_ANIMALS[index];
}

// Convert hex color to RGB values for tinting
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Apply color tinting to an image using canvas
export function tintImage(
  img: HTMLImageElement,
  tintColor: string,
  intensity: number = 0.3
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the original image
  ctx.drawImage(img, 0, 0);

  // Get the RGB values of the tint color
  const rgb = hexToRgb(tintColor);
  if (!rgb) return canvas;

  // Apply color tint
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${intensity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Restore normal blending and add some of the original image back
  ctx.globalCompositeOperation = "source-atop";
  ctx.drawImage(img, 0, 0);

  return canvas;
}
