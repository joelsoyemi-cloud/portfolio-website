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
  category: "Editorial" | "Tools";
  description: string;
  tags: string[];
  source: string;
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
  },
  {
    id: "nynth",
    number: "02",
    name: "NYNTH Studio",
    category: "Editorial",
    description:
      "A fashion journal for NYNTH World. Founder stories, culture, and clothing meet in a considered editorial experience.",
    tags: ["React", "Next.js", "Editorial design"],
    source: "https://github.com/joelsoyemi-cloud/nynth-studio",
  },
  {
    id: "cgpa",
    number: "03",
    name: "CGPA Calculator",
    category: "Tools",
    description:
      "A Python application that calculates CGPA from course scores and credit units. A practical tool built around a familiar student problem.",
    tags: ["Python", "Academic tools"],
    source: "https://github.com/joelsoyemi-cloud/cgpa-grading-system",
  },
];

export const filters = ["All work", "Editorial", "Tools"] as const;
export type ProjectFilter = (typeof filters)[number];
export const materials = ["Jade", "Chrome", "Frost"] as const;
export type SculptureMaterial = (typeof materials)[number];
