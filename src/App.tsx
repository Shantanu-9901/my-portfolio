import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const BlogPost = lazy(() => import("./components/BlogPost"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
import { LoadingProvider } from "./context/LoadingProvider";

const Home = () => (
  <LoadingProvider>
    <Suspense>
      <MainContainer>
        <Suspense>
          <CharacterModel />
        </Suspense>
      </MainContainer>
    </Suspense>
  </LoadingProvider>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/blog/:slug"
          element={
            <Suspense>
              <BlogPost />
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense>
              <PrivacyPolicy />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
