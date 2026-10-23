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

## Expanded Play section — 23 October 2026

Story: visitors enter Play, choose or manipulate an experiment, and see the result directly in the browser. All new state is local to the component; there is no API, database, account, or external service boundary.

Confirmed on the production static export:

- Orbit, Ribbon, and Lattice controls update the selected shape. Pointer input bends the field; clicking and Enter trigger scattering. Remix advances the edition and scatter count.
- Editing poster text, choosing Grotesk and Electric, and using End on the stretch range updates the poster label, palette, typeface, and 115% stretch. A 22-character unbroken string wraps inside the poster. The new-thought button replaces the text.
- Pointer and keyboard drops increase the pebble count. Gravity strength supports keyboard adjustment, and arrow keys nudge the newest pebble. Shake changes the arrangement; Reset restores five pebbles. At 18, the add button is disabled.
- The global motion toggle pauses continuous animation; shape changes, poster edits, scattering, and static pebble arrangement remain available.
- Both Canvas 2D surfaces render at nonzero dimensions in this browser. Their shared lifecycle explicitly cancels frames on cleanup, when outside the viewport, and when the document is hidden; density is capped at 1.5.
- The new layout has no horizontal document overflow at 320, 390, and 768-pixel responsive frame widths. Desktop was checked at a 1363-pixel frame width.
- The optimized Next.js build and TypeScript check pass.

The existing hero WebGL and physical iOS/Android device checks remain outstanding. Desktop browser checks and responsive frame checks do not establish touch-device frame-rate performance.
