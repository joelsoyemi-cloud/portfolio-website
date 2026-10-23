# Joel Soyemi — Spatial Portfolio

A personal portfolio built with Next.js, React, TypeScript, and Three.js. Mint glass controls, an interactive sculpture, real project links, and a small interaction lab.

## Run

Use Node.js 20.9 or later.

    npm ci
    npm run dev

Open http://localhost:3000. The development wrapper translates generic preview host flags into Next.js flags and uses Webpack for development compatibility.

## Check and build

    npm run typecheck
    npm run build

The project exports a static website to `out/`. Deploy that directory to a static host, or import the repository into Vercel as a Next.js project. No environment variables, database, or paid service are required.

Production output is static. Preview the exported directory with your static host's local tooling.

## Content

- Update the projects and verified contact links in `app/lib/content.ts`.
- Edit the page in `app/components/Portfolio.tsx`.
- The lazy-loaded 3D scene is in `app/components/SpatialScene.tsx`.
- The interaction lab is in `app/components/MotionStudy.tsx`.
- Styles and responsive breakpoints are in `app/globals.css`.
- Metadata lives in `app/layout.tsx`. Update its origin if deploying to another domain.

Project visuals are original illustrative studies, not screenshots or claims that these are the projects' exact current interfaces. The Daily Byte, NYNTH Studio, and CGPA Calculator link to their real source repositories. NYNTH's project is an editorial frontend; this portfolio does not imply that its admin backend is complete.

## Interactions and accessibility

The sculpture supports drag, arrow-key rotation, and Home to reset. Jade, Chrome, and Frost change its material. A CSS sculpture remains available when WebGL cannot start; its material choices and keyboard controls still work.

The motion toggle defaults to the system's reduced-motion preference and saves an explicit choice locally. It stops decorative animation, resets pointer tilt, and pauses the 3D render loop. Offscreen and background scenes also stop their render loop. Pixel density and geometry detail are capped for smaller screens.

The lab includes magnetic attraction, perspective tilt, and a draggable spring interaction. Its tabs support Left/Right, Home, and End. The experiments can also be triggered with Enter or Space. Project filtering and contact links remain usable with motion off.

Contact links use the verified GitHub profile by default. To use email instead, set `contact.email` in `app/lib/content.ts` to an address you intend to publish. Copy link reports a useful fallback when clipboard access is denied. There is no contact-form backend.

For a deliberate low-graphics view, append `?graphics=off` to the URL.

## Design references and verification

See [the reference and motion notes](docs/DESIGN-REFERENCES.md) and [verification results](docs/VERIFICATION.md).

The implementation uses original code and artwork. Pinterest references were found through public search results; Pinterest denied access to full pin pages in this browser, so their full motion was not inspected or copied.
