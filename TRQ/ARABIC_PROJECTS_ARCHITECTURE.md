# Arabic Projects - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARABIC PROJECTS SYSTEM                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      ADMIN PANEL (ARABIC)                        │
│                                                                  │
│  AdminArabicProjects.tsx                                         │
│  ├─ Display projects in Arabic                                   │
│  ├─ Search and filter                                            │
│  ├─ Publish/unpublish toggle                                     │
│  └─ Edit/delete actions                                          │
│                                                                  │
│  ProjectEditorArabic.tsx                                         │
│  ├─ Form with Arabic labels                                      │
│  ├─ 5 tabs: Basic Info, Details, Content, Gallery, Team         │
│  └─ Saves with _ar suffix                                        │
└──────────────────────────────────────────────────────────────────┘
                              ↓
                    API: POST/PUT /api/projects
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js)                            │
│                                                                  │
│  server/index.js                                                 │
│  ├─ POST /api/projects                                           │
│  │  └─ Accepts: title, category, ..., title_ar, category_ar...  │
│  │                                                               │
│  └─ PUT /api/projects/:id                                        │
│     └─ Accepts: title, category, ..., title_ar, category_ar...  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                             │
│                                                                  │
│  projects table                                                  │
│  ├─ English fields: title, category, description, ...            │
│  └─ Arabic fields: title_ar, category_ar, description_ar, ...    │
│                                                                  │
│  Example row:                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ id: 1                                                      │ │
│  │ title: "Royal Residence"                                   │ │
│  │ title_ar: "الإقامة الملكية"                                │ │
│  │ category: "residential"                                    │ │
│  │ category_ar: "سكني"                                        │ │
│  │ description: "A timeless luxury villa..."                  │ │
│  │ description_ar: "فيلا فاخرة خالدة..."                      │ │
│  │ ... (more fields)                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              ↓
                    API: GET /api/projects
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│                                                                  │
│  Portfolio.tsx                                                   │
│  ├─ Loads projects from API                                      │
│  ├─ Checks language context                                      │
│  ├─ If language === 'ar':                                        │
│  │  └─ Uses getProjectData() to extract _ar fields               │
│  └─ If language === 'en':                                        │
│     └─ Uses regular fields                                       │
│                                                                  │
│  ProjectDetail.tsx                                               │
│  ├─ Displays full project details                                │
│  ├─ Checks language context                                      │
│  ├─ If language === 'ar':                                        │
│  │  └─ Shows Arabic content from _ar fields                      │
│  └─ If language === 'en':                                        │
│     └─ Shows English content from regular fields                 │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    WEBSITE (User View)                           │
│                                                                  │
│  Language: English                                               │
│  ├─ Portfolio shows English projects                             │
│  ├─ "Royal Residence"                                            │
│  └─ "A timeless luxury villa..."                                 │
│                                                                  │
│  Language: Arabic                                                │
│  ├─ Portfolio shows Arabic projects                              │
│  ├─ "الإقامة الملكية"                                            │
│  └─ "فيلا فاخرة خالدة..."                                        │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Creating/Editing a Project in Arabic

```
Admin User
    ↓
Opens Admin Panel → Arabic Panel → المشاريع
    ↓
Clicks "إضافة مشروع" (Add Project)
    ↓
ProjectEditorArabic opens
    ↓
Fills in Arabic content:
├─ العنوان (Title): "الإقامة الملكية"
├─ الفئة (Category): "سكني"
├─ الوصف (Description): "فيلا فاخرة خالدة..."
└─ ... (other fields)
    ↓
Clicks "إنشاء المشروع" (Create Project)
    ↓
handleSubmit() converts to _ar fields:
├─ title_ar: "الإقامة الملكية"
├─ category_ar: "سكني"
├─ description_ar: "فيلا فاخرة خالدة..."
└─ ... (other _ar fields)
    ↓
POST /api/projects with _ar fields
    ↓
Server saves to database:
├─ title_ar: "الإقامة الملكية"
├─ category_ar: "سكني"
├─ description_ar: "فيلا فاخرة خالدة..."
└─ ... (other _ar fields)
    ↓
Success! Project saved with Arabic content
```

### Viewing a Project in Arabic

```
Website Visitor
    ↓
Clicks language selector
    ↓
Selects "العربية" (Arabic)
    ↓
Language context changes to 'ar'
    ↓
Navigates to Portfolio
    ↓
Portfolio.tsx loads projects from API
    ↓
For each project, calls getProjectData(project)
    ↓
getProjectData() checks: language === 'ar'?
    ├─ YES: Returns {
    │   title: project.title_ar || project.title,
    │   category: project.category_ar || project.category,
    │   description: project.description_ar || project.description,
    │   ... (all _ar fields)
    │ }
    └─ NO: Returns regular fields
    ↓
Portfolio displays Arabic project:
├─ Title: "الإقامة الملكية"
├─ Category: "سكني"
└─ Description: "فيلا فاخرة خالدة..."
    ↓
Visitor clicks on project
    ↓
ProjectDetail.tsx loads with Arabic data
    ↓
Displays full Arabic project details
    ↓
All text is right-to-left (RTL)
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN SIDE                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AdminArabicProjects.tsx                                        │
│  ├─ State: projects, searchTerm, filterCategory                 │
│  ├─ Uses: useAdmin() hook                                       │
│  └─ Renders: Project list with edit/delete buttons              │
│                                                                 │
│  When user clicks "Edit":                                       │
│  └─ Opens ProjectEditorArabic with project data                 │
│                                                                 │
│  ProjectEditorArabic.tsx                                        │
│  ├─ State: formData, activeTab                                  │
│  ├─ Tabs: Basic Info, Details, Content, Gallery, Team          │
│  └─ On submit:                                                  │
│     ├─ Converts form data to _ar fields                         │
│     ├─ Calls updateProject() or addProject()                    │
│     └─ Sends to API with _ar fields                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND SIDE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Portfolio.tsx                                                  │
│  ├─ State: projects, language                                   │
│  ├─ Uses: useLanguage() hook                                    │
│  ├─ On mount: Loads projects from API                           │
│  ├─ On language change: Re-renders with new language            │
│  └─ For each project:                                           │
│     ├─ Calls getProjectData(project)                            │
│     └─ Displays Arabic or English content                       │
│                                                                 │
│  When user clicks on project:                                   │
│  └─ Opens ProjectDetail with project data                       │
│                                                                 │
│  ProjectDetail.tsx                                              │
│  ├─ Props: project, onBack                                      │
│  ├─ Uses: useLanguage() hook                                    │
│  ├─ On mount: Prepares projectData with Arabic/English content  │
│  └─ Displays:                                                   │
│     ├─ Project title (Arabic or English)                        │
│     ├─ Full description                                         │
│     ├─ Gallery                                                  │
│     ├─ Team and awards                                          │
│     └─ Client quote                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
projects table
├─ id (INTEGER PRIMARY KEY)
├─ English Fields:
│  ├─ title (TEXT)
│  ├─ category (TEXT)
│  ├─ subcategory (TEXT)
│  ├─ description (TEXT)
│  ├─ image (TEXT)
│  ├─ year (TEXT)
│  ├─ location (TEXT)
│  ├─ client (TEXT)
│  ├─ size (TEXT)
│  ├─ duration (TEXT)
│  ├─ detailedDescription (TEXT)
│  ├─ challenge (TEXT)
│  ├─ solution (TEXT)
│  ├─ features (TEXT - JSON array)
│  ├─ materials (TEXT - JSON array)
│  ├─ awards (TEXT - JSON array)
│  ├─ team (TEXT - JSON array)
│  ├─ gallery (TEXT - JSON array)
│  ├─ clientQuote (TEXT)
│  ├─ clientName (TEXT)
│  └─ status (TEXT - 'published' or 'draft')
│
├─ Arabic Fields (_ar suffix):
│  ├─ title_ar (TEXT)
│  ├─ category_ar (TEXT)
│  ├─ subcategory_ar (TEXT)
│  ├─ description_ar (TEXT)
│  ├─ location_ar (TEXT)
│  ├─ client_ar (TEXT)
│  ├─ size_ar (TEXT)
│  ├─ duration_ar (TEXT)
│  ├─ detailedDescription_ar (TEXT)
│  ├─ challenge_ar (TEXT)
│  ├─ solution_ar (TEXT)
│  ├─ features_ar (TEXT - JSON array)
│  ├─ materials_ar (TEXT - JSON array)
│  ├─ awards_ar (TEXT - JSON array)
│  ├─ team_ar (TEXT - JSON array)
│  ├─ clientQuote_ar (TEXT)
│  └─ clientName_ar (TEXT)
│
└─ Metadata:
   └─ createdAt (DATETIME)
```

## API Endpoints

### GET /api/projects
Returns all projects with both English and Arabic fields

**Response:**
```json
[
  {
    "id": 1,
    "title": "Royal Residence",
    "title_ar": "الإقامة الملكية",
    "category": "residential",
    "category_ar": "سكني",
    "description": "A timeless luxury villa...",
    "description_ar": "فيلا فاخرة خالدة...",
    ...
  }
]
```

### POST /api/projects
Create new project with Arabic fields

**Request:**
```json
{
  "title": "Royal Residence",
  "title_ar": "الإقامة الملكية",
  "category": "residential",
  "category_ar": "سكني",
  "description": "A timeless luxury villa...",
  "description_ar": "فيلا فاخرة خالدة...",
  ...
}
```

### PUT /api/projects/:id
Update project with Arabic fields

**Request:**
```json
{
  "title": "Royal Residence",
  "title_ar": "الإقامة الملكية",
  "category": "residential",
  "category_ar": "سكني",
  "description": "A timeless luxury villa...",
  "description_ar": "فيلا فاخرة خالدة...",
  ...
}
```

## Language Context Flow

```
LanguageContext (useLanguage hook)
├─ language: 'en' | 'ar'
├─ isRTL: boolean (true if language === 'ar')
├─ ts(): Translate string from i18n
├─ td(): Translate dynamic text
└─ translateBatch(): Translate multiple texts

Portfolio.tsx
├─ Gets language from useLanguage()
├─ Passes to getProjectData()
├─ getProjectData() checks: language === 'ar'?
│  ├─ YES: Returns Arabic fields
│  └─ NO: Returns English fields
└─ Renders with appropriate content

ProjectDetail.tsx
├─ Gets language from useLanguage()
├─ Prepares projectData with Arabic/English content
└─ Renders with appropriate content
```

## Error Handling

```
Admin creates/edits project
    ↓
ProjectEditorArabic.handleSubmit()
    ↓
Validates form data
    ├─ If invalid: Show error message
    └─ If valid: Continue
    ↓
Converts to _ar fields
    ↓
Sends to API
    ├─ If error: Show error toast
    └─ If success: Continue
    ↓
API saves to database
    ├─ If error: Return error response
    └─ If success: Return saved project
    ↓
Frontend updates state
    ├─ If error: Show error message
    └─ If success: Close editor, refresh list
```

## Performance Considerations

1. **Database Queries**
   - Single query returns both English and Arabic fields
   - No additional queries needed for Arabic content

2. **Frontend Rendering**
   - getProjectData() is a simple object transformation
   - No expensive computations

3. **API Calls**
   - Single API call returns all project data
   - No separate calls for Arabic content

4. **Caching**
   - Projects are cached in component state
   - Language changes trigger re-render, not new API call

---

## Summary

The Arabic Projects system is designed with:
- ✅ **Separation of concerns** - Admin and frontend are independent
- ✅ **Efficient data storage** - Both languages in single database row
- ✅ **Minimal API calls** - Single call returns all data
- ✅ **Simple logic** - getProjectData() is straightforward
- ✅ **Scalability** - Easy to add more languages
- ✅ **Maintainability** - Clear naming conventions (_ar suffix)
