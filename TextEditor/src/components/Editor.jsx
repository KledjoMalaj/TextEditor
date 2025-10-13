import {useEffect, useRef, useState} from "react";
import ToolBar from "./ToolBar.jsx";
import {useParams} from "react-router";
import axios from "axios";

function Editor(){
    const [content,setContent] = useState("")
    const {id} = useParams()
    const editorRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:3030/Documents/get/${id}`)
            .then((res)=>{


                if (editorRef.current) {
                    editorRef.current.innerHTML = res.data.content;
                }
            })
    }, [id]);

    const handleInput = (e) => {
        setContent(e.target.innerHTML)
    }

    return(
        <>
            <div>
                <ToolBar content={content} id={id}/>
            </div>

            <div className={'p-2'}>
                <div ref={editorRef} className={"Editor"} contentEditable={'true'} onInput={handleInput}>
                </div>

            </div>
        </>
    )
}
export default Editor