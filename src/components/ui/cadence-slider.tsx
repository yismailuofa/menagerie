import { Slider } from "@/components/ui/slider";
import React from "react";

interface CadenceSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
}

// Predefined cadence options in seconds
const CADENCE_OPTIONS = [
  { seconds: 15, label: "15 seconds" },
  { seconds: 900, label: "15 minutes" }, // 15 * 60
  { seconds: 3600, label: "1 hour" }, // 60 * 60
  { seconds: 43200, label: "12 hours" }, // 12 * 60 * 60
  { seconds: 86400, label: "Daily" }, // 24 * 60 * 60
  { seconds: 172800, label: "2 days" }, // 2 * 24 * 60 * 60
  { seconds: 604800, label: "Weekly" }, // 7 * 24 * 60 * 60
  { seconds: 1209600, label: "Bi-weekly" }, // 14 * 24 * 60 * 60
  { seconds: 2592000, label: "Monthly" }, // 30 * 24 * 60 * 60
];

export const CadenceSlider: React.FC<CadenceSliderProps> = ({
  value,
  onValueChange,
  className = "",
}) => {
  // Find the closest index to the current value
  const getCurrentIndex = (currentValue: number): number => {
    const index = CADENCE_OPTIONS.findIndex(
      (option) => option.seconds === currentValue
    );
    return index >= 0 ? index : 5; // Default to daily if not found
  };

  const handleSliderChange = (newValue: number[]) => {
    const index = Math.round(newValue[0]);
    const clampedIndex = Math.max(
      0,
      Math.min(index, CADENCE_OPTIONS.length - 1)
    );
    onValueChange(CADENCE_OPTIONS[clampedIndex].seconds);
  };

  const currentIndex = getCurrentIndex(value);
  const currentLabel = CADENCE_OPTIONS[currentIndex]?.label || "Daily";

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground font-mono">
          {currentLabel}
        </span>
      </div>
      <Slider
        value={[currentIndex]}
        onValueChange={handleSliderChange}
        min={0}
        max={CADENCE_OPTIONS.length - 1}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>15s</span>
        <span>Daily</span>
        <span>Monthly</span>
      </div>
    </div>
  );
};

export default CadenceSlider;
