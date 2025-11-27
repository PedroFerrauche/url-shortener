import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Redirect from "./pages/redirect";

export function App() {

  return (
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:shortUrl" element={<Redirect />} />
        </Routes>
      </div>
  )
}