import {useRef, useState} from "react";

function Editor({setContent}){

    const handleInput = (e) => {
        setContent(e.target.textContent)
    }

    return(
        <>
            <div className={'p-2'}>

                <div  className={"Editor"} contentEditable={'true'} onInput={handleInput}>
                </div>

            </div>
        </>
    )
}
export default Editor