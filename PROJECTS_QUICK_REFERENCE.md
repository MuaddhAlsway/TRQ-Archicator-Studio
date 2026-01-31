# TRQ STUDIO Projects - Quick Reference

## All 15 Projects Now Available

### How Projects Are Organized

**By Category:**
- **Residential** (5 projects): PAWS & PARTNERS, A Fusion of Art and Elegance, CLASSIC BEDROOM, H & P, Half Million Project
- **Commercial** (2 projects): ALULAH, ARYASH AL-DRIIYAH
- **Events** (3 projects): DIRIYAH NATIONAL DAY EVENT, DIRIYAH PARADE, QUALITY OF LIFE PROGRAM
- **Booths** (1 project): RSG BOOTH
- **Recreation/Interior** (2 projects): REC. HEAVEN, Modern Luxury Living Room
- **Market** (1 project): DIRIYAH MARKET
- **Apartments** (1 project): RAFAL APARTMENT

## Key Features

✅ **Bilingual Content**
- All projects have English and Arabic descriptions
- Automatic language switching in portfolio

✅ **Rich Project Details**
- Project challenge and solution
- Materials and features used
- Team members involved
- Client testimonials
- Multiple images per project

✅ **Smart Display**
- Infinite scroll portfolio
- Category filtering
- Responsive design
- Mobile-friendly

## Database Status

- **Total Projects**: 15
- **Published**: 15 (all visible)
- **Status**: Ready for production
- **Images**: Linked from TRQ STUDIO _ PROJECTS folder

## API Endpoints

```
GET /api/projects              # All projects
GET /api/projects/published    # Published projects only
GET /api/projects/:id          # Single project details
```

## Portfolio Component

The Portfolio component automatically:
1. Fetches all published projects
2. Displays them with category filtering
3. Shows infinite scroll (6 projects per page)
4. Supports language switching
5. Opens detailed view on click

## Project Data Structure

Each project includes:
```
{
  id: number,
  title: string,
  title_ar: string,
  category: string,
  category_ar: string,
  description: string,
  description_ar: string,
  image: string,
  year: string,
  client: string,
  client_ar: string,
  location: string,
  location_ar: string,
  size: string,
  size_ar: string,
  duration: string,
  duration_ar: string,
  challenge: string,
  challenge_ar: string,
  solution: string,
  solution_ar: string,
  features: string[] (JSON),
  features_ar: string[] (JSON),
  materials: string[] (JSON),
  materials_ar: string[] (JSON),
  team: string[] (JSON),
  team_ar: string[] (JSON),
  clientQuote: string,
  clientQuote_ar: string,
  clientName: string,
  clientName_ar: string,
  gallery: string[] (JSON),
  status: 'published' | 'draft',
  createdAt: timestamp
}
```

## Managing Projects

### View in Admin Panel
1. Go to Admin Dashboard
2. Navigate to Projects section
3. View, edit, or delete projects

### Add New Project
1. Click "Add New Project"
2. Fill in English details
3. Add Arabic translations
4. Upload images
5. Set status to "published"
6. Save

### Edit Existing Project
1. Click on project in admin
2. Update details
3. Save changes
4. Changes reflect immediately in portfolio

## Troubleshooting

**Projects not showing?**
- Check if status is "published"
- Verify API endpoint: `GET /api/projects/published`
- Check browser console for errors

**Images not loading?**
- Verify image paths in database
- Check if files exist in public folder
- Use fallback images if needed

**Language not switching?**
- Check if Arabic fields are populated
- Verify language context is working
- Check browser language settings

## Performance Notes

- Portfolio loads 6 projects per page
- Infinite scroll loops through all projects
- Images are optimized (webp format preferred)
- Database queries are indexed by status
- API responses are cached by browser

## Future Enhancements

- [ ] Add project filtering by year
- [ ] Add project search functionality
- [ ] Add project comparison view
- [ ] Add project export to PDF
- [ ] Add project sharing to social media
- [ ] Add project comments/reviews
- [ ] Add project related projects
- [ ] Add project video support
