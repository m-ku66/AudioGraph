import React, { useState, useEffect } from "react";

type Props = {
  dataArray: Uint8Array;
};

const BallPit = ({ dataArray }: Props) => {
  const ballCount = 16;
  const width = 500;
  const height = 500;
  const ballSize = 30;

  // Initialize ball states with random positions and velocities
  const [balls, setBalls] = useState(() =>
    Array(ballCount)
      .fill(0)
      .map(() => ({
        x: Math.random() * (width - ballSize),
        y: Math.random() * (height - ballSize),
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
      }))
  );

  useEffect(() => {
    const updateBalls = () => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let { x, y, vx, vy } = ball;

          // Update position
          x += vx;
          y += vy;

          // Bounce off walls
          if (x <= 0 || x >= width - ballSize) {
            vx = -vx;
            x = Math.max(0, Math.min(x, width - ballSize));
          }

          // Bounce off ceiling and floor
          if (y <= 0 || y >= height - ballSize) {
            vy = -vy;
            y = Math.max(0, Math.min(y, height - ballSize));
          }

          // Apply gravity
          vy += 0.2;

          // Apply friction
          vx *= 0.99;
          vy *= 0.99;

          return { x, y, vx, vy };
        })
      );
    };

    const animationId = requestAnimationFrame(function animate() {
      updateBalls();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Function to influence a ball's velocity
  const influenceBall = (index: number, dvx: number, dvy: number) => {
    setBalls((prevBalls) =>
      prevBalls.map((ball, i) =>
        i === index ? { ...ball, vx: ball.vx + dvx, vy: ball.vy + dvy } : ball
      )
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative flex justify-center items-center border border-primary overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {balls.map((ball, index) => (
          <div
            key={index}
            className="z-20 bg-primary rounded-full absolute cursor-pointer"
            style={{
              left: `${ball.x}px`,
              bottom: `${height - ball.y - ballSize}px`,
              width: `${ballSize}px`,
              height: `${ballSize}px`,
            }}
            onMouseEnter={() =>
              influenceBall(index, (Math.random() - 0.5) * 10, -10)
            }
          >
            <div
              style={{
                width: `${10}px`,
                height: `${10}px`,
                padding: `${dataArray[index] / 2}px`,
              }}
              className="border border-primary bg-transparent rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            ></div>
          </div>
        ))}
      </div>

      <div
        style={{ width: `${dataArray[0] * 1.5}px`, height: `${10}px` }}
        className="bg-primary"
      ></div>
    </div>
  );
};

export default BallPit;
