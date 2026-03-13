import { BrowserRouter } from "react-router-dom";

import { About, Contact, Experience, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        {/* 全局星空背景 */}
        <StarsCanvas />

        <div className='relative z-0'>
          <div>
            <Navbar />
            <Hero />
          </div>
          <About />
          <Experience />
          <Tech />
          <Works />
          <Contact />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
