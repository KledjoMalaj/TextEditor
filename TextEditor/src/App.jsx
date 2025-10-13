import './App.css'
import Editor from "./components/Editor.jsx";
import ToolBar from "./components/ToolBar.jsx";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";

function App() {
    const [content, setContent] = useState("");

    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/editor/:id" element={<Editor />} />
            </Routes>
        </>
    );
}

export default App;
