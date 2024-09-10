import React from "react";

type Props = {
  dataArray: Uint8Array;
  circleState: boolean;
  setCircleState: React.Dispatch<React.SetStateAction<boolean>>;
};

const Mandala = ({ dataArray, circleState, setCircleState }: Props) => {
  const circles = new Array(16).fill(0);

  return (
    <div className="z-20 relative flex justify-center items-center w-[500px] h-[500px]">
      {circles.map((_, index) => {
        const angle = (index / circles.length) * 2 * Math.PI;
        const radius = dataArray[index % dataArray.length] * 0.5 + 150; // Dynamic radius based on frequency data
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <div
            onClick={() => setCircleState(!circleState)}
            key={index}
            className="cursor-pointer absolute bg-primary rounded-full"
            style={{
              width: circleState ? "80px" : "50px",
              height: circleState ? "80px" : "50px",
              transform: `translate(${x}px, ${y}px)`,
              transition: "transform 0.1s ease",
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default Mandala;
