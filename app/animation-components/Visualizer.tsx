"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Spine from "./Spine";
import Mandala from "./Mandala";
import BallPit from "./BallPit";

type Props = {
  setFrameRate: React.Dispatch<React.SetStateAction<number>>;
  currentVisual: string;
  analyser: AnalyserNode | null;
};

const Visualizer = ({ setFrameRate, currentVisual, analyser }: Props) => {
  const [spineState, setSpineState] = useState("px");
  const [circleState, setCircleState] = useState(false);
  const [dataArray, setDataArray] = useState<Uint8Array>(new Uint8Array(64));
  const animationFrameRef = useRef<number | null>(null);
  const frameRateAccumulatorRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  // Debounced frame rate update
  const updateFrameRate = useCallback(
    (newFrameRate: number) => {
      setTimeout(() => {
        setFrameRate(newFrameRate);
      }, 100); // Update every 100ms
    },
    [setFrameRate]
  );

  useEffect(() => {
    let isActive = true;

    const updateVisualizer = () => {
      if (analyser && isActive) {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = currentTime;

        const instantFrameRate = 1000 / deltaTime;
        frameRateAccumulatorRef.current += instantFrameRate;
        frameCountRef.current += 1;

        if (frameCountRef.current >= 10) {
          const averageFrameRate =
            frameRateAccumulatorRef.current / frameCountRef.current;

          // Use the debounced update function
          updateFrameRate(Math.floor(Math.round(averageFrameRate)));

          frameCountRef.current = 0;
          frameRateAccumulatorRef.current = 0;
        }

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
  }, [analyser, updateFrameRate]);

  function renderVisual() {
    switch (currentVisual) {
      case "V-Sp1n3":
        return (
          <>
            <Spine
              spineState={spineState}
              setSpineState={setSpineState}
              dataArray={dataArray}
            />
          </>
        );
      case "V-Mand4la":
        return (
          <>
            <Mandala
              dataArray={dataArray}
              circleState={circleState}
              setCircleState={setCircleState}
            />
          </>
        );
      case "V-8allp1t":
        return <BallPit dataArray={dataArray} />;
    }
  }

  return <>{renderVisual()}</>;
};

export default Visualizer;
