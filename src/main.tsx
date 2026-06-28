import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { Providers } from "./Providers.tsx";
import { Layout } from "./Layout.tsx";
import { Pages } from "./Pages.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Layout>
        <Pages />
      </Layout>
    </Providers>
  </StrictMode>
);
