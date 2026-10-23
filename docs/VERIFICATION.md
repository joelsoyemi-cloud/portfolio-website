# Verification

The visitor should be able to explore Joel's projects, change the hero material, use the interaction lab, pause motion, and reach his contact links on desktop and mobile. This is a static portfolio: there is no API or database boundary.

## Confirmed

- Dependency installation succeeds from the committed npm manifest.
- TypeScript and the optimized Next.js static export pass.
- The exported site's project filters return one business project, two editorial projects, and three projects for All work.
- In-page navigation updates the active navigation control.
- Material selection updates the selected control and the CSS sculpture.
- Interaction tabs support both clicks and arrow-key navigation.
- Motion pause updates the page state and disables decorative animations.
- Clipboard denial displays the contact destination and an explanatory fallback.
- Project image, title, and visit links point to their matching deployed websites. Separate source links point to the matching repositories verified through the connected GitHub account.
- Responsive layouts at 320, 390, and 768 CSS pixels have no horizontal overflow. Desktop layout was checked at 1363 CSS pixels.
- Fallback sculpture material selection, arrow-key rotation, and Home to reset work.
- An explicit motion-off preference remains off after a page reload.

## Limits

The managed browser reports that WebGL is disabled. The Three.js code compiles, but GPU rendering, shader appearance, drag behavior in WebGL, and frame-rate performance need a check on a real browser with WebGL enabled. The CSS fallback is the rendered result used in browser checks.

The development preview did not hydrate reliably through the managed preview environment. Interactive checks used the exported production files served by the supported preview supervisor instead. This is separate from the successful Next.js production build.

Pinterest blocked full pin pages. Reference discovery is based on indexed public pin titles and metadata. No claim is made that the full pinned animations were inspected.

The 3D and motion interactions should receive a final device check on Safari/iOS and an Android phone before treating this branch as ready for a public portfolio launch.

## Screenshot update — 23 October 2026

Real homepage captures replace all three illustrative project studies. NYNTH now references its deployed static demo and matching repository; Academy Press replaces the source-only CGPA tool in the image grid and is labeled as a private preview. Access-code values are not persisted.

The production export was checked again after the screenshot update:

- All three local images load with natural dimensions 1348 × 926 and preserve their aspect ratio.
- Each thumbnail, title, and visit action uses the corresponding website; source icons use matching GitHub repositories.
- Editorial shows two projects, Business shows Academy Press, and All work shows all three.
- The responsive preview at 320, 390, and 768-pixel frame widths has no horizontal document overflow (the content viewport excludes the browser scrollbar).
- The Academy Press preview note remains visible beside its visit action.
- The Next.js optimized static build and its TypeScript check pass.

Vercel project access is currently blocked by the connected account’s team authorization. No Vercel portfolio deployment has been reported as successful.
