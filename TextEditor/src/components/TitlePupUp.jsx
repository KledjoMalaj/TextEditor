import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import { XMarkIcon } from '@heroicons/react/24/solid'
import { API_URL } from "../config.js";

function TitlePupUp({ onClose }) {
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    const [id, setId] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/Documents/add`,
            { title },
            {headers:{'Authorization':`Bearer ${localStorage.getItem('token')}`}}
            )
            .then((res) => {
                setId(res.data.id);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to create document");
            });
    };

    useEffect(() => {
        if (id) navigate(`/editor/${id}`);
    }, [id, navigate]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-2 rounded w-80">
                <button onClick={onClose}><XMarkIcon className={"h-6 w-6 text-red-500 cursor-pointer"}/></button>
                <form className={"text-center pb-5"} onSubmit={handleSubmit}>
                    <input className={"border border-blue-500 rounded px-2 mb-2 text-center"}
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    /><br></br>
                    <button className={"w-50 cursor-pointer bg-blue-400 text-white px-2 rounded"} type="submit">Create Document</button>
                </form>
            </div>
        </div>
    );
}

export default TitlePupUp;
