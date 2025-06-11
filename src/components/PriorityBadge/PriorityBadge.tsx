import React from "react";
import { Badge } from "./PriorityBadge.styles";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
  size?: "sm" | "md" | "lg";
}

const priorityLabels = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = "md",
}) => {
  // Handle undefined or invalid priority values
  const safePriority = priority || "medium";
  const label = priorityLabels[safePriority as keyof typeof priorityLabels];

  if (!label) {
    console.error(`Invalid priority: ${priority}, falling back to medium`);
    return (
      <Badge $priority="medium" $size={size}>
        {priorityLabels.medium}
      </Badge>
    );
  }

  return (
    <Badge
      $priority={safePriority}
      $size={size}
      aria-label={`Prioridade ${label}`}
    >
      {label}
    </Badge>
  );
};

export default PriorityBadge;
