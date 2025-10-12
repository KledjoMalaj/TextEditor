import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";

function LandingPage() {
    const navigate = useNavigate()

    const [documents,setDocuments] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3030/Documents/getAll')
            .then((res)=>setDocuments(res.data))
    }, []);

    const handleOpenDoc = (title)=> {
        navigate(`/editor/${title}`)
    }


    return(
        <>
            <div className={'grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 m-5 gap-5'}>
                {documents && documents.map(i=>
                <div onClick={()=>handleOpenDoc(i.title)} key={i.id} className={'cursor-pointer h-75 bg-white rounded shadow-md'}>
                    <div className={'bg-blue-400 text-white text-center h-10 p-2 rounded shadow-md'}>
                        <h1 className={''}>{i.title}</h1>
                    </div>
                    <div className={'mt-5 px-5'} dangerouslySetInnerHTML={{ __html: i.content }}></div>

                </div>
                )}
            </div>
        </>
    )
}
export default LandingPage