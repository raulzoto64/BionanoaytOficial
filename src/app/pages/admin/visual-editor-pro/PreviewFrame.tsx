import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const PreviewFrame = ({ children, onLoad }: { children: React.ReactNode; onLoad?: () => void }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    if (!frameRef.current) return;
    const doc = frameRef.current.contentWindow?.document;
    if (!doc) return;

    if (!stylesLoaded) {
      const heads = document.getElementsByTagName('head')[0].innerHTML;
      doc.head.innerHTML = heads;

      const style = doc.createElement('style');
      style.innerHTML = `
        body { background-color: white; overflow-x: hidden; width: 100%; margin: 0; padding: 0; }
        .iframe-root { min-height: 100vh; }
        * { cursor: pointer !important; }
      `;
      doc.head.appendChild(style);
      setStylesLoaded(true);
    }

    doc.body.className = "bg-white overflow-x-hidden selection:bg-[#19FF00]/30";
    setMountNode(doc.body);
  }, [stylesLoaded]);

  return (
    <>
      <iframe
        ref={frameRef}
        title="Visual Preview"
        className="w-full h-full border-none transition-opacity duration-300"
        onLoad={() => {
          setStylesLoaded(false);
          onLoad?.();
        }}
      />
      {mountNode && createPortal(children, mountNode)}
    </>
  );
};
