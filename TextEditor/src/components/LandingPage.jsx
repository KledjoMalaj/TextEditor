import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import TitlePupUp from "./TitlePupUp.jsx";
import {Bars3Icon} from "@heroicons/react/16/solid/index.js";
import OptionsMenu from "./OptionsMenu.jsx";

function LandingPage() {
    const navigate = useNavigate()
    const [documents,setDocuments] = useState([])
    const [titlePopUp,setTitlePopUP] = useState(false)
    const [openMenuId, setOpenMenuId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3030/Documents/getAll')
            .then((res)=>setDocuments(res.data))
    }, []);

    const handleOpenDoc = (id)=> {
        navigate(`/editor/${id}`)
    }

    const handleStartNew = () => {
        setTitlePopUP(true)
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3030/Document/delete/${id}`)
    }


    return(
        <>
            {titlePopUp &&  <TitlePupUp onClose={()=>setTitlePopUP(false)}/>}


            <div className={'flex justify-center m-5'}>
                <button className={'bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded cursor-pointer shadow-md'}
                onClick={handleStartNew}>Start New</button>
            </div>


            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6 mx-5">
                {documents && documents.map(i => (
                    <div key={i.id} className="bg-white rounded shadow-lg flex flex-col">
                        <div className="bg-blue-500 flex justify-between items-center p-3 rounded-t">
                            <h1 className="text-white text-lg font-semibold">{i.title}</h1>
                            <button
                                className={"cursor-pointer hover:bg-blue-700 px-2 py-1 rounded"}
                                onClick={() => setOpenMenuId(openMenuId === i.id ? null : i.id)}
                            >
                                <Bars3Icon className={"h-6 w-6 text-white "}/>
                            </button>

                            <div className={"absolute"}>
                                {openMenuId === i.id && <OptionsMenu documentId={i.id} />}
                            </div>
                        </div>


                        <div
                            onClick={() => handleOpenDoc(i.id)}
                            className="flex-grow cursor-pointer p-4 overflow-hidden h-[270px] document-preview"
                        >
                            <div
                                dangerouslySetInnerHTML={{ __html: i.content }}
                            />
                        </div>

                    </div>
                ))}
            </div>

        </>
    )
}
export default LandingPage