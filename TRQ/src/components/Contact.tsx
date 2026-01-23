import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as api from '../api';
import { useLanguage } from '../context/LanguageContext';

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.MapPin;
};

export function Contact() {
  const { ts, td, translateBatch, isRTL, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    contactHeroTitle: 'GET IN TOUCH',
    contactHeroParagraph: 'Let\'s discuss your project and create something extraordinary together',
    contactHeroImage: '/TRQ STUDIO _ PROJECTS/REC. HEAVEN/13.jpg',
    contactInfo1Show: 'true', contactInfo1Icon: 'MapPin', contactInfo1Title: 'Visit Us', contactInfo1Detail1: 'TRQ Design Studio', contactInfo1Detail2: 'King Fahd Road', contactInfo1Detail3: 'Riyadh, Saudi Arabia',
    contactInfo2Show: 'true', contactInfo2Icon: 'Phone', contactInfo2Title: 'Call Us', contactInfo2Detail1: '+966 XX XXX XXXX', contactInfo2Detail2: 'Mon-Fri: 9:00 AM - 6:00 PM', contactInfo2Detail3: '',
    contactInfo3Show: 'true', contactInfo3Icon: 'Mail', contactInfo3Title: 'Email Us', contactInfo3Detail1: 'info@trq.design', contactInfo3Detail2: 'projects@trq.design', contactInfo3Detail3: '',
    contactInfo4Show: 'true', contactInfo4Icon: 'MessageCircle', contactInfo4Title: 'WhatsApp', contactInfo4Detail1: '+966 XX XXX XXXX', contactInfo4Detail2: 'Quick response guaranteed', contactInfo4Detail3: '',
    contactFormTitle: 'Send Us a Message',
    contactFormDescription: 'Fill out the form below and our team will get back to you within 24 hours.',
    contactFormSubjects: 'residential|Residential Project|commercial|Commercial Project|booth|Exhibition Booth|concept|Concept Design|furniture|Furniture Design|general|General Inquiry',
    contactQuickTitle: 'Quick Contact',
    contactQuick1Icon: 'MessageCircle', contactQuick1Title: 'WhatsApp', contactQuick1Description: 'Fastest way to reach us', contactQuick1ButtonText: 'CHAT ON WHATSAPP', contactQuick1Link: 'https://wa.me/966XXXXXXXXX', contactQuick1Color: 'green',
    contactQuick2Icon: 'Mail', contactQuick2Title: 'Email', contactQuick2Description: 'For detailed inquiries', contactQuick2ButtonText: 'SEND EMAIL', contactQuick2Link: 'mailto:info@trq.design?subject=Inquiry%20from%20TRQ%20Website&body=Hello%20TRQ%20Design%20Team%2C%0A%0AI%20am%20interested%20in%20your%20interior%20design%20services.%0A%0APlease%20contact%20me%20to%20discuss%20my%20project.%0A%0AThank%20you.', contactQuick2Color: 'black',
    contactOfficeHoursDay1: 'Monday - Thursday', contactOfficeHoursTime1: '9:00 AM - 6:00 PM',
    contactOfficeHoursDay2: 'Friday', contactOfficeHoursTime2: 'Closed',
    contactOfficeHoursDay3: 'Saturday', contactOfficeHoursTime3: '10:00 AM - 4:00 PM',
    contactOfficeHoursDay4: 'Sunday', contactOfficeHoursTime4: '9:00 AM - 6:00 PM',
    contactStudioShow: 'true', contactStudioTitle: 'Visit Our Studio', contactStudioDescription: 'Schedule an appointment to visit our design studio.', contactStudioButtonText: 'SCHEDULE A VISIT',
    contactMapShow: 'true', contactMapTitle: 'Find Us', contactMapAddress: 'TRQ Design Studio, King Fahd Road, Riyadh', contactMapImage: '', contactMapLink: 'https://maps.google.com/?q=Riyadh,Saudi+Arabia',
  });

  useEffect(() => {
    api.getSettings().then((data) => setSettings(prev => ({ ...prev, ...data }))).catch(() => {});
  }, []);

  // Translate dynamic content from database (contact info details, office hours)
  useEffect(() => {
    if (language === 'ar') {
      const dynamicTexts: string[] = [];
      for (let i = 1; i <= 4; i++) {
        dynamicTexts.push((settings as any)[`contactInfo${i}Title`]);
        dynamicTexts.push((settings as any)[`contactInfo${i}Detail1`]);
        dynamicTexts.push((settings as any)[`contactInfo${i}Detail2`]);
        dynamicTexts.push((settings as any)[`contactInfo${i}Detail3`]);
        dynamicTexts.push((settings as any)[`contactOfficeHoursDay${i}`]);
      }
      dynamicTexts.push(settings.contactQuick1Title, settings.contactQuick1Description);
      dynamicTexts.push(settings.contactQuick2Title, settings.contactQuick2Description);
      dynamicTexts.push(settings.contactStudioDescription, settings.contactMapAddress);
      translateBatch(dynamicTexts.filter(Boolean));
    }
  }, [language, settings]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createContact(formData);
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }, 3000);
    } catch (error) { console.error('Error submitting contact:', error); }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [1, 2, 3, 4]
    .filter((num) => (settings as any)[`contactInfo${num}Show`] !== 'false')
    .map((num) => ({
      icon: getIconComponent((settings as any)[`contactInfo${num}Icon`]),
      title: (settings as any)[`contactInfo${num}Title`],
      details: [(settings as any)[`contactInfo${num}Detail1`], (settings as any)[`contactInfo${num}Detail2`], (settings as any)[`contactInfo${num}Detail3`]].filter((d: string) => d && d.trim()),
    }));

  const officeHours = [1, 2, 3, 4].map((num) => ({ day: (settings as any)[`contactOfficeHoursDay${num}`], time: (settings as any)[`contactOfficeHoursTime${num}`] })).filter((item) => item.day && item.time);

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 z-10" />
        <ImageWithFallback src={settings.contactHeroImage || '/TRQ STUDIO _ PROJECTS/REC. HEAVEN/13.jpg'} alt="Contact Us" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4 sm:mb-6">{ts('contact.heroTitle')}</h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90">{ts('contact.heroSubtitle')}</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className={`grid gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-24 ${isRTL ? 'direction-rtl' : ''} ${contactInfo.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' : contactInfo.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' : contactInfo.length === 3 ? 'grid-cols-3 max-w-4xl mx-auto' : 'grid-cols-2 md:grid-cols-4'}`}>
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black mx-auto flex items-center justify-center mb-3 sm:mb-4 md:mb-6"><Icon className="text-white" size={20} /></div>
                <h3 className="text-base sm:text-lg md:text-xl mb-2 sm:mb-3 tracking-wide">{td(info.title)}</h3>
                {info.details.map((detail, idx) => (<p key={idx} className="text-black/60 text-xs sm:text-sm">{detail}</p>))}
              </div>
            );
          })}
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          <div className={isRTL ? 'lg:order-2' : ''}>
            <div className="bg-white border-2 border-black/10 p-6 sm:p-8">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 tracking-wide ${isRTL ? 'text-right' : ''}`}>{ts('contact.formTitle')}</h2>
              <p className={`text-sm sm:text-base text-black/70 mb-6 sm:mb-8 ${isRTL ? 'text-right' : ''}`}>{ts('contact.formSubtitle')}</p>
              {submitted ? (
                <div className="bg-green-50 border border-green-200 p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4"><Icons.Send className="text-white" size={24} /></div>
                  <h3 className="text-xl sm:text-2xl mb-2">{ts('contact.thankYou')}</h3>
                  <p className="text-sm sm:text-base text-black/70">{ts('contact.messageReceived')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="name" className={`block mb-2 text-xs sm:text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('contact.fullName')}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-black/20 focus:border-black focus:outline-none text-sm sm:text-base" placeholder={ts('contact.namePlaceholder')} dir={isRTL ? 'rtl' : 'ltr'} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="email" className={`block mb-2 text-xs sm:text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('contact.email')}</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-black/20 focus:border-black focus:outline-none text-sm sm:text-base" placeholder="your@email.com" dir="ltr" />
                    </div>
                    <div>
                      <label htmlFor="phone" className={`block mb-2 text-xs sm:text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('contact.phone')}</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-black/20 focus:border-black focus:outline-none text-sm sm:text-base" placeholder="+966 XX XXX XXXX" dir="ltr" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className={`block mb-2 text-xs sm:text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('contact.subject')}</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-black/20 focus:border-black focus:outline-none bg-white text-sm sm:text-base" dir={isRTL ? 'rtl' : 'ltr'}>
                      <option value="">{ts('contact.selectSubject')}</option>
                      <option value="residential">{ts('contact.residentialProject')}</option>
                      <option value="commercial">{ts('contact.commercialProject')}</option>
                      <option value="booth">{ts('contact.exhibitionBooth')}</option>
                      <option value="concept">{ts('contact.conceptDesign')}</option>
                      <option value="furniture">{ts('contact.furnitureDesign')}</option>
                      <option value="general">{ts('contact.generalInquiry')}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className={`block mb-2 text-xs sm:text-sm tracking-wider ${isRTL ? 'text-right' : ''}`}>{ts('contact.message')}</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-black/20 focus:border-black focus:outline-none resize-none text-sm sm:text-base" placeholder={ts('contact.messagePlaceholder')} dir={isRTL ? 'rtl' : 'ltr'} />
                  </div>
                  <button type="submit" disabled={loading} className={`w-full px-6 sm:px-8 py-3 sm:py-4 bg-black text-white hover:bg-black/80 transition-colors tracking-wider flex items-center justify-center gap-2 text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{ts('common.sendMessage')}</span><Icons.Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className={`space-y-6 sm:space-y-8 ${isRTL ? 'lg:order-1' : ''}`}>
            <div>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 tracking-wide ${isRTL ? 'text-right' : ''}`}>{ts('contact.quickContact')}</h2>
              <div className="space-y-3 sm:space-y-4">
                {[1, 2].map((num) => {
                  const title = (settings as any)[`contactQuick${num}Title`];
                  const description = (settings as any)[`contactQuick${num}Description`];
                  const link = (settings as any)[`contactQuick${num}Link`];
                  const color = (settings as any)[`contactQuick${num}Color`];
                  const iconName = (settings as any)[`contactQuick${num}Icon`];
                  if (!title || !link) return null;
                  const Icon = getIconComponent(iconName);
                  const isGreen = color === 'green';
                  return (
                    <div key={num} className={`border p-4 sm:p-6 ${isGreen ? 'bg-green-50 border-green-200' : 'bg-neutral-50 border-black/10'}`}>
                      <div className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center ${isGreen ? 'bg-green-500' : 'bg-black'}`}><Icon className="text-white" size={20} /></div>
                        <div className={isRTL ? 'text-right' : ''}>
                          <h3 className="text-lg sm:text-xl tracking-wide">{td(title)}</h3>
                          {description && <p className="text-xs sm:text-sm text-black/60">{td(description)}</p>}
                        </div>
                      </div>
                      <a href={link} target={link.startsWith('http') ? '_blank' : undefined} rel={link.startsWith('http') ? 'noopener noreferrer' : undefined} className={`block w-full px-4 sm:px-6 py-2 sm:py-3 text-center transition-colors tracking-wider text-sm sm:text-base ${isGreen ? 'bg-green-500 text-white hover:bg-green-600' : 'border-2 border-black text-black hover:bg-black hover:text-white'}`}>{isGreen ? ts('common.chatOnWhatsapp') : ts('common.sendEmail')}</a>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-black text-white p-6 sm:p-8">
              <div className={`flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}><Icons.Clock size={24} /><h3 className="text-xl sm:text-2xl tracking-wide">{ts('contact.officeHours')}</h3></div>
              <div className="space-y-2 sm:space-y-3">
                {officeHours.map((item, index) => (<div key={index} className={`flex justify-between text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''}`}><span className="text-white/60">{td(item.day)}</span><span>{item.time}</span></div>))}
              </div>
            </div>
            {settings.contactStudioShow === 'true' && (
              <div>
                <h3 className={`text-xl sm:text-2xl mb-3 sm:mb-4 tracking-wide ${isRTL ? 'text-right' : ''}`}>{ts('contact.visitStudio')}</h3>
                <p className={`text-sm sm:text-base text-black/70 mb-3 sm:mb-4 ${isRTL ? 'text-right' : ''}`}>{ts('contact.visitStudioText')}</p>
                <button className={`px-4 sm:px-6 py-2 sm:py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors tracking-wider text-sm sm:text-base ${isRTL ? 'float-right' : ''}`}>{ts('contact.scheduleVisit')}</button>
                <div className="clear-both"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {settings.contactMapShow === 'true' && (
        <section className="py-12 sm:py-16 md:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8 text-center tracking-wide">{ts('contact.findUs')}</h2>
            <a href={settings.contactMapLink} target="_blank" rel="noopener noreferrer" className="block h-64 sm:h-80 md:h-96 bg-neutral-200 overflow-hidden cursor-pointer group relative">
              {settings.contactMapImage ? (
                <>
                  <img src={settings.contactMapImage} alt={settings.contactMapAddress} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 text-sm sm:text-base"><Icons.ExternalLink size={18} /><span className="tracking-wider">{ts('contact.openInMaps')}</span></div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center group-hover:bg-neutral-300 transition-colors">
                  <div className="text-center text-black/40 px-4"><Icons.MapPin size={36} className="mx-auto mb-3 sm:mb-4" /><p className="text-base sm:text-lg">{ts('contact.openInMaps')}</p><p className="text-xs sm:text-sm">{td(settings.contactMapAddress)}</p></div>
                </div>
              )}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
