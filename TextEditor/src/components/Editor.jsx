import {useEffect, useRef, useState} from "react";
import ToolBar from "./ToolBar.jsx";
import {useParams} from "react-router";
import axios from "axios";

function Editor(){
    const [content,setContent] = useState("")
    const {id} = useParams()
    const editorRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:3030/Documents/get/${id}`,{
            headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
        })
            .then((res)=>{
                if (editorRef.current) {
                    editorRef.current.innerHTML = res.data.content;

                    extractAndLoadFonts(res.data.content);
                }
                setContent(res.data.content);
            })
            .catch(err => {
                console.log('Error loading document:', err)
                alert('Error Loading Document')
            });
    }, [id]);

    const extractAndLoadFonts = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const fontTags = tempDiv.querySelectorAll('font[face]');

        const uniqueFonts = new Set();
        fontTags.forEach(tag => {
            const fontName = tag.getAttribute('face');
            if (fontName) {
                uniqueFonts.add(fontName);
            }
        });

        uniqueFonts.forEach(fontName => {
            loadGoogleFont(fontName);
        });
    }

    const loadGoogleFont = (fontName) => {
        const linkId = `google-font-${fontName.replaceAll(" ", "-")}`;
        if (!document.getElementById(linkId)) {
            const link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replaceAll(" ", "+")}`;
            document.head.appendChild(link);
        }
    }

    const handleInput = (e) => {
        setContent(e.target.innerHTML)
    }

    return(
        <>
            <div className={"sticky top-0 pt-1"}>
                <ToolBar content={content} id={id}/>
            </div>

            <div className={'p-2'}>
                <div ref={editorRef} className={"Editor"} suppressContentEditableWarning contentEditable={'true'} onInput={handleInput}>
                </div>
            </div>
        </>
    )
}
export default Editor