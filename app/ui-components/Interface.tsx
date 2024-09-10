import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Copyright from "./Copyright";
import { TheaterIcon } from "lucide-react";
import { useTheme } from "next-themes";

type Props = {
  frameRate: number;
  currentVisual: string;
  setCurrentVisual: React.Dispatch<React.SetStateAction<string>>;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
};

const Interface = ({
  frameRate,
  currentVisual,
  setCurrentVisual,
  audioContext,
  analyser,
}: Props) => {
  const { theme, setTheme } = useTheme();
  const [viewportSize, setViewportSize] = useState({
    width: 1920,
    height: 1080,
  });

  // Effect to update viewport size on resize
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial viewport size
    updateViewportSize();

    // Listen for window resize events
    window.addEventListener("resize", updateViewportSize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateViewportSize);
    };
  }, []);

  const changeVisual = () => {
    if (currentVisual === "V-Sp1n3") {
      setCurrentVisual("V-Mand4la");
    } else if (currentVisual === "V-Mand4la") {
      setCurrentVisual("V-8allp1t");
    } else if (currentVisual === "V-8allp1t") {
      setCurrentVisual("V-Sp1n3");
    }
  };

  return (
    <div className="z-[5] absolute w-full h-full px-10 pt-6 pb-4 bg-transparent">
      <div className="flex flex-col w-full h-full items-center justify-between">
        <div className="flex items-center w-full justify-between">
          <div className="select-none flex gap-48">
            <div className="flex flex-col gap-2">
              <Logo />
              <h1 className="cursor-pointer" onClick={changeVisual}>
                {currentVisual}
              </h1>
            </div>
          </div>

          <div className="select-none flex flex-col gap-2 place-items-end">
            <div className="flex gap-1">
              <h1 className="select-none">Frame Rate</h1>
              <p className="text-[0.8rem]">
                {(Math.round(frameRate) % 100).toString().padStart(2, "0")}
              </p>
            </div>
            <h1>
              {viewportSize.width} X {viewportSize.height}
            </h1>
          </div>
        </div>

        <div className="flex items-center w-full justify-between">
          <Copyright />

          <div className="flex items-center gap-8">
            <h1 className="select-none">
              {audioContext ? "Listening" : "No audio context"}
            </h1>
            <div
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cursor-pointer border border-primary p-2 rounded-full"
            >
              <TheaterIcon size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
