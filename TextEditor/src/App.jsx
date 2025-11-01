import './App.css'
import Editor from "./components/Editor.jsx";
import ToolBar from "./components/ToolBar.jsx";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SharedPage from "./components/SharedPage.jsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path={"/shared/:token"} element={<SharedPage/>}/>

                <Route path="/homePage" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />

                <Route path="/editor/:id" element={
                    <ProtectedRoute>
                        <Editor />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

export default App;
