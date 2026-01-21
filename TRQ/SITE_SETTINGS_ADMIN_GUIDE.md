# Site Settings Admin Guide
## Complete Documentation for Admin Panel Sidebar

---

## 📋 Overview

The **Site Settings** section in the admin panel is your central hub for customizing all website content without touching code. It controls 11 different pages and sections with 200+ editable settings.

**Key Features:**
- ✅ Edit all page content from one place
- ✅ Real-time preview on frontend
- ✅ Organize by page sections with tabs
- ✅ Manage featured projects, categories, and more
- ✅ One-click save for all changes

---

## 🏠 HOME PAGE SETTINGS

The home page has 4 main sections you can customize:

### 1️⃣ Introduction Section
**What it controls:** The hero/intro area at the top of the home page

**Editable Fields:**
- **Title** - Main headline (e.g., "Creating Timeless Design Solutions")
- **Text 1** - First paragraph about your studio
- **Text 2** - Second paragraph about your approach
- **Image** - Hero image URL
- **Link Text** - Button text (e.g., "LEARN MORE ABOUT TRQ")
- **Link Page** - Where the button goes (About, Services, etc.)

**Best Practices:**
- Keep title under 60 characters for mobile
- Use compelling, benefit-focused copy
- Ensure image is high quality (1920x1080 recommended)
- Link should direct to relevant page

---

### 2️⃣ Featured Projects Section
**What it controls:** The "Featured Projects" showcase on home page

**Editable Fields:**
- **Title** - Section heading
- **Description** - Subtitle/description text
- **Featured Projects** - Select which projects to display (up to 5 recommended)

**How to Use:**
1. Click "Add Project" button
2. Select published projects from dropdown
3. Drag to reorder (if needed)
4. Click X to remove a project
5. Save changes

**Best Practices:**
- Show your best 3-5 projects
- Mix different project types (residential, commercial, etc.)
- Update quarterly to keep content fresh

---

### 3️⃣ How We Work Section
**What it controls:** The 5-step workflow process on home page

**Editable Fields:**
- **Title** - Section heading
- **Description** - Intro text
- **Step 1-5 Title** - Each step's title (Discovery, Concept, etc.)
- **Step 1-5 Description** - Brief description of each step
- **Link Text** - Button text
- **Link Page** - Where button directs

**Best Practices:**
- Keep step titles short (2-3 words)
- Descriptions should be 1-2 sentences
- Maintain consistent tone across all steps
- Link should go to Workflow page for more details

---

### 4️⃣ CTA Section (Call-to-Action)
**What it controls:** The bottom section encouraging visitors to take action

**Editable Fields:**
- **Title** - Main CTA headline
- **Description** - Supporting text
- **Button 1 Text** - First button (usually "REQUEST PRICING")
- **Button 1 Page** - Where it links
- **Button 2 Text** - Second button (usually "CONTACT US")
- **Button 2 Page** - Where it links

**Best Practices:**
- Make buttons action-oriented
- Offer clear choices (pricing vs. contact)
- Keep description concise (2-3 sentences)

---

## 📖 ABOUT PAGE SETTINGS

The About page has multiple subsections:

### Hero Section
- **Title** - Page heading (e.g., "ABOUT TRQ")
- **Paragraph** - Tagline/intro text

### Who We Are Section
- **Title** - Section heading
- **Paragraph 1-3** - Three paragraphs about your studio
- **Image** - Supporting image

**Tips:** Tell your story in 3 parts: history, team, approach

### Vision Section
- **Title** - "Our Vision"
- **Icon** - Choose from available icons
- **Paragraph** - Your vision statement

### Mission Section
- **Title** - "Our Mission"
- **Icon** - Choose from available icons
- **Paragraph** - Your mission statement

### Values Section
- **Title** - "Our Values"
- **Description** - Intro text
- **Value 1-4 Title** - Each value name (Excellence, Innovation, etc.)
- **Value 1-4 Icon** - Icon for each value
- **Value 1-4 Description** - Explanation of each value

### Why Choose TRQ Section
- **Title** - Section heading
- **Description** - Intro text
- **Why 1-4 Title** - Reason titles
- **Why 1-4 Description** - Explanation of each reason

### Impact Statement
- **Title** - Section heading
- **Paragraph 1-2** - Two paragraphs about your impact

---

## 🛠️ SERVICES PAGE SETTINGS

### Hero Section
- **Title** - Page heading
- **Paragraph** - Tagline

### Introduction Section
- **Title** - "Complete Design Solutions"
- **Description** - Overview of your services

### Service Highlights
- **Title** - Section heading
- **Description** - Intro text
- **Highlight 1-3 Title** - Each highlight title
- **Highlight 1-3 Description** - Explanation of each highlight

### CTA Section
- **Title** - Call-to-action heading
- **Description** - Supporting text
- **Button 1 & 2** - Action buttons with links

---

## 🔄 WORKFLOW PAGE SETTINGS

### Hero Section
- **Title** - Page heading
- **Paragraph** - Tagline

### Introduction Section
- **Title** - "Our Proven Process"
- **Paragraph** - Overview of your workflow

### 5 Workflow Steps
Each step has:
- **Title** - Step name
- **Icon** - Visual icon
- **Description** - Brief description
- **Features** - Pipe-separated list of features (|)

**Example Features Format:**
```
Initial consultation|Site visit and assessment|Discussion of goals|Review of references|Scope definition
```

### Why Our Process Works
- **Title** - Section heading
- **Description** - Intro text
- **Why 1-3 Title** - Each reason
- **Why 1-3 Description** - Explanation

### Project Timeline
- **Title** - Section heading
- **Paragraph 1-2** - Timeline information

### CTA Section
- **Title** - Call-to-action
- **Description** - Supporting text
- **Buttons** - Action buttons

---

## 🎨 PORTFOLIO PAGE SETTINGS

### Hero Section
- **Title** - Page heading
- **Paragraph** - Tagline

### Introduction
- **Paragraph** - Overview text

### Categories
**Format:** JSON array (editable)
```json
[
  { "id": "all", "label": "All Projects" },
  { "id": "residential", "label": "Residential" },
  { "id": "commercial", "label": "Commercial" }
]
```

### Statistics
- **Stat 1-4 Value** - Numbers (e.g., "150+")
- **Stat 1-4 Label** - Labels (e.g., "PROJECTS COMPLETED")

### CTA Section
- **Title** - Call-to-action
- **Description** - Supporting text
- **Buttons** - Action buttons

---

## 📞 CONTACT PAGE SETTINGS

### Hero Section
- **Title** - Page heading
- **Paragraph** - Tagline

### Contact Information (4 blocks)
Each block has:
- **Show** - Toggle visibility (true/false)
- **Icon** - Choose icon (MapPin, Phone, Mail, MessageCircle)
- **Title** - Block heading
- **Detail 1-3** - Information lines

**Example:**
- Icon: MapPin
- Title: Visit Us
- Detail 1: TRQ Design Studio
- Detail 2: King Fahd Road
- Detail 3: Riyadh, Saudi Arabia

### Contact Form
- **Title** - Form heading
- **Description** - Intro text
- **Button Text** - Submit button text
- **Button Icon** - Icon for button

### Form Subjects
**Format:** Pipe-separated (value|label)
```
residential|Residential Project|commercial|Commercial Project|booth|Exhibition Booth
```

### Quick Contact (up to 4)
Each has:
- **Icon** - Visual icon
- **Title** - Block title
- **Description** - Description
- **Button Text** - Button label
- **Link** - URL or mailto/wa.me link
- **Color** - Button color (green, black, etc.)

### Office Hours
- **Day 1-4** - Day names
- **Time 1-4** - Hours (e.g., "9:00 AM - 6:00 PM")

### Visit Studio
- **Show** - Toggle visibility
- **Title** - Section heading
- **Description** - Description
- **Button Text** - Button label
- **Button Page** - Link destination

### Map
- **Title** - Section heading
- **Address** - Location text
- **Image** - Map image URL
- **Link** - Google Maps link

---

## 💰 PRICING PAGE SETTINGS

### Hero Section
- **Title** - Page heading
- **Paragraph** - Tagline

### Introduction
- **Title** - "Tell Us About Your Project"
- **Paragraph** - Intro text

### Form Section Titles
- **Contact Title** - "Contact Information"
- **Project Title** - "Project Details"
- **Method Title** - "How Should We Contact You?"

### Project Types
**Format:** JSON array
```json
[
  { "value": "residential-villa", "label": "Residential - Villa" },
  { "value": "commercial-office", "label": "Commercial - Office" }
]
```

### Project Sizes
**Format:** JSON array
```json
[
  { "value": "small", "label": "Small (Under 100 sqm)" },
  { "value": "large", "label": "Large (300-1000 sqm)" }
]
```

### Timeline Options
**Format:** JSON array
```json
[
  { "value": "urgent", "label": "Urgent (Within 1 month)" },
  { "value": "flexible", "label": "Flexible" }
]
```

### Budget Ranges
**Format:** JSON array
```json
[
  { "value": "under-100k", "label": "Under 100,000 SAR" },
  { "value": "1m-plus", "label": "1,000,000+ SAR" }
]
```

### Contact Fields
**Format:** JSON array
```json
[
  { "id": "name", "label": "Full Name", "type": "text", "required": true },
  { "id": "email", "label": "Email", "type": "email", "required": true }
]
```

### Contact Method
- **Email Description** - Why choose email
- **WhatsApp Description** - Why choose WhatsApp

### Submit Button
- **Text** - Button label
- **Note** - Response time note

### Success Message
- **Title** - Success heading
- **Paragraph** - Success message
- **Next Title** - "What Happens Next?"
- **Step 1-3 Title** - Each step
- **Step 1-3 Description** - Step details

### Success Quick Contact
- **WhatsApp Text** - Button text
- **WhatsApp Link** - WhatsApp link
- **Email Text** - Button text
- **Email Link** - Email link

### What to Expect
- **Title** - Section heading
- **Paragraph** - Intro text
- **Step 1-3 Number** - Step numbers (01, 02, 03)
- **Step 1-3 Title** - Step titles
- **Step 1-3 Description** - Step descriptions

---

## 📰 BLOG PAGE SETTINGS

### Hero Section
- **Title** - Page heading
- **Paragraph** - Tagline

### Featured Section
- **Featured Label** - "FEATURED ARTICLE"
- **Read Article Text** - Button text

### Categories
- **Category All** - "All Articles"
- **Category Design Tips** - "Design Tips"
- **Category Trends** - "Trends"
- **Category Projects** - "Projects"
- **Category Insights** - "Insights"

### Newsletter
- **Title** - "Stay Inspired"
- **Paragraph** - Subscription pitch
- **Placeholder** - Email input placeholder
- **Button** - Subscribe button text
- **Disclaimer** - Privacy disclaimer

### Explore Section
- **Title** - "Explore by Category"

### Blog Article Page
- **Back Text** - "BACK TO BLOG"
- **Share Text** - "SHARE THIS ARTICLE"
- **Tags Label** - "TAGS"
- **Related Title** - "Related Articles"
- **Author Role** - Author title
- **Author Bio** - Author biography

---

## 💡 TIPS & BEST PRACTICES

### General Guidelines
1. **Keep it concise** - Shorter text performs better on mobile
2. **Use consistent tone** - Maintain your brand voice throughout
3. **Update regularly** - Keep content fresh and relevant
4. **Test on mobile** - Always preview changes on phone
5. **Use high-quality images** - Minimum 1920x1080 for hero images

### SEO Tips
- Use keywords naturally in titles and descriptions
- Keep descriptions under 160 characters for search results
- Use descriptive link text (avoid "click here")

### Conversion Tips
- Make CTAs clear and action-oriented
- Use benefit-focused language
- Create urgency when appropriate
- Test different button text

### Content Tips
- Update featured projects quarterly
- Keep testimonials and stats current
- Refresh blog categories as needed
- Update office hours if they change

---

## 🔧 TECHNICAL NOTES

### JSON Format Fields
Some fields use JSON format (Portfolio Categories, Pricing Options, etc.):
- Must be valid JSON
- Use double quotes for strings
- Arrays use square brackets []
- Objects use curly braces {}

### Icon Selection
Available icons include:
Eye, Target, Heart, Award, Users, Lightbulb, Star, Crown, Diamond, Gem, Compass, Flag, Globe, Rocket, Zap, Shield, CheckCircle, TrendingUp, Layers, Layout, Home, Building2, Search, Hammer, Briefcase, Calendar, Settings, Tool, MapPin, Phone, Mail, MessageCircle, Clock, Send

### Link Options
Available page links:
- home
- about
- services
- workflow
- portfolio
- contact
- pricing

### Color Options
For buttons and elements:
- black
- green (for WhatsApp)
- red (for alerts)

---

## 🚀 WORKFLOW

### Editing Settings
1. Click "Site Settings" in admin sidebar
2. Select the page/section from tabs
3. Edit the fields you want to change
4. Click "Save Changes" button
5. Wait for confirmation message
6. Check frontend to verify changes

### Reverting Changes
- Changes are saved immediately
- To revert, manually edit fields back to previous values
- Keep a backup of important content

### Bulk Updates
- You can edit multiple fields before saving
- All changes save at once when you click "Save Changes"
- No need to save after each field

---

## ❓ COMMON QUESTIONS

**Q: How long do changes take to appear?**
A: Changes appear immediately after saving. Refresh the frontend page to see updates.

**Q: Can I undo changes?**
A: Changes are permanent. Keep notes of original content if you need to revert.

**Q: What if I make a mistake?**
A: Simply edit the field again and save. You can fix it anytime.

**Q: Can I use HTML in text fields?**
A: No, use plain text only. HTML will be displayed as text.

**Q: How do I add line breaks?**
A: Use the pipe character (|) to separate items in lists.

**Q: Can I delete settings?**
A: No, but you can leave fields empty or set them to "false" to hide sections.

---

## 📞 SUPPORT

For issues or questions:
1. Check this guide for your specific section
2. Review the "Best Practices" section
3. Test changes on a staging environment first
4. Contact your development team if needed

---

**Last Updated:** January 18, 2026
**Version:** 1.0
**Status:** Complete

