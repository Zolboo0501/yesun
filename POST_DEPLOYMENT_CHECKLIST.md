# Post-Deployment SEO Checklist

## ✅ Completed (Already Done)
- [x] Site deployed to Vercel
- [x] Domain connected
- [x] Meta tags optimized
- [x] Keywords added
- [x] Sitemap created (`/sitemap.xml`)
- [x] Robots.txt configured
- [x] Structured data added to homepage
- [x] Language set to Mongolian

---

## 🚨 CRITICAL - Do These NOW (Required for Google Indexing)

### 1. Google Search Console Setup (15 minutes)
**URL:** https://search.google.com/search-console

**Steps:**
1. Click "Add Property"
2. Enter your domain (e.g., `https://yesunbelchir.mn`)
3. **Verify ownership** - Choose DNS verification:
   - Google will give you a TXT record
   - Add it to your domain DNS settings (in your domain registrar)
   - Click "Verify"
4. Once verified, go to "Sitemaps"
5. Submit: `sitemap.xml`
6. Click "Submit"

**Expected Result:** Google will start crawling your site within 24-48 hours

---

### 2. Request Indexing for Key Pages (10 minutes)

In Google Search Console:
1. Use "URL Inspection" tool (top search bar)
2. Enter these URLs one by one:
   - `https://yesunbelchir.mn/` (homepage)
   - `https://yesunbelchir.mn/products`
   - `https://yesunbelchir.mn/partner`
   - `https://yesunbelchir.mn/about`
   - `https://yesunbelchir.mn/contact`
3. Click "Request Indexing" for each
4. Wait 1-2 days for indexing

**Expected Result:** Pages appear in Google search within 2-7 days

---

### 3. Update Structured Data with Real Info (5 minutes)

Edit `/components/StructuredData.tsx` and replace:
- `"+976-XXXX-XXXX"` → Your real phone number
- `"https://www.yesunbelchir.mn"` → Your actual domain
- `"Mo-Fr 09:00-18:00"` → Your actual business hours
- Add your real Facebook/Instagram URLs
- Update geo coordinates if needed (currently set to Ulaanbaatar center)

---

### 4. Create Google Business Profile (30 minutes)
**URL:** https://business.google.com

**Steps:**
1. Sign in with Google account
2. Click "Add your business to Google"
3. Enter business name: **Есөн Бэлчир ХХК**
4. Choose category: **HVAC Contractor** or **Air Conditioning Contractor**
5. Add location: Your office address in Улаанбаатар
6. Add phone number
7. Add website: Your domain
8. Add business hours
9. Upload photos:
   - Logo
   - Office exterior/interior
   - Products (air conditioners, equipment)
   - Team photos
10. Verify business (Google will send verification code via postcard or phone)

**Expected Result:** Appear in Google Maps and local search within 1-2 weeks

---

## 📊 Why Your Site Isn't Showing Yet

### Normal Timeline:
- **Day 1-3:** Google discovers your site
- **Day 3-7:** Google indexes your pages
- **Week 2-4:** Site starts appearing for brand name searches
- **Month 1-3:** Site starts ranking for competitive keywords
- **Month 3-6:** Improved rankings with ongoing SEO

### Current Status:
❌ **Not indexed yet** - Google doesn't know your site exists
❌ **No Google Business Profile** - Missing from local search
❌ **No backlinks** - No authority signals
❌ **New domain** - No trust/history with Google

---

## 🎯 What to Expect

### Week 1-2: Brand Name Searches
After Google Search Console setup, you should rank for:
- "Есөн Бэлчир"
- "Есөн Бэлчир ХХК"
- Your exact domain name

### Month 1: Low Competition Keywords
You may start appearing for:
- "KANION агаар сэрүүцэгч Монгол"
- "AUX эйркондишн Улаанбаатар"
- "AIRONN галын сэнс"

### Month 2-3: Medium Competition
With ongoing work:
- "агаар сэрүүцэгч Улаанбаатар"
- "эйркондишн суурилуулалт"
- "агаар сэлгэлт УБ"

### Month 3-6: High Competition
With consistent SEO:
- "агаар сэрүүцэгч" (very competitive)
- "эйркондишн Монгол"
- "халаалтын систем"

---

## 🚀 Quick Wins (Do This Week)

### 1. Social Media Setup
- Create Facebook Business Page
- Create Instagram Business Account
- Post 3-5 times per week
- Link to your website

### 2. Get First Reviews
- Ask 5-10 satisfied customers for Google reviews
- Respond to all reviews
- Reviews boost local SEO significantly

### 3. Add Contact Info to Website
Make sure visible on every page:
- Phone number in header
- WhatsApp button
- Email address
- Physical address
- Business hours

### 4. Create Content
Add these pages:
- Blog/News section
- FAQ page
- Product detail pages
- Service pages

---

## 📈 Monitoring Tools

### 1. Google Search Console
**Check weekly:**
- Total clicks
- Total impressions
- Average position
- Which keywords bring traffic

### 2. Google Analytics
**Setup:** https://analytics.google.com
- Track visitor behavior
- See which pages are popular
- Monitor conversion rate

### 3. Google Business Insights
- See how many people find you on Maps
- Track phone calls
- Monitor direction requests

---

## 🔍 How to Check If You're Indexed

### Method 1: Site Search
In Google, search:
```
site:yesunbelchir.mn
```
If indexed, you'll see your pages listed.

### Method 2: Exact URL Search
Search for your exact homepage URL:
```
https://yesunbelchir.mn
```

### Method 3: Brand Name
Search for:
```
Есөн Бэлчир ХХК
```

---

## ⚠️ Common Mistakes to Avoid

1. **Expecting instant results** - SEO takes 2-6 months
2. **Not setting up Google Search Console** - Critical first step
3. **Ignoring Google Business Profile** - Essential for local SEO
4. **No mobile optimization** - Most users are on mobile
5. **Slow website** - Speed affects rankings
6. **No content updates** - Google favors fresh content
7. **Ignoring reviews** - Reviews build trust and rankings
8. **No backlinks** - Links from other sites boost authority

---

## 📞 Next Steps Summary

**TODAY:**
1. ✅ Set up Google Search Console
2. ✅ Submit sitemap
3. ✅ Request indexing for main pages
4. ✅ Update StructuredData.tsx with real info

**THIS WEEK:**
5. ✅ Create Google Business Profile
6. ✅ Set up Facebook/Instagram
7. ✅ Ask for first 5 reviews
8. ✅ Add contact info prominently on site

**THIS MONTH:**
9. Create blog content
10. Build backlinks
11. Optimize images
12. Add more product pages

**ONGOING:**
- Post on social media 3x/week
- Collect reviews monthly
- Monitor Google Search Console weekly
- Update content monthly

---

## 🎓 Resources

- **Google Search Console:** https://search.google.com/search-console
- **Google Business:** https://business.google.com
- **Google Analytics:** https://analytics.google.com
- **SEO Strategy:** See `SEO_STRATEGY.md` in project root

---

## 📊 Success Metrics (Track Monthly)

- [ ] Google Search Console impressions
- [ ] Google Search Console clicks
- [ ] Average keyword position
- [ ] Number of indexed pages
- [ ] Google Business profile views
- [ ] Number of reviews
- [ ] Website traffic (Analytics)
- [ ] Conversion rate (contact form submissions)

---

**Remember:** SEO is a marathon, not a sprint. Consistent effort over 3-6 months will show results.

**Last Updated:** 2026-03-07
