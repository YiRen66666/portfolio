import { styles } from "../styles";
import { HeroSceneCanvas } from "./canvas";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto overflow-hidden top-[150px]">
      <div className="absolute inset-0 z-0">
        <HeroSceneCanvas />
      </div>

      <div
        className={`pointer-events-none absolute inset-0 top-[30px] z-10 max-w-[1680px] mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        <div className="flex-1">
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-[#915EFF]">Yi Ren</span>
          </h1>

          <p className={`${styles.heroSubText} mt-5 text-white-100`}>
            A passionate software Developer <br /> with expertise in Javascript, Node.js and React.A
          </p>

          <div className={`${styles.heroSubSubText} pointer-events-auto mt-5 text-white-100`}>
            <a
              href="mailto:renyi6156@gmail.com"
              className="block w-fit transition-colors duration-200 hover:text-[#915EFF]"
            >
              <strong>Email:</strong> renyi6156@gmail.com
            </a>
            <a
              href="https://github.com/YiRen66666"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block w-fit transition-colors duration-200 hover:text-[#915EFF]"
            >
              <strong>Github:</strong> github.com/YiRen66666
            </a>
            <a
              href="https://www.linkedin.com/in/yi-ren-profile/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block w-fit transition-colors duration-200 hover:text-[#915EFF]"
            >
              <strong>Linkedin:</strong> yiren.linkedin.com
            </a>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;