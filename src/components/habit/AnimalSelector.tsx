import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AVAILABLE_ANIMALS,
  getAnimalAssetDir,
  getAnimalAssets,
} from "@/lib/animalUtils";

interface AnimalSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function AnimalSelector({ value, onValueChange }: AnimalSelectorProps) {
  const selectedAssets = getAnimalAssets(value);
  const selectedDisplayName = getAnimalAssetDir(value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full !h-13 p-4">
        <SelectValue asChild>
          <div className="flex items-center">
            <img
              src={selectedAssets.pngSrc}
              alt={selectedDisplayName}
              className="w-8 h-8 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <span className="text-sm font-medium">{selectedDisplayName}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {AVAILABLE_ANIMALS.map((animal) => {
          const assets = getAnimalAssets(animal);
          const displayName = getAnimalAssetDir(animal);

          return (
            <SelectItem key={animal} value={animal}>
              <div className="flex items-center gap-2">
                <img
                  src={assets.pngSrc}
                  alt={displayName}
                  className="w-8 h-8 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm font-medium">{displayName}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
