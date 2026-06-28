import { MoonIcon, SunIcon } from "lucide-react";
import { Theme } from "../Theme/ThemeContext";
import { useTheme } from "../Theme/useTheme";
import { Button } from "../ui/button";

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const onClick = (nextTheme: Theme) => () => setTheme(nextTheme);

  if (theme === "dark")
    return (
      <Button
        size="sm"
        onClick={onClick("light")}
        className="focus:outline-none"
        aria-label="light theme"
      >
        <SunIcon />
      </Button>
    );
  return (
    <Button
      size="sm"
      onClick={onClick("dark")}
      className="focus:outline-none"
      aria-label="dark theme"
    >
      <MoonIcon />
    </Button>
  );
};
