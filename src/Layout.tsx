import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren<object>) => {
  return (
    <div className="flex flex-col gap-6 h-full w-full mx-auto py-0 px-4 max-w-screen-xl">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};
