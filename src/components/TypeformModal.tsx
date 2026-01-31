import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TypeformModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
}

export function TypeformModal({ isOpen, onClose, formId }: TypeformModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Load Typeform embed script
      const script = document.createElement('script');
      script.src = 'https://embed.typeform.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <h2 className="text-xl tracking-wide">Request Pricing</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 transition-colors rounded"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Typeform Embed */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-black/60">Loading form...</p>
              </div>
            </div>
          )}
          <div
            data-tf-live={`https://form.typeform.com/to/${formId}`}
            style={{ width: '100%', height: '100%' }}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
