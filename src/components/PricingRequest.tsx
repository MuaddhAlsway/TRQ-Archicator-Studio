import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LoadingScreen } from './LoadingScreen';

export function PricingRequest() {
  const { ts, isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`w-full flex flex-col min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <LoadingScreen isLoading={isLoading} onLoadingComplete={() => setIsLoading(false)} />
      
      {/* Iframe Container */}
      <div className="flex-1 w-full bg-white">
        <iframe
          src="https://form.typeform.com/to/aTxRPmXX"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Request Pricing Form"
          onLoad={() => setIsLoading(false)}
          style={{ 
            border: 'none',
            display: 'block',
            minHeight: 'calc(100vh - 200px)'
          }}
        />
      </div>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 ${isRTL ? 'text-right' : ''}`}>
            {/* Logo & Description */}
            <div className="sm:col-span-2">
              <h3 className="text-xl sm:text-2xl tracking-[0.2em] mb-3 sm:mb-4">TRQ</h3>
              <p className="text-sm sm:text-base text-white/60 max-w-md">
                {ts('footer.tagline')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 opacity-60">{ts('footer.quickLinks')}</h4>
              <div className="space-y-1 sm:space-y-2">
                <a href="#home" className={`block text-xs sm:text-sm text-white/60 hover:text-white transition-colors ${isRTL ? 'w-full text-right' : ''}`}>
                  {ts('nav.home')}
                </a>
                <a href="#about" className={`block text-xs sm:text-sm text-white/60 hover:text-white transition-colors ${isRTL ? 'w-full text-right' : ''}`}>
                  {ts('nav.about')}
                </a>
                <a href="#services" className={`block text-xs sm:text-sm text-white/60 hover:text-white transition-colors ${isRTL ? 'w-full text-right' : ''}`}>
                  {ts('nav.services')}
                </a>
                <a href="#portfolio" className={`block text-xs sm:text-sm text-white/60 hover:text-white transition-colors ${isRTL ? 'w-full text-right' : ''}`}>
                  {ts('nav.portfolio')}
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 opacity-60">{ts('footer.contactInfo')}</h4>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/60">
                <p>Riyadh, Saudi Arabia</p>
                <p>info@trq.design</p>
                <p>+966 XX XXX XXXX</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`border-t border-white/10 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-white/40 gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <p>{ts('footer.copyright')}</p>
            <div className={`flex ${isRTL ? 'space-x-reverse space-x-4 sm:space-x-6' : 'space-x-4 sm:space-x-6'}`}>
              <button className="hover:text-white transition-colors">{ts('footer.quickLinks')}</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
