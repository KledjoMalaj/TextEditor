import './App.css'
import Editor from "./components/Editor.jsx";
import ToolBar from "./components/ToolBar.jsx";
import {use, useState} from "react";

function App() {
    const [content,setContent]=useState("")

  return (
    <>
        <ToolBar content={content}/>
        <Editor setContent={setContent}/>
   </>
  )
}

export default App
