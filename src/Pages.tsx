import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Support } from "./pages/Support";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { lazy, Suspense } from "react";

const Recommendation = lazy(() => import("./pages/Recommendation"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

export const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/recommendations/:id"
        element={
          <Suspense fallback={null}>
            <Recommendation />
          </Suspense>
        }
      />
      <Route path="/support" element={<Support />} />
      <Route
        path="/unsubscribe/:requestId"
        element={
          <Suspense fallback={null}>
            <Unsubscribe />
          </Suspense>
        }
      />
      <Route
        path="/privacy"
        element={<PrivacyPolicy supportEmail="support@shelfie.com" />}
      />
    </Routes>
  );
};
