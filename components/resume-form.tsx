"use client";

import { useCallback } from "react";

import {
  IResume,
  ContactType,
} from "@/types/resume";
import {
  createEmptyContact,
  createEmptyEducation,
  createEmptyProject,
  createEmptySkill,
  createEmptyWorkExperience,
} from "@/lib/default-resume";

interface ResumeFormProps {
  value: IResume;
  onChange: (updater: (prev: IResume) => IResume) => void;
}

const CONTACT_OPTIONS: ContactType[] = [
  "phone",
  "email",
  "linkedin",
  "github",
  "other",
];

export function ResumeForm({ value, onChange }: ResumeFormProps) {
  const updateResume = useCallback(
    (updater: (prev: IResume) => IResume) => {
      onChange(updater);
    },
    [onChange],
  );

  const handleProfileField = (field: "name" | "title", nextValue: string) => {
    updateResume((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: nextValue,
      },
    }));
  };

  const handleSummaryChange = (nextValue: string) => {
    updateResume((prev) => ({ ...prev, summary: nextValue }));
  };

  const handleContactChange = (
    index: number,
    field: "title" | "link" | "type",
    nextValue: string,
  ) => {
    updateResume((prev) => {
      const contact = [...prev.profile.contact];
      contact[index] = { ...contact[index], [field]: nextValue };
      return {
        ...prev,
        profile: { ...prev.profile, contact },
      };
    });
  };

  const addContact = () => {
    updateResume((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        contact: [...prev.profile.contact, createEmptyContact()],
      },
    }));
  };

  const removeContact = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        contact: prev.profile.contact.filter((_, idx) => idx !== index),
      },
    }));
  };

  const handleWorkChange = (
    index: number,
    field: keyof ReturnType<typeof createEmptyWorkExperience>,
    nextValue: string,
  ) => {
    updateResume((prev) => {
      const experiences = [...prev.workExperience];
      const current = experiences[index];
      if (!current) return prev;

      if (field === "responsibilities") {
        const lines = nextValue.split("\n").map((line) => line.trim());
        experiences[index] = {
          ...current,
          responsibilities: lines,
        };
      } else {
        experiences[index] = { ...current, [field]: nextValue } as typeof current;
      }

      return { ...prev, workExperience: experiences };
    });
  };

  const addWorkExperience = () => {
    updateResume((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, createEmptyWorkExperience()],
    }));
  };

  const removeWorkExperience = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, idx) => idx !== index),
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof ReturnType<typeof createEmptyEducation>,
    nextValue: string,
  ) => {
    updateResume((prev) => {
      const education = [...prev.education];
      const current = education[index];
      if (!current) return prev;

      if (field === "details") {
        education[index] = {
          ...current,
          details: nextValue
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        };
      } else {
        education[index] = { ...current, [field]: nextValue } as typeof current;
      }
      return { ...prev, education };
    });
  };

  const addEducation = () => {
    updateResume((prev) => ({
      ...prev,
      education: [...prev.education, createEmptyEducation()],
    }));
  };

  const removeEducation = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index),
    }));
  };

  const handleSkillChange = (index: number, field: "type" | "list", nextValue: string) => {
    updateResume((prev) => {
      const skills = [...prev.skills];
      const current = skills[index];
      if (!current) return prev;

      if (field === "list") {
        const entries = nextValue.split(",").map((item) => item.trim());
        const cleaned = entries.length === 1 && entries[0] === "" ? [] : entries;
        skills[index] = {
          ...current,
          list: cleaned,
        };
      } else {
        skills[index] = { ...current, type: nextValue };
      }
      return { ...prev, skills };
    });
  };

  const addSkill = () => {
    updateResume((prev) => ({ ...prev, skills: [...prev.skills, createEmptySkill()] }));
  };

  const removeSkill = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== index),
    }));
  };

  const handleProjectChange = (
    index: number,
    field: keyof ReturnType<typeof createEmptyProject> | "link" | "githubLink",
    nextValue: string,
  ) => {
    updateResume((prev) => {
      const projects = [...prev.firlance_projects];
      const current = projects[index];
      if (!current) return prev;

      projects[index] = { ...current, [field]: nextValue } as typeof current;
      return { ...prev, firlance_projects: projects };
    });
  };

  const addProject = () => {
    updateResume((prev) => ({
      ...prev,
      firlance_projects: [...prev.firlance_projects, createEmptyProject()],
    }));
  };

  const removeProject = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      firlance_projects: prev.firlance_projects.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          <p className="text-xs text-slate-500">Add your personal information here.</p>
        </div>
        <div className="grid gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            <span>Full name</span>
            <input
              type="text"
              value={value.profile.name}
              onChange={(event) => handleProfileField("name", event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            <span>Role / Title</span>
            <input
              type="text"
              value={value.profile.title}
              onChange={(event) => handleProfileField("title", event.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Contact list</h3>
            <p className="text-xs text-slate-500">Add the necessary contacts.</p>
          </div>
          <button
            type="button"
            onClick={addContact}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add contact
          </button>
        </div>
        <div className="space-y-4">
          {value.profile.contact.map((contact, index) => (
            <div key={`${contact.type}-${index}`} className="rounded-lg border border-slate-200 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeContact(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Type
                  <select
                    value={contact.type}
                    onChange={(event) => handleContactChange(index, "type", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  >
                    {CONTACT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Label
                  <input
                    type="text"
                    value={contact.title}
                    onChange={(event) => handleContactChange(index, "title", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Link / Value
                <input
                  type="text"
                  value={contact.link}
                  onChange={(event) => handleContactChange(index, "link", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
          <p className="text-xs text-slate-500">
            Write a brief summary about yourself.
          </p>
        </div>
        <textarea
          value={value.summary}
          onChange={(event) => handleSummaryChange(event.target.value)}
          rows={4}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Work experience</h3>
            <p className="text-xs text-slate-500">Add your work experiences.</p>
          </div>
          <button
            type="button"
            onClick={addWorkExperience}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add role
          </button>
        </div>
        <div className="space-y-4">
          {value.workExperience.map((exp, index) => (
            <div key={index} className="rounded-lg border border-slate-200 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeWorkExperience(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Company
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(event) => handleWorkChange(index, "company", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Role
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(event) => handleWorkChange(index, "position", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Start date
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(event) => handleWorkChange(index, "startDate", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  End date
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(event) => handleWorkChange(index, "endDate", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Location
                <input
                  type="text"
                  value={exp.location}
                  onChange={(event) => handleWorkChange(index, "location", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Responsibilities (one per line)
                <textarea
                  rows={4}
                  value={exp.responsibilities.join("\n")}
                  onChange={(event) => handleWorkChange(index, "responsibilities", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Education</h3>
            <p className="text-xs text-slate-500">Add your educational background.</p>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add education
          </button>
        </div>
        <div className="space-y-4">
          {value.education.map((edu, index) => (
            <div key={`${edu.institution}-${index}`} className="rounded-lg border border-slate-200 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Education {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Institution
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(event) => handleEducationChange(index, "institution", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Degree
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(event) => handleEducationChange(index, "degree", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Start date
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(event) => handleEducationChange(index, "startDate", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  End date
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(event) => handleEducationChange(index, "endDate", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Location
                <input
                  type="text"
                  value={edu.location}
                  onChange={(event) => handleEducationChange(index, "location", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Details (one per line)
                <textarea
                  rows={4}
                  value={(edu.details ?? []).join("\n")}
                  onChange={(event) => handleEducationChange(index, "details", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
            <p className="text-xs text-slate-500">Skills and technologies.</p>
          </div>
          <button
            type="button"
            onClick={addSkill}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add skill block
          </button>
        </div>
        <div className="space-y-4">
          {value.skills.map((skill, index) => (
            <div key={index} className="rounded-lg border border-slate-200 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Skill group {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Label
                <input
                  type="text"
                  value={skill.type}
                  onChange={(event) => handleSkillChange(index, "type", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Skills (comma separated)
                <textarea
                  rows={3}
                  value={skill.list.join(", ")}
                  onChange={(event) => handleSkillChange(index, "list", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
            <p className="text-xs text-slate-500">Freelance or personal projects.</p>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add project
          </button>
        </div>
        <div className="space-y-4">
          {value.firlance_projects.map((project, index) => (
            <div key={`${index}`} className="rounded-lg border border-slate-200 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Project {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Name
                <input
                  type="text"
                  value={project.name}
                  onChange={(event) => handleProjectChange(index, "name", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Live link
                  <input
                    type="text"
                    value={project.link ?? ""}
                    onChange={(event) => handleProjectChange(index, "link", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  GitHub link
                  <input
                    type="text"
                    value={project.githubLink ?? ""}
                    onChange={(event) => handleProjectChange(index, "githubLink", event.target.value)}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Description
                <textarea
                  rows={3}
                  value={project.description}
                  onChange={(event) => handleProjectChange(index, "description", event.target.value)}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
