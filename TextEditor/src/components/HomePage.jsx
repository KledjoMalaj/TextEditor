import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import TitlePupUp from "./TitlePupUp.jsx";
import {Bars3Icon} from "@heroicons/react/16/solid/index.js";
import OptionsMenu from "./OptionsMenu.jsx";
import { RxPlus } from "react-icons/rx";

function HomePage() {
    const navigate = useNavigate()
    const [documents,setDocuments] = useState([])
    const [titlePopUp,setTitlePopUP] = useState(false)
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3030/Documents/getAll',{
            headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}
        })
            .then((res)=>setDocuments(res.data))
    }, []);

    const handleOpenDoc = (id)=> {
        navigate(`/editor/${id}`)
    }

    const handleStartNew = () => {
        setTitlePopUP(true)
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3030/Documents/delete/${id}`)
        setDocuments(documents.filter(doc => doc.id !== id))
    }

    const handleRename = (id,newTitle ) => {
        axios.put(`http://localhost:3030/Documents/Rename/${id}`, {
            title:newTitle
        })
        setDocuments(documents.map(doc => doc.id === id ? {...doc,title:newTitle } : doc))

        setOpenMenuId(null)

    }

    return(
        <>
            {titlePopUp &&  <TitlePupUp onClose={()=>setTitlePopUP(false)}/>}

            <div className={'flex justify-center my-2 mx-3 mt-5'}>
                <div className={'flex bg-white py-2 px-6 rounded'}>
                    <h1 className={'pl-2 h-6 w-30 mt-2 font-semibold text-xl'}>Start New </h1>
                    <button className={'StartButton'}
                            onClick={handleStartNew}>
                        <RxPlus className={'h-6 w-6'}/>
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6 mx-3 bg-white rounded p-5">
                {documents && documents.map(i => (
                    <div key={i.id} className="Document-card">
                        <div className={"Document-card2"}>
                            <div className="bg-blue-500 flex justify-between items-center p-3 rounded-t">
                                <h1 className="text-white text-lg font-semibold">{i.title}</h1>
                                <button
                                    className={"cursor-pointer hover:bg-blue-700 px-3 py-2 rounded"}
                                    onClick={() => setOpenMenuId(openMenuId === i.id ? null : i.id)}
                                >
                                    <Bars3Icon className={"h-6 w-6 text-white "}/>
                                </button>

                                <div className={"absolute"}>
                                    {openMenuId === i.id && <OptionsMenu documentId={i.id} onDelete={()=>handleDelete(i.id)} onRename={handleRename} />}
                                </div>
                            </div>


                            <div
                                onClick={() => handleOpenDoc(i.id)}
                                className="bg-white flex-grow cursor-pointer p-4 overflow-hidden h-[270px] document-preview border-1 hover:border-blue-600 "
                            >
                                <div
                                    dangerouslySetInnerHTML={{ __html: i.content }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    )
}
export default HomePage