import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload, useGLTF } from "@react-three/drei";

import floatingFoxGlb from "../../glbSource/floating_fox.glb?url";
import foxIslandGlb from "../../glbSource/foxs_islands.glb?url";

const FloatingFoxModel = ({ screenSize }) => {
  const model = useGLTF(floatingFoxGlb);
  const foxGroup = useRef();

  const foxConfig = useMemo(() => {
    if (screenSize === "mobile") {
      return {
        scale: 0.12,
        position: [0.8, 0.35, -1.8],
      };
    }

    if (screenSize === "tablet") {
      return {
        scale: 0.15,
        position: [1.4, 0.85, -1.1],
      };
    }

    return {
      scale: 0.3,
      position: [2.8, 0.55, -1.5],
    };
  }, [screenSize]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (!foxGroup.current) return;

    foxGroup.current.position.y =
      foxConfig.position[1] + Math.sin(elapsed * 1.4) * 0.18;
    foxGroup.current.rotation.z = Math.sin(elapsed * 1.1) * 0.04;
    foxGroup.current.rotation.y = -0.18 + Math.sin(elapsed * 0.9) * 0.06;
  });

  return (
    <group ref={foxGroup}>
      <primitive
        object={model.scene}
        scale={foxConfig.scale}
        position={foxConfig.position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </group>
  );
};

const FoxIslandModel = ({ screenSize }) => {
  const model = useGLTF(foxIslandGlb);
  const { gl } = useThree();

  const islandRootRef = useRef();
  const isDraggingRef = useRef(false);
  const lastClientXRef = useRef(0);
  const rotationYRef = useRef(-0.22);
  const rotationVelocityRef = useRef(0);

  const baseRotation = useMemo(
    () => ({ x: -0.02, y: -0.22, z: -0.08 }),
    []
  );

  const islandConfig = useMemo(() => {
    if (screenSize === "mobile") {
      return {
        scale: 0.065,
        position: [0, -2.15, -2.2],
      };
    }

    if (screenSize === "tablet") {
      return {
        scale: 0.7,
        position: [0, -2.7, -1.9],
      };
    }

    return {
      scale: 0.09,
      position: [0, -1.85, -1.55],
    };
  }, [screenSize]);

  useEffect(() => {
    const canvas = gl.domElement;

    const readClientX = (event) => {
      if ("touches" in event && event.touches.length > 0) {
        return event.touches[0].clientX;
      }

      return event.clientX;
    };

    const handlePointerDown = (event) => {
      isDraggingRef.current = true;
      lastClientXRef.current = readClientX(event);
      rotationVelocityRef.current = 0;
      canvas.style.cursor = "grabbing";
    };

    const handlePointerMove = (event) => {
      if (!isDraggingRef.current) return;

      const clientX = readClientX(event);
      const deltaX = clientX - lastClientXRef.current;
      lastClientXRef.current = clientX;

      const rotationDelta = (deltaX / Math.max(window.innerWidth, 1)) * Math.PI * 1.2;

      rotationYRef.current += rotationDelta;
      rotationVelocityRef.current = rotationDelta * 0.35;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      canvas.style.cursor = "grab";
    };
  }, [gl]);

  useFrame(() => {
    if (!islandRootRef.current) return;

    if (!isDraggingRef.current && Math.abs(rotationVelocityRef.current) > 0.0001) {
      rotationYRef.current += rotationVelocityRef.current;
      rotationVelocityRef.current *= 0.94;
    }

    islandRootRef.current.rotation.x = baseRotation.x;
    islandRootRef.current.rotation.y = rotationYRef.current;
    islandRootRef.current.rotation.z = baseRotation.z;
  });

  return (
    <group
      ref={islandRootRef}
      position={islandConfig.position}
      scale={islandConfig.scale}
      rotation={[baseRotation.x, baseRotation.y, baseRotation.z]}
    >
      <primitive object={model.scene} />
    </group>
  );
};

const HeroSceneContent = ({ screenSize }) => {
  return (
    <>
      <hemisphereLight intensity={0.3} groundColor="#EB6E23" />
      <spotLight
        position={[-20, 40, 12]}
        angle={0.14}
        penumbra={1}
        intensity={0.1}
        castShadow={false}
      />
      <pointLight intensity={0.9} />

      <FloatingFoxModel screenSize={screenSize} />
      <FoxIslandModel screenSize={screenSize} />
    </>
  );
};

const HeroSceneCanvas = () => {
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
      return { position: [0, 0.55, 9], fov: 48 };
    }

    if (screenSize === "tablet") {
      return { position: [0, 0.7, 8.6], fov: 44 };
    }

    return { position: [0, 0.85, 8.2], fov: 40 };
  }, [screenSize]);

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
      <Suspense fallback={null}>
        <HeroSceneContent screenSize={screenSize} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

useGLTF.preload(floatingFoxGlb);
useGLTF.preload(foxIslandGlb);

export { HeroSceneCanvas };
export default HeroSceneCanvas;