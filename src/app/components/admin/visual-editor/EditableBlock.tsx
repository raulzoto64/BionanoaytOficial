import React from 'react';

interface EditableBlockProps {
  sectionId: string;
  activeSectionId: string | null;
  onClick: (id: string) => void;
  children: React.ReactNode;
  label?: string;
}

export function EditableBlock({ sectionId, activeSectionId, onClick, children, label = "Sección" }: EditableBlockProps) {
  const isActive = activeSectionId === sectionId;

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 border-2 ${isActive
          ? 'border-[#19FF00] z-10 shadow-[0_0_0_4px_rgba(25,255,0,0.1)]'
          : 'border-transparent hover:border-[#1C5D15]/50'
        }`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(sectionId);
      }}
    >
      {/* Etiqueta flotante */}
      <div
        className={`absolute -top-6 left-0 bg-[#1C5D15] text-[#19FF00] text-xs font-bold px-2 py-1 rounded-t-md transition-opacity duration-200 ${isActive || 'opacity-0 group-hover:opacity-100'
          }`}
        style={{ zIndex: 20 }}
      >
        {label}
      </div>

      {/* Capa de protección para evitar interacciones dentro del bloque si no es necesario,
          o simplemente la clase de pointer-events */}
      <div className={`relative ${isActive ? '' : 'pointer-events-none'}`}>
        {children}
      </div>

      {/* Capa invisible para atrapar todos los clicks si childs tuvieran stopPropagation. Solo cuando NO ES ACTIVA. */}
      {!isActive && <div className="absolute inset-0 z-10" />}
    </div>
  );
}
