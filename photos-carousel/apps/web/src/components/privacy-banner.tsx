import { useState } from 'react';
import { Button } from '@photos-carousel/ui';

export function PrivacyBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-3xl -translate-x-1/2 rounded-2xl bg-white/10 p-4 text-sm text-white">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>
          Las fotos se procesan solo en tu dispositivo. No almacenamos tus imágenes y el acceso a
          Google Photos se realiza mediante OAuth seguro.
        </p>
        <Button variant="primary" onClick={() => setVisible(false)}>
          Entendido
        </Button>
      </div>
    </div>
  );
}
