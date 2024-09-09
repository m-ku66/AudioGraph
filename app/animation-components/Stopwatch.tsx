import React, { useState, useEffect, useRef } from "react";

interface StopwatchProps {
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
  initialTime?: number;
}

const Stopwatch: React.FC<StopwatchProps> = ({
  isRunning,
  onTimeUpdate,
  initialTime = 0,
}) => {
  const [elapsedTime, setElapsedTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        const currentTime = Date.now() - startTime;
        setElapsedTime(currentTime);
        onTimeUpdate(currentTime);
      }, 912.5);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  useEffect(() => {
    setElapsedTime(initialTime);
  }, [initialTime]);

  return null;
};

export default Stopwatch;
