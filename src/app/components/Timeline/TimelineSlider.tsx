import Slider from "react-slick";
import { TimelineCard } from "./TimelineCard";
import { NextArrow, PrevArrow } from "./TimelineArrows";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: 'Lightbulb' | 'FileCheck' | 'TrendingUp';
}

interface TimelineSliderProps {
  milestones: Milestone[];
}

export function TimelineSlider({ milestones }: TimelineSliderProps) {
  const settings = {
    dots: true,
    infinite: milestones.length > 1,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    swipe: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: milestones.length > 2,
        }
      },
      {
        // Mobile breakpoint increased to 768px for better compatibility
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false, // Explicitly disable arrows instead of undefined
          dots: true,
          infinite: milestones.length > 1,
        }
      }
    ],
    dotsClass: "slick-dots !bottom-[-40px]",
    customPaging: () => (
      <div className="w-3 h-3 bg-[#19FF00]/30 rounded-full hover:bg-[#19FF00] transition-colors" />
    ),
  };

  return (
    <div className="w-full min-w-0">
      <Slider {...settings}>
        {milestones
          .filter(m => m.title.trim() && m.description.trim())
          .map((milestone, index) => (
            <div key={index} className="outline-none px-2">
              <TimelineCard milestone={milestone} />
            </div>
          ))}
      </Slider>
    </div>
  );
}
