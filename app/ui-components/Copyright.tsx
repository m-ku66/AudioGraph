"use client";
import Image from "next/image";
import { useTheme } from "next-themes";

const Copyright = () => {
  const { theme } = useTheme();
  function getLogoBasedOnTheme() {
    switch (theme) {
      case "dark":
        return "/copyright-w.svg";
      case "light":
        return "/copyright-b.svg";
      default:
        return "/copyright-b.svg";
    }
  }
  return (
    <Image src={getLogoBasedOnTheme()} alt="logo" width={150} height={150} />
  );
};

export default Copyright;
