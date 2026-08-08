'use client';

import * as React from 'react';
import { Megaphone, X } from 'lucide-react';

interface AnnouncementBannerProps {
  announcement?: {
    id: string;
    title: string;
    content: string;
  } | null;
}

export function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (!announcement || isDismissed) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md relative z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950/10 text-slate-950">
            <Megaphone className="h-4 w-4" />
          </span>
          <div>
            <strong className="font-bold mr-2">{announcement.title}:</strong>
            <span className="text-slate-900">{announcement.content}</span>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="rounded-lg p-1 text-slate-900 hover:bg-slate-950/10 transition"
          aria-label="Duyuruyu kapat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
