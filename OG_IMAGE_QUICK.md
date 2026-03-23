# 🖼️ OG Image - Quick Reference

**Everything you need to know in one page.**

---

## ⚡ 30-Second Setup

```bash
# Generate PNG from SVG
npm run generate:og-image

# Build and deploy
npm run build
git push
```

Done! Social media previews will now work. ✅

---

## 📍 Files Created/Modified

| File | Action | Status |
|------|--------|--------|
| `/public/og-image.png` | Generated | Will be created |
| `/public/og-image.svg` | Created | ✅ Ready |
| `src/components/SEO.jsx` | Enhanced | ✅ Updated |
| `index.html` | Updated | ✅ Improved |
| `scripts/generate-og-image.js` | Created | ✅ Automated |
| `package.json` | Updated | ✅ Scripts added |

---

## 🎯 What You Need to Know

### Image Specs
- **Size:** 1200x630 pixels
- **Format:** PNG (or fallback SVG)
- **Location:** `/public/og-image.png`
- **File Size:** 200-500 KB typical

### Meta Tags Added
- `og:image` - Primary image
- `og:image:width` - Dimension info
- `og:image:height` - Dimension info
- `og:image:type` - Image format
- `twitter:image` - Twitter-specific

### Platforms Covered
✅ Facebook  
✅ Twitter/X  
✅ LinkedIn  
✅ Discord/Slack  
✅ WhatsApp  
✅ Google  
✅ Pinterest  

---

## 🔄 Two Ways to Generate

### Option 1: Automatic (On Build)
```bash
npm run build
# Automatically generates PNG from SVG during build
```

### Option 2: On Demand
```bash
npm run generate:og-image
# Generate PNG anytime without full build
```

### Option 3: Manual (No Installation)
```
1. Go to: https://cloudconvert.com/svg-to-png
2. Upload: public/og-image.svg
3. Download as PNG
4. Save to: public/og-image.png
```

---

## ✅ Testing (Pick Any)

### Fastest (5 seconds)
```bash
# Check file exists
ls -la public/og-image.png
```

### Complete (2 minutes)
```
1. https://www.opengraphcheck.com/ → Enter URL
2. https://cards-dev.twitter.com/validator → Check preview
3. https://developers.facebook.com/tools/debug/ → Verify
```

### Real-world (1 minute)
```
1. Copy your URL
2. Share on Twitter/Facebook/LinkedIn
3. Check preview thumbnail
4. Should show your OG image!
```

---

## 🛠️ Installation (If Needed)

**Required:** Nothing! Optional:

```bash
# For faster image generation
npm install -D sharp

# OR alternative
npm install -D canvas
```

---

## 📊 How It Works

```
Your Site → og-image.png → Social Media Crawler → Preview Image → User Sees It!
```

When someone shares your link on social media:
1. Their platform fetches your website
2. Reads the `og:image` meta tag
3. Downloads your PNG image
4. Shows it as the preview thumbnail

---

## 🎨 Customizing

**Want to change the design?**

1. Edit `/public/og-image.svg` (text, colors, etc.)
2. Run `npm run generate:og-image`
3. Done!

**Sample text edits:**
```xml
<!-- Change this line: -->
<text x="600" y="220" ...>StudentToolHub</text>

<!-- To this: -->
<text x="600" y="220" ...>Your New Title</text>

<!-- Then regenerate: -->
npm run generate:og-image
```

---

## 🐛 Issues & Fixes

| Issue | Fix |
|-------|-----|
| "PNG not found" | Run `npm run generate:og-image` |
| "Sharp error" | Install: `npm install -D sharp` |
| "Preview not updating" | Debuggers: https://www.opengraphcheck.com/ |
| "Image too small/large" | Check dimensions (should be 1200x630) |
| "Looks distorted" | Regenerate with correct aspect ratio |

---

## 📋 Pre-Launch Checklist

- [ ] `npm run generate:og-image` succeeds
- [ ] `ls public/og-image.png` shows file
- [ ] `npm run build` completes without errors
- [ ] Tested on OG Debugger
- [ ] Tested on Twitter Validator
- [ ] Deployed to production
- [ ] Shared URL on social media
- [ ] Preview thumbnail shows correctly

---

## 🔗 One-Click Testing

Click to test your OG image after deploying:

**Replace `https://studenttoolhub.com/` with your actual domain:**

1. [OG Debugger](https://www.opengraphcheck.com/) - Type URL, click Scrape
2. [Twitter Validator](https://cards-dev.twitter.com/validator) - Type URL
3. [FB Debugger](https://developers.facebook.com/tools/debug/) - Paste URL
4. [LinkedIn Share](https://www.linkedin.com/feed/) - Share your URL

---

## 📚 More Info

**Full Documentation:** See `OG_IMAGE_SETUP.md` for complete guide  
**SVG File:** `/public/og-image.svg` (editable template)  
**Generator Script:** `scripts/generate-og-image.js` (see for options)  

---

## ✨ Summary

✅ Your OG image is set up  
✅ SVG fallback is ready  
✅ PNG generator is automated  
✅ Meta tags are optimized  
✅ Ready to deploy  
✅ Social media previews will work  

**One command before go-live:**
```bash
npm run generate:og-image
```

**Done!** 🚀

---

*Last Updated: March 23, 2026*
