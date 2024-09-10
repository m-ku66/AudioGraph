"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const Logo = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  function getLogoBasedOnTheme() {
    switch (theme) {
      case "dark":
        return "/logo-w.svg";
      case "light":
        return "/logo-b.svg";
      default:
        return "/logo-w.svg";
    }
  }
  return (
    <Image
      onClick={() => router.push("/")}
      src={getLogoBasedOnTheme()}
      alt="logo"
      width={120}
      height={120}
      className="cursor-pointer"
      priority
    />
  );
};

export default Logo;
