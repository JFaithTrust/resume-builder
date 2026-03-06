import {
  IResume,
  IWorkExperience,
  IEducation,
  ISkill,
  IFreelanceProject,
  IContact,
} from "@/types/resume";

export const DEFAULT_RESUME_DATA: IResume = {
  profile: {
    name: "Alex Johnson",
    title: "Software Engineer",
    contact: [
      {
        type: "phone",
        title: "+1 (555) 000-1234",
        link: "tel:+15550001234",
      },
      {
        type: "email",
        title: "alex.johnson@example.com",
        link: "mailto:alex.johnson@example.com",
      },
      {
        type: "github",
        title: "github.com/alexjohnson",
        link: "https://github.com/alexjohnson",
      },
      {
        type: "linkedin",
        title: "linkedin.com/in/alexjohnson",
        link: "https://www.linkedin.com/in/alexjohnson",
      },
    ],
  },
  summary:
    "Results-driven software engineer with 4+ years of experience building scalable web applications. Skilled in modern JavaScript/TypeScript ecosystems with a strong focus on React and Next.js. Passionate about clean code, performance optimization, and delivering exceptional user experiences. Collaborative team player with experience in Agile environments.",
  workExperience: [
    {
      company: "Acme Corp",
      companyLink: "https://example.com",
      position: "Senior Software Engineer",
      startDate: "Jan 2023",
      endDate: "Present",
      location: "San Francisco, CA",
      responsibilities: [
        "Led development of a customer-facing dashboard using Next.js and TypeScript, reducing page load time by 40%.",
        "Architected a reusable component library adopted across 3 product teams, improving developer velocity.",
        "Collaborated with design and product teams to deliver features on time, consistently meeting sprint goals.",
        "Mentored 2 junior engineers through code reviews and pair programming sessions.",
      ],
    },
    {
      company: "StartupXYZ",
      companyLink: "https://example.com",
      position: "Frontend Engineer",
      startDate: "Mar 2021",
      endDate: "Dec 2022",
      location: "Remote",
      responsibilities: [
        "Built responsive UI components from Figma designs using React and Tailwind CSS.",
        "Integrated RESTful APIs and managed state with React Query, improving data-fetching reliability.",
        "Wrote unit and integration tests with Jest and React Testing Library, achieving 85% code coverage.",
        "Participated in daily standups and sprint planning as part of a cross-functional Agile team.",
      ],
    },
  ],
  education: [
    {
      institution: "State University",
      degree: "BSc in Computer Science",
      startDate: "Sep 2017",
      endDate: "May 2021",
      location: "New York, NY",
      details: [
        "GPA: 3.8/4.0. Dean's List all semesters.",
        "Courses: Data Structures, Algorithms, Operating Systems, Databases, Web Development.",
      ],
    },
  ],
  skills: [
    {
      type: "Proficient",
      list: ["JavaScript", "TypeScript", "React", "Next.js", "HTML", "CSS"],
    },
    {
      type: "Familiar",
      list: ["Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "Python"],
    },
    {
      type: "Tools",
      list: ["Git", "Figma", "Jest", "Cypress", "Vercel", "GitHub Actions"],
    },
  ],
  freelance_projects: [
    {
      name: "Open Source UI Kit",
      link: "https://example.com/ui-kit",
      githubLink: "https://github.com/alexjohnson/ui-kit",
      description:
        "Built and maintain an open-source component library in React with full TypeScript support and Storybook documentation. Used by over 200 developers on GitHub.",
    },
  ],
};

export const createEmptyContact = (): IContact => ({
  type: "other",
  title: "",
  link: "",
});

export const createEmptyWorkExperience = (): IWorkExperience => ({
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  location: "",
  responsibilities: [],
});

export const createEmptyEducation = (): IEducation => ({
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
  location: "",
  details: [],
});

export const createEmptySkill = (): ISkill => ({
  type: "",
  list: [],
});

export const createEmptyProject = (): IFreelanceProject => ({
  name: "",
  description: "",
});
