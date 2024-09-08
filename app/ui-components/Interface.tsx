import React, { useRef, useState, useEffect } from "react";
import Logo from "./Logo";
import Copyright from "./Copyright";
import {
  ArrowBigLeftDashIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  TheaterIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
type Props = {
  frameRate: number;
  currentVisual: string;
  setCurrentVisual: React.Dispatch<React.SetStateAction<string>>;
  setAudioData: (audioBuffer: AudioBuffer) => void;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  audioContext: AudioContext | null;
  setAudioContext: React.Dispatch<React.SetStateAction<AudioContext | null>>;
  analyser: AnalyserNode | null;
  setAnalyser: React.Dispatch<React.SetStateAction<AnalyserNode | null>>;
};

const Interface = ({
  frameRate,
  currentVisual,
  setCurrentVisual,
  setAudioData,
  isPlaying,
  setIsPlaying,
  audioContext,
  setAudioContext,
  analyser,
  setAnalyser,
}: Props) => {
  const { theme, setTheme } = useTheme();
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [pausedAt, setPausedAt] = useState<number>(0);

  const changeVisual = () => {
    setCurrentVisual(currentVisual === "V-Sp1n3" ? "V-Sp1n4" : "V-Sp1n3");
  };

  useEffect(() => {
    // Create AudioContext on component mount
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    setAudioContext(audioContextRef.current);

    const newAnalyser = audioContextRef.current.createAnalyser();
    newAnalyser.fftSize = 256;
    setAnalyser(newAnalyser);

    return () => {
      // Clean up on component unmount
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [setAudioContext, setAnalyser]);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && audioContextRef.current) {
      console.log("File selected:", file.name);
      setAudioFileName(file.name);

      try {
        const arrayBuffer = await file.arrayBuffer();
        console.log("File read as ArrayBuffer");

        const decodedAudioBuffer =
          await audioContextRef.current.decodeAudioData(arrayBuffer);
        console.log("Audio data decoded successfully");
        setAudioBuffer(decodedAudioBuffer);
        setAudioData(decodedAudioBuffer);
        setCurrentTime(0);
        setIsPlaying(false);

        if (sourceRef.current) {
          sourceRef.current.stop();
          sourceRef.current.disconnect();
          sourceRef.current = null; // ensure the previous source is cleared
        }
        console.log("Audio buffer set and ready for playback");
      } catch (error) {
        console.error("Error decoding audio data:", error);
      }
    } else {
      console.error("File or AudioContext is null");
    }
  };

  const createAndStartSource = (offset: number = 0) => {
    console.log("Creating and starting source", {
      audioBuffer,
      audioContext: audioContextRef.current,
      analyser,
      offset,
    });
    if (audioBuffer && audioContextRef.current && analyser) {
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      }

      sourceRef.current = audioContextRef.current.createBufferSource();
      sourceRef.current.buffer = audioBuffer;
      sourceRef.current.connect(analyser);
      analyser.connect(audioContextRef.current.destination);

      sourceRef.current.start(0, offset);
      startTimeRef.current = audioContextRef.current.currentTime - offset;

      sourceRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(audioBuffer.duration);
        // Don't reset pausedAt here
      };

      console.log("Audio source created and started at offset:", offset);
    } else {
      console.error("Unable to create audio source", {
        audioBuffer,
        audioContext: audioContextRef.current,
        analyser,
      });
    }
  };

  const handlePlay = () => {
    console.log("Play button clicked", {
      audioBuffer,
      audioContext: audioContextRef.current,
      pausedAt,
    });
    if (audioBuffer && audioContextRef.current) {
      createAndStartSource(pausedAt);
      setIsPlaying(true);
      startTimeRef.current = audioContextRef.current.currentTime - pausedAt;
      updateCurrentTime();
    } else {
      console.error("Unable to play: audioBuffer or audioContext is null");
    }
  };

  const handlePause = () => {
    console.log("Pause button clicked");
    if (audioContextRef.current && startTimeRef.current !== null) {
      const elapsed =
        audioContextRef.current.currentTime - startTimeRef.current;
      console.log("Elapsed time at pause:", elapsed);
      setPausedAt(elapsed);
      setIsPlaying(false);
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const handleReplay = () => {
    console.log("Replay button clicked");
    handlePause(); // Stop current playback
    setPausedAt(0);
    setCurrentTime(0);
    handlePlay(); // Start playback from the beginning
  };

  const updateCurrentTime = () => {
    if (audioContextRef.current && startTimeRef.current !== null && isPlaying) {
      const newTime =
        audioContextRef.current.currentTime - startTimeRef.current;
      setCurrentTime(newTime);
      if (newTime < audioBuffer!.duration) {
        animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
      } else {
        setIsPlaying(false);
        setCurrentTime(audioBuffer!.duration);
        setPausedAt(0);
        startTimeRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const miliseconds = Math.floor(time % 60) / 100;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${miliseconds.toString().padStart(2, "0")}`;
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
            <h1 className="text-[1.1rem]">{formatTime(currentTime)}</h1>
          </div>

          <div className="select-none flex flex-col gap-2 place-items-end">
            <div className="flex gap-1">
              <h1 className="select-none">Frame Rate</h1>
              <p className="text-[0.8rem]">{frameRate}</p>
            </div>
            <h1>1920 X 1080</h1>
          </div>
        </div>

        <div className="flex items-center w-full justify-between">
          <Copyright />

          <div className="flex items-center gap-8">
            <div className="z-20 flex gap-4 w-full">
              <button onClick={handlePlay} disabled={isPlaying}>
                <PlayCircleIcon size={24} />
              </button>
              <button onClick={handlePause} disabled={!isPlaying}>
                <PauseCircleIcon size={24} />
              </button>
              <button onClick={handleReplay}>
                <ArrowBigLeftDashIcon size={24} />
              </button>
            </div>

            <label className="cursor-pointer text-nowrap">
              {audioFileName ? audioFileName : "Upload Audio"}
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleAudioUpload}
              />
            </label>

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
