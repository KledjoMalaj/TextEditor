import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";
import TitlePupUp from "./TitlePupUp.jsx";
import {Bars3Icon} from "@heroicons/react/16/solid/index.js";
import OptionsMenu from "./OptionsMenu.jsx";
import { RxPlus } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { API_URL } from "../config.js";

function HomePage() {
    const navigate = useNavigate()
    const [documents,setDocuments] = useState([])
    const [titlePopUp,setTitlePopUP] = useState(false)
    const [openMenuId, setOpenMenuId] = useState(null);
    const [user,setUser] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchData = async () => {
            try {
                const [docsRes, userRes] = await Promise.all([
                    axios.get(`${API_URL}/Documents/getAll`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API_URL}/Users/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setDocuments(docsRes.data);
                setUser(userRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to load data");
            }
        };

        fetchData();
    }, []);



    const handleOpenDoc = (id)=> {
        navigate(`/editor/${id}`)
    }

    const handleStartNew = () => {
        setTitlePopUP(true)
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/Documents/delete/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to Delete')
        }
    };

    const handleRename = async (id,newTitle ) => {
        try {
            await axios.put(`${API_URL}/Documents/Rename/${id}`, {
                title: newTitle
            }, {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
            })
            setDocuments(prevDocs =>
                prevDocs.map(doc =>
                    doc.id === id ? { ...doc, title: newTitle } : doc
                )
            );

            setOpenMenuId(null)
        }catch (err){
            alert('Failed to Rename')
        }
    }

    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return(
        <>
            {titlePopUp &&  <TitlePupUp onClose={()=>setTitlePopUP(false)}/>}

            <div className={'flex justify-between my-2 mx-3 mt-5 mb-4'}>

                    <h1 className={'flex gap-2 bg-blue-700 rounded p-3 px-5  mt-1 mb-2 shadow-lg text-lg font-semibold text-white'}>
                        <FaRegUser className={'h-6 w-6 text-white'}/>{user.email}
                    </h1>

                <div className={'flex bg-white py-2 px-6 rounded shadow-lg'}>
                    <h1 className={'pl-2 h-6 w-30 mt-2 font-semibold text-xl'}>Start New </h1>
                    <button className={'StartButton'}
                            onClick={handleStartNew}>
                        <RxPlus className={'h-6 w-6'}/>
                    </button>
                </div>

                    <button className={'text-lg font-semibold text-white flex gap-2 cursor-pointer bg-red-500 rounded shadow-lg p-3 px-5 mt-1 mb-2 hover:bg-red-600 hover:shadow-xl transition-all duration-150'}
                    onClick={handleLogOut}>
                        Log Out<RiLogoutBoxRLine className={'h-7 w-7 '}/>
                    </button>

            </div>

            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-6 mx-3 bg-white rounded p-5 border">
                {documents && documents.map(i => (
                    <div key={i.id} className="Document-card">
                        <div className={"Document-card2"}>
                            <div className="bg-blue-500 flex justify-between items-center p-3 rounded-t">
                                <h1 className="text-white text-lg font-semibold">{i.title}</h1>
                                <button
                                    className={"cursor-pointer hover:bg-blue-700 px-3 py-2 rounded transition-all duration-150"}
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