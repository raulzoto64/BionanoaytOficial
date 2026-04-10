import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TimelineSlider } from "./TimelineSlider";
import { TimelineHeader } from "./TimelineHeader";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: 'Lightbulb' | 'FileCheck' | 'TrendingUp';
}

interface TimelineProps {
  milestones: Milestone[];
  title?: string;
  subtitle?: string;
  description?: string;
}

export function Timeline({ milestones, title, subtitle, description }: TimelineProps) {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-[#1C5D15] text-white pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <TimelineHeader title={title} subtitle={subtitle} description={description} />
        <div className="relative px-10 md:px-16">
          <TimelineSlider milestones={milestones} />
        </div>
      </div>
    </section>
  );
}