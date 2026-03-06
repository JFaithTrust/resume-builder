"use client";

import { useCallback, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";

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

const inputCls =
  "rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none w-full";
const textareaCls =
  "rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none w-full resize-y";

/** Checkbox that swaps a date field between "Present" and a typed value */
function PresentToggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer select-none mt-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="rounded border-slate-300 accent-[#114A8A]"
      />
      <span className="text-xs text-slate-500">Currently here</span>
    </label>
  );
}

interface SortableWorkExperienceItemProps {
  exp: ReturnType<typeof createEmptyWorkExperience>;
  index: number;
  isCollapsed: boolean;
  onToggleCollapse: (index: number) => void;
  handleWorkChange: (
    index: number,
    field: keyof ReturnType<typeof createEmptyWorkExperience>,
    value: string
  ) => void;
  removeWorkExperience: (index: number) => void;
  addKeyProject: (workIndex: number) => void;
  removeKeyProject: (workIndex: number, projectIndex: number) => void;
  handleKeyProjectChange: (
    workIndex: number,
    projectIndex: number,
    field: "name" | "link",
    value: string
  ) => void;
}

function SortableWorkExperienceItem({
  exp,
  index,
  isCollapsed,
  onToggleCollapse,
  handleWorkChange,
  removeWorkExperience,
  addKeyProject,
  removeKeyProject,
  handleKeyProjectChange,
}: SortableWorkExperienceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `work-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isPresent = exp.endDate === "Present";
  const summary = [exp.company, exp.position].filter(Boolean).join(" — ");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-slate-200 bg-white"
    >
      {/* Card header — always visible */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none p-1 hover:bg-slate-100 rounded shrink-0"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4 text-slate-400" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 truncate">
            {summary || `Role ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => removeWorkExperience(index)}
            className="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
          <button
            type="button"
            onClick={() => onToggleCollapse(index)}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronUp className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable body */}
      {!isCollapsed && (
        <div className="px-3 pb-3 space-y-3 border-t border-slate-100 pt-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-slate-600">
              Company
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleWorkChange(index, "company", e.target.value)}
                className={inputCls}
                placeholder="Acme Corp"
                aria-label={`Role ${index + 1} company name`}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-slate-600">
              Job title
              <input
                type="text"
                value={exp.position}
                onChange={(e) => handleWorkChange(index, "position", e.target.value)}
                className={inputCls}
                placeholder="Software Engineer"
                aria-label={`Role ${index + 1} job title`}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-slate-600">
            Company URL
            <input
              type="text"
              value={exp.companyLink ?? ""}
              onChange={(e) => handleWorkChange(index, "companyLink", e.target.value)}
              className={inputCls}
              placeholder="https://company.com (optional)"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-slate-600">
              Start date
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => handleWorkChange(index, "startDate", e.target.value)}
                className={inputCls}
                placeholder="Jan 2022"
              />
            </label>
            <div className="flex flex-col gap-1 text-xs text-slate-600">
              End date
              <input
                type="text"
                value={isPresent ? "" : exp.endDate}
                onChange={(e) => handleWorkChange(index, "endDate", e.target.value)}
                className={inputCls}
                placeholder={isPresent ? "Present" : "Dec 2024"}
                disabled={isPresent}
              />
              <PresentToggle
                checked={isPresent}
                onToggle={() =>
                  handleWorkChange(index, "endDate", isPresent ? "" : "Present")
                }
              />
            </div>
          </div>
          <label className="flex flex-col gap-1 text-xs text-slate-600">
            Location
            <input
              type="text"
              value={exp.location}
              onChange={(e) => handleWorkChange(index, "location", e.target.value)}
              className={inputCls}
              placeholder="San Francisco, CA or Remote"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-600">
            Responsibilities
            <span className="text-slate-400 font-normal">(one bullet per line)</span>
            <textarea
              rows={5}
              value={exp.responsibilities.join("\n")}
              onChange={(e) => handleWorkChange(index, "responsibilities", e.target.value)}
              className={textareaCls}
              placeholder={"Led development of X, resulting in Y.\nCollaborated with Z to deliver..."}
            />
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">
                Key projects <span className="text-slate-400 font-normal">(optional)</span>
              </span>
              <button
                type="button"
                onClick={() => addKeyProject(index)}
                className="text-xs font-semibold text-[#114A8A] hover:underline"
              >
                + Add project
              </button>
            </div>
            {exp.key_projects && exp.key_projects.length > 0 && (
              <div className="space-y-2">
                {exp.key_projects.map((project, projectIdx) => (
                  <div key={projectIdx} className="flex gap-2 items-start">
                    <input
                      type="text"
                      placeholder="Project name"
                      value={project.name}
                      onChange={(e) =>
                        handleKeyProjectChange(index, projectIdx, "name", e.target.value)
                      }
                      className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-slate-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="https://... (optional)"
                      value={project.link || ""}
                      onChange={(e) =>
                        handleKeyProjectChange(index, projectIdx, "link", e.target.value)
                      }
                      className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs focus:border-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyProject(index, projectIdx)}
                      className="text-xs text-red-500 hover:underline px-2 py-1.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ResumeForm({ value, onChange }: ResumeFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [collapsedWork, setCollapsedWork] = useState<Record<number, boolean>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateResume = useCallback(
    (updater: (prev: IResume) => IResume) => {
      onChange(updater);
    },
    [onChange],
  );

  const toggleCollapse = useCallback((index: number) => {
    setCollapsedWork((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const handleProfileField = (field: "name" | "title", nextValue: string) => {
    updateResume((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: nextValue },
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
      const contact = [...(prev.profile?.contact || [])];
      contact[index] = { ...contact[index], [field]: nextValue };
      return { ...prev, profile: { ...prev.profile, contact } };
    });
  };

  const addContact = () => {
    updateResume((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        contact: [...(prev.profile?.contact || []), createEmptyContact()],
      },
    }));
  };

  const removeContact = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        contact: (prev.profile?.contact || []).filter((_, idx) => idx !== index),
      },
    }));
  };

  const handleWorkChange = (
    index: number,
    field: keyof ReturnType<typeof createEmptyWorkExperience>,
    nextValue: string,
  ) => {
    updateResume((prev) => {
      const experiences = [...(prev.workExperience || [])];
      const current = experiences[index];
      if (!current) return prev;

      if (field === "responsibilities") {
        const lines = nextValue.split("\n").map((line) => line.trim());
        experiences[index] = { ...current, responsibilities: lines };
      } else {
        experiences[index] = { ...current, [field]: nextValue } as typeof current;
      }
      return { ...prev, workExperience: experiences };
    });
  };

  const addWorkExperience = () => {
    updateResume((prev) => ({
      ...prev,
      workExperience: [...(prev.workExperience || []), createEmptyWorkExperience()],
    }));
  };

  const removeWorkExperience = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      workExperience: (prev.workExperience || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleWorkExperienceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      updateResume((prev) => {
        const oldIndex = prev.workExperience.findIndex(
          (_, idx) => `work-${idx}` === active.id,
        );
        const newIndex = prev.workExperience.findIndex(
          (_, idx) => `work-${idx}` === over.id,
        );
        return {
          ...prev,
          workExperience: arrayMove(prev.workExperience, oldIndex, newIndex),
        };
      });
    }
  };

  const addKeyProject = (workIndex: number) => {
    updateResume((prev) => {
      const workExperience = [...(prev.workExperience || [])];
      const current = workExperience[workIndex];
      if (!current) return prev;
      workExperience[workIndex] = {
        ...current,
        key_projects: [...(current.key_projects || []), { name: "", link: "" }],
      };
      return { ...prev, workExperience };
    });
  };

  const removeKeyProject = (workIndex: number, projectIndex: number) => {
    updateResume((prev) => {
      const workExperience = [...(prev.workExperience || [])];
      const current = workExperience[workIndex];
      if (!current || !current.key_projects) return prev;
      workExperience[workIndex] = {
        ...current,
        key_projects: current.key_projects.filter((_, idx) => idx !== projectIndex),
      };
      return { ...prev, workExperience };
    });
  };

  const handleKeyProjectChange = (
    workIndex: number,
    projectIndex: number,
    field: "name" | "link",
    val: string,
  ) => {
    updateResume((prev) => {
      const workExperience = [...(prev.workExperience || [])];
      const current = workExperience[workIndex];
      if (!current || !current.key_projects) return prev;
      const keyProjects = [...current.key_projects];
      keyProjects[projectIndex] = { ...keyProjects[projectIndex], [field]: val };
      workExperience[workIndex] = { ...current, key_projects: keyProjects };
      return { ...prev, workExperience };
    });
  };

  const handleEducationChange = (
    index: number,
    field: keyof ReturnType<typeof createEmptyEducation>,
    nextValue: string,
  ) => {
    updateResume((prev) => {
      const education = [...(prev.education || [])];
      const current = education[index];
      if (!current) return prev;
      if (field === "details") {
        education[index] = {
          ...current,
          details: nextValue.split("\n").map((l) => l.trim()).filter(Boolean),
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
      education: [...(prev.education || []), createEmptyEducation()],
    }));
  };

  const removeEducation = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSkillChange = (index: number, field: "type" | "list", nextValue: string) => {
    updateResume((prev) => {
      const skills = [...(prev.skills || [])];
      const current = skills[index];
      if (!current) return prev;
      if (field === "list") {
        const entries = nextValue.split(",").map((item) => item.trim());
        skills[index] = { ...current, list: entries[0] === "" ? [] : entries };
      } else {
        skills[index] = { ...current, type: nextValue };
      }
      return { ...prev, skills };
    });
  };

  const addSkill = () => {
    updateResume((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), createEmptySkill()],
    }));
  };

  const removeSkill = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleProjectChange = (
    index: number,
    field: keyof ReturnType<typeof createEmptyProject> | "link" | "githubLink",
    nextValue: string,
  ) => {
    updateResume((prev) => {
      const projects = [...(prev.freelance_projects || [])];
      const current = projects[index];
      if (!current) return prev;
      projects[index] = { ...current, [field]: nextValue } as typeof current;
      return { ...prev, freelance_projects: projects };
    });
  };

  const addProject = () => {
    updateResume((prev) => ({
      ...prev,
      freelance_projects: [...(prev.freelance_projects || []), createEmptyProject()],
    }));
  };

  const removeProject = (index: number) => {
    updateResume((prev) => ({
      ...prev,
      freelance_projects: (prev.freelance_projects || []).filter((_, idx) => idx !== index),
    }));
  };

  const workItems = isMounted ? (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleWorkExperienceDragEnd}
    >
      <SortableContext
        items={value.workExperience?.map((_, i) => `work-${i}`) || []}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {value.workExperience?.map((exp, index) => (
            <SortableWorkExperienceItem
              key={`work-${index}`}
              exp={exp}
              index={index}
              isCollapsed={!!collapsedWork[index]}
              onToggleCollapse={toggleCollapse}
              handleWorkChange={handleWorkChange}
              removeWorkExperience={removeWorkExperience}
              addKeyProject={addKeyProject}
              removeKeyProject={removeKeyProject}
              handleKeyProjectChange={handleKeyProjectChange}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  ) : (
    <div className="space-y-3">
      {value.workExperience.map((exp, index) => (
        <SortableWorkExperienceItem
          key={`work-${index}`}
          exp={exp}
          index={index}
          isCollapsed={!!collapsedWork[index]}
          onToggleCollapse={toggleCollapse}
          handleWorkChange={handleWorkChange}
          removeWorkExperience={removeWorkExperience}
          addKeyProject={addKeyProject}
          removeKeyProject={removeKeyProject}
          handleKeyProjectChange={handleKeyProjectChange}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ── Profile ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          <p className="text-xs text-slate-500">Your name and current role.</p>
        </div>
        <div className="grid gap-4">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Full name
            <input
              type="text"
              value={value.profile.name}
              onChange={(e) => handleProfileField("name", e.target.value)}
              className={inputCls}
              placeholder="Alex Johnson"
              aria-label="Full name"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Role / Title
            <input
              type="text"
              value={value.profile.title}
              onChange={(e) => handleProfileField("title", e.target.value)}
              className={inputCls}
              placeholder="Software Engineer"
              aria-label="Professional role or title"
            />
          </label>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
            <p className="text-xs text-slate-500">Email, phone, LinkedIn, GitHub, etc.</p>
          </div>
          <button
            type="button"
            onClick={addContact}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add contact
          </button>
        </div>
        <div className="space-y-3">
          {value.profile?.contact?.map((contact, index) => (
            <div
              key={`${contact.type}-${index}`}
              className="rounded-lg border border-slate-200 p-3 space-y-3"
            >
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
                    onChange={(e) => handleContactChange(index, "type", e.target.value)}
                    className={inputCls}
                    aria-label={`Contact ${index + 1} type`}
                  >
                    {CONTACT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Display label
                  <input
                    type="text"
                    value={contact.title}
                    onChange={(e) => handleContactChange(index, "title", e.target.value)}
                    className={inputCls}
                    placeholder={
                      contact.type === "email"
                        ? "you@example.com"
                        : contact.type === "phone"
                        ? "+1 (555) 000-1234"
                        : contact.type === "linkedin"
                        ? "linkedin.com/in/you"
                        : contact.type === "github"
                        ? "github.com/you"
                        : "My Website"
                    }
                    aria-label={`Contact ${index + 1} label`}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Link / Value
                <input
                  type="text"
                  value={contact.link}
                  onChange={(e) => handleContactChange(index, "link", e.target.value)}
                  className={inputCls}
                  placeholder={
                    contact.type === "email"
                      ? "mailto:you@example.com"
                      : contact.type === "phone"
                      ? "tel:+15550001234"
                      : contact.type === "linkedin"
                      ? "https://linkedin.com/in/you"
                      : contact.type === "github"
                      ? "https://github.com/you"
                      : "https://yourwebsite.com"
                  }
                  aria-label={`Contact ${index + 1} link`}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* ── Summary ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
          <p className="text-xs text-slate-500">
            2–4 sentences about your experience and goals.
          </p>
        </div>
        <div className="relative">
          <textarea
            value={value.summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            rows={5}
            className={textareaCls}
            placeholder="Results-driven engineer with X years of experience building... Passionate about..."
            aria-label="Professional summary"
          />
          <span className="block text-right text-[11px] text-slate-400 mt-1">
            {value.summary?.length ?? 0} characters
          </span>
        </div>
      </section>

      {/* ── Work Experience ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Work experience</h3>
            <p className="text-xs text-slate-500">
              Most recent first. Drag to reorder.
            </p>
          </div>
          <button
            type="button"
            onClick={addWorkExperience}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add role
          </button>
        </div>
        {workItems}
      </section>

      {/* ── Education ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Education</h3>
            <p className="text-xs text-slate-500">Degrees, certifications, courses.</p>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add education
          </button>
        </div>
        <div className="space-y-3">
          {value.education?.map((edu, index) => {
            const isPresent = edu.endDate === "Present";
            return (
              <div
                key={`${edu.institution}-${index}`}
                className="rounded-lg border border-slate-200 p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {edu.institution || `Education ${index + 1}`}
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
                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                    className={inputCls}
                    placeholder="State University"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Degree
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                    className={inputCls}
                    placeholder="BSc in Computer Science"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs text-slate-600">
                    Start date
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                      className={inputCls}
                      placeholder="Sep 2019"
                    />
                  </label>
                  <div className="flex flex-col gap-1 text-xs text-slate-600">
                    End date
                    <input
                      type="text"
                      value={isPresent ? "" : edu.endDate}
                      onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                      className={inputCls}
                      placeholder={isPresent ? "Present" : "May 2023"}
                      disabled={isPresent}
                    />
                    <PresentToggle
                      checked={isPresent}
                      onToggle={() =>
                        handleEducationChange(
                          index,
                          "endDate",
                          isPresent ? "" : "Present",
                        )
                      }
                    />
                  </div>
                </div>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Location
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                    className={inputCls}
                    placeholder="New York, NY"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Details
                  <span className="text-slate-400 font-normal">(one item per line — GPA, honours, courses)</span>
                  <textarea
                    rows={3}
                    value={(edu.details ?? []).join("\n")}
                    onChange={(e) => handleEducationChange(index, "details", e.target.value)}
                    className={textareaCls}
                    placeholder={"GPA: 3.8/4.0, Dean's List.\nCourses: Algorithms, Databases..."}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Skills</h3>
            <p className="text-xs text-slate-500">Group skills by proficiency or category.</p>
          </div>
          <button
            type="button"
            onClick={addSkill}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add group
          </button>
        </div>
        <div className="space-y-3">
          {value.skills?.map((skill, index) => (
            <div key={index} className="rounded-lg border border-slate-200 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {skill.type || `Skill group ${index + 1}`}
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
                Group label
                <input
                  type="text"
                  value={skill.type}
                  onChange={(e) => handleSkillChange(index, "type", e.target.value)}
                  className={inputCls}
                  placeholder="Proficient / Tools / Languages"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Skills
                <span className="text-slate-400 font-normal">(comma-separated)</span>
                <textarea
                  rows={2}
                  value={skill.list.join(", ")}
                  onChange={(e) => handleSkillChange(index, "list", e.target.value)}
                  className={textareaCls}
                  placeholder="TypeScript, React, Next.js, Node.js"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
            <p className="text-xs text-slate-500">Freelance, open-source, or personal work.</p>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="text-xs font-semibold text-[#114A8A] hover:underline"
          >
            + Add project
          </button>
        </div>
        <div className="space-y-3">
          {value.freelance_projects?.map((project, index) => (
            <div key={index} className="rounded-lg border border-slate-200 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {project.name || `Project ${index + 1}`}
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
                Project name
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                  className={inputCls}
                  placeholder="My Awesome Project"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  Live URL
                  <input
                    type="text"
                    value={project.link ?? ""}
                    onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                    className={inputCls}
                    placeholder="https://myproject.com (optional)"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-600">
                  GitHub URL
                  <input
                    type="text"
                    value={project.githubLink ?? ""}
                    onChange={(e) => handleProjectChange(index, "githubLink", e.target.value)}
                    className={inputCls}
                    placeholder="https://github.com/you/repo (optional)"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs text-slate-600">
                Description
                <textarea
                  rows={3}
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                  className={textareaCls}
                  placeholder="What it does, technologies used, and any notable outcomes."
                />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
