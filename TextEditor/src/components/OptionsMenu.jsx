import axios from "axios";
import {TrashIcon} from "@heroicons/react/24/outline/index.js";
import { CgRename } from "react-icons/cg";
import {useState} from "react";
import {XMarkIcon} from "@heroicons/react/24/solid/index.js";
import { FiShare2 } from "react-icons/fi";
import {API_URL} from "../config.js";

function OptionsMenu({documentId, onDelete, onRename}){
    const [rename,setRename] = useState(false)
    const [share,setShare] = useState(false)

    const [title,setTitle] = useState('')
    const [role, setRole] = useState('')
    const [expiration, setExpiration] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        onRename(documentId, title);
        setRename(false);
    }

    const handleShare = (e) => {
        e.preventDefault()
        axios.post(`${API_URL}/ShareDocuments/documents/${documentId}/share`,{role,expiration},
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            }).then(res=>console.log(res.data))
    }

    return (
        <>
            {rename && <>
                <div className={'fixed inset-0 bg-black/50 flex items-center justify-center z-50'}>
                    <div className="bg-white p-2 rounded w-80">
                        <button onClick={()=>setRename(false)}><XMarkIcon className={"h-6 w-6 text-red-500 cursor-pointer"}/></button>
                        <form className={"text-center pb-5"} onSubmit={handleSubmit}>
                            <input className={"border border-blue-500 rounded px-2 mb-2 text-center"}
                                   placeholder="Enter Title"
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}
                            /><br></br>
                            <button className={"w-50 cursor-pointer bg-blue-400 text-white px-2 rounded"} type="submit">Rename Document</button>
                        </form>
                    </div>
                </div>
            </>}

            {share &&
                <>
                <div className={'fixed inset-0 bg-black/50 flex items-center justify-center z-50'}>
                    <div className="bg-white p-2 rounded w-80">
                        <button onClick={()=>setRename(false)}><XMarkIcon className={"h-6 w-6 text-red-500 cursor-pointer"}/></button>
                        <form className={"text-center pb-5"} onSubmit={handleShare}>
                            <input className={"border border-blue-500 rounded px-2 mb-2 text-center"}
                                   placeholder="Enter role"
                                   value={role}
                                   onChange={(e) => setRole(e.target.value)}
                            /><br></br>
                            <input className={"border border-blue-500 rounded px-2 mb-2 text-center"}
                                   placeholder="Enter Duration"
                                   value={expiration}
                                   onChange={(e) => setExpiration(e.target.value)}
                            />
                            <button className={"w-50 cursor-pointer bg-blue-400 text-white px-2 rounded"} type="submit">Get Link</button>
                        </form>
                    </div>
                </div>
            </>
            }

            <div className={"bg-white border border-gray-500 rounded p-3 w-46 h-50 mt-42  shadow-lg"}>
                <h1 className={"hover:bg-blue-400 hover:text-white px-5 rounded cursor-pointer mb-1 flex p-2"}
                    onClick={()=>setRename(true)}>
                    <CgRename className={'h-6 w-6 mr-2'}/>Rename</h1>

                <h1 className={"hover:bg-blue-400 hover:text-white px-5 rounded cursor-pointer mb-1 flex p-2"}
                    onClick={onDelete}>
                    <TrashIcon className={"h-6 w-6 mr-2"}/>Delete</h1>

                <h1 className={"hover:bg-blue-400 hover:text-white px-5 rounded cursor-pointer mb-1 flex p-2"}
                onClick={()=>setShare(true)}>
                    <FiShare2 className={"h-6 w-6 mr-2"}/>Share</h1>
            </div>
        </>
    )
}
export default OptionsMenu