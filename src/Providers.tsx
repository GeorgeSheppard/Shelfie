import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./api/queryClient";
import { ThemeProvider } from "./components/Theme/ThemeProvider";
import { initialThemeState } from "./components/Theme/ThemeContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Providers = ({ children }: PropsWithChildren<object>) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider
          defaultTheme={initialThemeState.theme}
          storageKey="theme-key"
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
