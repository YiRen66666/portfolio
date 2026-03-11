import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";

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
      scale: 0.18,
      position: [2.9, 0.84, -1.75],
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

const FoxIslandModel = ({ screenSize, isAboutFocused, onToggleAboutFocus, defaultCameraSettings }) => {
  const model = useGLTF(foxIslandGlb);
  const { gl, camera } = useThree();

  const islandRootRef = useRef();
  const aboutAnchorRef = useRef();
  const isDraggingRef = useRef(false);
  const lastClientXRef = useRef(0);
  const rotationYRef = useRef(-0.22);
  const rotationVelocityRef = useRef(0);
  const cameraLookAtRef = useRef(new THREE.Vector3(0, 0.2, 0));
  const focusWorldPositionRef = useRef(new THREE.Vector3());
  const focusOffsetRef = useRef(new THREE.Vector3());
  const rootQuaternionRef = useRef(new THREE.Quaternion());

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
        scale: 0.11,
        position: [0, -2.7, -1.9],
      };
    }

    return {
      scale: 0.086,
      position: [0, -1.55, -1.62],
    };
  }, [screenSize]);

  const roofMarkerPosition = useMemo(() => {
    return [5.2, 10.2, 0.6];
  }, []);

  const aboutFocusOffset = useMemo(() => {
    if (screenSize === "mobile") {
      return [2.2, 1.15, 4.2];
    }

    if (screenSize === "tablet") {
      return [2.45, 1.25, 4.75];
    }

    return [2.55, 1.25, 5.0];
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

      const rotationDelta =
        (deltaX / Math.max(window.innerWidth, 1)) * Math.PI * 1.2;

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

    const lerpAlpha = 0.08;

    if (isAboutFocused && aboutAnchorRef.current) {
      aboutAnchorRef.current.getWorldPosition(focusWorldPositionRef.current);
      islandRootRef.current.getWorldQuaternion(rootQuaternionRef.current);

      focusOffsetRef.current
        .set(...aboutFocusOffset)
        .applyQuaternion(rootQuaternionRef.current);

      camera.position.lerp(
        focusWorldPositionRef.current.clone().add(focusOffsetRef.current),
        lerpAlpha
      );
      cameraLookAtRef.current.lerp(focusWorldPositionRef.current, lerpAlpha);
    } else {
      camera.position.lerp(
        new THREE.Vector3(...defaultCameraSettings.position),
        lerpAlpha
      );
      cameraLookAtRef.current.lerp(new THREE.Vector3(0, 0.2, 0), lerpAlpha);
    }

    camera.lookAt(cameraLookAtRef.current);
  });

  return (
    <group
      ref={islandRootRef}
      position={islandConfig.position}
      scale={islandConfig.scale}
      rotation={[baseRotation.x, baseRotation.y, baseRotation.z]}
    >
      <primitive object={model.scene} />
      <group ref={aboutAnchorRef} position={roofMarkerPosition}>
        <AboutHotspot position={[0, 0, 0]} onActivate={onToggleAboutFocus} />
      </group>
    </group>
  );
};

const AboutHotspot = ({ position = [0, 0, 0], onActivate }) => {
  const [hovered, setHovered] = useState(false);
  const hotspotInnerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!hotspotInnerRef.current) return;

    // 轻微呼吸感
    const scale = hovered
      ? 1.08 + Math.sin(t * 4.5) * 0.02
      : 1.02 + Math.sin(t * 4.5) * 0.008;

    hotspotInnerRef.current.scale.set(scale, scale, scale);
  });

  const handleEnter = (event) => {
    event.stopPropagation();
    setHovered(true);
  };

  const handleLeave = (event) => {
    event.stopPropagation();
    setHovered(false);
  };

  const handleActivate = (event) => {
    event.stopPropagation();

    if (onActivate) {
      onActivate();
    }
  };

  return (
    <group position={position}>
      <Billboard follow>
        <group ref={hotspotInnerRef}>
          {/* 中心发光点 */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.046, 24, 24]} />
            <meshBasicMaterial
              color={hovered ? "#5ccfff" : "#f8fafc"}
              transparent
              opacity={hovered ? 1 : 0.96}
              depthWrite={false}
            />
          </mesh>

          {/* 主圆环 */}
          <mesh
            position={[0, 0, 0.01]}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
            onClick={handleActivate}
          >
            <ringGeometry args={[0.1, 0.17, 64]} />
            <meshBasicMaterial
              color={hovered ? "#60d8ff" : "#e2e8f0"}
              transparent
              opacity={hovered ? 1 : 0.92}
              depthWrite={false}
            />
          </mesh>

          {/* 外围呼吸光晕 */}
          <mesh position={[0, 0, -0.005]} scale={hovered ? 1.2 : 1.08}>
            <ringGeometry args={[0.18, 0.31, 64]} />
            <meshBasicMaterial
              color={hovered ? "#38bdf8" : "#cbd5e1"}
              transparent
              opacity={hovered ? 0.22 : 0.08}
              depthWrite={false}
            />
          </mesh>

          {/* About 标签 */}
          <Html
            center
            position={[0.24, 0, 0]}
            style={{ pointerEvents: "auto" }}
            zIndexRange={[100, 0]}
          >
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={handleActivate}
              style={{
                padding: "9px 20px",
                borderRadius: "999px",
                border: `1px solid ${
                  hovered ? "rgba(96,216,255,0.95)" : "rgba(226,232,240,0.45)"
                }`,
                background: hovered
                  ? "linear-gradient(180deg, rgba(23,37,84,0.92), rgba(12,22,48,0.9))"
                  : "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(15,23,42,0.76))",
                color: hovered ? "#7dd3fc" : "#f8fafc",
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                userSelect: "none",
                cursor: "pointer",
                textRendering: "geometricPrecision",
                WebkitFontSmoothing: "antialiased",
                boxShadow: hovered
                  ? "0 0 0 1px rgba(96,216,255,0.12), 0 10px 24px rgba(2,132,199,0.22)"
                  : "0 8px 20px rgba(15,23,42,0.18)",
                backdropFilter: "blur(10px)",
                transition:
                  "border-color 0.2s ease, color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                transform: hovered ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              About
            </div>
          </Html>
        </group>
      </Billboard>
    </group>
  );
};

const HeroSceneContent = ({ screenSize, isAboutFocused, onToggleAboutFocus, defaultCameraSettings }) => {
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
      <FoxIslandModel
        screenSize={screenSize}
        isAboutFocused={isAboutFocused}
        onToggleAboutFocus={onToggleAboutFocus}
        defaultCameraSettings={defaultCameraSettings}
      />
    </>
  );
};

const HeroSceneCanvas = () => {
  const [screenSize, setScreenSize] = useState("desktop");
  const [isAboutFocused, setIsAboutFocused] = useState(false);
  const aboutScrollTimeoutRef = useRef(null);

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
      if (aboutScrollTimeoutRef.current) {
        window.clearTimeout(aboutScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleAboutFocus = () => {
    if (aboutScrollTimeoutRef.current) {
      window.clearTimeout(aboutScrollTimeoutRef.current);
      aboutScrollTimeoutRef.current = null;
    }

    setIsAboutFocused(true);

    aboutScrollTimeoutRef.current = window.setTimeout(() => {
      const aboutSection = document.getElementById("about");

      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", "#about");
      }

      setIsAboutFocused(false);
      aboutScrollTimeoutRef.current = null;
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
      <Suspense fallback={null}>
        <HeroSceneContent
          screenSize={screenSize}
          isAboutFocused={isAboutFocused}
          onToggleAboutFocus={handleToggleAboutFocus}
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