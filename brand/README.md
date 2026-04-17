# HWA Packages – Brand Assets

## Folder Structure

```
brand/
├── logo/          ← Drop your logo files here (SVG, PNG, etc.)
├── colors.md      ← Full color palette with hex codes
└── README.md      ← This file
```

## Logo
Place your logo files inside the `logo/` folder. Recommended formats:
- `logo.svg` — primary logo (scalable, best for web)
- `logo.png` — fallback (transparent background)
- `logo-white.svg` / `logo-white.png` — white version for dark backgrounds (navbar, footer)
- `favicon.ico` — browser tab icon (copy to the root `hwa-website/` folder)

## Using the Logo in the Website
Once you add your logo file, update [index.html](../index.html) to replace the text logo:

```html
<!-- Find this in the navbar: -->
<a href="#home" class="nav-logo">
  <span class="logo-hwa">HWA</span><span class="logo-packages">PACKAGES</span>
</a>

<!-- Replace with: -->
<a href="#home" class="nav-logo">
  <img src="brand/logo/logo.svg" alt="HWA Packages" height="36" />
</a>
```

Do the same for the footer logo block.

## Color Reference
See [colors.md](colors.md) for the full palette.
