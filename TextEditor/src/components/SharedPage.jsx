import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../config.js";
import ToolBar from "./ToolBar.jsx";

function SharedPage() {
    const { token } = useParams();
    const [documentData, setDocumentData] = useState(null);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const editorRef = useRef(null);

    useEffect(() => {
        axios
            .get(`${API_URL}/ShareDocuments/shared/${token}`)
            .then((res) => {
                const { document, role } = res.data;
                setDocumentData(document);
                setRole(role);
                // Load content and fonts once
                if (editorRef.current) {
                    editorRef.current.innerHTML = document.content || "";
                    extractAndLoadFonts(document.content || "");
                }
            })
            .catch((err) => {
                console.error("Error loading shared document:", err);
                alert("Error loading shared document. The link may be invalid or expired.");
            })
            .finally(() => setLoading(false));
    }, [token]);

    const extractAndLoadFonts = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const matches = html.match(/face="([^"]+)"/g) || [];
        const uniqueFonts = [...new Set(matches.map(m => m.replace(/face="|"/g, "")))];
        uniqueFonts.forEach(loadGoogleFont);
    };

    const loadGoogleFont = (fontName) => {
        const linkId = `google-font-${fontName.replaceAll(" ", "-")}`;
        if (!document.getElementById(linkId)) {
            const link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replaceAll(" ", "+")}`;
            document.head.appendChild(link);
        }
    };

    const handleInput = (e) => {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
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
                        dangerouslySetInnerHTML={{ __html: documentData.content }}
                        className="Editor"
                    />
                </div>
            )}

            {role === "editor" && (
                <>
                    <div className="sticky top-0 pt-1 z-10">
                        <ToolBar content={documentData.content} id={documentData.id} title={documentData.title} />
                    </div>
                    <div className={'p-2 sm:p-4 md:p-8 flex justify-center items-start min-h-screen'}>
                        <div
                            ref={editorRef}
                            className={"Editor"}
                            suppressContentEditableWarning
                            contentEditable={true}
                            onInput={handleInput}
                        />
                    </div>
                </>
            )}
        </>
    );
}

export default SharedPage;
