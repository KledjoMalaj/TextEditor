import axios from "axios";

function OptionsMenu({documentId}){

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3030/Document/delete/${id}`)
    }

    return (
        <>
            <div className={"bg-white rounded p-2 w-50 h-50 mt-40 ml-3 shadow-lg"}>
                <h1 className={"hover:bg-gray-400 px-5 rounded cursor-pointer mb-1"}>Rename</h1>
                <h1 className={"hover:bg-gray-400 px-5 rounded cursor-pointer mb-1"} onClick={() => handleDelete(documentId)}>Delete</h1>
            </div>
        </>
    )
}
export default OptionsMenu