"use client";

import { Earth, Github, Linkedin, Mail, Phone } from "lucide-react";

import { IResume } from "@/types/resume";
import { isValidUrl } from "@/lib/utils";

interface ResumePreviewProps {
  resume: IResume;
  onDownload: () => void;
  isGeneratingPdf: boolean;
  isPdfRender: boolean;
  showDownloadButton: boolean;
  scale?: number;
}

export function ResumePreview({
  resume,
  onDownload,
  isGeneratingPdf,
  isPdfRender,
  showDownloadButton,
  scale = 1,
}: ResumePreviewProps) {
  const resumeWrapperClass = [
    "resume-wrapper w-[210mm] bg-white",
    isPdfRender ? "m-0 shadow-none" : "m-auto min-h-[297mm] shadow-[0_0_10px_rgba(0,0,0,0.15)]",
    "print:m-0 print:w-full print:shadow-none",
  ].join(" ");

  const scaledStyle = isPdfRender
    ? undefined
    : {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: scale !== 1 ? `calc(210mm / ${scale})` : "210mm",
      } as const;

  return (
    <>
      {showDownloadButton && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onDownload}
            disabled={isGeneratingPdf}
            className="mt-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGeneratingPdf ? "Generating..." : "Download as PDF"}
          </button>
        </div>
      )}

      <main className={resumeWrapperClass} style={scaledStyle}>
        <div className="flex flex-col px-[18mm] py-[10mm] text-slate-900 print:px-[14mm] print:py-[11mm]">
          <header className="text-center">
            <h1 className="text-[26px] font-semibold tracking-[0.4em] uppercase">
              {resume.profile.name}
            </h1>
            <p className="mt-1 text-[11px] uppercase text-slate-600 tracking-[0.35em]">
              {resume.profile.title}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-medium text-slate-700">
              {resume.profile.contact.map((contact) => {
                const isValidLink = isValidUrl(contact.link);
                return (
                  <div className="flex items-center gap-x-1" key={`${contact.type}-${contact.title}`}>
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
                      {isValidLink ? (
                        <a href={contact.link} className="hover:underline">
                          {contact.title}
                        </a>
                      ) : (
                        <span>{contact.title}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </header>

          <section className="resume-section mt-6">
            <h2 className="border-b border-slate-200 pb-1 text-[13px] font-bold uppercase tracking-[0.25em] text-slate-800">
              Summary
            </h2>
            <p className="mt-2 text-[10px] leading-[1.55] text-slate-700">
              {resume.summary}
            </p>
          </section>

          <section className="resume-section mt-6">
            <h2 className="border-b border-slate-200 pb-1 text-[13px] font-bold uppercase tracking-[0.25em] text-slate-800">
              Work Experience
            </h2>
            <div className="mt-3 space-y-4">
              {resume.workExperience.map((exp) => (
                <article
                  key={`${exp.company}-${exp.position}`}
                  className="space-y-1.5 print:break-inside-avoid"
                >
                  <div className="flex flex-wrap justify-between gap-y-1 text-[11px] font-semibold text-slate-900">
                    <div className="flex flex-col">
                      {exp.companyLink && isValidUrl(exp.companyLink) ? (
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
                    <div className="text-right text-[11px] font-medium italic text-slate-600">
                      <p>{exp.location}</p>
                      <p className="font-thin">
                        {exp.startDate} - {exp.endDate}
                      </p>
                    </div>
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-[10px] leading-normal text-slate-700">
                    {exp.responsibilities.filter(Boolean).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  {exp.key_projects && exp.key_projects.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] font-semibold text-slate-800">Key Projects:</p>
                      <ul className="list-disc space-y-0.5 pl-5 text-[10px] text-slate-700">
                        {exp.key_projects.map((project, idx) => (
                          <li key={idx}>
                            {project.link && isValidUrl(project.link) ? (
                              <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline text-[#114A8A]">
                                {project.name}
                              </a>
                            ) : (
                              <span>{project.name}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {resume.freelance_projects?.length > 0 && (
            <section className="resume-section mt-6">
              <h2 className="border-b border-slate-200 pb-1 text-[13px] font-bold uppercase tracking-[0.25em] text-slate-800">
                Client & Independent Projects
              </h2>
              <div className="mt-3 space-y-3">
                {resume.freelance_projects.map((project) => (
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
                        {project.link && isValidUrl(project.link) && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            Live
                          </a>
                        )}
                        {project.githubLink && isValidUrl(project.githubLink) && (
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
              {resume.education.map((edu) => (
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
                    <div className="text-right text-[11px] font-medium italic text-slate-600">
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
              {resume.skills.map((skill) => (
                <div key={skill.type} className="flex items-start gap-x-4">
                  <p className="text-[11px] text-right font-bold text-slate-800 min-w-20">
                    {skill.type}
                  </p>
                  <p className="text-[10px] text-slate-700">{skill.list.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
