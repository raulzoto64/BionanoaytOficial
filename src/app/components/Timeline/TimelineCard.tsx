
import { Lightbulb, FileCheck, TrendingUp } from "lucide-react";
import { TextWithTooltip } from "./index";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: 'Lightbulb' | 'FileCheck' | 'TrendingUp';
}

interface TimelineCardProps {
  milestone: Milestone;
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'Lightbulb': return Lightbulb;
    case 'FileCheck': return FileCheck;
    case 'TrendingUp': return TrendingUp;
    default: return Lightbulb;
  }
}

export function TimelineCard({ milestone }: TimelineCardProps) {
  const IconComponent = getIconComponent(milestone.icon);

  return (
    <div className="px-3">
      <div className="bg-[#629960]/30 rounded-2xl p-8 hover:bg-[#629960]/40 transition-all duration-300 h-80 flex flex-col items-center justify-center border border-white/10 shadow-xl">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-[#19FF00] rounded-full shrink-0 shadow-inner">
          <IconComponent className="w-8 h-8 text-[#1C5D15]" />
        </div>
        
        <div className="text-[#19FF00] font-bold text-2xl mb-2">
          {milestone.year}
        </div>

        <TextWithTooltip 
          text={milestone.title} 
          lines={1} 
          className="text-xl font-semibold mb-3 text-center cursor-default" 
        />

        <TextWithTooltip 
          text={milestone.description} 
          lines={3} 
          className="text-white/80 text-center text-sm leading-relaxed" 
        />
      </div>
    </div>
  );
}
