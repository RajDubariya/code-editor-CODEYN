import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import EditorPage from "./pages/EditorPage";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomid" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;
