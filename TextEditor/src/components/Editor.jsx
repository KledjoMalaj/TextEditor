import {useEffect, useRef, useState} from "react";
import ToolBar from "./ToolBar.jsx";
import {useParams} from "react-router";
import axios from "axios";

function Editor(){
    const [content,setContent] = useState("")
    const {title} = useParams()
    const editorRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:3030/Documents/get/${title}`)
            .then((res)=>{

                if (editorRef.current) {
                    editorRef.current.innerHTML = res.data.content;
                }
            })
    }, [title]);

    const handleInput = (e) => {
        setContent(e.target.innerHTML)
    }

    return(
        <>
            <div>
                <ToolBar content={content} title={title}/>
            </div>

            <div className={'p-2'}>
                <div ref={editorRef} className={"Editor"} contentEditable={'true'} onInput={handleInput}>
                </div>

            </div>
        </>
    )
}
export default Editor