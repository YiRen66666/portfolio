import React from "react";
import { motion } from "framer-motion";

import photo1 from "../assets/1.jpg";
import photo4 from "../assets/4.jpg";
import photo5 from "../assets/5.jpg";
import photo6 from "../assets/6.jpg";
import selfie from "../assets/selfie.jpg";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const galleryPhotos = [
  { id: 1, src: photo1, alt: "Yi Ren lifestyle photo 1" },
  { id: 4, src: photo5, alt: "Yi Ren lifestyle photo 4" },
  { id: 5, src: photo4, alt: "Yi Ren lifestyle photo 4" },
  { id: 6, src: photo6, alt: "Yi Ren lifestyle photo 6" },
];

const About = () => {
  return (
    <motion.div className='pt-20'>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>About me</h2>
      </motion.div>

      <div className='mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='text-white text-[16px] lg:text-[17px] max-w-2xl leading-[30px]'
        >
          Hey! I'm Yi Ren, a software developer with great passion for web development and interactive applications.
          I enjoy solving real-world problems through clean code and innovative design. <br />
          <br />
          My core stack includes <strong>JavaScript</strong>, <strong>Node.js</strong>, <strong>React</strong>, <strong>SpringBoot</strong>, <strong>PostgreSQL</strong> and Agile workflows,
          with hands-on experience prioritizing customer needs, and collaborating effectively in team environments.
          <br />
           <br />
          Beyond coding, l'm also a robotics enthusiast, Photographer,tennis player, and guzheng player.
        </motion.p>

        <motion.div
          variants={fadeIn("left", "spring", 0.2, 1)}
          className='mx-auto w-full max-w-[330px] lg:mx-0 lg:-mt-12 lg:-ml-8'
        >
          <div className='overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm'>
            <img
              src={selfie}
              alt='Yi Ren portrait'
              className='h-full w-full rounded-[22px] object-cover'
            />
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeIn("up", "spring", 0.25, 1)} className='mt-10'>
        <div className='mb-5 flex items-center justify-between gap-4'>
          <p className='text-[14px] font-semibold uppercase tracking-[0.28em] text-white/45'>
            Life Beyond Code
          </p>
        </div>

        <div className='overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          <div className='flex min-w-full gap-4'>
            {galleryPhotos.map((photo, index) => {
              const randomAngle = (index * 7 % 16) - 8;
              return (
                <motion.div
                  key={photo.id}
                  variants={fadeIn("up", "spring", 0.1 + index * 0.08, 0.8)}
                  className='flex-[0_0_clamp(240px,16vw,340px)] snap-start overflow-visible rounded-[26px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm'
                  style={{
                    transform: `rotate(${randomAngle}deg)`,
                    transition: 'transform 0.35s cubic-bezier(.4,2,.6,1)',
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: 0,
                    transition: { duration: 0.32, ease: [0.4, 2, 0.6, 1] },
                  }}
                >
                  {photo.src ? (
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className='h-[300px] w-full min-w-[220px] max-w-[320px] rounded-[20px] object-cover'
                      style={{
                        transition: 'width 0.3s',
                      }}
                    />
                  ) : (
                    <div className='flex h-[300px] w-full items-center justify-center rounded-[20px] bg-white/5 text-center text-[14px] font-medium leading-7 text-white/45'>
                      Add 5.jpg to src/assets
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default SectionWrapper(About, "about");
