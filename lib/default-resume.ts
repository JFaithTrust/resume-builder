import {
  IResume,
  IWorkExperience,
  IEducation,
  ISkill,
  IFirlanceProject,
  IContact,
} from "@/types/resume";

export const DEFAULT_RESUME_DATA: IResume = {
  profile: {
    name: "Javohir Mirzaakbarov",
    title: "Software Engineer",
    contact: [
      {
        type: "phone",
        title: "+49 152 26269553",
        link: "tel:+4915226269553",
      },
      {
        type: "email",
        title: "javohir.mir@gmail.com",
        link: "mailto:javohir.mir@gmail.com",
      },
      {
        type: "github",
        title: "github.com/javohirmir",
        link: "https://github.com/javohirmir",
      },
      {
        type: "linkedin",
        title: "linkedin.com/in/javohir-mirzaakbarov",
        link: "https://www.linkedin.com/in/javohir-mirzaakbarov/",
      },
    ],
  },
  summary:
    "Result-oriented software engineer with 3.5+ years of commercial experience (Front-end, UI/UX, Web Design, API). With an ongoing Master's Degree in Computer Science, my expertise lies in modern web technologies, especially JavaScript/TypeScript, React/Next.js. Possessing a deep understanding of software development principles, I am an Agile development practitioner, a passionate learner, and an active team member, always ensuring to deliver high-quality, well-structured, clean code.",
  workExperience: [
    {
      company: "BALU",
      companyLink: "https://balu.com",
      position: "Software Engineer",
      startDate: "Apr 2024",
      endDate: "Feb 2025",
      location: "Berlin, Germany",
      responsibilities: [
        "Designed and developed responsive UI components using Next.js and Tailwind CSS, publishing MVP in 2 months.",
        "Improved SEO with SSR, meta-tags, sitemaps, and JSON-LD, leading to 100 new users monthly.",
        "Configured and integrated static pages built with Prismic into Next.js application using Prismic API and web hooks, resulting in 50% increase in the user interaction.",
        "Implemented authentication to the adoption website and shelters' CRM with Firebase, leading to 20% traffic conversion.",
        "Created email templates with React-email and set up automatic email sending service with Resend, bringing 50 new partner shelters in a month.",
      ],
    },
    {
      company: "EBSCO via EPAM",
      companyLink: "https://www.ebsco.com/products/ebsco-discovery-service",
      position: "Software Engineer",
      startDate: "Mar 2024",
      endDate: "Sep 2024",
      location: "Tashkent, Uzbekistan",
      responsibilities: [
        "Delivered search results bulk actions (download, citation, share) for the EBSCO Discovery Service - a high-load online academic research platform with search-engine functionality that is used by many universities worldwide.",
        "Extended edge service endpoints, built as API Gateway in express.js, to route front-end requests to the back-end.",
        "Developed new components into existing internal UI package, publishing new version before the deadline.",
        "Added unit tests with React Testing Library and integration tests with Cypress, increasing coverage from 60% to 90% (measured via SonarQube).",
        "Conducted code reviews daily for other team members with constructive feedback.",
      ],
    },
    {
      company: "ITPU via EPAM",
      companyLink: "https://itpu.uz",
      position: "Software Engineer",
      startDate: "Jan 2023",
      endDate: "Feb 2024",
      location: "Tashkent, Uzbekistan",
      responsibilities: [
        "Designed and developed exam platform for ITPU using React.js and MUI, enabling the university to conduct online exams.",
        "Integrated front-end application with back-end API and internal SSO service.",
        "Supported with on-boarding new team members, participating in code reviews and peer programming.",
        "Collaborated with stakeholders to refine requirements and ensure timely delivery of milestones.",
      ],
    },
    {
      company: "EPAM",
      companyLink: "https://www.epam.com",
      position: "Resource Manager",
      startDate: "Nov 2021",
      endDate: "Sep 2024",
      location: "Tashkent, Uzbekistan",
      responsibilities: [
        "Managed a team of 3 developers, relaying project feedback and supporting with administrative tasks.",
        "Provided continuous technical guidance to team members, building self-development plan for every member.",
      ],
    },
  ],
  education: [
    {
      institution: "Universität Passau",
      degree: "MSc in Computer Science",
      startDate: "Oct 2024",
      endDate: "Current",
      location: "Passau, Germany",
      details: [
        "Courses: Deep Learning, Principles of AI Engineering, IT Security, Search-based Software Engineering.",
      ],
    },
    {
      institution: "Inha University in Tashkent",
      degree: "BSc in Computer Science and Software Engineering",
      startDate: "Sept 2019",
      endDate: "May 2023",
      location: "Tashkent, Uzbekistan",
      details: [
        "Member of Dean's List with ranking 3/300, GPA: 4.38/4.5.",
        "Holder of Japan And Central Asia Friendship Association Scholarship out of 500 candidates.",
        "Winner of Scholarship of the Ministry of Information Technology among 1200 applicants.",
        "Courses: Data Structures, Computer Algorithms, Operating Systems, Computer Networks, Web Programming, Unix Programming, Databases, Artificial Intelligence, Big Data Analytics.",
      ],
    },
  ],
  skills: [
    {
      type: "Proficient",
      list: ["JavaScript", "TypeScript", "ReactJS", "NextJS"],
    },
    {
      type: "Competent",
      list: [
        "Firebase",
        "SSR",
        "Tailwind CSS",
        "Material UI",
        "Prismic",
        "React Testing Library",
        "Cypress",
        "Node.js",
        "Express.js",
      ],
    },
    {
      type: "Familiar",
      list: [
        "Typeform",
        "Sentry",
        "Algolia",
        "Resend",
        "React-email",
        "Vercel",
        "AWS S3",
        "AWS Lambda",
        "Jenkins",
        "Analytics",
        "Docker",
        "NestJS",
        "Python",
      ],
    },
    {
      type: "Languages",
      list: ["English - Professional proficiency", "German - Conversational"],
    },
  ],
  firlance_projects: [
    {
      name: "Portfolio Website",
      link: "https://javohirmir.com",
      githubLink: "https://github.com/javohirmir/portfolio-website",
      description:
        "Developed a personal portfolio website using Next.js and Tailwind CSS to showcase my projects and skills. Implemented responsive design principles to ensure optimal viewing across devices. Integrated contact forms and optimized SEO to enhance visibility.",
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

export const createEmptyProject = (): IFirlanceProject => ({
  name: "",
  description: "",
});
