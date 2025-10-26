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
            {titlePopUp && <TitlePupUp onClose={()=>setTitlePopUP(false)}/>}

            {/* Header Section - Responsive */}
            <div className={'flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 my-2 mx-3 mt-5 mb-4'}>

                {/* User Info */}
                <h1 className={'flex gap-2 bg-blue-700 rounded p-3 px-5 shadow-lg text-base sm:text-lg font-semibold text-white w-full sm:w-auto justify-center sm:justify-start'}>
                    <FaRegUser className={'h-5 w-5 sm:h-6 sm:w-6 text-white'}/>
                    <span className={'truncate max-w-[150px] sm:max-w-none'}>{user.email}</span>
                </h1>

                {/* Start New Button */}
                <div className={'flex bg-white py-2 px-4 sm:px-6 rounded shadow-lg w-full sm:w-auto justify-center'}>
                    <h1 className={'pl-2 h-6 w-30 mt-2 font-semibold text-lg sm:text-xl'}>Start New</h1>
                    <button className={'StartButton'}
                            onClick={handleStartNew}>
                        <RxPlus className={'h-6 w-6'}/>
                    </button>
                </div>

                {/* Logout Button */}
                <button
                    className={'text-base sm:text-lg font-semibold text-white flex gap-2 cursor-pointer bg-red-500 rounded shadow-lg p-3 px-5 hover:bg-red-600 hover:shadow-xl transition-all duration-150 w-full sm:w-auto justify-center'}
                    onClick={handleLogOut}>
                    Log Out<RiLogoutBoxRLine className={'h-6 w-6 sm:h-7 sm:w-7'}/>
                </button>

            </div>

            {/* Documents Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mx-3 bg-white rounded p-3 sm:p-5 border">
                {documents && documents.map(i => (
                    <div key={i.id} className="Document-card">
                        <div className={"Document-card2"}>
                            {/* Document Header */}
                            <div className="bg-blue-500 flex justify-between items-center p-2 sm:p-3 rounded-t">
                                <h1 className="text-white text-base sm:text-lg font-semibold truncate flex-1 mr-2">
                                    {i.title}
                                </h1>
                                <button
                                    className={"cursor-pointer hover:bg-blue-700 px-2 sm:px-3 py-2 rounded transition-all duration-150 flex-shrink-0"}
                                    onClick={() => setOpenMenuId(openMenuId === i.id ? null : i.id)}
                                >
                                    <Bars3Icon className={"h-5 w-5 sm:h-6 sm:w-6 text-white"}/>
                                </button>

                                {/* Options Menu */}
                                <div className={"absolute z-50"}>
                                    {openMenuId === i.id && (
                                        <OptionsMenu
                                            documentId={i.id}
                                            onDelete={()=>handleDelete(i.id)}
                                            onRename={handleRename}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Document Preview */}
                            <div
                                onClick={() => handleOpenDoc(i.id)}
                                className="bg-white flex-grow cursor-pointer p-3 sm:p-4 overflow-hidden
                                   h-[200px] sm:h-[250px] md:h-[270px]
                                   document-preview border hover:border-blue-600 transition-all duration-150
                                   text-sm sm:text-base"
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