'use client';
import { useState, useRef, useEffect } from 'react';

import { cn } from '@/lib/utils';

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS_LONG = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];
const MONTHS_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/** Parse "YYYY-MM" or "YYYY-MM-DD" string → { year, month (0-based), day } */
function parseStringValue(
  value: string
): { year: number; month: number; day?: number } | null {
  if (!value) return null;
  const monthMatch = value.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) return { year: +monthMatch[1], month: +monthMatch[2] - 1 };
  const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateMatch)
    return {
      year: +dateMatch[1],
      month: +dateMatch[2] - 1,
      day: +dateMatch[3],
    };
  return null;
}

function toMonthString(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function toDateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplayMonth(year: number, month: number) {
  return `${MONTHS_LONG[month]} de ${year}`;
}

function formatDisplayDate(year: number, month: number, day: number) {
  return new Date(year, month, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

interface CalendarProps {
  /** Valor em formato "YYYY-MM" (mode="month") ou "YYYY-MM-DD" (mode="date") */
  value?: string;
  /** Retorna string no mesmo formato do value */
  onChange?: (value: string) => void;
  /** "month" → seletor mês/ano compatível com input[type=month] | "date" → calendário completo */
  mode?: 'month' | 'date';
  placeholder?: string;
  label?: string;
  className?: string;
}

export function Calendar({
  value = '',
  onChange,
  mode = 'date',
  placeholder,
  label,
  className,
}: CalendarProps) {
  const today = new Date();
  const parsed = parseStringValue(value);

  const defaultPlaceholder =
    mode === 'month' ? 'Mês / Ano' : 'Selecione uma data';

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  function prevYear() {
    setViewYear((y) => y - 1);
  }
  function nextYear() {
    setViewYear((y) => y + 1);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  function selectMonth(month: number) {
    onChange?.(toMonthString(viewYear, month));
    setViewMonth(month);
    setOpen(false);
  }

  function selectDay(day: number) {
    onChange?.(toDateString(viewYear, viewMonth, day));
    setOpen(false);
  }

  function triggerLabel() {
    if (!parsed) return placeholder ?? defaultPlaceholder;
    if (mode === 'month') return formatDisplayMonth(parsed.year, parsed.month);
    if (parsed.day !== undefined)
      return formatDisplayDate(parsed.year, parsed.month, parsed.day);
    return placeholder ?? defaultPlaceholder;
  }

  const hasValue = !!parsed;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          {label}
        </label>
      )}

      {/* ── Trigger ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) =>
          (e.key === 'Enter' || e.key === ' ') && setOpen((o) => !o)
        }
        className={cn(
          'w-full flex items-center gap-3 rounded-xl border border-white/6 bg-white/2 py-3 px-4',
          'text-sm outline-none transition-all duration-200 text-left cursor-pointer select-none',
          'hover:border-white/10 hover:bg-white/4',
          open && 'border-blue-500/40 bg-white/4',
          !hasValue ? 'text-zinc-600' : 'text-white'
        )}
      >
        <CalendarIcon className="size-4 shrink-0 text-zinc-500" />
        <span className="flex-1 truncate">{triggerLabel()}</span>
        {hasValue && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.('');
            }}
            className="shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors"
            aria-label="Limpar data"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-full min-w-[300px] rounded-2xl border border-white/10',
            'bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-4',
            'animate-in fade-in-0 zoom-in-95 duration-150'
          )}
        >
          {/* ── MODE: MONTH ── */}
          {mode === 'month' && (
            <>
              {/* Year navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevYear}
                  className="flex size-8 items-center justify-center rounded-lg border border-white/6 bg-white/2 text-zinc-400 transition-all hover:border-white/10 hover:bg-white/6 hover:text-white"
                  aria-label="Ano anterior"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-sm font-semibold text-white tracking-wide">
                  {viewYear}
                </span>
                <button
                  type="button"
                  onClick={nextYear}
                  className="flex size-8 items-center justify-center rounded-lg border border-white/6 bg-white/2 text-zinc-400 transition-all hover:border-white/10 hover:bg-white/6 hover:text-white"
                  aria-label="Próximo ano"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-3 gap-2">
                {MONTHS_SHORT.map((name, idx) => {
                  const isSelected =
                    parsed?.year === viewYear && parsed?.month === idx;
                  const isCurrentMonth =
                    idx === today.getMonth() &&
                    viewYear === today.getFullYear();
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => selectMonth(idx)}
                      className={cn(
                        'rounded-xl py-2.5 text-sm font-medium transition-all duration-150',
                        !isSelected &&
                          !isCurrentMonth &&
                          'text-zinc-400 hover:bg-white/6 hover:text-white',
                        isCurrentMonth &&
                          !isSelected &&
                          'text-blue-400 ring-1 ring-blue-500/40',
                        isSelected &&
                          'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      )}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-end border-t border-white/6 pt-3">
                <button
                  type="button"
                  onClick={() => selectMonth(today.getMonth())}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Mês atual
                </button>
              </div>
            </>
          )}

          {/* ── MODE: DATE ── */}
          {mode === 'date' && (
            <>
              {/* Month/Year navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex size-8 items-center justify-center rounded-lg border border-white/6 bg-white/2 text-zinc-400 transition-all hover:border-white/10 hover:bg-white/6 hover:text-white"
                  aria-label="Mês anterior"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-sm font-semibold text-white tracking-wide">
                  {MONTHS_LONG[viewMonth]} {viewYear}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex size-8 items-center justify-center rounded-lg border border-white/6 bg-white/2 text-zinc-400 transition-all hover:border-white/10 hover:bg-white/6 hover:text-white"
                  aria-label="Próximo mês"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((wd) => (
                  <div
                    key={wd}
                    className="text-center text-[10px] font-medium text-zinc-600 py-1 uppercase tracking-widest"
                  >
                    {wd}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />;
                  const isToday =
                    day === today.getDate() &&
                    viewMonth === today.getMonth() &&
                    viewYear === today.getFullYear();
                  const isSelected =
                    parsed?.day === day &&
                    parsed?.month === viewMonth &&
                    parsed?.year === viewYear;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => selectDay(day)}
                      className={cn(
                        'relative mx-auto flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-all duration-150',
                        !isSelected &&
                          !isToday &&
                          'text-zinc-400 hover:bg-white/6 hover:text-white',
                        isToday &&
                          !isSelected &&
                          'text-blue-400 ring-1 ring-blue-500/40',
                        isSelected &&
                          'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setViewYear(today.getFullYear());
                    setViewMonth(today.getMonth());
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {today.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewYear(today.getFullYear());
                    setViewMonth(today.getMonth());
                    selectDay(today.getDate());
                  }}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Selecionar hoje
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
