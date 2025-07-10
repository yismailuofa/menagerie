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

// Get animal assets (GIF and PNG) for a given animal name
export function getAnimalAssets(animalName: string): {
  gifSrc: string;
  pngSrc: string;
} {
  const dirName = getAnimalAssetDir(animalName);
  const baseDir = "Basic Animal Animations";
  const basePath = `/assets/${encodeURIComponent(baseDir)}/${encodeURIComponent(
    dirName
  )}/${animalName}`;

  return {
    gifSrc: `${basePath}.gif`,
    pngSrc: `${basePath}.png`,
  };
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

// Get a consistent animal for a given habit name (fallback for backward compatibility)
export function getAnimalForHabit(habitName: string): string {
  const hash = hashString(habitName);
  const index = hash % AVAILABLE_ANIMALS.length;
  return AVAILABLE_ANIMALS[index];
}
