import { useState } from 'react';
import { FileText, CheckCircle, MessageCircle, Mail } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

export function PricingRequest() {
  const { ts, isRTL, toArabicNum } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    projectSize: '',
    location: '',
    budget: '',
    timeline: '',
    description: '',
    contactMethod: 'email',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createPricingRequest(formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
        <section className="py-24 px-4 min-h-[80vh] flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-8">
              <CheckCircle className="text-white" size={48} />
            </div>
            <h1 className="text-4xl md:text-5xl mb-6 tracking-wide">{ts('pricing.successTitle')}</h1>
            <p className="text-lg text-black/70 mb-8">{ts('pricing.successText')}</p>
            <div className="bg-neutral-50 p-8 mb-8">
              <h2 className="text-2xl mb-4 tracking-wide">{ts('pricing.whatHappensNext')}</h2>
              <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'} max-w-lg mx-auto`}>
                {[
                  { num: 1, title: ts('pricing.step1Title'), desc: ts('pricing.step1Desc') },
                  { num: 2, title: ts('pricing.step2Title'), desc: ts('pricing.step2Desc') },
                  { num: 3, title: ts('pricing.step3Title'), desc: ts('pricing.step3Desc') },
                ].map((step) => (
                  <div key={step.num} className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center flex-shrink-0 mt-1">
                      {toArabicNum(step.num)}
                    </div>
                    <div>
                      <h3 className="mb-1">{step.title}</h3>
                      <p className="text-sm text-black/60">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <a href="https://wa.me/966XXXXXXXXX" target="_blank" rel="noopener noreferrer" className={`px-8 py-4 bg-green-500 text-white hover:bg-green-600 transition-colors tracking-wider inline-flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MessageCircle size={20} />
                <span>{ts('common.chatOnWhatsapp')}</span>
              </a>
              <a href="mailto:info@trq.design" className={`px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider inline-flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail size={20} />
                <span>{ts('common.sendEmail')}</span>
              </a>
            </div>
            <button onClick={() => setSubmitted(false)} className="text-black/60 hover:text-black underline">
              {ts('pricing.submitAnother')}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
        <ImageWithFallback src="https://images.unsplash.com/photo-1669387448840-610c588f003d?w=1080" alt="Request Pricing" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl tracking-wider mb-6">{ts('pricing.heroTitle')}</h1>
          <p className="text-xl opacity-90">{ts('pricing.heroSubtitle')}</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <div className={`flex items-center justify-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <FileText size={32} />
          <h2 className="text-3xl tracking-wide">{ts('pricing.formIntroTitle')}</h2>
        </div>
        <p className="text-lg text-black/70">{ts('pricing.formIntroText')}</p>
      </section>

      {/* Form Section */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Contact Information */}
            <div className="bg-white border-2 border-black/10 p-8">
              <h3 className={`text-2xl mb-6 tracking-wide ${isRTL ? 'text-right' : ''}`}>{ts('pricing.contactInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.fullName')}</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={`w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none ${isRTL ? 'text-right' : ''}`} placeholder={ts('pricing.namePlaceholder')} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.company')}</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className={`w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none ${isRTL ? 'text-right' : ''}`} placeholder={ts('pricing.companyPlaceholder')} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.email')}</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none" placeholder="your@email.com" />
                </div>
                <div>
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.phone')}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none" placeholder="+966 XX XXX XXXX" />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white border-2 border-black/10 p-8">
              <h3 className={`text-2xl mb-6 tracking-wide ${isRTL ? 'text-right' : ''}`}>{ts('pricing.projectDetails')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.projectType')}</label>
                  <select name="projectType" value={formData.projectType} onChange={handleChange} required className={`w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <option value="">{ts('pricing.selectProjectType')}</option>
                    <option value="residential-villa">{ts('pricing.residentialVilla')}</option>
                    <option value="residential-apartment">{ts('pricing.residentialApartment')}</option>
                    <option value="commercial-office">{ts('pricing.commercialOffice')}</option>
                    <option value="commercial-retail">{ts('pricing.commercialRetail')}</option>
                    <option value="commercial-hotel">{ts('pricing.commercialHotel')}</option>
                    <option value="commercial-restaurant">{ts('pricing.commercialRestaurant')}</option>
                    <option value="exhibition-booth">{ts('pricing.exhibitionBooth')}</option>
                    <option value="event-design">{ts('pricing.eventDesign')}</option>
                    <option value="furniture-design">{ts('pricing.furnitureDesign')}</option>
                    <option value="other">{ts('pricing.other')}</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.projectSize')}</label>
                  <select name="projectSize" value={formData.projectSize} onChange={handleChange} required className={`w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <option value="">{ts('pricing.selectSize')}</option>
                    <option value="small">{ts('pricing.sizeSmall')}</option>
                    <option value="medium">{ts('pricing.sizeMedium')}</option>
                    <option value="large">{ts('pricing.sizeLarge')}</option>
                    <option value="extra-large">{ts('pricing.sizeXLarge')}</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.location')}</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required className={`w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none ${isRTL ? 'text-right' : ''}`} placeholder={ts('pricing.locationPlaceholder')} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
                <div>
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.timeline')}</label>
                  <select name="timeline" value={formData.timeline} onChange={handleChange} required className={`w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <option value="">{ts('pricing.selectTimeline')}</option>
                    <option value="urgent">{ts('pricing.timelineUrgent')}</option>
                    <option value="1-3-months">{ts('pricing.timeline1to3')}</option>
                    <option value="3-6-months">{ts('pricing.timeline3to6')}</option>
                    <option value="6-12-months">{ts('pricing.timeline6to12')}</option>
                    <option value="flexible">{ts('pricing.timelineFlexible')}</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.budget')}</label>
                  <select name="budget" value={formData.budget} onChange={handleChange} required className={`w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    <option value="">{ts('pricing.selectBudget')}</option>
                    <option value="under-100k">{ts('pricing.budgetUnder100k')}</option>
                    <option value="100k-300k">{ts('pricing.budget100to300k')}</option>
                    <option value="300k-500k">{ts('pricing.budget300to500k')}</option>
                    <option value="500k-1m">{ts('pricing.budget500kto1m')}</option>
                    <option value="over-1m">{ts('pricing.budget1mPlus')}</option>
                    <option value="not-sure">{ts('pricing.budgetNotSure')}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={`block mb-2 text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('pricing.description')}</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={6} className={`w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none ${isRTL ? 'text-right' : ''}`} placeholder={ts('pricing.descriptionPlaceholder')} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
              </div>
            </div>

            {/* Contact Method */}
            <div className="bg-white border-2 border-black/10 p-8">
              <h3 className={`text-2xl mb-6 tracking-wide ${isRTL ? 'text-right' : ''}`}>{ts('pricing.contactMethod')}</h3>
              <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
                <label className={`flex items-center gap-4 cursor-pointer p-4 border border-black/10 hover:border-black/30 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input type="radio" name="contactMethod" value="email" checked={formData.contactMethod === 'email'} onChange={handleChange} className="w-5 h-5" />
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Mail size={20} />
                    <div className={isRTL ? 'text-right' : ''}>
                      <div>{ts('pricing.emailMethod')}</div>
                      <div className="text-sm text-black/60">{ts('pricing.emailMethodDesc')}</div>
                    </div>
                  </div>
                </label>
                <label className={`flex items-center gap-4 cursor-pointer p-4 border border-black/10 hover:border-black/30 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input type="radio" name="contactMethod" value="whatsapp" checked={formData.contactMethod === 'whatsapp'} onChange={handleChange} className="w-5 h-5" />
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <MessageCircle size={20} />
                    <div className={isRTL ? 'text-right' : ''}>
                      <div>{ts('pricing.whatsappMethod')}</div>
                      <div className="text-sm text-black/60">{ts('pricing.whatsappMethodDesc')}</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" disabled={loading} className="px-12 py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider text-lg disabled:opacity-50">
                {loading ? ts('common.submitting') : ts('common.submitRequest')}
              </button>
              <p className="text-sm text-black/60 mt-4">{ts('pricing.responseTime')}</p>
            </div>
          </form>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 tracking-wide">{ts('pricing.expectTitle')}</h2>
            <p className="text-white/60 max-w-2xl mx-auto">{ts('pricing.expectText')}</p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${isRTL ? 'direction-rtl' : ''}`}>
            {[
              { num: '01', title: ts('pricing.expect1Title'), desc: ts('pricing.expect1Desc') },
              { num: '02', title: ts('pricing.expect2Title'), desc: ts('pricing.expect2Desc') },
              { num: '03', title: ts('pricing.expect3Title'), desc: ts('pricing.expect3Desc') },
            ].map((step) => (
              <div key={step.num} className="text-center p-6">
                <div className="text-5xl mb-4">{toArabicNum(step.num)}</div>
                <h3 className="text-xl mb-3 tracking-wide">{step.title}</h3>
                <p className="text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
