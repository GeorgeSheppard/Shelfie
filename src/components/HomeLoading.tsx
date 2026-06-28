import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTheme } from "./Theme/useTheme";

export const HomeLoading = () => {
  const { theme } = useTheme();
  const speed = 0.8;

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <DotLottieReact
        src="/assets/book-loading.lottie"
        loop
        autoplay
        mode="bounce"
        speed={speed}
        themeId={theme}
      />
    </div>
  );
};
