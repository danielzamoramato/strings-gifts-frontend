import { Routes, Route } from "react-router-dom";
import Catalogo   from "./components/Catalogo";
import AdminPanel from "./AdminPanel";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/*"     element={<Catalogo />} />
    </Routes>
  );
}
