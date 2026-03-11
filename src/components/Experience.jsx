import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const renderPointText = (point) =>
  point.split(/(\*\*.*?\*\*)/g).map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return <strong key={`point-strong-${index}`}>{segment.slice(2, -2)}</strong>;
    }

    return <React.Fragment key={`point-text-${index}`}>{segment}</React.Fragment>;
  });

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      className='experience-card'
      dateClassName='experience-date'
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
        borderRadius: "24px",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{
        background: experience.iconBg,
        borderRadius: "9999px",
        overflow: "hidden",
      }}
      icon={
        <div className='flex h-full w-full items-center justify-center rounded-full bg-white p-2'>
          <img
            src={experience.icon}
            alt={experience.company_name}
            className='h-full w-full rounded-full object-contain'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] leading-tight font-bold'>{experience.title}</h3>
        <p
          className='company-name text-secondary font-semibold'
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className='mt-4 list-disc ml-5 space-y-4'>
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] leading-[1.55] pl-1 tracking-wide'
          >
            {renderPointText(point)}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Work Experience.
        </h2>
      </motion.div>

      <div className='mt-10 flex flex-col'>
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
