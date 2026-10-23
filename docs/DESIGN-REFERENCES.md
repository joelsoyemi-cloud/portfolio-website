# Reference study — 23 October 2026

## Direction

An iOS-inspired glass navigation layer over calm, readable content; a restrained mint and forest palette; expressive typography; a single dimensional hero. The work section remains the main purpose of the portfolio.

The web's backdrop blur is an interpretation of a glass surface. It does not automatically reproduce Apple's native Liquid Glass refraction and system behavior. Controls use distinct foregrounds and borders so the effect does not depend on transparency alone.

## Pinterest discovery

These are public pins surfaced by search, not pins saved to Joel's account. No board was created or changed. Metricool's connection supports account management, not Pinterest pin search.

| Reference                                                    | Link                                                                                                                                                            | Useful direction                                           |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Navigation Bar for Mobile Screen Liquid Glass Style          | https://www.pinterest.com/pin/388998486588677712/                                                                                                               | A compact floating navigation layer with an active control |
| Glassmorphism in user interfaces                             | https://www.pinterest.com/pin/840765824184171299/                                                                                                               | Layering and translucent interface surfaces                |
| Ambient Parallax Portfolio Template with Scroll Animation    | https://in.pinterest.com/pin/ambient-parallax-portfolio-template-with-scroll-animation--663577326378431224/                                                     | Portfolio depth and scroll motion                          |
| 3D website animation of Exito scroll, by Alex Bender / Fancy | https://ar.pinterest.com/pin/3d-website-animation-of-exito-scroll-by-alex-bender-for-fancy-on-dribbble-in-2025--315322411430859343/                             | A dimensional hero and scroll-led presentation             |
| Morphing and other 3D shape transitions                      | https://in.pinterest.com/pin/create-animated-interactive-and-highly-customizable-backgrounds-enjoy-morphing-and-other-3d-shape-transitions--727401777294414196/ | Shape, material, and depth exploration                     |

Verification limit: search exposed the pin titles and metadata. Full pin requests returned access-denied responses, including a Pinterest “Access denied” page in the browser. Their complete visuals, creators' source implementations, and video timelines could not be verified. The directions above are design interpretations, not claims that the pinned examples implement those exact techniques.

## Motion in this implementation

“All animation types” is not a bounded feature list. This build covers several useful families while keeping readable content and native scrolling.

| Family                 | Where it appears               | Trigger                                            |
| ---------------------- | ------------------------------ | -------------------------------------------------- |
| Physically shaded 3D   | Glass / chrome / frosted knot  | Page load and material selection                   |
| Object rotation        | Hero sculpture                 | Drag or arrow keys                                 |
| Pointer parallax       | Hero object                    | Pointer movement with motion enabled               |
| Idle motion            | Sculpture and floating note    | While visible and motion enabled                   |
| Continuous rotation    | Decorative asterisks           | Motion enabled                                     |
| Infinite translation   | Toolkit strip                  | Motion enabled; pauses on hover                    |
| Scroll reveal          | Work, about, lab, and contact  | Intersection with viewport                         |
| Scroll-linked progress | Thin top progress line         | Native page scroll                                 |
| Perspective tilt       | Project cards and lab          | Fine pointer movement                              |
| Highlight tracking     | Project artwork                | Pointer position                                   |
| Magnetic attraction    | Lab button                     | Pointer movement or keyboard activation            |
| Spring return          | Draggable lab star             | Release after dragging                             |
| SVG path drawing       | Lab invitation line            | Reveal                                             |
| Microinteraction       | Buttons, arrows, material tabs | Hover, focus, or selection                         |
| Anchor movement        | Navigation and section links   | Native smooth scroll; immediate when motion is off |

There is no scroll hijacking or custom cursor. Important content is server-rendered. Animation does not gate project links or contact details.

## Primary technical references

- [Apple: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [Apple: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Three.js: MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html)
- [Three.js documentation](https://threejs.org/docs/)

Three.js documents the higher per-pixel cost of physical materials and recommends an environment map. This scene uses an environment map, bounded pixel density, a single main physical surface, deferred loading, and a render loop that stops when it is unnecessary.

## Project screenshot sources

The work cards use browser captures from the actual project homepages, taken on 23 October 2026 and converted to WebP without changing their design. They are not generated concept images.

- The Daily Byte: https://the-dailybyte-nine.vercel.app/
- NYNTH Journal: https://nynth-mockup.vercel.app/ (the static editorial demo; source is NYNTH-MOCKUP).
- Academy Press: https://acad-press-pratice.vercel.app/ (access-code preview, entered through the browser’s secure authentication flow).

Only the website presentation is captured. The Academy Press access code is not stored in source, URLs, screenshots, or public copy. All three cards retain a separate source link.

## Expanded creative playground

Play now moves from a large generative field into two hands-on studies, followed by the original microinteraction lab. The particle field introduces a darker forest surface; a clay/lime typographic poster and a lilac gravity scene add controlled color variation. These are original procedural experiments, with no borrowed project imagery or generated bitmap assets.

| Experiment | Visitor input | Visible result |
| --- | --- | --- |
| Particle universe | Pointer, tap/Enter, shape buttons, Remix | A deforming sphere, ribbon, or lattice; scatter and a new edition |
| Type as material | Text, typeface, palette, stretch, new prompt | A live typographic composition |
| A little weight | Drop, drag/release, arrow keys, gravity, shake/reset | Bounded pebbles with gravity, collisions, bounce, and a static arrangement when paused |

Canvas 2D keeps the new experiments independent of WebGL availability. Their continuous motion follows the existing global preference and stops offscreen. The gravity toy is a small custom circle simulation rather than an engineering model.
