"use client";

import AnimatedNumber from "react-animated-numbers";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
}

export default function AnimatedStat({
  value,
  suffix = "",
}: AnimatedStatProps) {
  return (
    <div className="flex items-baseline gap-0.5 text-3xl font-bold text-white">
      <AnimatedNumber
        animateToNumber={value}
        transitions={() => ({
          type: "spring",
          stiffness: 90,
          damping: 14,
        })}
        fontStyle={{
          fontSize: "1.875rem",
          fontWeight: 700,
          color: "white",
          lineHeight: 1,
        }}
      />
      <span>{suffix}</span>
    </div>
  );
}
