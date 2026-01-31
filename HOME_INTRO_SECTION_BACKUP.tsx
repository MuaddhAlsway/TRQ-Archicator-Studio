{/* Introduction - Static text from i18next */}
{/* THIS SECTION WAS REMOVED FROM HOME.TSX - BACKUP FOR RESTORATION */}
<section className="py-12 sm:py-16 md:py-24 px-4 max-w-7xl mx-auto">
  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
    <div className={isRTL ? 'lg:order-2 text-right' : 'text-left'}>
      <h2 className={`text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}>
        {ts('home.introTitle')}
      </h2>
      <p className={`text-base sm:text-lg text-black/60 mb-4 sm:mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {ts('home.introText1')}
      </p>
      <p className={`text-base sm:text-lg text-black/60 mb-6 sm:mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        {ts('home.introText2')}
      </p>
      <button
        onClick={() => onNavigate(settings.homeIntroLinkPage as any)}
        className={`inline-flex items-center gap-2 text-black hover:gap-4 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <span className="tracking-wider text-sm sm:text-base">{ts('home.learnMoreAboutTrq')}</span>
        <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
      </button>
    </div>
    <div className={`relative h-[300px] sm:h-[400px] lg:h-[500px] ${isRTL ? 'lg:order-1' : ''}`}>
      <ImageWithFallback
        src={'/uploads/5.webp'}
        alt="TRQ design work"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</section>
