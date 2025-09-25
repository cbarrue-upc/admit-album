import { useState } from 'react';
import type { LLMCommand } from '@photos-carousel/types';
import { Button } from '@photos-carousel/ui';

interface FiltersPanelProps {
  onApply: (filters: LLMCommand['filters']) => void;
}

export function FiltersPanel({ onApply }: FiltersPanelProps) {
  const [orientation, setOrientation] = useState<LLMCommand['filters']['orientation']>();
  const [mime, setMime] = useState('image/jpeg');

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white">
      <h2 className="text-lg font-semibold">Filtros locales</h2>
      <div className="flex gap-2">
        <Button
          variant={orientation === 'portrait' ? 'primary' : 'ghost'}
          onClick={() => setOrientation(orientation === 'portrait' ? undefined : 'portrait')}
        >
          Vertical
        </Button>
        <Button
          variant={orientation === 'landscape' ? 'primary' : 'ghost'}
          onClick={() => setOrientation(orientation === 'landscape' ? undefined : 'landscape')}
        >
          Horizontal
        </Button>
      </div>
      <label className="flex flex-col gap-2 text-white/80">
        Tipo MIME
        <select
          value={mime}
          onChange={(event) => setMime(event.target.value)}
          className="rounded-lg bg-black/40 p-2"
        >
          <option value="image/jpeg">JPEG</option>
          <option value="image/png">PNG</option>
          <option value="image/webp">WEBP</option>
        </select>
      </label>
      <Button
        onClick={() => onApply({ orientation, mime: [mime] })}
        className="mt-2"
      >
        Aplicar filtros
      </Button>
    </div>
  );
}
