"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import Icon, { Asterisk } from "./Icon";

const experiments = [
  {
    id: "magnetic",
    name: "Magnetic",
    label: "A little attraction.",
    hint: "Move over the button, or focus it and press Enter.",
  },
  {
    id: "depth",
    name: "Perspective",
    label: "Look a little closer.",
    hint: "Move across the card, or focus it and press Enter.",
  },
  {
    id: "spring",
    name: "Spring",
    label: "Room to play.",
    hint: "Drag the little star and let go. Keyboard? Press Enter.",
  },
] as const;

export default function MotionStudy({ motion }: { motion: boolean }) {
  const [selected, setSelected] = useState(0);
  const object = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const position = useRef({ x: 0, y: 0 });
  const animation = useRef<Animation | null>(null);
  const didDrag = useRef(false);
  const current = experiments[selected];

  useEffect(() => {
    if (!motion) {
      animation.current?.cancel();
      drag.current = null;
      if (object.current) object.current.style.transform = "";
      position.current = { x: 0, y: 0 };
    }
    return () => {
      animation.current?.cancel();
    };
  }, [motion]);

  function reset() {
    drag.current = null;
    animation.current?.cancel();
    if (object.current) object.current.style.transform = "";
    position.current = { x: 0, y: 0 };
  }
  function select(index: number) {
    reset();
    setSelected(index);
  }
  function keyTabs(event: KeyboardEvent<HTMLButtonElement>) {
    let next = selected;
    if (event.key === "ArrowRight") next = (selected + 1) % experiments.length;
    else if (event.key === "ArrowLeft")
      next = (selected + experiments.length - 1) % experiments.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = experiments.length - 1;
    else return;
    event.preventDefault();
    select(next);
    document.getElementById("study-tab-" + next)?.focus();
  }
  function release() {
    if (!drag.current) return;
    drag.current = null;
    const node = object.current;
    if (!node) return;
    if (motion) {
      const { x, y } = position.current;
      animation.current?.cancel();
      animation.current = node.animate(
        [
          {
            transform: "translate(" + x + "px," + y + "px) scale(.94)",
            offset: 0,
          },
          {
            transform:
              "translate(" + -x * 0.13 + "px," + -y * 0.13 + "px) scale(1.04)",
            offset: 0.48,
          },
          {
            transform:
              "translate(" + x * 0.04 + "px," + y * 0.04 + "px) scale(.99)",
            offset: 0.73,
          },
          { transform: "translate(0,0) scale(1)", offset: 1 },
        ],
        { duration: 760, easing: "cubic-bezier(.22,.68,.24,1)" },
      );
    }
    node.style.transform = "";
    position.current = { x: 0, y: 0 };
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const node = object.current;
    const bounds = field.current?.getBoundingClientRect();
    if (!node || !bounds || !motion) return;
    if (selected === 2 && drag.current) {
      if (
        Math.abs(event.clientX - drag.current.x) +
          Math.abs(event.clientY - drag.current.y) >
        4
      )
        didDrag.current = true;
      const x = Math.max(
        -bounds.width * 0.3,
        Math.min(bounds.width * 0.3, event.clientX - drag.current.x),
      );
      const y = Math.max(-75, Math.min(75, event.clientY - drag.current.y));
      position.current = { x, y };
      node.style.transform = "translate(" + x + "px," + y + "px) scale(.94)";
    } else if (event.pointerType !== "touch") {
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      node.style.transform =
        selected === 0
          ? "translate(" + x * 55 + "px," + y * 40 + "px)"
          : selected === 1
            ? "perspective(700px) rotateX(" +
              -y * 22 +
              "deg) rotateY(" +
              x * 28 +
              "deg)"
            : "";
    }
  }
  function demonstrate() {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    const node = object.current;
    if (!node || !motion || drag.current) return;
    animation.current?.cancel();
    const frames =
      selected === 0
        ? [
            { transform: "translateX(0)" },
            { transform: "translateX(24px)", offset: 0.5 },
            { transform: "translateX(0)" },
          ]
        : selected === 1
          ? [
              { transform: "perspective(700px) rotateY(0)" },
              {
                transform: "perspective(700px) rotateY(22deg) rotateX(-8deg)",
                offset: 0.5,
              },
              { transform: "perspective(700px) rotateY(0)" },
            ]
          : [
              { transform: "translateY(0)" },
              { transform: "translateY(-65px) rotate(22deg)", offset: 0.35 },
              { transform: "translateY(9px) rotate(-5deg)", offset: 0.75 },
              { transform: "translateY(0)" },
            ];
    animation.current = node.animate(frames, {
      duration: 800,
      easing: "cubic-bezier(.22,.68,.24,1)",
    });
  }

  return (
    <div className="motion-study" data-reveal>
      <div className="study-heading">
        <span className="eyebrow">A SMALL INTERACTION LAB</span>
        <span className="live-dot" aria-hidden="true" />
      </div>
      <div
        className="study-tabs"
        role="tablist"
        aria-label="Choose a motion experiment"
      >
        {experiments.map((experiment, index) => (
          <button
            key={experiment.id}
            id={"study-tab-" + index}
            role="tab"
            type="button"
            aria-selected={index === selected}
            aria-controls="study-panel"
            tabIndex={index === selected ? 0 : -1}
            onClick={() => select(index)}
            onKeyDown={keyTabs}
          >
            {experiment.name}
          </button>
        ))}
      </div>
      <div
        ref={field}
        id="study-panel"
        className={"study-field study-" + current.id}
        role="tabpanel"
        aria-labelledby={"study-tab-" + selected}
        onPointerMove={move}
        onPointerLeave={() => {
          if (!drag.current && object.current)
            object.current.style.transform = "";
        }}
        onPointerUp={release}
        onPointerCancel={reset}
      >
        <span className="study-cross cross-one" aria-hidden="true">
          +
        </span>
        <span className="study-cross cross-two" aria-hidden="true">
          +
        </span>
        <div className="study-orbit" aria-hidden="true" />
        <button
          ref={object}
          type="button"
          className="study-object"
          aria-label={"Try the " + current.name.toLowerCase() + " interaction"}
          onClick={demonstrate}
          onPointerDown={(event) => {
            if (
              selected !== 2 ||
              !motion ||
              (event.pointerType === "mouse" && event.button !== 0)
            )
              return;
            animation.current?.cancel();
            didDrag.current = false;
            drag.current = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          style={{ "--study-index": selected } as CSSProperties}
        >
          {selected === 0 ? (
            <>
              <span>Come closer</span>
              <Icon name="upRight" />
            </>
          ) : selected === 1 ? (
            <>
              <span className="depth-chip">A NEW PERSPECTIVE</span>
              <Asterisk />
              <span>
                More than
                <br />
                meets the eye.
              </span>
              <i />
            </>
          ) : (
            <Asterisk />
          )}
        </button>
        <span className="study-coordinate" aria-hidden="true">
          X / Y / Z
        </span>
      </div>
      <div className="study-caption">
        <div>
          <strong>{current.label}</strong>
          <p>
            {motion
              ? current.hint
              : "Motion is paused. Turn it on below to explore."}
          </p>
        </div>
        <span className="study-number">0{selected + 1} / 03</span>
      </div>
    </div>
  );
}
