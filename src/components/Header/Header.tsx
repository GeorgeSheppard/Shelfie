import { ShelfieLogo } from "./ShelfieLogo";
import { ThemeSelector } from "./ThemeSelector";

export const Header = () => {
  return (
    <header className="sticky top-0 py-4 w-full bg-background backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="flex flex-row justify-between items-center w-full">
        <ShelfieLogo />
        <ThemeSelector />
      </div>
    </header>
  );
};
