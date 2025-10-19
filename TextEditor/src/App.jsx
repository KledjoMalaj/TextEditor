import './App.css'
import Editor from "./components/Editor.jsx";
import ToolBar from "./components/ToolBar.jsx";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/homePage" element={<HomePage />} />
                <Route path="/editor/:id" element={<Editor />} />
            </Routes>
        </>
    );
}

export default App;
