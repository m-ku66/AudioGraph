"use client";
import { useState, useEffect } from "react";
import Interface from "./ui-components/Interface";
import Visualizer from "./animation-components/Visualizer";

export default function Home() {
  const [frameRate, setFrameRate] = useState<number>(30);
  const [currentVisual, setCurrentVisual] = useState("V-Sp1n3");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream | null>(
    null
  );

  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const AudioContextClass = (window.AudioContext ||
          window.AudioContext) as typeof AudioContext;
        const context = new AudioContextClass();
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 256;

        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);

        setAudioContext(context);
        setAnalyser(analyserNode);
        setMicrophoneStream(stream);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    initAudio();

    return () => {
      if (microphoneStream) {
        microphoneStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return (
    <>
      <div className="container max-w-full h-screen relative hidden md:flex justify-center items-center overflow-hidden">
        <Interface
          frameRate={frameRate}
          currentVisual={currentVisual}
          setCurrentVisual={setCurrentVisual}
          audioContext={audioContext}
          analyser={analyser}
        />
        <Visualizer
          setFrameRate={setFrameRate}
          currentVisual={currentVisual}
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
