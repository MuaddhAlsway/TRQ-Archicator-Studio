import { useState, useEffect } from 'react';
import { Save, RefreshCw, Plus, X, GripVertical } from 'lucide-react';
import * as Icons from 'lucide-react';
import * as api from '../api';
import { useAdmin } from './AdminContext';

const availableIcons = [
  'Eye', 'Target', 'Heart', 'Award', 'Users', 'Lightbulb', 'Star', 'Crown',
  'Diamond', 'Gem', 'Compass', 'Flag', 'Globe', 'Rocket', 'Zap', 'Shield',
  'CheckCircle', 'TrendingUp', 'Layers', 'Layout', 'Home', 'Building2',
  'Search', 'Hammer', 'Briefcase', 'Calendar', 'Settings', 'Tool',
  'MapPin', 'Phone', 'Mail', 'MessageCircle', 'Clock', 'Send'
];

const getIconComponent = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.Star;
};

export function AdminSettings() {
  const { projects } = useAdmin();
  const [activeTab, setActiveTab] = useState<'home-intro' | 'home-featured' | 'home-workflow' | 'home-cta' | 'about' | 'services' | 'workflow' | 'portfolio' | 'contact' | 'pricing' | 'blog'>('home-intro');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    // Home page - Introduction section
    homeIntroTitle: 'Creating Timeless Design Solutions',
    homeIntroText1: 'TRQ is a luxury and creative interior design studio based in Riyadh, Saudi Arabia. We specialize in delivering high-quality, creative, and refined solutions for both residential and commercial clients.',
    homeIntroText2: 'Our approach combines artistic vision with practical expertise to create spaces that not only look exceptional but also enhance the way you live and work.',
    homeIntroImage: '/uploads/5.webp',
    homeIntroLinkText: 'LEARN MORE ABOUT TRQ',
    homeIntroLinkPage: 'about',
    // Home page - Featured Projects section
    homeFeaturedTitle: 'Featured Projects',
    homeFeaturedDescription: 'A glimpse into our recent work and design excellence',
    homeFeaturedProjects: '', // comma-separated project IDs
    // Home page - How We Work section
    homeWorkflowTitle: 'How We Work',
    homeWorkflowDescription: 'A seamless process designed to bring your vision to life',
    homeWorkflowStep1Title: 'Discovery',
    homeWorkflowStep1Desc: 'Understanding your vision',
    homeWorkflowStep2Title: 'Concept',
    homeWorkflowStep2Desc: 'Design development',
    homeWorkflowStep3Title: 'Approval',
    homeWorkflowStep3Desc: 'Refinement & planning',
    homeWorkflowStep4Title: 'Execution',
    homeWorkflowStep4Desc: 'Bringing it to life',
    homeWorkflowStep5Title: 'Delivery',
    homeWorkflowStep5Desc: 'Final handover',
    homeWorkflowLinkText: 'LEARN MORE',
    homeWorkflowLinkPage: 'workflow',
    // Home page - CTA section
    homeCtaTitle: 'Ready to Transform Your Space?',
    homeCtaDescription: 'Let\'s discuss your project and create something extraordinary together. Get in touch with our team today.',
    homeCtaButton1Text: 'REQUEST PRICING',
    homeCtaButton1Page: 'pricing',
    homeCtaButton2Text: 'CONTACT US',
    homeCtaButton2Page: 'contact',
    // About page - Hero
    aboutHeroTitle: 'ABOUT TRQ',
    aboutHeroParagraph: 'Crafting exceptional spaces through vision, expertise, and dedication',
    // About page - Who We Are
    aboutWhoWeAreTitle: 'Who We Are',
    aboutWhoWeAreParagraph1: 'TRQ is a luxury and creative interior design studio based in Riyadh, Saudi Arabia. Founded on the principles of excellence, innovation, and client-centric service, we have established ourselves as a premier design partner for discerning clients who demand the best.',
    aboutWhoWeAreParagraph2: 'Our multidisciplinary team brings together expertise in interior design, architecture, furniture design, and project management to deliver comprehensive solutions that exceed expectations.',
    aboutWhoWeAreParagraph3: 'Whether creating intimate residential spaces or grand commercial environments, we approach each project with the same level of dedication, creativity, and attention to detail that has become our hallmark.',
    aboutWhoWeAreImage: 'https://images.unsplash.com/photo-1669387448840-610c588f003d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    // About page - Vision
    aboutVisionTitle: 'Our Vision',
    aboutVisionIcon: 'Eye',
    aboutVisionParagraph: 'To be recognized as the leading luxury design studio in Saudi Arabia and beyond, setting new standards for creative excellence and transforming spaces into timeless works of art that inspire and elevate the human experience.',
    // About page - Mission
    aboutMissionTitle: 'Our Mission',
    aboutMissionIcon: 'Target',
    aboutMissionParagraph: 'To deliver exceptional, bespoke design solutions that reflect our clients\' unique vision while exceeding their expectations. We are committed to combining artistic innovation with practical expertise, creating spaces that are both beautiful and functional.',
    // About page - Values
    aboutValuesTitle: 'Our Values',
    aboutValuesDescription: 'The principles that guide our work and define our approach to design',
    aboutValue1Title: 'Excellence',
    aboutValue1Icon: 'Award',
    aboutValue1Description: 'We pursue the highest standards in every project, ensuring exceptional quality and attention to detail.',
    aboutValue2Title: 'Innovation',
    aboutValue2Icon: 'Lightbulb',
    aboutValue2Description: 'We embrace creativity and push boundaries to deliver unique, forward-thinking design solutions.',
    aboutValue3Title: 'Collaboration',
    aboutValue3Icon: 'Users',
    aboutValue3Description: 'We work closely with our clients, valuing their input and building lasting partnerships.',
    aboutValue4Title: 'Passion',
    aboutValue4Icon: 'Heart',
    aboutValue4Description: 'Our love for design drives us to create spaces that inspire and delight.',
    // About page - Why Choose TRQ
    aboutWhyTitle: 'Why Choose TRQ',
    aboutWhyDescription: 'What sets us apart in the world of luxury interior design',
    aboutWhy1Title: 'Luxury Focus',
    aboutWhy1Description: 'Specializing in high-end residential and commercial projects that demand the finest craftsmanship.',
    aboutWhy2Title: 'Holistic Approach',
    aboutWhy2Description: 'From concept to completion, we manage every aspect of your project with meticulous care.',
    aboutWhy3Title: 'Cultural Sensitivity',
    aboutWhy3Description: 'Deep understanding of Saudi Arabian culture combined with global design perspectives.',
    aboutWhy4Title: 'Proven Track Record',
    aboutWhy4Description: 'Successfully delivered premium projects across residential, commercial, and exhibition sectors.',
    // About page - Impact Statement
    aboutImpactTitle: 'Our Impact on Clients',
    aboutImpactParagraph1: 'We don\'t just design spaces—we transform the way our clients live, work, and experience their environments. Through thoughtful design, meticulous execution, and unwavering commitment to quality, we create spaces that inspire, comfort, and elevate daily life.',
    aboutImpactParagraph2: 'Every project is an opportunity to make a lasting positive impact, and we take this responsibility seriously. Our success is measured not just in completed projects, but in the satisfaction and delight of our clients.',
    // Services page - Hero
    servicesHeroTitle: 'OUR SERVICES',
    servicesHeroParagraph: 'Comprehensive design solutions tailored to your unique vision',
    // Services page - Introduction
    servicesTitle: 'Complete Design Solutions',
    servicesDescription: 'From intimate residential spaces to grand commercial projects, from exhibition booths to custom furniture, TRQ offers a comprehensive suite of design services.',
    // Services page - Highlights
    servicesHighlightsTitle: 'Service Highlights',
    servicesHighlightsDescription: 'What you can expect when working with TRQ',
    servicesHighlight1Title: 'Tailored Solutions',
    servicesHighlight1Description: 'Every project is unique. We create bespoke designs that reflect your specific needs, preferences, and vision.',
    servicesHighlight2Title: 'End-to-End Service',
    servicesHighlight2Description: 'From initial consultation to final installation, we manage every detail to ensure a seamless experience.',
    servicesHighlight3Title: 'Premium Quality',
    servicesHighlight3Description: 'We source the finest materials and work with skilled craftsmen to deliver exceptional results.',
    // Services page - CTA
    servicesCtaTitle: 'Ready to Get Started?',
    servicesCtaDescription: 'Let\'s discuss your project and explore how our services can bring your vision to life.',
    servicesCtaButton1Text: 'REQUEST PRICING',
    servicesCtaButton1Page: 'pricing',
    servicesCtaButton2Text: 'CONTACT US',
    servicesCtaButton2Page: 'contact',
    // Workflow page - Hero
    workflowHeroTitle: 'HOW WE WORK',
    workflowHeroParagraph: 'A seamless process designed to bring your vision to life',
    // Workflow page - Introduction
    workflowIntroTitle: 'Our Proven Process',
    workflowIntroParagraph: 'At TRQ, we believe that exceptional design requires a structured yet flexible approach. Our five-step workflow ensures that every project receives the attention, expertise, and care it deserves, from initial concept to final completion.',
    // Workflow page - Steps
    workflowStep1Title: 'Discovery & Consultation',
    workflowStep1Icon: 'Search',
    workflowStep1Description: 'Understanding your vision and requirements',
    workflowStep1Features: 'Initial consultation to understand your needs, preferences, and budget|Site visit and assessment of the existing space|Discussion of project goals, timeline, and constraints|Review of inspiration and reference materials|Preliminary scope definition and feasibility analysis',
    workflowStep2Title: 'Concept & Design Development',
    workflowStep2Icon: 'Lightbulb',
    workflowStep2Description: 'Bringing your vision to life through creative design',
    workflowStep2Features: 'Development of initial design concepts and mood boards|Space planning and layout options|Selection of color palettes, materials, and finishes|3D visualizations and renderings|Presentation of design proposals for your review',
    workflowStep3Title: 'Approval & Planning',
    workflowStep3Icon: 'CheckCircle',
    workflowStep3Description: 'Refinement and detailed planning',
    workflowStep3Features: 'Incorporating your feedback and refining the design|Preparation of detailed technical drawings and specifications|Finalization of material selections and furniture choices|Budget confirmation and project timeline establishment|Coordination with contractors and suppliers',
    workflowStep4Title: 'Execution & Supervision',
    workflowStep4Icon: 'Hammer',
    workflowStep4Description: 'Bringing the design to reality',
    workflowStep4Features: 'Procurement of materials, furniture, and fixtures|Coordination and supervision of construction work|Quality control and regular site inspections|Problem-solving and on-site design adjustments|Regular progress updates and communication',
    workflowStep5Title: 'Delivery & Final Handover',
    workflowStep5Icon: 'Home',
    workflowStep5Description: 'Completing your perfect space',
    workflowStep5Features: 'Final installation of furniture and décor|Styling and finishing touches|Comprehensive walk-through and inspection|Documentation of completed project|Post-completion support and maintenance guidance',
    // Workflow page - Why Our Process Works
    workflowWhyTitle: 'Why Our Process Works',
    workflowWhyDescription: 'Built on years of experience and refined through countless successful projects',
    workflowWhy1Title: 'Collaborative',
    workflowWhy1Description: 'We work closely with you at every stage, ensuring your vision guides the entire process and the final result exceeds your expectations.',
    workflowWhy2Title: 'Transparent',
    workflowWhy2Description: 'Clear communication, regular updates, and complete transparency in timelines, budgets, and decision-making throughout the project.',
    workflowWhy3Title: 'Efficient',
    workflowWhy3Description: 'Streamlined workflows, experienced project management, and attention to detail ensure projects are completed on time and to the highest standards.',
    // Workflow page - Project Timeline
    workflowTimelineTitle: 'Project Timeline',
    workflowTimelineParagraph1: 'While every project is unique, most projects follow a similar timeline. Residential projects typically take 3-6 months from concept to completion, while larger commercial projects may require 6-12 months or more. Exhibition booth designs often have faster turnarounds of 2-6 weeks depending on complexity.',
    workflowTimelineParagraph2: 'During our initial consultation, we\'ll provide you with a detailed timeline specific to your project\'s scope and requirements.',
    // Workflow page - CTA
    workflowCtaTitle: 'Ready to Begin Your Journey?',
    workflowCtaDescription: 'Let\'s start with a consultation to discuss your project and explore how we can bring your vision to life.',
    workflowCtaButton1Text: 'REQUEST PRICING',
    workflowCtaButton1Page: 'pricing',
    workflowCtaButton2Text: 'SCHEDULE CONSULTATION',
    workflowCtaButton2Page: 'contact',
    // Portfolio page - Hero
    portfolioHeroTitle: 'OUR PORTFOLIO',
    portfolioHeroParagraph: 'Explore our collection of exceptional design projects',
    // Portfolio page - Introduction
    portfolioIntroParagraph: 'Each project represents our commitment to excellence, creativity, and attention to detail. From intimate residential spaces to grand commercial environments, our portfolio showcases the breadth and depth of our design expertise.',
    // Portfolio page - Categories (JSON array - all editable)
    portfolioCategories: JSON.stringify([
      { id: 'all', label: 'All Projects' },
      { id: 'residential', label: 'Residential' },
      { id: 'commercial', label: 'Commercial' },
      { id: 'booths', label: 'Booths & Exhibitions' },
      { id: 'events', label: 'Events' },
      { id: 'furniture', label: 'Furniture' },
    ]),
    // Portfolio page - Stats
    portfolioStat1Value: '150+',
    portfolioStat1Label: 'PROJECTS COMPLETED',
    portfolioStat2Value: '100+',
    portfolioStat2Label: 'HAPPY CLIENTS',
    portfolioStat3Value: '15+',
    portfolioStat3Label: 'AWARDS WON',
    portfolioStat4Value: '8+',
    portfolioStat4Label: 'YEARS EXPERIENCE',
    // Portfolio page - CTA
    portfolioCtaTitle: 'Let\'s Create Your Project',
    portfolioCtaDescription: 'Ready to start your own design journey? Get in touch with our team to discuss your vision and explore how we can bring it to life.',
    portfolioCtaButton1Text: 'REQUEST PRICING',
    portfolioCtaButton1Page: 'pricing',
    portfolioCtaButton2Text: 'CONTACT US',
    portfolioCtaButton2Page: 'contact',
    // Contact page - Hero
    contactHeroTitle: 'GET IN TOUCH',
    contactHeroParagraph: 'Let\'s discuss your project and create something extraordinary together',
    // Contact page - Contact Info
    contactInfo1Show: 'true',
    contactInfo1Icon: 'MapPin',
    contactInfo1Title: 'Visit Us',
    contactInfo1Detail1: 'TRQ Design Studio',
    contactInfo1Detail2: 'King Fahd Road',
    contactInfo1Detail3: 'Riyadh, Saudi Arabia',
    contactInfo2Show: 'true',
    contactInfo2Icon: 'Phone',
    contactInfo2Title: 'Call Us',
    contactInfo2Detail1: '+966 XX XXX XXXX',
    contactInfo2Detail2: 'Mon-Fri: 9:00 AM - 6:00 PM',
    contactInfo2Detail3: '',
    contactInfo3Show: 'true',
    contactInfo3Icon: 'Mail',
    contactInfo3Title: 'Email Us',
    contactInfo3Detail1: 'info@trq.design',
    contactInfo3Detail2: 'projects@trq.design',
    contactInfo3Detail3: '',
    contactInfo4Show: 'true',
    contactInfo4Icon: 'MessageCircle',
    contactInfo4Title: 'WhatsApp',
    contactInfo4Detail1: '+966 XX XXX XXXX',
    contactInfo4Detail2: 'Quick response guaranteed',
    contactInfo4Detail3: '',
    // Contact page - Form Section
    contactFormTitle: 'Send Us a Message',
    contactFormDescription: 'Fill out the form below and our team will get back to you within 24 hours.',
    contactFormButtonText: 'SEND MESSAGE',
    contactFormButtonIcon: 'Send',
    // Contact page - Form Subjects (pipe-separated: value|label)
    contactFormSubjects: 'residential|Residential Project|commercial|Commercial Project|booth|Exhibition Booth|event|Event Design|furniture|Furniture Design|general|General Inquiry',
    // Contact page - Quick Contact (up to 4 customizable)
    contactQuickTitle: 'Quick Contact',
    contactQuick1Icon: 'MessageCircle',
    contactQuick1Title: 'WhatsApp',
    contactQuick1Description: 'Fastest way to reach us',
    contactQuick1ButtonText: 'CHAT ON WHATSAPP',
    contactQuick1Link: 'https://wa.me/966XXXXXXXXX',
    contactQuick1Color: 'green',
    contactQuick2Icon: 'Mail',
    contactQuick2Title: 'Email',
    contactQuick2Description: 'For detailed inquiries',
    contactQuick2ButtonText: 'SEND EMAIL',
    contactQuick2Link: 'mailto:info@trq.design?subject=Inquiry%20from%20TRQ%20Website&body=Hello%20TRQ%20Design%20Team%2C%0A%0AI%20am%20interested%20in%20your%20interior%20design%20services.%0A%0APlease%20contact%20me%20to%20discuss%20my%20project.%0A%0AThank%20you.',
    contactQuick2Color: 'black',
    contactQuick3Icon: '',
    contactQuick3Title: '',
    contactQuick3Description: '',
    contactQuick3ButtonText: '',
    contactQuick3Link: '',
    contactQuick3Color: 'black',
    contactQuick4Icon: '',
    contactQuick4Title: '',
    contactQuick4Description: '',
    contactQuick4ButtonText: '',
    contactQuick4Link: '',
    contactQuick4Color: 'black',
    // Contact page - Office Hours
    contactOfficeHoursDay1: 'Monday - Thursday',
    contactOfficeHoursTime1: '9:00 AM - 6:00 PM',
    contactOfficeHoursDay2: 'Friday',
    contactOfficeHoursTime2: 'Closed',
    contactOfficeHoursDay3: 'Saturday',
    contactOfficeHoursTime3: '10:00 AM - 4:00 PM',
    contactOfficeHoursDay4: 'Sunday',
    contactOfficeHoursTime4: '9:00 AM - 6:00 PM',
    // Contact page - Visit Studio
    contactStudioShow: 'true',
    contactStudioTitle: 'Visit Our Studio',
    contactStudioDescription: 'Schedule an appointment to visit our design studio, view our portfolio, and discuss your project in person.',
    contactStudioButtonText: 'SCHEDULE A VISIT',
    contactStudioButtonPage: 'contact',
    // Contact page - Map
    contactMapTitle: 'Find Us',
    contactMapAddress: 'TRQ Design Studio, King Fahd Road, Riyadh',
    contactMapImage: '',
    contactMapLink: 'https://maps.google.com/?q=Riyadh,Saudi+Arabia',
    // Pricing page - Hero
    pricingHeroTitle: 'REQUEST PRICING',
    pricingHeroParagraph: 'Get a custom quote tailored to your project',
    // Pricing page - Introduction
    pricingIntroTitle: 'Tell Us About Your Project',
    pricingIntroParagraph: 'Please provide as much detail as possible about your project. The more we know, the more accurate and tailored our proposal will be. All information is confidential and will only be used to prepare your custom quote.',
    // Pricing page - Form Section Titles
    pricingFormContactTitle: 'Contact Information',
    pricingFormProjectTitle: 'Project Details',
    pricingFormMethodTitle: 'How Should We Contact You?',
    // Pricing page - Project Types (JSON array)
    pricingProjectTypes: JSON.stringify([
      { value: 'residential-villa', label: 'Residential - Villa' },
      { value: 'residential-apartment', label: 'Residential - Apartment' },
      { value: 'commercial-office', label: 'Commercial - Office' },
      { value: 'commercial-retail', label: 'Commercial - Retail' },
      { value: 'commercial-hotel', label: 'Commercial - Hotel' },
      { value: 'commercial-restaurant', label: 'Commercial - Restaurant' },
      { value: 'exhibition-booth', label: 'Exhibition Booth' },
      { value: 'event-design', label: 'Event Design' },
      { value: 'furniture-design', label: 'Furniture Design' },
      { value: 'other', label: 'Other' },
    ]),
    // Pricing page - Project Sizes (JSON array)
    pricingProjectSizes: JSON.stringify([
      { value: 'small', label: 'Small (Under 100 sqm)' },
      { value: 'medium', label: 'Medium (100-300 sqm)' },
      { value: 'large', label: 'Large (300-1000 sqm)' },
      { value: 'xlarge', label: 'Extra Large (1000+ sqm)' },
    ]),
    // Pricing page - Timeline Options (JSON array)
    pricingTimelines: JSON.stringify([
      { value: 'urgent', label: 'Urgent (Within 1 month)' },
      { value: '1-3months', label: '1-3 months' },
      { value: '3-6months', label: '3-6 months' },
      { value: '6-12months', label: '6-12 months' },
      { value: 'flexible', label: 'Flexible' },
    ]),
    // Pricing page - Budget Ranges (JSON array)
    pricingBudgets: JSON.stringify([
      { value: 'under-100k', label: 'Under 100,000 SAR' },
      { value: '100k-300k', label: '100,000 - 300,000 SAR' },
      { value: '300k-500k', label: '300,000 - 500,000 SAR' },
      { value: '500k-1m', label: '500,000 - 1,000,000 SAR' },
      { value: '1m-plus', label: '1,000,000+ SAR' },
      { value: 'not-sure', label: 'Not sure yet' },
    ]),
    // Pricing page - Contact Form Fields (JSON array - editable/removable)
    pricingContactFields: JSON.stringify([
      { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name', required: true, halfWidth: false },
      { id: 'company', label: 'Company Name (Optional)', type: 'text', placeholder: 'Your company', required: false, halfWidth: false },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true, halfWidth: true },
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+966 XX XXX XXXX', required: true, halfWidth: true },
    ]),
    // Pricing page - Contact Method
    pricingMethodEmailDesc: 'Detailed written communication',
    pricingMethodWhatsappDesc: 'Quick response and easy communication',
    // Pricing page - Submit Button
    pricingSubmitText: 'SUBMIT REQUEST',
    pricingSubmitNote: 'We typically respond within 24 hours',
    // Pricing page - Success Message
    pricingSuccessTitle: 'Request Received!',
    pricingSuccessParagraph: 'Thank you for your interest in TRQ Design Studio. We have received your pricing request and will review it carefully.',
    pricingSuccessNextTitle: 'What Happens Next?',
    pricingSuccessStep1Title: 'Initial Review',
    pricingSuccessStep1Desc: 'Our team will review your project details within 24 hours.',
    pricingSuccessStep2Title: 'Follow-up Contact',
    pricingSuccessStep2Desc: "We'll reach out to discuss your project in more detail.",
    pricingSuccessStep3Title: 'Custom Proposal',
    pricingSuccessStep3Desc: "We'll prepare a detailed proposal with pricing tailored to your needs.",
    // Pricing page - Success Quick Contact
    pricingSuccessWhatsappText: 'CHAT ON WHATSAPP',
    pricingSuccessWhatsappLink: 'https://wa.me/966XXXXXXXXX',
    pricingSuccessEmailText: 'SEND EMAIL',
    pricingSuccessEmailLink: 'mailto:info@trq.design',
    // Pricing page - What to Expect Section
    pricingExpectTitle: 'What to Expect',
    pricingExpectParagraph: 'Our pricing process is transparent and tailored to your specific needs',
    pricingExpectStep1Number: '01',
    pricingExpectStep1Title: 'Detailed Review',
    pricingExpectStep1Desc: 'We carefully review your requirements and project scope to understand your vision.',
    pricingExpectStep2Number: '02',
    pricingExpectStep2Title: 'Custom Proposal',
    pricingExpectStep2Desc: 'We prepare a comprehensive proposal with itemized pricing and project timeline.',
    pricingExpectStep3Number: '03',
    pricingExpectStep3Title: 'Consultation',
    pricingExpectStep3Desc: 'We schedule a meeting to discuss the proposal and answer any questions you have.',
    // Blog page - Hero
    blogHeroTitle: 'DESIGN INSIGHTS',
    blogHeroParagraph: 'Expert perspectives on luxury interior design, trends, and inspiration',
    // Blog page - Featured Section
    blogFeaturedLabel: 'FEATURED ARTICLE',
    blogReadArticleText: 'READ ARTICLE',
    // Blog page - Categories
    blogCategoryAll: 'All Articles',
    blogCategoryDesignTips: 'Design Tips',
    blogCategoryTrends: 'Trends',
    blogCategoryProjects: 'Projects',
    blogCategoryInsights: 'Insights',
    // Blog page - Newsletter
    blogNewsletterTitle: 'Stay Inspired',
    blogNewsletterParagraph: 'Subscribe to receive our latest articles, design insights, and project updates directly to your inbox.',
    blogNewsletterPlaceholder: 'Your email address',
    blogNewsletterButton: 'SUBSCRIBE',
    blogNewsletterDisclaimer: 'We respect your privacy. Unsubscribe at any time.',
    // Blog page - Explore Section
    blogExploreTitle: 'Explore by Category',
    // Blog Article page
    blogArticleBackText: 'BACK TO BLOG',
    blogArticleShareText: 'SHARE THIS ARTICLE',
    blogArticleTagsLabel: 'TAGS',
    blogArticleRelatedTitle: 'Related Articles',
    blogArticleAuthorRole: 'Senior Design Writer',
    blogArticleAuthorBio: 'A passionate writer exploring the intersection of design, architecture, and lifestyle. With over 10 years of experience in the interior design industry, bringing insights and inspiration to design enthusiasts worldwide.',
  });

  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);

  useEffect(() => {
    api.getSettings().then((data) => {
      setSettings(prev => ({ ...prev, ...data }));
      // Parse featured projects
      if (data.homeFeaturedProjects) {
        const ids = data.homeFeaturedProjects.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
        setSelectedProjectIds(ids);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToSave = {
        ...settings,
        homeFeaturedProjects: selectedProjectIds.join(','),
      };
      await api.updateSettings(settingsToSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const addFeaturedProject = (projectId: number) => {
    if (!selectedProjectIds.includes(projectId)) {
      setSelectedProjectIds([...selectedProjectIds, projectId]);
    }
  };

  const removeFeaturedProject = (projectId: number) => {
    setSelectedProjectIds(selectedProjectIds.filter(id => id !== projectId));
  };

  const publishedProjects = projects.filter(p => p.status === 'published');
  const availableProjects = publishedProjects.filter(p => !selectedProjectIds.includes(p.id));
  const selectedProjects = selectedProjectIds.map(id => projects.find(p => p.id === id)).filter(Boolean);

  const linkOptions = [
    { value: 'home', label: 'Home' },
    { value: 'about', label: 'About' },
    { value: 'services', label: 'Services' },
    { value: 'workflow', label: 'Workflow' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'contact', label: 'Contact' },
    { value: 'pricing', label: 'Pricing' },
  ];

  const tabs = [
    { id: 'home-intro', label: 'Introduction' },
    { id: 'home-featured', label: 'Featured Projects' },
    { id: 'home-workflow', label: 'How We Work' },
    { id: 'home-cta', label: 'CTA Section' },
    { id: 'about', label: 'About Page' },
    { id: 'services', label: 'Services Page' },
    { id: 'workflow', label: 'Workflow Page' },
    { id: 'portfolio', label: 'Portfolio Page' },
    { id: 'contact', label: 'Contact Page' },
    { id: 'pricing', label: 'Pricing Page' },
    { id: 'blog', label: 'Blog Page' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl tracking-wide">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs - Dropdown on mobile/tablet, wrapped grid on desktop */}
        <div className="border-b border-black/5 p-4">
          {/* Mobile & Tablet: Dropdown */}
          <div className="lg:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
              className="w-full px-4 py-3 border border-black/10 rounded text-sm"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>
          {/* Desktop: Wrapped flex */}
          <div className="hidden lg:flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 text-sm tracking-wider rounded transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-black/5 text-black/60 hover:bg-black/10 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Home Page - Introduction Section */}
          {activeTab === 'home-intro' && (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-medium">Introduction Section</h2>
                <p className="text-sm text-black/60 mt-1">Content displayed in the introduction area on the home page</p>
              </div>
              
              <div>
                <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                <input
                  type="text"
                  value={settings.homeIntroTitle}
                  onChange={(e) => setSettings({ ...settings, homeIntroTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="Creating Timeless Design Solutions"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 1</label>
                <textarea
                  value={settings.homeIntroText1}
                  onChange={(e) => setSettings({ ...settings, homeIntroText1: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={4}
                  placeholder="TRQ is a luxury and creative interior design studio..."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 2</label>
                <textarea
                  value={settings.homeIntroText2}
                  onChange={(e) => setSettings({ ...settings, homeIntroText2: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={4}
                  placeholder="Our approach combines artistic vision..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">LINK TEXT</label>
                  <input
                    type="text"
                    value={settings.homeIntroLinkText}
                    onChange={(e) => setSettings({ ...settings, homeIntroLinkText: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="LEARN MORE ABOUT TRQ"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">LINK TO PAGE</label>
                  <select
                    value={settings.homeIntroLinkPage}
                    onChange={(e) => setSettings({ ...settings, homeIntroLinkPage: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white"
                  >
                    {linkOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">IMAGE URL</label>
                <input
                  type="url"
                  value={settings.homeIntroImage}
                  onChange={(e) => setSettings({ ...settings, homeIntroImage: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="https://..."
                />
                {settings.homeIntroImage && (
                  <div className="mt-3 w-64 h-40 bg-neutral-100 overflow-hidden rounded">
                    <img src={settings.homeIntroImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Home Page - Featured Projects Section */}
          {activeTab === 'home-featured' && (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-medium">Featured Projects Section</h2>
                <p className="text-sm text-black/60 mt-1">Select which projects to showcase on the home page</p>
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                <input
                  type="text"
                  value={settings.homeFeaturedTitle}
                  onChange={(e) => setSettings({ ...settings, homeFeaturedTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="Featured Projects"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">SECTION DESCRIPTION</label>
                <textarea
                  value={settings.homeFeaturedDescription}
                  onChange={(e) => setSettings({ ...settings, homeFeaturedDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={2}
                  placeholder="A glimpse into our recent work and design excellence"
                />
              </div>

              {/* Selected Projects */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">SELECTED PROJECTS ({selectedProjectIds.length})</label>
                {selectedProjects.length === 0 ? (
                  <div className="border-2 border-dashed border-black/20 rounded p-8 text-center text-black/40">
                    No projects selected. Add projects from the list below.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProjects.map((project, index) => project && (
                      <div key={project.id} className="flex items-center gap-3 bg-neutral-50 p-3 rounded">
                        <GripVertical size={18} className="text-black/30" />
                        <img src={project.image} alt={project.title} className="w-16 h-12 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{project.title}</p>
                          <p className="text-sm text-black/60 capitalize">{project.category}</p>
                        </div>
                        <button
                          onClick={() => removeFeaturedProject(project.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Projects */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">ADD PROJECTS</label>
                {availableProjects.length === 0 ? (
                  <p className="text-sm text-black/40">All published projects are already selected.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                    {availableProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => addFeaturedProject(project.id)}
                        className="flex items-center gap-3 p-3 border border-black/10 hover:border-black/30 rounded transition-colors text-left"
                      >
                        <img src={project.image} alt={project.title} className="w-16 h-12 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{project.title}</p>
                          <p className="text-sm text-black/60 capitalize">{project.category}</p>
                        </div>
                        <Plus size={18} className="text-black/40" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Home Page - How We Work Section */}
          {activeTab === 'home-workflow' && (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-medium">How We Work Section</h2>
                <p className="text-sm text-black/60 mt-1">Configure the workflow steps displayed on the home page</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                  <input
                    type="text"
                    value={settings.homeWorkflowTitle}
                    onChange={(e) => setSettings({ ...settings, homeWorkflowTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="How We Work"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">SECTION DESCRIPTION</label>
                  <input
                    type="text"
                    value={settings.homeWorkflowDescription}
                    onChange={(e) => setSettings({ ...settings, homeWorkflowDescription: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="A seamless process designed to bring your vision to life"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <label className="block mb-4 text-sm tracking-wider">WORKFLOW STEPS</label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="bg-neutral-50 p-4 rounded">
                      <div className="text-2xl font-light text-black/20 mb-2">0{step}</div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={(settings as any)[`homeWorkflowStep${step}Title`]}
                          onChange={(e) => setSettings({ ...settings, [`homeWorkflowStep${step}Title`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                          placeholder="Step title"
                        />
                        <input
                          type="text"
                          value={(settings as any)[`homeWorkflowStep${step}Desc`]}
                          onChange={(e) => setSettings({ ...settings, [`homeWorkflowStep${step}Desc`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                          placeholder="Step description"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">BUTTON TEXT</label>
                  <input
                    type="text"
                    value={settings.homeWorkflowLinkText}
                    onChange={(e) => setSettings({ ...settings, homeWorkflowLinkText: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="LEARN MORE"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">BUTTON LINK TO</label>
                  <select
                    value={settings.homeWorkflowLinkPage}
                    onChange={(e) => setSettings({ ...settings, homeWorkflowLinkPage: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white"
                  >
                    {linkOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Home Page - CTA Section */}
          {activeTab === 'home-cta' && (
            <div className="space-y-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-medium">Call to Action Section</h2>
                <p className="text-sm text-black/60 mt-1">Configure the CTA section at the bottom of the home page</p>
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                <input
                  type="text"
                  value={settings.homeCtaTitle}
                  onChange={(e) => setSettings({ ...settings, homeCtaTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                  placeholder="Ready to Transform Your Space?"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                <textarea
                  value={settings.homeCtaDescription}
                  onChange={(e) => setSettings({ ...settings, homeCtaDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={3}
                  placeholder="Let's discuss your project and create something extraordinary together."
                />
              </div>

              <div className="border-t pt-6">
                <label className="block mb-4 text-sm tracking-wider">BUTTONS</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">Primary Button</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Button Text</label>
                      <input
                        type="text"
                        value={settings.homeCtaButton1Text}
                        onChange={(e) => setSettings({ ...settings, homeCtaButton1Text: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="REQUEST PRICING"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Link To</label>
                      <select
                        value={settings.homeCtaButton1Page}
                        onChange={(e) => setSettings({ ...settings, homeCtaButton1Page: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">Secondary Button</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Button Text</label>
                      <input
                        type="text"
                        value={settings.homeCtaButton2Text}
                        onChange={(e) => setSettings({ ...settings, homeCtaButton2Text: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="CONTACT US"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Link To</label>
                      <select
                        value={settings.homeCtaButton2Page}
                        onChange={(e) => setSettings({ ...settings, homeCtaButton2Page: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Page Settings */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Hero Section</h2>
                  <p className="text-sm text-black/60 mt-1">The banner at the top of the About page</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO TITLE</label>
                    <input
                      type="text"
                      value={settings.aboutHeroTitle}
                      onChange={(e) => setSettings({ ...settings, aboutHeroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="ABOUT TRQ"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO PARAGRAPH</label>
                    <textarea
                      value={settings.aboutHeroParagraph}
                      onChange={(e) => setSettings({ ...settings, aboutHeroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Crafting exceptional spaces through vision, expertise, and dedication"
                    />
                  </div>
                </div>
              </div>

              {/* Who We Are Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Who We Are Section</h2>
                  <p className="text-sm text-black/60 mt-1">Main introduction section on the About page</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.aboutWhoWeAreTitle}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Who We Are"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 1</label>
                    <textarea
                      value={settings.aboutWhoWeAreParagraph1}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreParagraph1: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="TRQ is a luxury and creative interior design studio..."
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 2</label>
                    <textarea
                      value={settings.aboutWhoWeAreParagraph2}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreParagraph2: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="Our multidisciplinary team brings together expertise..."
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 3</label>
                    <textarea
                      value={settings.aboutWhoWeAreParagraph3}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreParagraph3: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="Whether creating intimate residential spaces..."
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm tracking-wider">IMAGE URL</label>
                    <input
                      type="url"
                      value={settings.aboutWhoWeAreImage}
                      onChange={(e) => setSettings({ ...settings, aboutWhoWeAreImage: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="https://..."
                    />
                    {settings.aboutWhoWeAreImage && (
                      <div className="mt-3 w-48 h-32 bg-neutral-100 overflow-hidden rounded">
                        <img src={settings.aboutWhoWeAreImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vision & Mission Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Vision & Mission</h2>
                  <p className="text-sm text-black/60 mt-1">Configure the Vision and Mission cards</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vision */}
                  <div className="bg-neutral-50 p-6 rounded space-y-4">
                    <h3 className="font-medium">Vision</h3>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">TITLE</label>
                      <input
                        type="text"
                        value={settings.aboutVisionTitle}
                        onChange={(e) => setSettings({ ...settings, aboutVisionTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Our Vision"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">ICON</label>
                      <div className="grid grid-cols-6 gap-2 p-3 border bg-white max-h-32 overflow-y-auto rounded">
                        {availableIcons.map((iconName) => {
                          const Icon = getIconComponent(iconName);
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setSettings({ ...settings, aboutVisionIcon: iconName })}
                              className={`p-2 flex items-center justify-center rounded transition-colors ${
                                settings.aboutVisionIcon === iconName
                                  ? 'bg-black text-white'
                                  : 'hover:bg-black/10'
                              }`}
                              title={iconName}
                            >
                              <Icon size={20} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">PARAGRAPH</label>
                      <textarea
                        value={settings.aboutVisionParagraph}
                        onChange={(e) => setSettings({ ...settings, aboutVisionParagraph: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none"
                        rows={4}
                        placeholder="To be recognized as the leading luxury design studio..."
                      />
                    </div>
                  </div>

                  {/* Mission */}
                  <div className="bg-neutral-50 p-6 rounded space-y-4">
                    <h3 className="font-medium">Mission</h3>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">TITLE</label>
                      <input
                        type="text"
                        value={settings.aboutMissionTitle}
                        onChange={(e) => setSettings({ ...settings, aboutMissionTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Our Mission"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">ICON</label>
                      <div className="grid grid-cols-6 gap-2 p-3 border bg-white max-h-32 overflow-y-auto rounded">
                        {availableIcons.map((iconName) => {
                          const Icon = getIconComponent(iconName);
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setSettings({ ...settings, aboutMissionIcon: iconName })}
                              className={`p-2 flex items-center justify-center rounded transition-colors ${
                                settings.aboutMissionIcon === iconName
                                  ? 'bg-black text-white'
                                  : 'hover:bg-black/10'
                              }`}
                              title={iconName}
                            >
                              <Icon size={20} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">PARAGRAPH</label>
                      <textarea
                        value={settings.aboutMissionParagraph}
                        onChange={(e) => setSettings({ ...settings, aboutMissionParagraph: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none"
                        rows={4}
                        placeholder="To deliver exceptional, bespoke design solutions..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Values Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Our Values Section</h2>
                  <p className="text-sm text-black/60 mt-1">Configure the 4 value cards on the About page</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.aboutValuesTitle}
                      onChange={(e) => setSettings({ ...settings, aboutValuesTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Our Values"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION DESCRIPTION</label>
                    <input
                      type="text"
                      value={settings.aboutValuesDescription}
                      onChange={(e) => setSettings({ ...settings, aboutValuesDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="The principles that guide our work..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => {
                    const IconPreview = getIconComponent((settings as any)[`aboutValue${num}Icon`]);
                    return (
                      <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black flex items-center justify-center rounded">
                            <IconPreview className="text-white" size={20} />
                          </div>
                          <span className="font-medium">Value {num}</span>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Title</label>
                          <input
                            type="text"
                            value={(settings as any)[`aboutValue${num}Title`]}
                            onChange={(e) => setSettings({ ...settings, [`aboutValue${num}Title`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="Value title"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Icon</label>
                          <div className="grid grid-cols-6 gap-1 p-2 border bg-white max-h-24 overflow-y-auto rounded">
                            {availableIcons.map((iconName) => {
                              const Icon = getIconComponent(iconName);
                              return (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => setSettings({ ...settings, [`aboutValue${num}Icon`]: iconName })}
                                  className={`p-1.5 flex items-center justify-center rounded transition-colors ${
                                    (settings as any)[`aboutValue${num}Icon`] === iconName
                                      ? 'bg-black text-white'
                                      : 'hover:bg-black/10'
                                  }`}
                                  title={iconName}
                                >
                                  <Icon size={16} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Description</label>
                          <textarea
                            value={(settings as any)[`aboutValue${num}Description`]}
                            onChange={(e) => setSettings({ ...settings, [`aboutValue${num}Description`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                            rows={3}
                            placeholder="Value description..."
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Why Choose TRQ Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Why Choose TRQ Section</h2>
                  <p className="text-sm text-black/60 mt-1">Configure the 4 differentiator items on the About page</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.aboutWhyTitle}
                      onChange={(e) => setSettings({ ...settings, aboutWhyTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Why Choose TRQ"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION DESCRIPTION</label>
                    <input
                      type="text"
                      value={settings.aboutWhyDescription}
                      onChange={(e) => setSettings({ ...settings, aboutWhyDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="What sets us apart in the world of luxury interior design"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black/10 flex items-center justify-center rounded text-sm font-medium">
                          {num}
                        </div>
                        <span className="font-medium">Differentiator {num}</span>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Title</label>
                        <input
                          type="text"
                          value={(settings as any)[`aboutWhy${num}Title`]}
                          onChange={(e) => setSettings({ ...settings, [`aboutWhy${num}Title`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="Differentiator title"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Description</label>
                        <textarea
                          value={(settings as any)[`aboutWhy${num}Description`]}
                          onChange={(e) => setSettings({ ...settings, [`aboutWhy${num}Description`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                          rows={3}
                          placeholder="Differentiator description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Statement Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Impact Statement Section</h2>
                  <p className="text-sm text-black/60 mt-1">Configure the impact statement at the bottom of the About page</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.aboutImpactTitle}
                      onChange={(e) => setSettings({ ...settings, aboutImpactTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Our Impact on Clients"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 1</label>
                    <textarea
                      value={settings.aboutImpactParagraph1}
                      onChange={(e) => setSettings({ ...settings, aboutImpactParagraph1: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="We don't just design spaces—we transform the way our clients live..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 2</label>
                    <textarea
                      value={settings.aboutImpactParagraph2}
                      onChange={(e) => setSettings({ ...settings, aboutImpactParagraph2: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="Every project is an opportunity to make a lasting positive impact..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Page Settings */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Hero Section</h2>
                  <p className="text-sm text-black/60 mt-1">The banner at the top of the Services page</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO TITLE</label>
                    <input
                      type="text"
                      value={settings.servicesHeroTitle}
                      onChange={(e) => setSettings({ ...settings, servicesHeroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="OUR SERVICES"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO PARAGRAPH</label>
                    <textarea
                      value={settings.servicesHeroParagraph}
                      onChange={(e) => setSettings({ ...settings, servicesHeroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Comprehensive design solutions tailored to your unique vision"
                    />
                  </div>
                </div>
              </div>

              {/* Introduction Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Introduction Section</h2>
                  <p className="text-sm text-black/60 mt-1">Content displayed below the hero</p>
                </div>
              
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.servicesTitle}
                      onChange={(e) => setSettings({ ...settings, servicesTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Complete Design Solutions"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                    <textarea
                      value={settings.servicesDescription}
                      onChange={(e) => setSettings({ ...settings, servicesDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="From intimate residential spaces to grand commercial projects..."
                    />
                  </div>
                </div>
              </div>

              {/* Service Highlights Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Service Highlights Section</h2>
                  <p className="text-sm text-black/60 mt-1">The 3 highlight features displayed on the Services page</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.servicesHighlightsTitle}
                      onChange={(e) => setSettings({ ...settings, servicesHighlightsTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Service Highlights"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION DESCRIPTION</label>
                    <input
                      type="text"
                      value={settings.servicesHighlightsDescription}
                      onChange={(e) => setSettings({ ...settings, servicesHighlightsDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="What you can expect when working with TRQ"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black/10 flex items-center justify-center rounded text-sm font-medium">
                          {num}
                        </div>
                        <span className="font-medium">Highlight {num}</span>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Title</label>
                        <input
                          type="text"
                          value={(settings as any)[`servicesHighlight${num}Title`]}
                          onChange={(e) => setSettings({ ...settings, [`servicesHighlight${num}Title`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="Highlight title"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Description</label>
                        <textarea
                          value={(settings as any)[`servicesHighlight${num}Description`]}
                          onChange={(e) => setSettings({ ...settings, [`servicesHighlight${num}Description`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                          rows={3}
                          placeholder="Highlight description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Call to Action Section</h2>
                  <p className="text-sm text-black/60 mt-1">The CTA at the bottom of the Services page</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.servicesCtaTitle}
                      onChange={(e) => setSettings({ ...settings, servicesCtaTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Ready to Get Started?"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                    <textarea
                      value={settings.servicesCtaDescription}
                      onChange={(e) => setSettings({ ...settings, servicesCtaDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Let's discuss your project..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">Primary Button</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Button Text</label>
                      <input
                        type="text"
                        value={settings.servicesCtaButton1Text}
                        onChange={(e) => setSettings({ ...settings, servicesCtaButton1Text: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="REQUEST PRICING"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Link To</label>
                      <select
                        value={settings.servicesCtaButton1Page}
                        onChange={(e) => setSettings({ ...settings, servicesCtaButton1Page: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">Secondary Button</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Button Text</label>
                      <input
                        type="text"
                        value={settings.servicesCtaButton2Text}
                        onChange={(e) => setSettings({ ...settings, servicesCtaButton2Text: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="CONTACT US"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Link To</label>
                      <select
                        value={settings.servicesCtaButton2Page}
                        onChange={(e) => setSettings({ ...settings, servicesCtaButton2Page: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflow Page Settings */}
          {activeTab === 'workflow' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Hero Section</h2>
                  <p className="text-sm text-black/60 mt-1">The banner at the top of the Workflow page</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO TITLE</label>
                    <input
                      type="text"
                      value={settings.workflowHeroTitle}
                      onChange={(e) => setSettings({ ...settings, workflowHeroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="HOW WE WORK"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO PARAGRAPH</label>
                    <textarea
                      value={settings.workflowHeroParagraph}
                      onChange={(e) => setSettings({ ...settings, workflowHeroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="A seamless process designed to bring your vision to life"
                    />
                  </div>
                </div>
              </div>

              {/* Introduction Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Introduction Section</h2>
                  <p className="text-sm text-black/60 mt-1">Content displayed below the hero</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.workflowIntroTitle}
                      onChange={(e) => setSettings({ ...settings, workflowIntroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Our Proven Process"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH</label>
                    <textarea
                      value={settings.workflowIntroParagraph}
                      onChange={(e) => setSettings({ ...settings, workflowIntroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="At TRQ, we believe that exceptional design requires..."
                    />
                  </div>
                </div>
              </div>

              {/* Process Steps */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Process Steps</h2>
                  <p className="text-sm text-black/60 mt-1">Configure the 5 workflow steps (separate features with | character)</p>
                </div>

                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const IconPreview = getIconComponent((settings as any)[`workflowStep${num}Icon`]);
                    return (
                      <div key={num} className="bg-neutral-50 p-6 rounded space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-black flex items-center justify-center rounded">
                            <IconPreview className="text-white" size={24} />
                          </div>
                          <span className="text-lg font-medium">Step {num}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1 text-xs text-black/60">Title</label>
                            <input
                              type="text"
                              value={(settings as any)[`workflowStep${num}Title`]}
                              onChange={(e) => setSettings({ ...settings, [`workflowStep${num}Title`]: e.target.value })}
                              className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                              placeholder="Step title"
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-xs text-black/60">Icon</label>
                            <div className="grid grid-cols-8 gap-1 p-2 border bg-white max-h-24 overflow-y-auto rounded">
                              {availableIcons.map((iconName) => {
                                const Icon = getIconComponent(iconName);
                                return (
                                  <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setSettings({ ...settings, [`workflowStep${num}Icon`]: iconName })}
                                    className={`p-1.5 flex items-center justify-center rounded transition-colors ${
                                      (settings as any)[`workflowStep${num}Icon`] === iconName
                                        ? 'bg-black text-white'
                                        : 'hover:bg-black/10'
                                    }`}
                                    title={iconName}
                                  >
                                    <Icon size={16} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Description</label>
                          <input
                            type="text"
                            value={(settings as any)[`workflowStep${num}Description`]}
                            onChange={(e) => setSettings({ ...settings, [`workflowStep${num}Description`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="Step description"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Features (separate with | character)</label>
                          <textarea
                            value={(settings as any)[`workflowStep${num}Features`]}
                            onChange={(e) => setSettings({ ...settings, [`workflowStep${num}Features`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                            rows={4}
                            placeholder="Feature 1|Feature 2|Feature 3..."
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Why Our Process Works Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Why Our Process Works Section</h2>
                  <p className="text-sm text-black/60 mt-1">The 3 process benefits displayed on the Workflow page</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.workflowWhyTitle}
                      onChange={(e) => setSettings({ ...settings, workflowWhyTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Why Our Process Works"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION DESCRIPTION</label>
                    <input
                      type="text"
                      value={settings.workflowWhyDescription}
                      onChange={(e) => setSettings({ ...settings, workflowWhyDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Built on years of experience..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black/10 flex items-center justify-center rounded text-sm font-medium">
                          {num}
                        </div>
                        <span className="font-medium">Benefit {num}</span>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Title</label>
                        <input
                          type="text"
                          value={(settings as any)[`workflowWhy${num}Title`]}
                          onChange={(e) => setSettings({ ...settings, [`workflowWhy${num}Title`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="Benefit title"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Description</label>
                        <textarea
                          value={(settings as any)[`workflowWhy${num}Description`]}
                          onChange={(e) => setSettings({ ...settings, [`workflowWhy${num}Description`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none resize-none text-sm"
                          rows={3}
                          placeholder="Benefit description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Timeline Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Project Timeline Section</h2>
                  <p className="text-sm text-black/60 mt-1">Information about project timelines</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.workflowTimelineTitle}
                      onChange={(e) => setSettings({ ...settings, workflowTimelineTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Project Timeline"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 1</label>
                    <textarea
                      value={settings.workflowTimelineParagraph1}
                      onChange={(e) => setSettings({ ...settings, workflowTimelineParagraph1: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={4}
                      placeholder="While every project is unique..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH 2</label>
                    <textarea
                      value={settings.workflowTimelineParagraph2}
                      onChange={(e) => setSettings({ ...settings, workflowTimelineParagraph2: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="During our initial consultation..."
                    />
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Call to Action Section</h2>
                  <p className="text-sm text-black/60 mt-1">The CTA at the bottom of the Workflow page</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.workflowCtaTitle}
                      onChange={(e) => setSettings({ ...settings, workflowCtaTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Ready to Begin Your Journey?"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                    <textarea
                      value={settings.workflowCtaDescription}
                      onChange={(e) => setSettings({ ...settings, workflowCtaDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Let's start with a consultation..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">Primary Button</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Button Text</label>
                      <input
                        type="text"
                        value={settings.workflowCtaButton1Text}
                        onChange={(e) => setSettings({ ...settings, workflowCtaButton1Text: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="REQUEST PRICING"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Link To</label>
                      <select
                        value={settings.workflowCtaButton1Page}
                        onChange={(e) => setSettings({ ...settings, workflowCtaButton1Page: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">Secondary Button</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Button Text</label>
                      <input
                        type="text"
                        value={settings.workflowCtaButton2Text}
                        onChange={(e) => setSettings({ ...settings, workflowCtaButton2Text: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="SCHEDULE CONSULTATION"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Link To</label>
                      <select
                        value={settings.workflowCtaButton2Page}
                        onChange={(e) => setSettings({ ...settings, workflowCtaButton2Page: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Page Settings */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Hero Section</h2>
                  <p className="text-sm text-black/60 mt-1">The banner at the top of the Portfolio page</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO TITLE</label>
                    <input
                      type="text"
                      value={settings.portfolioHeroTitle}
                      onChange={(e) => setSettings({ ...settings, portfolioHeroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="OUR PORTFOLIO"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO PARAGRAPH</label>
                    <textarea
                      value={settings.portfolioHeroParagraph}
                      onChange={(e) => setSettings({ ...settings, portfolioHeroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Explore our collection of exceptional design projects"
                    />
                  </div>
                </div>
              </div>

              {/* Introduction Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Introduction Section</h2>
                  <p className="text-sm text-black/60 mt-1">Text displayed below the hero</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm tracking-wider">PARAGRAPH</label>
                  <textarea
                    value={settings.portfolioIntroParagraph}
                    onChange={(e) => setSettings({ ...settings, portfolioIntroParagraph: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                    rows={4}
                    placeholder="Each project represents our commitment to excellence..."
                  />
                </div>
              </div>

              {/* Categories Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Filter Categories</h2>
                  <p className="text-sm text-black/60 mt-1">Manage filter buttons for the portfolio. Drag to reorder. The ID should match project categories.</p>
                </div>

                {(() => {
                  // Parse categories from JSON
                  let categories: { id: string; label: string }[] = [];
                  try {
                    categories = JSON.parse(settings.portfolioCategories || '[]');
                  } catch {
                    categories = [];
                  }

                  const updateCategories = (newCategories: { id: string; label: string }[]) => {
                    setSettings({ ...settings, portfolioCategories: JSON.stringify(newCategories) });
                  };

                  const addCategory = () => {
                    updateCategories([...categories, { id: '', label: '' }]);
                  };

                  const removeCategory = (index: number) => {
                    const newCategories = categories.filter((_, i) => i !== index);
                    updateCategories(newCategories);
                  };

                  const updateCategory = (index: number, field: 'id' | 'label', value: string) => {
                    const newCategories = [...categories];
                    newCategories[index] = { ...newCategories[index], [field]: value };
                    updateCategories(newCategories);
                  };

                  const moveCategory = (index: number, direction: 'up' | 'down') => {
                    if (direction === 'up' && index === 0) return;
                    if (direction === 'down' && index === categories.length - 1) return;
                    
                    const newCategories = [...categories];
                    const newIndex = direction === 'up' ? index - 1 : index + 1;
                    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
                    updateCategories(newCategories);
                  };

                  return (
                    <div className="space-y-3">
                      {categories.map((cat, index) => (
                        <div key={index} className="flex items-center gap-2 bg-neutral-50 p-4 rounded">
                          {/* Order Controls */}
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => moveCategory(index, 'up')}
                              disabled={index === 0}
                              className={`p-1 rounded transition-colors ${index === 0 ? 'text-black/20 cursor-not-allowed' : 'text-black/40 hover:text-black hover:bg-black/10'}`}
                              title="Move up"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCategory(index, 'down')}
                              disabled={index === categories.length - 1}
                              className={`p-1 rounded transition-colors ${index === categories.length - 1 ? 'text-black/20 cursor-not-allowed' : 'text-black/40 hover:text-black hover:bg-black/10'}`}
                              title="Move down"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                          </div>
                          
                          {/* Order Number */}
                          <div className="w-8 h-8 bg-black/10 flex items-center justify-center rounded text-sm font-medium text-black/60">
                            {index + 1}
                          </div>
                          
                          {/* Fields */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-1 text-xs text-black/60">ID (for filtering)</label>
                              <input
                                type="text"
                                value={cat.id}
                                onChange={(e) => updateCategory(index, 'id', e.target.value)}
                                className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                                placeholder="e.g. residential"
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-xs text-black/60">Display Label</label>
                              <input
                                type="text"
                                value={cat.label}
                                onChange={(e) => updateCategory(index, 'label', e.target.value)}
                                className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                                placeholder="e.g. Residential"
                              />
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove category"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addCategory}
                        className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-black/20 hover:border-black/40 rounded w-full justify-center text-black/60 hover:text-black transition-colors"
                      >
                        <Plus size={20} />
                        <span>Add Category</span>
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Stats Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Stats Banner Section</h2>
                  <p className="text-sm text-black/60 mt-1">The 4 statistics displayed on the Portfolio page</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                      <span className="font-medium">Stat {num}</span>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Value</label>
                        <input
                          type="text"
                          value={(settings as any)[`portfolioStat${num}Value`]}
                          onChange={(e) => setSettings({ ...settings, [`portfolioStat${num}Value`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="150+"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Label</label>
                        <input
                          type="text"
                          value={(settings as any)[`portfolioStat${num}Label`]}
                          onChange={(e) => setSettings({ ...settings, [`portfolioStat${num}Label`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="PROJECTS COMPLETED"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Call to Action Section</h2>
                  <p className="text-sm text-black/60 mt-1">The CTA at the bottom of the Portfolio page</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.portfolioCtaTitle}
                      onChange={(e) => setSettings({ ...settings, portfolioCtaTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Let's Create Your Project"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                    <textarea
                      value={settings.portfolioCtaDescription}
                      onChange={(e) => setSettings({ ...settings, portfolioCtaDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Ready to start your own design journey?..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">Primary Button</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Button Text</label>
                      <input
                        type="text"
                        value={settings.portfolioCtaButton1Text}
                        onChange={(e) => setSettings({ ...settings, portfolioCtaButton1Text: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="REQUEST PRICING"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Link To</label>
                      <select
                        value={settings.portfolioCtaButton1Page}
                        onChange={(e) => setSettings({ ...settings, portfolioCtaButton1Page: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded space-y-3">
                    <p className="text-sm font-medium">Secondary Button</p>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Button Text</label>
                      <input
                        type="text"
                        value={settings.portfolioCtaButton2Text}
                        onChange={(e) => setSettings({ ...settings, portfolioCtaButton2Text: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="CONTACT US"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-black/60">Link To</label>
                      <select
                        value={settings.portfolioCtaButton2Page}
                        onChange={(e) => setSettings({ ...settings, portfolioCtaButton2Page: e.target.value })}
                        className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Page Settings */}
          {activeTab === 'contact' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Hero Section</h2>
                  <p className="text-sm text-black/60 mt-1">The banner at the top of the Contact page</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO TITLE</label>
                    <input
                      type="text"
                      value={settings.contactHeroTitle}
                      onChange={(e) => setSettings({ ...settings, contactHeroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="GET IN TOUCH"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO PARAGRAPH</label>
                    <textarea
                      value={settings.contactHeroParagraph}
                      onChange={(e) => setSettings({ ...settings, contactHeroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Let's discuss your project..."
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Cards */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Contact Information Cards</h2>
                  <p className="text-sm text-black/60 mt-1">The 4 contact info cards displayed on the Contact page</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => {
                    const IconPreview = getIconComponent((settings as any)[`contactInfo${num}Icon`]);
                    const isVisible = (settings as any)[`contactInfo${num}Show`] !== 'false';
                    return (
                      <div key={num} className={`bg-neutral-50 p-4 rounded space-y-3 ${!isVisible ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black flex items-center justify-center rounded">
                              <IconPreview className="text-white" size={20} />
                            </div>
                            <span className="font-medium">Contact Card {num}</span>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-black/60">Show</span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isVisible}
                                onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Show`]: e.target.checked ? 'true' : 'false' })}
                                className="sr-only"
                              />
                              <div className={`w-10 h-5 rounded-full transition-colors ${isVisible ? 'bg-black' : 'bg-black/20'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform mt-0.5 ${isVisible ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                              </div>
                            </div>
                          </label>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Icon</label>
                          <div className="grid grid-cols-8 gap-1 p-2 border bg-white max-h-20 overflow-y-auto rounded">
                            {availableIcons.map((iconName) => {
                              const Icon = getIconComponent(iconName);
                              return (
                                <button
                                  key={iconName}
                                  type="button"
                                  onClick={() => setSettings({ ...settings, [`contactInfo${num}Icon`]: iconName })}
                                  className={`p-1.5 flex items-center justify-center rounded transition-colors ${
                                    (settings as any)[`contactInfo${num}Icon`] === iconName
                                      ? 'bg-black text-white'
                                      : 'hover:bg-black/10'
                                  }`}
                                  title={iconName}
                                >
                                  <Icon size={14} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Title</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactInfo${num}Title`]}
                            onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Title`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="Card title"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Detail Line 1</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactInfo${num}Detail1`]}
                            onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Detail1`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                            placeholder="e.g. TRQ Design Studio"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Detail Line 2</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactInfo${num}Detail2`]}
                            onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Detail2`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                            placeholder="e.g. King Fahd Road"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Detail Line 3 (optional)</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactInfo${num}Detail3`]}
                            onChange={(e) => setSettings({ ...settings, [`contactInfo${num}Detail3`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none text-sm"
                            placeholder="e.g. Riyadh, Saudi Arabia"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Contact Form Section</h2>
                  <p className="text-sm text-black/60 mt-1">Form title and description</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">FORM TITLE</label>
                    <input
                      type="text"
                      value={settings.contactFormTitle}
                      onChange={(e) => setSettings({ ...settings, contactFormTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Send Us a Message"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">FORM DESCRIPTION</label>
                    <textarea
                      value={settings.contactFormDescription}
                      onChange={(e) => setSettings({ ...settings, contactFormDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Fill out the form below..."
                    />
                  </div>
                </div>
              </div>

              {/* Quick Contact Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Quick Contact Section</h2>
                  <p className="text-sm text-black/60 mt-1">Add up to 4 quick contact options (leave empty to hide)</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.contactQuickTitle}
                      onChange={(e) => setSettings({ ...settings, contactQuickTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Quick Contact"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => {
                    const IconPreview = getIconComponent((settings as any)[`contactQuick${num}Icon`] || 'Circle');
                    return (
                      <div key={num} className="bg-neutral-50 p-4 rounded space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 flex items-center justify-center rounded ${
                            (settings as any)[`contactQuick${num}Color`] === 'green' ? 'bg-green-500' : 'bg-black'
                          }`}>
                            <IconPreview className="text-white" size={20} />
                          </div>
                          <span className="font-medium">Quick Contact {num}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 text-xs text-black/60">Icon</label>
                            <div className="grid grid-cols-6 gap-1 p-2 border bg-white max-h-20 overflow-y-auto rounded">
                              {availableIcons.map((iconName) => {
                                const Icon = getIconComponent(iconName);
                                return (
                                  <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setSettings({ ...settings, [`contactQuick${num}Icon`]: iconName })}
                                    className={`p-1.5 flex items-center justify-center rounded transition-colors ${
                                      (settings as any)[`contactQuick${num}Icon`] === iconName
                                        ? 'bg-black text-white'
                                        : 'hover:bg-black/10'
                                    }`}
                                    title={iconName}
                                  >
                                    <Icon size={14} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <label className="block mb-1 text-xs text-black/60">Button Color</label>
                            <select
                              value={(settings as any)[`contactQuick${num}Color`]}
                              onChange={(e) => setSettings({ ...settings, [`contactQuick${num}Color`]: e.target.value })}
                              className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none bg-white"
                            >
                              <option value="black">Black</option>
                              <option value="green">Green (WhatsApp)</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Title</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactQuick${num}Title`]}
                            onChange={(e) => setSettings({ ...settings, [`contactQuick${num}Title`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="e.g. WhatsApp, Email, Phone"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Description</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactQuick${num}Description`]}
                            onChange={(e) => setSettings({ ...settings, [`contactQuick${num}Description`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="e.g. Fastest way to reach us"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Button Text</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactQuick${num}ButtonText`]}
                            onChange={(e) => setSettings({ ...settings, [`contactQuick${num}ButtonText`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="e.g. CHAT ON WHATSAPP"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-xs text-black/60">Link URL</label>
                          <input
                            type="text"
                            value={(settings as any)[`contactQuick${num}Link`]}
                            onChange={(e) => setSettings({ ...settings, [`contactQuick${num}Link`]: e.target.value })}
                            className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                            placeholder="e.g. https://wa.me/966... or mailto:..."
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Office Hours Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Office Hours Section</h2>
                  <p className="text-sm text-black/60 mt-1">Set your business hours for each day</p>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded">
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Day(s)</label>
                        <input
                          type="text"
                          value={(settings as any)[`contactOfficeHoursDay${num}`]}
                          onChange={(e) => setSettings({ ...settings, [`contactOfficeHoursDay${num}`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="e.g. Monday - Thursday"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-black/60">Hours</label>
                        <input
                          type="text"
                          value={(settings as any)[`contactOfficeHoursTime${num}`]}
                          onChange={(e) => setSettings({ ...settings, [`contactOfficeHoursTime${num}`]: e.target.value })}
                          className="w-full px-3 py-2 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="e.g. 9:00 AM - 6:00 PM or Closed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visit Studio Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-medium">Visit Our Studio Section</h2>
                      <p className="text-sm text-black/60 mt-1">Studio visit information</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <span className="text-sm text-black/60">Show Section</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.contactStudioShow === 'true'}
                          onChange={(e) => setSettings({ ...settings, contactStudioShow: e.target.checked ? 'true' : 'false' })}
                          className="sr-only"
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${settings.contactStudioShow === 'true' ? 'bg-black' : 'bg-black/20'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${settings.contactStudioShow === 'true' ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.contactVisitTitle}
                      onChange={(e) => setSettings({ ...settings, contactVisitTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Visit Our Studio"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                    <textarea
                      value={settings.contactVisitDescription}
                      onChange={(e) => setSettings({ ...settings, contactVisitDescription: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Schedule an appointment..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">BUTTON TEXT</label>
                    <input
                      type="text"
                      value={settings.contactVisitButtonText}
                      onChange={(e) => setSettings({ ...settings, contactVisitButtonText: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="SCHEDULE A VISIT"
                    />
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Map Section</h2>
                  <p className="text-sm text-black/60 mt-1">Map title, image, and Google Maps link</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.contactMapTitle}
                      onChange={(e) => setSettings({ ...settings, contactMapTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Find Us"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">ADDRESS TEXT</label>
                    <input
                      type="text"
                      value={settings.contactMapAddress}
                      onChange={(e) => setSettings({ ...settings, contactMapAddress: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="TRQ Design Studio, King Fahd Road, Riyadh"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">MAP IMAGE URL (optional)</label>
                    <input
                      type="url"
                      value={settings.contactMapImage}
                      onChange={(e) => setSettings({ ...settings, contactMapImage: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="https://... (leave empty for default placeholder)"
                    />
                    {settings.contactMapImage && (
                      <div className="mt-3 w-64 h-40 bg-neutral-100 overflow-hidden rounded">
                        <img src={settings.contactMapImage} alt="Map Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">GOOGLE MAPS LINK</label>
                    <input
                      type="url"
                      value={settings.contactMapLink}
                      onChange={(e) => setSettings({ ...settings, contactMapLink: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="https://maps.google.com/?q=Your+Address"
                    />
                    <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
                      <p className="font-medium text-blue-800 mb-2">How to get Google Maps link:</p>
                      <ol className="list-decimal list-inside text-blue-700 space-y-1">
                        <li>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="underline">maps.google.com</a></li>
                        <li>Search for your location</li>
                        <li>Click "Share" button</li>
                        <li>Click "Copy link"</li>
                        <li>Paste the link here</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Page Settings */}
          {activeTab === 'pricing' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Hero Section</h2>
                  <p className="text-sm text-black/60 mt-1">The main banner at the top of the pricing page</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO TITLE</label>
                    <input
                      type="text"
                      value={settings.pricingHeroTitle}
                      onChange={(e) => setSettings({ ...settings, pricingHeroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="REQUEST PRICING"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO PARAGRAPH</label>
                    <textarea
                      value={settings.pricingHeroParagraph}
                      onChange={(e) => setSettings({ ...settings, pricingHeroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Get a custom quote tailored to your project"
                    />
                  </div>
                </div>
              </div>

              {/* Introduction Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Introduction Section</h2>
                  <p className="text-sm text-black/60 mt-1">Introduction text below the hero</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">TITLE</label>
                    <input
                      type="text"
                      value={settings.pricingIntroTitle}
                      onChange={(e) => setSettings({ ...settings, pricingIntroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Tell Us About Your Project"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PARAGRAPH</label>
                    <textarea
                      value={settings.pricingIntroParagraph}
                      onChange={(e) => setSettings({ ...settings, pricingIntroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="Please provide as much detail as possible..."
                    />
                  </div>
                </div>
              </div>

              {/* Form Section Titles */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Form Section Titles</h2>
                  <p className="text-sm text-black/60 mt-1">Titles for each form section</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">CONTACT INFO TITLE</label>
                    <input
                      type="text"
                      value={settings.pricingFormContactTitle}
                      onChange={(e) => setSettings({ ...settings, pricingFormContactTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Contact Information"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PROJECT DETAILS TITLE</label>
                    <input
                      type="text"
                      value={settings.pricingFormProjectTitle}
                      onChange={(e) => setSettings({ ...settings, pricingFormProjectTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Project Details"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">CONTACT METHOD TITLE</label>
                    <input
                      type="text"
                      value={settings.pricingFormMethodTitle}
                      onChange={(e) => setSettings({ ...settings, pricingFormMethodTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="How Should We Contact You?"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Contact Method Options</h2>
                  <p className="text-sm text-black/60 mt-1">Labels for contact method radio buttons</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">EMAIL OPTION LABEL</label>
                      <input
                        type="text"
                        value={settings.pricingMethodEmail}
                        onChange={(e) => setSettings({ ...settings, pricingMethodEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">EMAIL DESCRIPTION</label>
                      <input
                        type="text"
                        value={settings.pricingMethodEmailDesc}
                        onChange={(e) => setSettings({ ...settings, pricingMethodEmailDesc: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="We'll send you a detailed proposal"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">WHATSAPP OPTION LABEL</label>
                      <input
                        type="text"
                        value={settings.pricingMethodWhatsapp}
                        onChange={(e) => setSettings({ ...settings, pricingMethodWhatsapp: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="WhatsApp"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">WHATSAPP DESCRIPTION</label>
                      <input
                        type="text"
                        value={settings.pricingMethodWhatsappDesc}
                        onChange={(e) => setSettings({ ...settings, pricingMethodWhatsappDesc: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Quick response and easy communication"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Submit Button</h2>
                  <p className="text-sm text-black/60 mt-1">Submit button text and note</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">BUTTON TEXT</label>
                    <input
                      type="text"
                      value={settings.pricingSubmitText}
                      onChange={(e) => setSettings({ ...settings, pricingSubmitText: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="SUBMIT REQUEST"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">NOTE BELOW BUTTON</label>
                    <input
                      type="text"
                      value={settings.pricingSubmitNote}
                      onChange={(e) => setSettings({ ...settings, pricingSubmitNote: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="We typically respond within 24 hours"
                    />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Success Message</h2>
                  <p className="text-sm text-black/60 mt-1">Message shown after form submission</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SUCCESS TITLE</label>
                    <input
                      type="text"
                      value={settings.pricingSuccessTitle}
                      onChange={(e) => setSettings({ ...settings, pricingSuccessTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Request Received!"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SUCCESS PARAGRAPH</label>
                    <textarea
                      value={settings.pricingSuccessParagraph}
                      onChange={(e) => setSettings({ ...settings, pricingSuccessParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Thank you for your interest..."
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">NEXT STEPS TITLE</label>
                    <input
                      type="text"
                      value={settings.pricingSuccessNextTitle}
                      onChange={(e) => setSettings({ ...settings, pricingSuccessNextTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="What Happens Next?"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block mb-2 text-sm tracking-wider">STEP 1 TITLE</label>
                      <input
                        type="text"
                        value={settings.pricingSuccessStep1Title}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessStep1Title: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Initial Review"
                      />
                      <textarea
                        value={settings.pricingSuccessStep1Desc}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessStep1Desc: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                        rows={2}
                        placeholder="Description..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block mb-2 text-sm tracking-wider">STEP 2 TITLE</label>
                      <input
                        type="text"
                        value={settings.pricingSuccessStep2Title}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessStep2Title: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Follow-up Contact"
                      />
                      <textarea
                        value={settings.pricingSuccessStep2Desc}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessStep2Desc: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                        rows={2}
                        placeholder="Description..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block mb-2 text-sm tracking-wider">STEP 3 TITLE</label>
                      <input
                        type="text"
                        value={settings.pricingSuccessStep3Title}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessStep3Title: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Custom Proposal"
                      />
                      <textarea
                        value={settings.pricingSuccessStep3Desc}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessStep3Desc: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                        rows={2}
                        placeholder="Description..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Quick Contact */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Success Page Quick Contact</h2>
                  <p className="text-sm text-black/60 mt-1">Contact buttons shown on success page</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">WHATSAPP BUTTON TEXT</label>
                      <input
                        type="text"
                        value={settings.pricingSuccessWhatsappText}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessWhatsappText: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="CHAT ON WHATSAPP"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">WHATSAPP LINK</label>
                      <input
                        type="url"
                        value={settings.pricingSuccessWhatsappLink}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessWhatsappLink: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="https://wa.me/966XXXXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">EMAIL BUTTON TEXT</label>
                      <input
                        type="text"
                        value={settings.pricingSuccessEmailText}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessEmailText: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="SEND EMAIL"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">EMAIL LINK</label>
                      <input
                        type="text"
                        value={settings.pricingSuccessEmailLink}
                        onChange={(e) => setSettings({ ...settings, pricingSuccessEmailLink: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="mailto:info@trq.design"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Expect Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">What to Expect Section</h2>
                  <p className="text-sm text-black/60 mt-1">Bottom section explaining the pricing process</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                    <input
                      type="text"
                      value={settings.pricingExpectTitle}
                      onChange={(e) => setSettings({ ...settings, pricingExpectTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="What to Expect"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">SECTION PARAGRAPH</label>
                    <textarea
                      value={settings.pricingExpectParagraph}
                      onChange={(e) => setSettings({ ...settings, pricingExpectParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Our pricing process is transparent..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 p-4 bg-neutral-50 rounded">
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">STEP NUMBER</label>
                        <input
                          type="text"
                          value={settings.pricingExpectStep1Number}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep1Number: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="01"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">TITLE</label>
                        <input
                          type="text"
                          value={settings.pricingExpectStep1Title}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep1Title: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="Detailed Review"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                        <textarea
                          value={settings.pricingExpectStep1Desc}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep1Desc: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                          rows={2}
                          placeholder="Description..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2 p-4 bg-neutral-50 rounded">
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">STEP NUMBER</label>
                        <input
                          type="text"
                          value={settings.pricingExpectStep2Number}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep2Number: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="02"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">TITLE</label>
                        <input
                          type="text"
                          value={settings.pricingExpectStep2Title}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep2Title: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="Custom Proposal"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                        <textarea
                          value={settings.pricingExpectStep2Desc}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep2Desc: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                          rows={2}
                          placeholder="Description..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2 p-4 bg-neutral-50 rounded">
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">STEP NUMBER</label>
                        <input
                          type="text"
                          value={settings.pricingExpectStep3Number}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep3Number: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="03"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">TITLE</label>
                        <input
                          type="text"
                          value={settings.pricingExpectStep3Title}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep3Title: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                          placeholder="Consultation"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm tracking-wider">DESCRIPTION</label>
                        <textarea
                          value={settings.pricingExpectStep3Desc}
                          onChange={(e) => setSettings({ ...settings, pricingExpectStep3Desc: e.target.value })}
                          className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                          rows={2}
                          placeholder="Description..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Page Settings */}
          {activeTab === 'blog' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div>
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Hero Section</h2>
                  <p className="text-sm text-black/60 mt-1">Main banner at the top of the blog page</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO TITLE</label>
                    <input
                      type="text"
                      value={settings.blogHeroTitle}
                      onChange={(e) => setSettings({ ...settings, blogHeroTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="DESIGN INSIGHTS"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">HERO PARAGRAPH</label>
                    <textarea
                      value={settings.blogHeroParagraph}
                      onChange={(e) => setSettings({ ...settings, blogHeroParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Expert perspectives on luxury interior design..."
                    />
                  </div>
                </div>
              </div>

              {/* Featured Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Featured Article Section</h2>
                  <p className="text-sm text-black/60 mt-1">Labels for the featured article area</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">FEATURED LABEL</label>
                    <input
                      type="text"
                      value={settings.blogFeaturedLabel}
                      onChange={(e) => setSettings({ ...settings, blogFeaturedLabel: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="FEATURED ARTICLE"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">READ ARTICLE TEXT</label>
                    <input
                      type="text"
                      value={settings.blogReadArticleText}
                      onChange={(e) => setSettings({ ...settings, blogReadArticleText: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="READ ARTICLE"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Category Labels</h2>
                  <p className="text-sm text-black/60 mt-1">Names for the category filter buttons</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">ALL ARTICLES</label>
                    <input
                      type="text"
                      value={settings.blogCategoryAll}
                      onChange={(e) => setSettings({ ...settings, blogCategoryAll: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="All Articles"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">DESIGN TIPS</label>
                    <input
                      type="text"
                      value={settings.blogCategoryDesignTips}
                      onChange={(e) => setSettings({ ...settings, blogCategoryDesignTips: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Design Tips"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">TRENDS</label>
                    <input
                      type="text"
                      value={settings.blogCategoryTrends}
                      onChange={(e) => setSettings({ ...settings, blogCategoryTrends: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Trends"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">PROJECTS</label>
                    <input
                      type="text"
                      value={settings.blogCategoryProjects}
                      onChange={(e) => setSettings({ ...settings, blogCategoryProjects: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Projects"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">INSIGHTS</label>
                    <input
                      type="text"
                      value={settings.blogCategoryInsights}
                      onChange={(e) => setSettings({ ...settings, blogCategoryInsights: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Insights"
                    />
                  </div>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Newsletter Section</h2>
                  <p className="text-sm text-black/60 mt-1">Email subscription area content</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">NEWSLETTER TITLE</label>
                    <input
                      type="text"
                      value={settings.blogNewsletterTitle}
                      onChange={(e) => setSettings({ ...settings, blogNewsletterTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Stay Inspired"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">NEWSLETTER PARAGRAPH</label>
                    <textarea
                      value={settings.blogNewsletterParagraph}
                      onChange={(e) => setSettings({ ...settings, blogNewsletterParagraph: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={2}
                      placeholder="Subscribe to receive our latest articles..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">INPUT PLACEHOLDER</label>
                      <input
                        type="text"
                        value={settings.blogNewsletterPlaceholder}
                        onChange={(e) => setSettings({ ...settings, blogNewsletterPlaceholder: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Your email address"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">BUTTON TEXT</label>
                      <input
                        type="text"
                        value={settings.blogNewsletterButton}
                        onChange={(e) => setSettings({ ...settings, blogNewsletterButton: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="SUBSCRIBE"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">DISCLAIMER TEXT</label>
                      <input
                        type="text"
                        value={settings.blogNewsletterDisclaimer}
                        onChange={(e) => setSettings({ ...settings, blogNewsletterDisclaimer: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="We respect your privacy..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Explore Section */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Explore by Category Section</h2>
                  <p className="text-sm text-black/60 mt-1">Bottom section with category cards</p>
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">SECTION TITLE</label>
                  <input
                    type="text"
                    value={settings.blogExploreTitle}
                    onChange={(e) => setSettings({ ...settings, blogExploreTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="Explore by Category"
                  />
                </div>
              </div>

              {/* Article Page Settings */}
              <div className="border-t pt-8">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-medium">Article Page Settings</h2>
                  <p className="text-sm text-black/60 mt-1">Labels and content for individual article pages</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">BACK BUTTON TEXT</label>
                      <input
                        type="text"
                        value={settings.blogArticleBackText}
                        onChange={(e) => setSettings({ ...settings, blogArticleBackText: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="BACK TO BLOG"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">SHARE TEXT</label>
                      <input
                        type="text"
                        value={settings.blogArticleShareText}
                        onChange={(e) => setSettings({ ...settings, blogArticleShareText: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="SHARE THIS ARTICLE"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">TAGS LABEL</label>
                      <input
                        type="text"
                        value={settings.blogArticleTagsLabel}
                        onChange={(e) => setSettings({ ...settings, blogArticleTagsLabel: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="TAGS"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm tracking-wider">RELATED ARTICLES TITLE</label>
                      <input
                        type="text"
                        value={settings.blogArticleRelatedTitle}
                        onChange={(e) => setSettings({ ...settings, blogArticleRelatedTitle: e.target.value })}
                        className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="Related Articles"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">DEFAULT AUTHOR ROLE</label>
                    <input
                      type="text"
                      value={settings.blogArticleAuthorRole}
                      onChange={(e) => setSettings({ ...settings, blogArticleAuthorRole: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="Senior Design Writer"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm tracking-wider">DEFAULT AUTHOR BIO</label>
                    <textarea
                      value={settings.blogArticleAuthorBio}
                      onChange={(e) => setSettings({ ...settings, blogArticleAuthorBio: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                      rows={3}
                      placeholder="A passionate writer exploring the intersection of design..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
