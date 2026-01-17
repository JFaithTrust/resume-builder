export type ContactType = "email" | "phone" | "linkedin" | "github" | "other";

export interface IContact {
  link: string;
  title: string;
  type: ContactType;
}

export interface IProfile {
  name: string;
  title: string;
  contact: IContact[];
}

export interface IWorkExperience {
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

export interface IEducation {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  location: string;
  details?: string[];
}

export interface ISkill {
  type: string;
  list: string[];
}

export interface IFirlanceProject {
  name: string;
  link?: string;
  githubLink?: string;
  description: string;
}

export interface IResume {
  profile: IProfile;
  summary: string;
  workExperience: IWorkExperience[];
  education: IEducation[];
  skills: ISkill[];
  firlance_projects: IFirlanceProject[];
}
