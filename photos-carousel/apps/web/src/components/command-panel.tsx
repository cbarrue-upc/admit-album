import { useState } from 'react';
import type { LLMCommand } from '@photos-carousel/types';
import { Button } from '@photos-carousel/ui';
import { sendLLMCommand } from '../lib/api.js';
import { useSlideshowStore } from '../store/slideshow.js';

export function CommandPanel() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const applyAction = useSlideshowStore((state) => state.applyAction);

  const handleSubmit = async () => {
    try {
      const mockCommand: LLMCommand = { action: 'LIST' };
      const response = await sendLLMCommand(mockCommand);
      if (response.action && ['PLAY', 'PAUSE', 'NEXT', 'PREV', 'SHUFFLE'].includes(response.action)) {
        applyAction(response.action as LLMCommand['action']);
      }
      setResult(JSON.stringify(response));
      setInput('');
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Error');
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 text-sm text-white">
      <h2 className="text-lg font-semibold">Comandos por texto</h2>
      <textarea
        className="min-h-[96px] rounded-lg bg-black/40 p-3"
        placeholder="Ej. \"pon pausa\" o \"siguiente foto\""
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <Button onClick={handleSubmit}>Enviar comando</Button>
      {result && <pre className="whitespace-pre-wrap text-xs text-white/70">{result}</pre>}
    </div>
  );
}
