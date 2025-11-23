"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Earth, Github, Linkedin, Mail, Phone } from "lucide-react";

interface IContact {
  link: string;
  title: string;
  type: "email" | "phone" | "linkedin" | "github" | "other";
}

interface IProfile {
  name: string;
  title: string;
  contact: IContact[];
}

interface IWorkExperience {
  company: string;
  companyLink?: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  responsibilities: string[];
  key_projects?: {
    name: string;
    link?: string;
  }[];
}

interface IEducation {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  location: string;
  details?: string[];
}

interface ISkill {
  type: string;
  list: string[];
}

interface IFirlanceProject {
  name: string;
  link?: string;
  githubLink?: string;
  description: string;
}

interface IResume {
  profile: IProfile;
  summary: string;
  workExperience: IWorkExperience[];
  education: IEducation[];
  skills: ISkill[];
  firlance_projects: IFirlanceProject[];
}

export default function Home() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const searchParams = useSearchParams();
  const isPdfRender = useMemo(
    () => searchParams.get("pdf") === "1",
    [searchParams]
  );
  const resumeWrapperClass = [
    "resume-wrapper w-[210mm] min-h-[297mm] bg-white",
    isPdfRender
      ? "m-0 shadow-none"
      : "m-auto shadow-[0_0_10px_rgba(0,0,0,0.15)]",
    "print:m-0 print:w-full print:min-h-0 print:shadow-none",
  ].join(" ");

  const handleDownload = useCallback(async () => {
    try {
      setIsGeneratingPdf(true);
      const response = await fetch("/api/resume-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: window.location.origin }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Javohir_Mirzaakbarov_Resume.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed", error);
      alert(
        "PDF ni yaratishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  }, []);

  const resumeData: IResume = {
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
        key_projects: [
          {
            name: "Adoption Website",
            link: "https://adopt.balu.com",
          },
          {
            name: "Shelter CRM",
            link: "https://crm.balu.com",
          },
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

  return (
    <>
      {!isPdfRender && (
        <div className="print:hidden flex justify-end">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isGeneratingPdf}
            className="mt-6 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGeneratingPdf ? "Yuklanmoqda..." : "PDF sifatida yuklab olish"}
          </button>
        </div>
      )}
      <main className={resumeWrapperClass}>
        <div className="flex flex-col px-[18mm] py-[10mm] text-slate-900 print:px-[14mm] print:py-[11mm]">
          <header className="text-center">
            <h1 className="text-[26px] font-semibold tracking-[0.4em] uppercase">
              {resumeData.profile.name}
            </h1>
            <p className="mt-1 text-[11px] uppercase text-slate-600 tracking-[0.35em]">
              {resumeData.profile.title}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-medium text-slate-700">
              {resumeData.profile.contact.map((contact) => (
                <div className="flex gap-x-1 items-center" key={contact.type}>
                  {contact.type === "email" ? (
                    <Mail className="size-3 text-slate-500" />
                  ) : contact.type === "phone" ? (
                    <Phone className="size-3 text-slate-500" />
                  ) : contact.type === "linkedin" ? (
                    <Linkedin className="size-3 text-slate-500" />
                  ) : contact.type === "github" ? (
                    <Github className="size-2.5 text-slate-500" />
                  ) : (
                    <Earth className="size-2.5 text-slate-500" />
                  )}
                  <span>
                    <a href={contact.link} className="hover:underline">
                      {contact.title}
                    </a>
                  </span>
                </div>
              ))}
            </div>
          </header>

          <section className="resume-section mt-6">
            <h2 className="border-b border-slate-200 pb-1 text-[13px] font-bold uppercase tracking-[0.25em] text-slate-800">
              Summary
            </h2>
            <p className="mt-2 text-[10px] leading-[1.55] text-slate-700">
              {resumeData.summary}
            </p>
          </section>

          <section className="resume-section mt-6">
            <h2 className="border-b border-slate-200 pb-1 text-[13px] font-bold uppercase tracking-[0.25em] text-slate-800">
              Work Experience
            </h2>
            <div className="mt-3 space-y-4">
              {resumeData.workExperience.map((exp) => {
                const keyProjects = exp.key_projects ?? [];
                return (
                  <article
                    key={`${exp.company}-${exp.position}`}
                    className="space-y-1.5 print:break-inside-avoid"
                  >
                    <div className="flex flex-wrap justify-between gap-y-1 text-[11px] font-semibold text-slate-900">
                      <div className="flex flex-col">
                        {exp.companyLink ? (
                          <a
                            href={exp.companyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#114A8A] hover:underline"
                          >
                            {exp.company}
                          </a>
                        ) : (
                          <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#114A8A]">
                            {exp.company}
                          </span>
                        )}
                        <span className="text-[12px] font-medium capitalize text-slate-800">
                          {exp.position}
                        </span>
                      </div>
                      <div className="text-right italic text-[11px] font-medium text-slate-600">
                        <p>{exp.location}</p>
                        <p className="font-thin">
                          {exp.startDate} - {exp.endDate}
                        </p>
                      </div>
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-[10px] leading-normal text-slate-700">
                      {exp.responsibilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    {keyProjects.length > 0 && (
                      <div className="mt-2 flex gap-x-2 items-center">
                        <h3 className="text-[11px] font-semibold text-slate-900">
                          Key Projects:
                        </h3>
                        <div className="text-[10px] flex leading-normal text-slate-700">
                          {keyProjects.map((project, index) => (
                            <span
                              key={project.name}
                              className="flex items-center"
                            >
                              {project.link ? (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline"
                                >
                                  {project.name}
                                </a>
                              ) : (
                                project.name
                              )}
                              {index < keyProjects.length - 1 && (
                                <span className="mx-1">,</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {resumeData.firlance_projects.length > 0 && (
            <section className="resume-section mt-6">
              <h2 className="border-b border-slate-200 pb-1 text-[13px] font-bold uppercase tracking-[0.25em] text-slate-800">
                Freelance and Own Projects
              </h2>
              <div className="mt-3 space-y-3">
                {resumeData.firlance_projects.map((project) => (
                  <article
                    key={project.name}
                    className="space-y-1 print:break-inside-avoid"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-y-1 text-[11px] font-semibold text-slate-900">
                      <div>
                        <span className="text-[12px] uppercase tracking-[0.15em] text-[#114A8A]">
                          {project.name}
                        </span>
                      </div>
                      <div className="flex gap-3 text-[11px] font-medium text-slate-600">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            Live
                          </a>
                        )}
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] leading-normal text-slate-700">
                      {project.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="resume-section mt-6">
            <h2 className="border-b border-slate-200 pb-1 text-[13px] font-semibold uppercase tracking-[0.25em] text-slate-800">
              Education
            </h2>
            <div className="mt-3 space-y-4">
              {resumeData.education.map((edu) => (
                <article
                  key={`${edu.institution}-${edu.degree}`}
                  className="space-y-1.5 print:break-inside-avoid"
                >
                  <div className="flex flex-wrap justify-between gap-y-1 text-[11px] font-semibold text-slate-900">
                    <div className="flex flex-col">
                      <span className="text-[12px] uppercase tracking-[0.15em] text-[#114A8A]">
                        {edu.institution}
                      </span>
                      <span className="text-[12px] font-medium text-slate-800">
                        {edu.degree}
                      </span>
                    </div>
                    <div className="text-right italic text-[11px] font-medium text-slate-600">
                      <p>{edu.location}</p>
                      <p className="font-thin">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                  </div>
                  {edu.details && (
                    <ul className="list-disc space-y-1 pl-5 text-[10px] leading-normal text-slate-700">
                      {edu.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="resume-section mt-6">
            <h2 className="border-b border-slate-200 pb-1 text-[13px] font-bold uppercase tracking-[0.25em] text-slate-800">
              Skills
            </h2>
            <div className="mt-3 flex flex-col gap-1.5 text-[10px]">
              {resumeData.skills.map((skill) => (
                <div key={skill.type} className="flex items-start gap-x-4">
                  <p className="text-[11px] min-w-24 text-right font-bold tracking-[0.3em] text-slate-800">
                    {skill.type}
                  </p>
                  <p className="text-[10px] text-slate-700">
                    {skill.list.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
