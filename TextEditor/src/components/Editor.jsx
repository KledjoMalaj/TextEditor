import {useRef, useState} from "react";

function Editor(){

    const [content,setContent] = useState("")


    const handleInput = (e) => {
        setContent(e.target.textContent)
    }

    return(
        <>
            <div className={'p-2'}>
                <h1>{content.length}</h1><br></br>

                <div  className={"Editor"} contentEditable={'true'} onInput={handleInput}>
                </div>

            </div>
        </>
    )
}
export default Editor