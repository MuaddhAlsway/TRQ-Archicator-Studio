import { useLanguage } from '../context/LanguageContext';

export function CompanyProfile() {
  const { isRTL } = useLanguage();
  const flipbookUrl = 'https://publuu.com/flip-book/829640/2262213';

  // Show embedded flipbook on both mobile and desktop
  return (
    <>
      <div className={`w-full h-screen ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <iframe
          src={flipbookUrl}
          title="Company Profile"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          className="w-full h-full block"
        />
      </div>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 ${isRTL ? 'text-right' : ''}`}>
            <div className="sm:col-span-2">
              <h3 className="text-xl sm:text-2xl tracking-[0.2em] mb-3 sm:mb-4">TRQ</h3>
              <p className="text-sm sm:text-base text-white/60 max-w-md">
                Luxury interior design studio creating exceptional spaces
              </p>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 opacity-60">QUICK LINKS</h4>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-white/60">Home</p>
                <p className="text-xs sm:text-sm text-white/60">About</p>
                <p className="text-xs sm:text-sm text-white/60">Services</p>
                <p className="text-xs sm:text-sm text-white/60">Portfolio</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm tracking-wider mb-3 sm:mb-4 opacity-60">CONTACT</h4>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-white/60">
                <p>Riyadh & Jeddah, Saudi Arabia</p>
                <p>info@trq.design</p>
                <p>+966 XX XXX XXXX</p>
              </div>
            </div>
          </div>
          <div className={`border-t border-white/10 mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-white/40 gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <p>© 2026 TRQ Design Studio. All rights reserved</p>
            <div className={`flex gap-4 sm:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <a href="https://www.behance.net/TRQSTUDIO" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Behance</a>
              <a href="https://www.linkedin.com/company/trqstudio/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://www.instagram.com/trqstudio_/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
