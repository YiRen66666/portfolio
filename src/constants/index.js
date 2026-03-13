import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  bostonScientific,
  feelingai,
  WheelEasy,
  teamfacilitator,
  bigbrain,
  annotationtool,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Software Developer",
    company_name: "Feeling AI",
    icon: feelingai,
    iconBg: "#383E56",
    date: "March 2025 - Dec 2025",
    points: [
      "Built a web-based 3D annotation tool by **React.js** and **Three.js**, focusing on optimization of annotation workflow and rendering performance",
      "Developed reusable backend modules using **.NET REST APIs** and **PostgreSQL** to maintain stability across the platform.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Contributed **CI/CD** pipelines using **Jenkins** and **AWS** to deployment workflows.",
    ],
  },

  {
    title: "IT Intern",
    company_name: "WheelEasy",
    icon: WheelEasy,
    iconBg: "#E6DEDD",
    date: "May 2024 - Jan 2025",
    points: [
      " Redesigned accessibility-first UI for wheelchair users using **React** and **MUI/Tailwind**, following **WCAG/ARIA** best practices, increasing average session duration by 15~20%.",
      " Worked in an **Agile environment** using Jira and GitHub to track progress effectively with the team.",
      " Collaborated with UX designers and product managers to understand requirements and improve the user interface accordingly.",
      " Integrated **Pytest framework** as a release quality gate, ensuring robost coverage across all wrokflows",
    ],
  },
  {
    title: " IT Intern",
    company_name: "Boston Scientific | Interventional Pulmonology Department",
    icon: bostonScientific,
    iconBg: "#E6DEDD",
    date: "Jan 2022 - Jan 2023",
    points: [
      " Helped maintain internal documentation systems  related to medical literature and device information.",
      " Performed data retrieval and documentation tracking for import/export records.",
      " Debugged and troubleshot software integration issues."
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Team AI-powered collaboration facilitator",
    description:
      "AI-powered facilitator for  group projects, solving communication breakdowns and fragmented task management.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "PostgreSQL",
        color: "green-text-gradient",
      },
      {
        name: "Docker",
        color: "pink-text-gradient",
      },
    ],
    image: teamfacilitator,
    source_code_link: "https://github.com/unsw-cse-comp99-3900/capstone-project-9900-w14a-almond",
  },
  {
    name: "Big Brain",
    description:
      "A full-stack quiz platform that allows admins to create and manage games, start live sessions, and track player results through a responsive single-page interface.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "REST API",
        color: "green-text-gradient",
      },
      {
        name: "MUI",
        color: "pink-text-gradient",
      },
    ],
    image: bigbrain,
    source_code_link: "https://github.com/YiRen66666/BigBrain",
  },
  {
    name: "Annotation Tool",
    description:
      "A research-driven annotation tool built for accurate motion labeling, helping improve data quality and generate reliable training data for algorithm teams.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Python",
        color: "green-text-gradient",
      },
      {
        name: "Jerkins",
        color: "pink-text-gradient",
      },
    ],
    image: annotationtool,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };
