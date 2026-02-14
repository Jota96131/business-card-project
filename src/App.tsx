import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CardPage from "./pages/CardPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cards/register" element={<RegisterPage />} />
      <Route path="/cards/:id" element={<CardPage />} />
    </Routes>
  );
}

export default App;
