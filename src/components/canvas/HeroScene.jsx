import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Preload, useGLTF } from "@react-three/drei";

import floatingFoxGlb from "../../glbSource/floating_fox.glb?url";
import foxIslandGlb from "../../glbSource/foxs_islands.glb?url";

const HeroSceneContent = lazy(() => import("./HeroSceneContent"));

const SceneLoader = () => {
  return (
    <Html center>
      <div
        style={{
          padding: "10px 18px",
          borderRadius: "999px",
          background: "rgba(15, 23, 42, 0.88)",
          border: "1px solid rgba(226, 232, 240, 0.28)",
          color: "#f8fafc",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          backdropFilter: "blur(8px)",
        }}
      >
        Loading 3D scene...
      </div>
    </Html>
  );
};

const HeroSceneCanvas = () => {
  const [screenSize, setScreenSize] = useState("desktop");
  const [isAboutFocused, setIsAboutFocused] = useState(false);
  const [isWorkFocused, setIsWorkFocused] = useState(false);
  const [isContactFocused, setIsContactFocused] = useState(false);
  const sceneScrollTimeoutRef = useRef(null);

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("mobile");
        return;
      }

      if (window.innerWidth < 1024) {
        setScreenSize("tablet");
        return;
      }

      setScreenSize("desktop");
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const cameraSettings = useMemo(() => {
    if (screenSize === "mobile") {
      return { position: [0, 0.55, 9], fov: 48 };
    }

    if (screenSize === "tablet") {
      return { position: [0, 0.7, 8.6], fov: 44 };
    }

    return { position: [0, 0.86, 9.35], fov: 40 };
  }, [screenSize]);

  useEffect(() => {
    return () => {
      if (sceneScrollTimeoutRef.current) {
        window.clearTimeout(sceneScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleAboutFocus = () => {
    if (sceneScrollTimeoutRef.current) {
      window.clearTimeout(sceneScrollTimeoutRef.current);
      sceneScrollTimeoutRef.current = null;
    }

    setIsWorkFocused(false);
    setIsContactFocused(false);
    setIsAboutFocused(true);

    sceneScrollTimeoutRef.current = window.setTimeout(() => {
      const aboutSection = document.getElementById("about");

      if (aboutSection) {
        const y =
          aboutSection.getBoundingClientRect().top + window.pageYOffset + 90;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });

        window.history.replaceState(null, "", "#about");
      }

      setIsAboutFocused(false);
      sceneScrollTimeoutRef.current = null;
    }, 2500);
  };

  const handleToggleWorkFocus = () => {
    if (sceneScrollTimeoutRef.current) {
      window.clearTimeout(sceneScrollTimeoutRef.current);
      sceneScrollTimeoutRef.current = null;
    }

    setIsAboutFocused(false);
    setIsContactFocused(false);
    setIsWorkFocused(true);

    sceneScrollTimeoutRef.current = window.setTimeout(() => {
      const workSection = document.getElementById("work");

      if (workSection) {
        const y =
          workSection.getBoundingClientRect().top + window.pageYOffset + 50;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });

        window.history.replaceState(null, "", "#work");
      }

      setIsWorkFocused(false);
      sceneScrollTimeoutRef.current = null;
    }, 2500);
  };

  const handleToggleContactFocus = () => {
    if (sceneScrollTimeoutRef.current) {
      window.clearTimeout(sceneScrollTimeoutRef.current);
      sceneScrollTimeoutRef.current = null;
    }

    setIsAboutFocused(false);
    setIsWorkFocused(false);
    setIsContactFocused(true);

    sceneScrollTimeoutRef.current = window.setTimeout(() => {
      const contactSection = document.getElementById("contact");

      if (contactSection) {
        const y =
          contactSection.getBoundingClientRect().top + window.pageYOffset + 80;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });

        window.history.replaceState(null, "", "#contact");
      }

      setIsContactFocused(false);
      sceneScrollTimeoutRef.current = null;
    }, 2500);
  };

  return (
    <Canvas
      frameloop="always"
      shadows={false}
      dpr={[1, 1.5]}
      camera={cameraSettings}
      gl={{ alpha: true, antialias: true }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        background: "transparent",
        cursor: "grab",
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0);
        scene.background = null;
      }}
    >
      <Suspense fallback={<SceneLoader />}>
        <HeroSceneContent
          screenSize={screenSize}
          isAboutFocused={isAboutFocused}
          isWorkFocused={isWorkFocused}
          isContactFocused={isContactFocused}
          onToggleAboutFocus={handleToggleAboutFocus}
          onToggleWorkFocus={handleToggleWorkFocus}
          onToggleContactFocus={handleToggleContactFocus}
          defaultCameraSettings={cameraSettings}
        />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

useGLTF.preload(floatingFoxGlb);
useGLTF.preload(foxIslandGlb);

export { HeroSceneCanvas };
export default HeroSceneCanvas;