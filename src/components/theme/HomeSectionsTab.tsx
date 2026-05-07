'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Tag,
  Grid3x3,
  Percent,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Megaphone,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { HomeSection, HomeSectionId } from '@/lib/theme/theme.types';

const SECTION_META: Record<HomeSectionId, { label: string; description: string; icon: React.ElementType; hasBanner: boolean }> = {
  promotions:       { label: 'Promociones',       description: 'Bloques de beneficios',       icon: Tag,         hasBanner: false },
  categories:       { label: 'Categorías',        description: 'Banners de categorías',       icon: Grid3x3,     hasBanner: false },
  saleProducts:     { label: 'Productos en oferta', description: 'Con descuento',             icon: Percent,     hasBanner: false },
  mainBanner:       { label: 'Banner principal',  description: 'Banner grande / carrusel',    icon: ImageIcon,   hasBanner: true },
  categoryProducts: { label: 'Por categoría',     description: 'Con tabs rotativos',          icon: Layers,      hasBanner: false },
  suggestions:      { label: 'Sugerencias',       description: 'Basado en historial',         icon: Sparkles,    hasBanner: false },
  brandBanner:      { label: 'Banner marca/cat.', description: 'Banner específico',           icon: Megaphone,   hasBanner: true },
  brandProducts:    { label: 'Productos del banner', description: 'Relacionados al banner',   icon: Star,        hasBanner: false },
};

interface Props {
  sections: HomeSection[];
  onChange: (sections: HomeSection[]) => void;
}

export default function HomeSectionsTab({ sections, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<HomeSectionId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    onChange(arrayMove(sections, oldIndex, newIndex));
  };

  const updateSection = (id: HomeSectionId, patch: Partial<HomeSection>) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mt-2 mb-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#3C3C50]">
          Secciones de la home
        </span>
        <div className="flex-1 h-px bg-[#1E1E2A]" />
        <span className="text-[9px] text-[#3C3C50]">{sections.filter((s) => s.visible).length}/{sections.length}</span>
      </div>

      <p className="text-[10px] text-[#5A5A70] leading-relaxed mb-2 px-1">
        Arrastrá las secciones para reordenar. Tocá una para editar título, subtítulo o banner.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {sections.map((section) => (
              <SortableRow
                key={section.id}
                section={section}
                isExpanded={expandedId === section.id}
                onToggleExpand={() => setExpandedId(expandedId === section.id ? null : section.id)}
                onUpdate={(patch) => updateSection(section.id, patch)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// ─── Row (sortable) ───────────────────────────────────────────────────────────

function SortableRow({
  section,
  isExpanded,
  onToggleExpand,
  onUpdate,
}: {
  section: HomeSection;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (patch: Partial<HomeSection>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const meta = SECTION_META[section.id];
  const Icon = meta.icon;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('rounded-xl bg-[#141419] transition-all', isDragging && 'ring-1 ring-emerald-500/40')}>
      {/* Row head */}
      <div className="flex items-center gap-1 pl-1 pr-2 h-11">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="w-6 h-9 flex items-center justify-center text-[#44445A] hover:text-[#8888A8] cursor-grab active:cursor-grabbing touch-none"
          aria-label="Arrastrar"
        >
          <GripVertical size={14} />
        </button>

        {/* Icon */}
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', section.visible ? 'bg-emerald-500/12 text-emerald-400' : 'bg-[#1C1C24] text-[#44445A]')}>
          <Icon size={12} />
        </div>

        {/* Label */}
        <button onClick={onToggleExpand} className="flex-1 min-w-0 text-left px-1">
          <p className={cn('text-[11px] font-semibold truncate leading-none', section.visible ? 'text-[#D0D0E8]' : 'text-[#55556A]')}>
            {meta.label}
          </p>
          <p className="text-[9px] text-[#44445A] truncate mt-0.5">{meta.description}</p>
        </button>

        {/* Expand toggle */}
        <button onClick={onToggleExpand} className="w-6 h-6 flex items-center justify-center text-[#44445A] hover:text-[#8888A8]">
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Visibility toggle */}
        <button
          onClick={() => onUpdate({ visible: !section.visible })}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded-md transition-colors',
            section.visible ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-[#44445A] hover:bg-white/5',
          )}
          title={section.visible ? 'Ocultar' : 'Mostrar'}
        >
          {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
      </div>

      {/* Expanded fields */}
      {isExpanded && (
        <div className="border-t border-[#1E1E2A] px-3 py-2.5 space-y-2">
          <Field label="Título">
            <input
              type="text"
              value={section.title ?? ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full bg-[#1C1C24] border border-[#28283A] rounded-md px-2 h-7 text-[11px] text-[#C8C8DC] outline-none focus:border-[#10B981]/60"
              placeholder="Título de la sección"
            />
          </Field>
          <Field label="Subtítulo">
            <input
              type="text"
              value={section.subtitle ?? ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="w-full bg-[#1C1C24] border border-[#28283A] rounded-md px-2 h-7 text-[11px] text-[#C8C8DC] outline-none focus:border-[#10B981]/60"
              placeholder="Opcional"
            />
          </Field>
          {meta.hasBanner && (
            <>
              <Field label="Imagen del banner (URL)">
                <input
                  type="text"
                  value={section.bannerImageUrl ?? ''}
                  onChange={(e) => onUpdate({ bannerImageUrl: e.target.value })}
                  className="w-full bg-[#1C1C24] border border-[#28283A] rounded-md px-2 h-7 text-[11px] text-[#C8C8DC] outline-none focus:border-[#10B981]/60"
                  placeholder="https://…/banner.jpg"
                />
              </Field>
              <Field label="Enlace al hacer clic">
                <input
                  type="text"
                  value={section.bannerLinkUrl ?? ''}
                  onChange={(e) => onUpdate({ bannerLinkUrl: e.target.value })}
                  className="w-full bg-[#1C1C24] border border-[#28283A] rounded-md px-2 h-7 text-[11px] text-[#C8C8DC] outline-none focus:border-[#10B981]/60"
                  placeholder="/products"
                />
              </Field>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] text-[#686878] uppercase tracking-wider">{label}</p>
      {children}
    </div>
  );
}
