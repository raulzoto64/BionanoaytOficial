import * as React from "react";

interface TextWithTooltipProps {
  text: string;
  className: string;
  lines?: number;
}

export function TextWithTooltip({ text, className, lines = 1 }: TextWithTooltipProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const textRef = React.useRef<HTMLParagraphElement>(null);

  const checkOverflow = React.useCallback(() => {
    const el = textRef.current;
    if (el) {
      const isOverflowing = lines === 1 
        ? el.scrollWidth > el.clientWidth 
        : el.scrollHeight > el.clientHeight;
      setShowTooltip(isOverflowing);
    }
  }, [lines]);

  React.useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [checkOverflow, text]);

  return (
    <div className="w-full">
      <p
        ref={textRef}
        title={showTooltip ? text : undefined}
        className={`${className} ${lines === 1 ? 'truncate' : 'line-clamp-3'} transition-all`}
        style={lines > 1 ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical' } : {}}
      >
        {text}
      </p>
    </div>
  );
}