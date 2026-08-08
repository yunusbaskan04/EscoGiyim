'use client';

import * as React from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

interface FaqSearchAccordionProps {
  faqs: FaqItemData[];
}

export function FaqSearchAccordion({ faqs }: FaqSearchAccordionProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredFaqs = React.useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase().trim();
    return faqs.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [faqs, searchQuery]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Soru veya kelime yazarak arayın (örn: dikim, değişim, ödeme)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 h-12 text-base rounded-2xl border-slate-300 shadow-sm focus:border-amber-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Accordion Container */}
      {filteredFaqs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
          <p className="text-slate-500 font-medium">Aramanıza uygun soru bulunamadı.</p>
          <Button variant="outline" onClick={() => setSearchQuery('')} className="text-xs font-semibold">
            Tüm Soruları Göster
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm divide-y divide-slate-200">
          {filteredFaqs.map((faq, idx) => (
            <AccordionItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={idx === 0 && !searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}
