import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import TitlePupUp from "./TitlePupUp.jsx";

function LandingPage() {
    const navigate = useNavigate()
    const [documents,setDocuments] = useState([])
    const [titlePopUp,setTitlePopUP] = useState(false)

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


            <div className={'grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 mx-5 gap-5'}>

                {documents && documents.map(i=>
                    <div   key={i.id}>
                        <div className={'bg-blue-400 flex justify-between p-2 rounded-t'}>
                            <h1 className={'text-white'}>{i.title}</h1>
                            <button className={'bg-red-400 px-2 rounded cursor-pointer'} onClick={()=>handleDelete(i.id)}>Delete</button>
                        </div>

                        <div onClick={()=>handleOpenDoc(i.id)} className={'h-75 bg-white rounded shadow-lg cursor-pointer p-2'}>
                            <div  className={'mt-5 px-5'} dangerouslySetInnerHTML={{ __html: i.content }}></div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default LandingPage