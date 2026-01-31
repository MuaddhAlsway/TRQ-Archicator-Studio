import { useState } from 'react';
import { X } from 'lucide-react';

interface PricingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingForm({ isOpen, onClose }: PricingFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <h2 className="text-2xl tracking-wide">Request Pricing</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 transition-colors rounded"
          >
            <X size={24} />
          </button>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src="https://form.typeform.com/to/aTxRPmXX"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Request Pricing Form"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
