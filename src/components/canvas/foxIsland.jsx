import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import foxIslandGlb from "../../glbSource/foxs_islands.glb?url";

const FoxIslandModel = ({ screenSize }) => {
  const gltf = useGLTF(foxIslandGlb);
  const islandRef = useRef();

  const islandConfig = useMemo(() => {
    if (screenSize === "mobile") {
      return {
        scale: 0.16,
        position: [0, -2.55, -2.2],
      };
    }

    if (screenSize === "tablet") {
      return {
        scale: 0.3,
        position: [0, -2.7, -1.9],
      };
    }

    return {
      scale: 0.09,
      position: [0, -1.85, -1.55],
    };
  }, [screenSize]);

  const islandScene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);

    clonedScene.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;

      obj.material = obj.material.clone();

      // 整体统一微调
     obj.material.color.offsetHSL(10.02, 2.05, 3.04);
      // 参数解释：
      // 第1个：色相 hue，正负都能偏色
      // 第2个：饱和度 saturation，负数更灰，正数更鲜艳
      // 第3个：亮度 lightness，正数更亮，负数更暗

      obj.material.needsUpdate = true;
    });

    return clonedScene;
  }, [gltf.scene]);

  useFrame((state) => {
    if (!islandRef.current) return;

    islandRef.current.rotation.x = -0.02;
    islandRef.current.rotation.z = -0.08;
    islandRef.current.rotation.y = -0.22 + state.pointer.x * 0.22;
  });

  return (
    <primitive
      ref={islandRef}
      object={islandScene}
      scale={islandConfig.scale}
      position={islandConfig.position}
      rotation={[-0.02, -0.22, -0.08]}
    />
  );
};

const FoxIslandCanvas = () => {
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
      return { position: [0, 0.6, 7.8], fov: 48 };
    }

    if (screenSize === "tablet") {
      return { position: [0, 0.7, 7.2], fov: 44 };
    }

    return { position: [0, 0.85, 6.8], fov: 40 };
  }, [screenSize]);

  return (
    <Canvas
      frameloop="always"
      shadows
      dpr={[1, 2]}
      camera={cameraSettings}
      gl={{
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        background: "transparent",
      }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0);
        scene.background = null;
      }}
    >
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
        />
        <FoxIslandModel screenSize={screenSize} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

useGLTF.preload(foxIslandGlb);

export default FoxIslandCanvas;