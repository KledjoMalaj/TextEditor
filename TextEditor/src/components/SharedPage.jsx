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
        console.log('1. Starting fetch for token:', token);

        axios
            .get(`${API_URL}/ShareDocuments/shared/${token}`)
            .then(async (res) => {
                console.log('2. Response received:', res.data);

                const { document, role } = res.data;
                console.log('3. Document content length:', document.content?.length);
                console.log('4. Role:', role);

                setDocumentData(document);
                setRole(role);

                await extractAndLoadFonts(document.content || "");
                console.log('5. Fonts loaded');

                setContent(document.content || "");
                console.log('6. Content state set');

                if (editorRef.current) {
                    console.log('7. Setting innerHTML on editorRef');
                    editorRef.current.innerHTML = document.content || "";
                    console.log('8. innerHTML set, value:', editorRef.current.innerHTML.substring(0, 50));
                } else {
                    console.log('7. editorRef.current is NULL!');
                }
            })
            .catch((err) => {
                console.error('ERROR:', err);
                alert("Error loading shared document.");
            })
            .finally(() => {
                console.log('9. Finally - setting loading false');
                setLoading(false);
            });
    }, [token]);



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