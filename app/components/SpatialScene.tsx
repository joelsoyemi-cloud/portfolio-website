"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { SculptureMaterial } from "../lib/content";

type Controller = {
  refresh: () => void;
  setMaterial: (name: SculptureMaterial) => void;
};
const palette = {
  Jade: {
    color: "#598d73",
    metalness: 0.17,
    transmission: 0.68,
    roughness: 0.12,
    iridescence: 0.32,
  },
  Chrome: {
    color: "#c5d5c7",
    metalness: 0.97,
    transmission: 0,
    roughness: 0.14,
    iridescence: 0.08,
  },
  Frost: {
    color: "#dcebdc",
    metalness: 0.02,
    transmission: 0.78,
    roughness: 0.32,
    iridescence: 0.12,
  },
};

export default function SpatialScene({
  motion,
  material,
}: {
  motion: boolean;
  material: SculptureMaterial;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef(motion);
  const modeRef = useRef(material);
  const controller = useRef<Controller | null>(null);
  const rotation = useRef({ x: 0, y: 0 });
  const fallbackDrag = useRef<{
    x: number;
    y: number;
    rx: number;
    ry: number;
  } | null>(null);
  const [rendererState, setRendererState] = useState("loading");

  useEffect(() => {
    motionRef.current = motion;
    controller.current?.refresh();
  }, [motion]);

  useEffect(() => {
    modeRef.current = material;
    controller.current?.setMaterial(material);
  }, [material]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (new URLSearchParams(window.location.search).get("graphics") === "off") {
      setRendererState("fallback");
      return;
    }
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setRendererState("fallback");
      return;
    }
    const compact = window.matchMedia("(max-width: 720px)").matches;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, compact ? 1.25 : 1.65),
    );
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 7.8);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    room.dispose();
    scene.environment = environment.texture;

    const key = new THREE.DirectionalLight("#ffffff", 4);
    key.position.set(3, 6, 5);
    scene.add(key);
    const rim = new THREE.PointLight("#d5ffd1", 28, 20);
    rim.position.set(-3, 0, 4);
    scene.add(rim);
    scene.add(new THREE.AmbientLight("#d9e7da", 1.8));

    const sculpture = new THREE.Group();
    const geometry = new THREE.TorusKnotGeometry(
      1.18,
      0.4,
      compact ? 112 : 192,
      compact ? 16 : 28,
      2,
      3,
    );
    const surface = new THREE.MeshPhysicalMaterial({
      ...palette[modeRef.current],
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      thickness: 1.7,
      ior: 1.43,
      envMapIntensity: 2,
      iridescenceIOR: 1.3,
    });
    const knot = new THREE.Mesh(geometry, surface);
    knot.rotation.set(0.3, 0, -0.5);
    sculpture.add(knot);
    scene.add(sculpture);
    const pebbleGeometry = new THREE.SphereGeometry(0.15, 20, 16);
    const pebbleMaterial = new THREE.MeshStandardMaterial({
      color: "#f0f6db",
      roughness: 0.2,
      metalness: 0.55,
    });
    const pebble = new THREE.Mesh(pebbleGeometry, pebbleMaterial);
    pebble.position.set(1.9, 1.12, 0.1);
    scene.add(pebble);

    let inView = true;
    let disposed = false;
    let elapsed = 0;
    let previousTime = 0;
    let drag: { x: number; y: number; startX: number; startY: number } | null =
      null;
    const pointer = { x: 0, y: 0 };
    const draw = () => {
      if (!disposed && inView && !document.hidden)
        renderer.render(scene, camera);
    };
    const animate = (time: number) => {
      const dt = previousTime
        ? Math.min((time - previousTime) / 1000, 0.04)
        : 0;
      previousTime = time;
      elapsed += dt;
      sculpture.rotation.y +=
        (rotation.current.y +
          elapsed * 0.13 +
          pointer.x * 0.22 -
          sculpture.rotation.y) *
        0.06;
      sculpture.rotation.x +=
        (rotation.current.x + pointer.y * 0.14 - sculpture.rotation.x) * 0.06;
      sculpture.position.y = Math.sin(elapsed * 0.7) * 0.09;
      pebble.position.y = 1.12 + Math.sin(elapsed * 0.9 + 1) * 0.13;
      draw();
    };
    const refresh = () => {
      if (disposed) return;
      previousTime = 0;
      renderer.setAnimationLoop(
        motionRef.current && inView && !document.hidden ? animate : null,
      );
      draw();
    };
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      draw();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (
        !motionRef.current ||
        (event.pointerType === "mouse" && event.button !== 0)
      )
        return;
      drag = {
        x: event.clientX,
        y: event.clientY,
        startX: rotation.current.x,
        startY: rotation.current.y,
      };
      host.setPointerCapture(event.pointerId);
      host.dataset.dragging = "true";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!motionRef.current) return;
      const rect = host.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
      if (drag) {
        rotation.current.y = drag.startY + (event.clientX - drag.x) * 0.008;
        rotation.current.x = Math.max(
          -0.8,
          Math.min(0.8, drag.startX + (event.clientY - drag.y) * 0.005),
        );
      }
    };
    const onPointerUp = () => {
      drag = null;
      host.dataset.dragging = "false";
    };
    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
          event.key,
        )
      )
        return;
      event.preventDefault();
      if (event.key === "Home") rotation.current = { x: 0, y: 0 };
      if (event.key === "ArrowLeft") rotation.current.y -= 0.2;
      if (event.key === "ArrowRight") rotation.current.y += 0.2;
      if (event.key === "ArrowUp") rotation.current.x -= 0.15;
      if (event.key === "ArrowDown") rotation.current.x += 0.15;
      if (!motionRef.current) {
        sculpture.rotation.x = rotation.current.x;
        sculpture.rotation.y = rotation.current.y;
      }
      draw();
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      renderer.setAnimationLoop(null);
      setRendererState("fallback");
    };
    controller.current = {
      refresh,
      setMaterial: (name) => {
        const values = palette[name];
        surface.color.set(values.color);
        surface.metalness = values.metalness;
        surface.transmission = values.transmission;
        surface.roughness = values.roughness;
        surface.iridescence = values.iridescence;
        surface.needsUpdate = true;
        draw();
      },
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        refresh();
      },
      { rootMargin: "80px" },
    );
    visibilityObserver.observe(host);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("keydown", onKeyDown);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    document.addEventListener("visibilitychange", refresh);
    resize();
    refresh();
    setRendererState("webgl");

    return () => {
      disposed = true;
      controller.current = null;
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("keydown", onKeyDown);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      document.removeEventListener("visibilitychange", refresh);
      geometry.dispose();
      surface.dispose();
      pebbleGeometry.dispose();
      pebbleMaterial.dispose();
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="spatial-canvas"
      data-renderer={rendererState}
      role="group"
      tabIndex={0}
      aria-label="Interactive sculpture. Drag to rotate, or focus here and use the arrow keys. Home resets the rotation."
      onPointerDown={(event) => {
        if (
          rendererState !== "fallback" ||
          !motion ||
          (event.pointerType === "mouse" && event.button !== 0)
        )
          return;
        fallbackDrag.current = {
          x: event.clientX,
          y: event.clientY,
          rx: rotation.current.x,
          ry: rotation.current.y,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const drag = fallbackDrag.current;
        if (rendererState !== "fallback" || !motion || !drag) return;
        rotation.current.x = Math.max(
          -30,
          Math.min(30, drag.rx - (event.clientY - drag.y) * 0.12),
        );
        rotation.current.y = Math.max(
          -40,
          Math.min(40, drag.ry + (event.clientX - drag.x) * 0.15),
        );
        event.currentTarget.style.setProperty(
          "--fallback-rx",
          rotation.current.x + "deg",
        );
        event.currentTarget.style.setProperty(
          "--fallback-ry",
          rotation.current.y + "deg",
        );
      }}
      onPointerUp={() => {
        fallbackDrag.current = null;
      }}
      onPointerCancel={() => {
        fallbackDrag.current = null;
      }}
      onKeyDown={(event) => {
        if (
          rendererState !== "fallback" ||
          !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
            event.key,
          )
        )
          return;
        event.preventDefault();
        if (event.key === "Home") rotation.current = { x: 0, y: 0 };
        if (event.key === "ArrowLeft") rotation.current.y -= 8;
        if (event.key === "ArrowRight") rotation.current.y += 8;
        if (event.key === "ArrowUp") rotation.current.x -= 6;
        if (event.key === "ArrowDown") rotation.current.x += 6;
        event.currentTarget.style.setProperty(
          "--fallback-rx",
          rotation.current.x + "deg",
        );
        event.currentTarget.style.setProperty(
          "--fallback-ry",
          rotation.current.y + "deg",
        );
      }}
    >
      <div
        className={"sculpture-fallback material-" + material.toLowerCase()}
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
      </div>
      <span className="sr-only">
        {rendererState === "fallback"
          ? "A sculptural illustration is shown because 3D rendering is unavailable."
          : "An interlocking glass sculpture."}
      </span>
    </div>
  );
}
