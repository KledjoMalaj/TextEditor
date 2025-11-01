import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config.js";

function SharedPage() {
    const { token } = useParams();
    const [documentData, setDocumentData] = useState({});

    useEffect(() => {
        axios.get(`${API_URL}/ShareDocuments/shared/${token}`)
            .then(res => {
                setDocumentData(res.data.document);
            })
            .catch(console.error);
    }, [token]);

    useEffect(() => {
        if (documentData.content) {
            extractAndLoadFonts(documentData.content);
        }
    }, [documentData.content]);


    const extractAndLoadFonts = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const fontTags = tempDiv.querySelectorAll('font[face]');

        const uniqueFonts = new Set();
        fontTags.forEach(tag => {
            const fontName = tag.getAttribute('face');
            if (fontName) {
                uniqueFonts.add(fontName);
            }
        });

        uniqueFonts.forEach(fontName => {
            loadGoogleFont(fontName);
        });
    }

    const loadGoogleFont = (fontName) => {
        const linkId = `google-font-${fontName.replaceAll(" ", "-")}`;
        if (!document.getElementById(linkId)) {
            const link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replaceAll(" ", "+")}`;
            document.head.appendChild(link);
        }
    }

    return (
        <div className={"p-2 sm:p-4 md:p-8 flex justify-center items-start min-h-screen"}>
            <div className={"Editor"} dangerouslySetInnerHTML={{ __html: documentData.content }}></div>
        </div>
    );
}

export default SharedPage;
