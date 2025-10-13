import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function TitlePupUp({ onClose }) {
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    const [id, setId] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3030/Documents/add', { title })
            .then((res) => {
                setId(res.data.id);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (id) navigate(`/editor/${id}`);
    }, [id, navigate]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-2 rounded">
                <button onClick={onClose}>Close</button>
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    /><br />
                    <button type="submit">Create Document</button>
                </form>
            </div>
        </div>
    );
}

export default TitlePupUp;
