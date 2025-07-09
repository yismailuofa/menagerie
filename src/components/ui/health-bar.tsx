import { cn } from "@/lib/utils";
import React from "react";

interface HealthBarProps {
  health: number;
  maxHealth?: number;
  className?: string;
  showText?: boolean;
  isDead?: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  health,
  maxHealth = 100,
  className = "",
  showText = true,
  isDead = false,
}) => {
  const healthPercentage = Math.max(
    0,
    Math.min(100, (health / maxHealth) * 100)
  );

  const getHealthColor = () => {
    if (isDead) return "bg-gray-500";
    if (healthPercentage > 75) return "bg-green-500";
    if (healthPercentage > 50) return "bg-yellow-500";
    if (healthPercentage > 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getHealthText = () => {
    if (isDead) return "💀 Dead";
    if (healthPercentage >= 100) return "💚 Perfect";
    if (healthPercentage > 75) return "💛 Healthy";
    if (healthPercentage > 50) return "🧡 OK";
    if (healthPercentage > 25) return "❤️ Weak";
    return "💔 Critical";
  };

  return (
    <div className={cn("space-y-1", className)}>
      {showText && (
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium">{getHealthText()}</span>
          <span className="text-muted-foreground">
            {Math.round(health)}/{maxHealth}
          </span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            getHealthColor()
          )}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthBar;
