import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AVAILABLE_ANIMALS,
  getAnimalAssetDir,
  getAnimalAssets,
} from "@/lib/animalUtils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AnimalSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function AnimalSelector({ value, onValueChange }: AnimalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedAssets = getAnimalAssets(value);
  const selectedDisplayName = getAnimalAssetDir(value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between h-auto p-2"
        >
          <div className="flex items-center gap-2">
            <img
              src={selectedAssets.pngSrc}
              alt={selectedDisplayName}
              className="w-8 h-8 object-contain"
            />
            <span className="text-sm font-medium">{selectedDisplayName}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-90 p-0">
        <div className="p-2">
          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
            {AVAILABLE_ANIMALS.map((animal) => {
              const assets = getAnimalAssets(animal);
              const displayName = getAnimalAssetDir(animal);
              const isSelected = value === animal;

              return (
                <Button
                  key={animal}
                  variant={isSelected ? "default" : "ghost"}
                  className="h-auto flex flex-col items-center gap-1 aspect-square p-0"
                  onClick={() => {
                    onValueChange(animal);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={assets.pngSrc}
                    alt={displayName}
                    className="w-9 h-9 object-contain"
                  />
                  <span className="text-xs font-medium text-center leading-tight">
                    {displayName}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
