import { useRef, useEffect, useState, useId } from "react";

export default function CurvedLoop({ text = "Christ University | BYC ✦ " }) {
  const measureRef = useRef<SVGTextElement>(null);
  const [spacing, setSpacing] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-100,80 Q720,-80 1540,80`; // Creates the "Easy" looking curve

  useEffect(() => {
    if (measureRef.current)
      setSpacing(measureRef.current.getComputedTextLength());
  }, [text]);

  const repeatedText = new Array(10).fill(text).join("");

  return (
    <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-[0.15]">
      <svg
        className="w-full h-auto text-[6rem] font-black uppercase tracking-tighter"
        viewBox="0 0 1440 200"
      >
        <text ref={measureRef} className="invisible">
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} />
        </defs>
        {spacing > 0 && (
          <text className="fill-primary dark:fill-white">
            <textPath href={`#${pathId}`} startOffset="0%">
              {repeatedText}
              <animate
                attributeName="startOffset"
                from="0%"
                to={`-${spacing}px`}
                dur="20s"
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
}
