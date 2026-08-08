'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({ question, answer, defaultOpen = false, className }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('border-b border-slate-200 py-4 dark:border-slate-800', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left font-semibold text-slate-900 transition-colors hover:text-amber-600 dark:text-white dark:hover:text-amber-400"
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg pr-4">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-slate-500 transition-transform duration-300 dark:text-slate-400',
            isOpen && 'rotate-180 text-amber-600'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {answer}
        </div>
      </div>
    </div>
  );
}
