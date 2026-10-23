export const contact = {
  // Add an address here only if you intend to publish it.
  // With no public email configured, contact links use the GitHub profile.
  email: "",
  github: "https://github.com/joelsoyemi-cloud",
  pinterest: "https://www.pinterest.com/joelsoyemi/",
};

export type Project = {
  id: string;
  number: string;
  name: string;
  category: "Editorial" | "Business";
  description: string;
  tags: string[];
  source: string;
  site: string;
  preview: string;
  privatePreview?: boolean;
};

export const projects: Project[] = [
  {
    id: "byte",
    number: "01",
    name: "The Daily Byte",
    category: "Editorial",
    description:
      "A publishing platform with article pages, an editorial dashboard, and media uploads. Built around the stories people want to share.",
    tags: ["Next.js", "React", "Supabase"],
    source: "https://github.com/joelsoyemi-cloud/The-daily-byte",
    site: "https://the-dailybyte-nine.vercel.app/",
    preview: "/projects/the-daily-byte.webp",
  },
  {
    id: "nynth",
    number: "02",
    name: "NYNTH Journal",
    category: "Editorial",
    description:
      "An editorial design concept for NYNTH World. Fashion, music, and culture come together in a photo-led journal, with a static dashboard preview.",
    tags: ["HTML", "CSS", "JavaScript"],
    source: "https://github.com/joelsoyemi-cloud/NYNTH-MOCKUP",
    site: "https://nynth-mockup.vercel.app/",
    preview: "/projects/nynth-journal.webp",
  },
  {
    id: "academy",
    number: "03",
    name: "Academy Press",
    category: "Business",
    description:
      "A responsive website concept for specialized print services. A bold image carousel, service pages, and a clear path to request a quote.",
    tags: ["React", "Vite", "Tailwind CSS"],
    source: "https://github.com/joelsoyemi-cloud/Acad-press-pratice-",
    site: "https://acad-press-pratice.vercel.app/",
    preview: "/projects/academy-press.webp",
    privatePreview: true,
  },
];

export const filters = ["All work", "Editorial", "Business"] as const;
export type ProjectFilter = (typeof filters)[number];
export const materials = ["Jade", "Chrome", "Frost"] as const;
export type SculptureMaterial = (typeof materials)[number];
