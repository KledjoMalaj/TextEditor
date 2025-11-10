import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../config.js";
import ToolBar from "./ToolBar.jsx";

function SharedPage() {
    const { token } = useParams();
    const [documentData, setDocumentData] = useState(null);
    const [role, setRole] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const editorRef = useRef(null);

    useEffect(() => {
        axios
            .get(`${API_URL}/ShareDocuments/shared/${token}`)
            .then(async (res) => {
                const { document, role } = res.data;

                setDocumentData(document);
                setRole(role);
                setContent(document.content || "");

                await extractAndLoadFonts(document.content || "");
            })
            .catch((err) => {
                console.error('Error loading shared document:', err);
                alert("Error loading shared document.");
            })
            .finally(() => setLoading(false));
    }, [token]);

    useEffect(() => {
        if (role === "editor" && editorRef.current && documentData?.content) {
            editorRef.current.innerHTML = documentData.content;
        }
    }, [role, documentData]);



    const extractAndLoadFonts = async (html) => {
        const matches = html.match(/face="([^"]+)"/g) || [];
        const uniqueFonts = [...new Set(matches.map(m => m.replace(/face="|"/g, "")))];

        await Promise.all(uniqueFonts.map(fontName => loadGoogleFont(fontName)));
    };

    const loadGoogleFont = (fontName) => {
        return new Promise((resolve) => {
            const linkId = `google-font-${fontName.replaceAll(" ", "-")}`;

            if (document.getElementById(linkId)) {
                resolve();
                return;
            }

            const link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replaceAll(" ", "+")}`;
            link.onload = () => resolve();
            link.onerror = () => resolve();
            document.head.appendChild(link);
        });
    };

    const handleInput = (e) => {
        e.preventDefault()
        setContent(e.target.innerHTML);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading shared document...</div>;
    }

    if (!documentData) {
        return <div className="p-8 text-center text-red-500">Document not found.</div>;
    }

    return (
        <>
            {role === "viewer" && (
                <div className="p-2 sm:p-4 md:p-8 flex justify-center items-start min-h-screen">
                    <div
                        dangerouslySetInnerHTML={{ __html: content }}
                        className="Editor"
                    />
                </div>
            )}

            {role === "editor" && (
                <>
                    <div className="sticky top-0 pt-1 z-10">
                        <ToolBar content={content} id={documentData?.id} title={documentData?.title} />
                    </div>
                    <div className={'p-2 sm:p-4 md:p-8 flex justify-center items-start min-h-screen'}>
                        <div
                            ref={editorRef}
                            className={"Editor"}
                            suppressContentEditableWarning
                            contentEditable={true}
                            onInput={handleInput}
                        >
                            {!content && <span style={{color: 'red'}}>Editor loading...</span>}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default SharedPage;