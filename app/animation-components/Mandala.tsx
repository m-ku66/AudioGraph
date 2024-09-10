"use client";
import React, { useMemo, useState } from "react";

type Props = {
  dataArray: Uint8Array;
};

const LAYERS = 10;
const BASE_RADII = [150, 225, 275, 300, 375, 450, 475, 500, 550, 575, 600];
const RADIUS_MULTIPLIERS = [0.6, 0.5, 0.4, 0.3, 0.5, 0.3, 0.3, 0.3, 0.2, 0.6];
const TRANSITION_DELAYS = [0.1, 0.2, 0.3, 0.4, 0.2, 1.0, 1.5, 2, 2.5, 0.1];
const CIRCLE_SIZES = {
  small: [50, 30, 20, 15, 10, 10, 10, 10, 10, 10],
  large: [80, 50, 30, 30, 20, 20, 20, 20, 20, 20],
};

const Mandala = ({ dataArray }: Props) => {
  const [circleState, setCircleState] = useState(false);
  const [CIRCLE_COUNT, setCIRCLE_COUNT] = useState(6);

  const circles = useMemo(() => {
    return Array.from({ length: CIRCLE_COUNT }, (_, index) => {
      const angle = (index / CIRCLE_COUNT) * 2 * Math.PI;
      const frequencyData = dataArray[index % dataArray.length];

      return Array.from({ length: LAYERS }, (_, layerIndex) => {
        const radius =
          frequencyData * RADIUS_MULTIPLIERS[layerIndex] +
          BASE_RADII[layerIndex];
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return {
          x,
          y,
          size: circleState
            ? CIRCLE_SIZES.large[layerIndex]
            : CIRCLE_SIZES.small[layerIndex],
          transitionDelay: TRANSITION_DELAYS[layerIndex],
        };
      });
    }).flat();
  }, [dataArray, circleState, CIRCLE_COUNT]);

  const handleCirlcleCount = () => {
    if (CIRCLE_COUNT <= 16) {
      setCIRCLE_COUNT(CIRCLE_COUNT + 1);
    } else {
      setCIRCLE_COUNT(6);
    }
  };

  return (
    <div
      onClick={() => handleCirlcleCount()}
      className="z-20 relative flex justify-center items-center w-[500px] h-[500px]"
    >
      {circles.map((circle, index) => (
        <div
          key={index}
          onMouseEnter={() => setCircleState(true)}
          onMouseLeave={() => setCircleState(false)}
          className="z-30 cursor-pointer absolute bg-primary rounded-full"
          style={{
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            transform: `translate(${circle.x}px, ${circle.y}px)`,
            transition: `transform ${circle.transitionDelay}s ease`,
          }}
        />
      ))}
    </div>
  );
};

export default Mandala;
