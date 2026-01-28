# Product Images Directory

This directory contains product images displayed on the `/products` page.

## Image Requirements

### File Specifications:

- **Format**: JPG, PNG, or WebP
- **Dimensions**: 800x800px minimum (square aspect ratio)
- **File Size**: < 500KB per image (optimize before uploading)
- **Quality**: High resolution for product details visibility

### Naming Convention:

Images should match the filenames specified in `src/data/products.ts`:

```
vape-delta8.jpg
vape-thca.jpg
vape-hhc.jpg
gummies-delta9.jpg
gummies-cbd-sleep.jpg
gummies-thcp.jpg
flower-purple-haze.jpg
flower-cbd.jpg
flower-indica.jpg
wax-delta8.jpg
live-resin.jpg
prerolls.jpg
prerolls-cbd.jpg
tincture-cbd.jpg
tincture-delta8.jpg
glass-pipe.jpg
grinder.jpg
storage-jars.jpg
```

## Adding Product Images

### Method 1: Manual Upload

1. Obtain product photos (take your own or source from supplier)
2. Resize and optimize images to meet specifications
3. Name files according to the convention above
4. Place files in this directory (`public/images/products/`)

### Method 2: Image Optimization Tools

Use these tools to optimize images before uploading:

- **TinyPNG**: https://tinypng.com (compress PNG/JPG)
- **Squoosh**: https://squoosh.app (advanced compression with preview)
- **ImageOptim** (Mac): https://imageoptim.com
- **GIMP** (Free): https://www.gimp.org (resize and edit)

### Method 3: Using Next.js Image Optimization

Next.js automatically optimizes images, but starting with optimized sources improves performance:

```bash
# Install sharp for better image optimization
npm install sharp
```

## Placeholder Image

If an image is missing, the product card will show a placeholder. To replace the placeholder:

1. Create a `placeholder.svg` in this directory, OR
2. Update `src/app/components/products/product-card.tsx` to use a different fallback

## Legal Considerations

⚠️ **Important**: Ensure you have rights to use all product images.

- **Own Photos**: You own the copyright ✅
- **Supplier Photos**: Get written permission from supplier
- **Stock Photos**: Purchase license from stock photo sites
- **Competitor Photos**: NEVER use - copyright infringement ❌

## Image Accessibility

All product images should:

- Be clearly visible and well-lit
- Show the actual product (not generic stock)
- Display product packaging/branding if applicable
- Be consistent in style across all products

## Next Steps

After adding images:

1. Verify images load correctly at `http://localhost:3000/products`
2. Check mobile responsiveness
3. Confirm alt text is descriptive in product data
4. Test image loading performance with Lighthouse

---

**Last Updated**: January 2026
**Maintained By**: THC Plus Development Team
