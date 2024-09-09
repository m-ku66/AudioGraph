"use client";
import React, { useState, useEffect, useRef } from "react";

type Props = {
  currentVisual: string;
  audioData: AudioBuffer | null;
  isPlaying: boolean;
  analyser: AnalyserNode | null;
};

const spines = new Array(26).fill(0);

const Visualizer = ({
  currentVisual,
  audioData,
  isPlaying,
  analyser,
}: Props) => {
  const [spineState, setSpineState] = useState("px");
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array(64));
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let isActive = true;

    const updateVisualizer = () => {
      if (analyser && isActive) {
        const bufferLength = analyser.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(data);
        setDataArray(data);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      }
    };

    if (analyser) {
      updateVisualizer();
    }

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser]);

  function renderVisual() {
    switch (currentVisual) {
      case "V-Sp1n3":
        return (
          <>
            <div
              onClick={() => setSpineState(spineState === "px" ? "rem" : "px")}
              className="z-10 cursor-pointer flex items-center gap-2 w-[90%] justify-center"
            >
              {spines.map((_, index) => (
                <div className="w-fit h-fit bg-primary py-0 hover:py-32 duration-150">
                  <div
                    key={index}
                    style={{
                      width: `2.5rem`,
                      height: `${
                        dataArray[index % dataArray.length] *
                        (spineState === "px" ? 0.5 : 0.1)
                      }${spineState}`,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </>
        );
      case "V-Sp1n4":
        return <>Alternative Visual Here</>;
    }
  }

  return <>{renderVisual()}</>;
};

export default Visualizer;
