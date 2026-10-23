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
- Metadata lives in `app/layout.tsx`. On Vercel, social images use its production domain automatically. An optional public `NEXT_PUBLIC_SITE_URL` can override the origin for another host.

Project previews are actual homepage screenshots captured on 23 October 2026, stored locally as optimized WebP images in `public/projects/`. Each preview, title, and visit action opens the exact website shown; the separate GitHub icon opens its matching source repository.

| Project | Website | Source |
| --- | --- | --- |
| The Daily Byte | https://the-dailybyte-nine.vercel.app/ | [The-daily-byte](https://github.com/joelsoyemi-cloud/The-daily-byte) |
| NYNTH Journal | https://nynth-mockup.vercel.app/ | [NYNTH-MOCKUP](https://github.com/joelsoyemi-cloud/NYNTH-MOCKUP) |
| Academy Press | https://acad-press-pratice.vercel.app/ | [Acad-press-pratice-](https://github.com/joelsoyemi-cloud/Acad-press-pratice-) |

NYNTH is the live static editorial design concept, rather than the separate React project. Academy Press is labeled as a private preview because visitors need an access code. No access code is included in this repository. The source-only Python CGPA tool remains available on Joel's GitHub profile.

Screenshots preserve the sites' actual layout, colors, photography, and text. A video/carousel frame and published content may naturally change when visitors open a site. Refresh the captures when those sites are redesigned.

## Vercel

Import this repository into the intended Vercel team as a Next.js project. The root directory is the repository root; install with `npm ci` and build with `npm run build`. No application secrets or database setup are required. Deploy the feature branch for review without merging unfinished work into `main`. The connected Vercel account must have access to the target team before project creation or deployment can succeed.

## Interactions and accessibility

The sculpture supports drag, arrow-key rotation, and Home to reset. Jade, Chrome, and Frost change its material. A CSS sculpture remains available when WebGL cannot start; its material choices and keyboard controls still work.

The motion toggle defaults to the system's reduced-motion preference and saves an explicit choice locally. It stops decorative animation, resets pointer tilt, and pauses the 3D render loop. Offscreen and background scenes also stop their render loop. Pixel density and geometry detail are capped for smaller screens.

The lab includes magnetic attraction, perspective tilt, and a draggable spring interaction. Its tabs support Left/Right, Home, and End. The experiments can also be triggered with Enter or Space. Project filtering and contact links remain usable with motion off.

Contact links use the verified GitHub profile by default. To use email instead, set `contact.email` in `app/lib/content.ts` to an address you intend to publish. Copy link reports a useful fallback when clipboard access is denied. There is no contact-form backend.

For a deliberate low-graphics view, append `?graphics=off` to the URL.

## Design references and verification

See [the reference and motion notes](docs/DESIGN-REFERENCES.md) and [verification results](docs/VERIFICATION.md).

The portfolio uses original interface code and a procedural hero sculpture, with screenshots from Joel’s own project sites. Pinterest references were found through public search results; Pinterest denied access to full pin pages in this browser, so their full motion was not inspected or copied.
