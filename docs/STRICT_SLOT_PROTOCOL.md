# STRICT ARCHITECTURAL PROTOCOL: DYNAMIC IMAGE SLOTS & PLACEHOLDERS

## 1. Golden Rules
1. **ONLY SERIAL NUMBER IN SMALL LOWERCASE LETTERS**:
   - Every dynamic picture slot that does not have an image configured MUST ONLY display its serial number in small lowercase letters (e.g., `aurum_img_01`, `abvarbor_img_16`, `aurum_img_plan_north_ground`).
   - NOTHING ELSE is allowed inside an empty slot plate.
   - Absolutely NO icons (no layers, camera, sparkles, or upload icons).
   - Absolutely NO titles, subtitles, or category labels inside the plate.
   - Absolutely NO helper texts ("drag and drop", "click to upload", etc.).

2. **NEVER ANY UPLOAD CONTROLS OR SLOTS**:
   - Website visitors and users must NEVER be presented with an upload slot, upload button, drag-and-drop target, or file input (`<input type="file">`).
   - Regular users of the website must NEVER be permitted or prompted to upload images.
   - NO floating upload or delete/trash buttons on active or inactive images.

3. **UNIVERSAL APPLICATION**:
   - This rule strictly applies across:
     - All pages (`/`, `/about`, `/projects/[id]`, etc.)
     - All sections (Hero, Showcase, Selected Works, Floor Plans, Amenities, Specifications, Spaces, Materiality, Footer, etc.)
     - All floating sections, modals, drawers, and lightboxes.

4. **ASSET REGISTRATION**:
   - Real architectural images are supplied and mapped exclusively through:
     - `DEFAULT_SLOT_IMAGES` registry in `lib/slots.ts`
     - Static assets placed in `public/images/...`
     - Verified Cloudinary CDN URLs in project data files
