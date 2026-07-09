import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Demo from "@/pages/Demo";
import Timeline from "@/pages/Timeline";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/timeline" element={<Timeline />} />
    </Routes>
  );
}
