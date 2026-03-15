import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimelineArrowProps {
  onClick?: () => void;
}

export function NextArrow({ onClick }: TimelineArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute -right-15 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#19FF00] rounded-full flex items-center justify-center hover:bg-[#19FF00]/80 transition-colors shadow-lg"
    >
      <ChevronRight className="w-6 h-6 text-[#1C5D15]" />
    </button>
  );
}

export function PrevArrow({ onClick }: TimelineArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute -left-15 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#19FF00] rounded-full flex items-center justify-center hover:bg-[#19FF00]/80 transition-colors shadow-lg"
    >
      <ChevronLeft className="w-6 h-6 text-[#1C5D15]" />
    </button>
  );
}