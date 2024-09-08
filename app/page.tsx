"use client";
import { useState } from "react";
import Interface from "./ui-components/Interface";
import Visualizer from "./animation-components/Visualizer";

export default function Home() {
  const [frameRate, setFrameRate] = useState<number>(30);
  const [currentVisual, setCurrentVisual] = useState("V-Sp1n3");
  const [audioData, setAudioData] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  return (
    <>
      <div className="container max-w-full h-screen relative hidden md:flex justify-center items-center overflow-hidden">
        <Interface
          frameRate={frameRate}
          currentVisual={currentVisual}
          setCurrentVisual={setCurrentVisual}
          setAudioData={setAudioData}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioContext={audioContext}
          setAudioContext={setAudioContext}
          analyser={analyser}
          setAnalyser={setAnalyser}
        />
        <Visualizer
          currentVisual={currentVisual}
          audioData={audioData}
          isPlaying={isPlaying}
          analyser={analyser}
        />
      </div>
      <div className="container max-w-full h-screen flex md:hidden justify-center items-center p-10">
        <p className="text-center">
          Please switch to a larger device to view this experience
        </p>
      </div>
    </>
  );
}
