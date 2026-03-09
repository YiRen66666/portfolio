import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF } from "@react-three/drei";

import floatingFoxGlb from "../../glbSource/floating_fox.glb?url";

const FoxIslands = ({ screenSize }) => {
  const model = useGLTF(floatingFoxGlb);
  const foxGroup = useRef();
  const foxConfig = useMemo(() => {
    if (screenSize === "mobile") {
      return {
        scale: 0.24,
        position: [-0.1, -0.55, -2.2],
      };
    }

    if (screenSize === "tablet") {
      return {
        scale: 0.29,
        position: [-0.55, -0.2, -1.8],
      };
    }

    return {
      scale: 0.5,
      position: [-0.8, 1, -1.5],
    };
  }, [screenSize]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (!foxGroup.current) {
      return;
    }

    foxGroup.current.position.y = Math.sin(elapsed * 1.4) * 0.18;
    foxGroup.current.rotation.z = Math.sin(elapsed * 1.1) * 0.04;
    foxGroup.current.rotation.y = -0.18 + Math.sin(elapsed * 0.9) * 0.06;
  });

  return (
    <>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <group ref={foxGroup}>
        <primitive
          object={model.scene}
          scale={foxConfig.scale}
          position={foxConfig.position}
          rotation={[-0.01, -0.2, -0.1]}
        />
      </group>
    </>
  );
};

const FloatingFoxCanvas = () => {
  const [screenSize, setScreenSize] = useState("desktop");

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
      return { position: [0, 0.5, 9.2], fov: 46 };
    }

    if (screenSize === "tablet") {
      return { position: [0, 0.7, 8.9], fov: 43 };
    }

    return { position: [0, 0.9, 8.6], fov: 40 };
  }, [screenSize]);

  return (
    <div className='h-full w-full bg-transparent' style={{ background: "transparent" }}>
      <Canvas
        frameloop="always"
        shadows
        dpr={[1, 2]}
        camera={cameraSettings}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#000000", 0);
          scene.background = null;
        }}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      >
        <Suspense fallback={null}>
          <FoxIslands screenSize={screenSize} />
        </Suspense>

        <Preload all />
      </Canvas>
    </div>
  );
};

export default FloatingFoxCanvas;
