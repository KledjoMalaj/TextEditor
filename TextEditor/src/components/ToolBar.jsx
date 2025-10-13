import {useEffect, useState} from "react";
import {FetchFonts} from "../apis.js";
import axios from "axios";

function ToolBar({content,id}){
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [fontSize,setFontSize] = useState(3)
    const [fontNames,setFontNames] = useState([])


    const colors = [
        '#000000', '#434343', '#666666', '#999999', '#b7b7b7',
        '#ffffff', '#ff0000', '#ff9900', '#ffff00', '#00ff00',
        '#00ffff', '#0000ff', '#9900ff', '#ff00ff'
    ];

    const handleColor = (color) => {
        document.execCommand('foreColor', false, color);
    }

    const handleBold = () =>{
        document.execCommand('bold',false, null)
    }

    const handleItalic = () => {
        document.execCommand('italic',false,null)
    }

    const handleUnderline = () => {
        document.execCommand('underline', false, null)
    }

    const handleHeading = (event) => {
        const value = event.target.value
        document.execCommand('formatBlock', false, '<' + value + '>')
    }

    const handleIncrement = () => {
        const newSize = Math.min(7,fontSize + 1)
        setFontSize(newSize)
        document.execCommand('fontSize',false, newSize)
    }

    const handleDecrement = () => {
        const newSize = Math.max(1,fontSize - 1)
        setFontSize(newSize)
        document.execCommand('fontSize',false, newSize)
    }

    const handleFont = (e) => {
        const selectedFont = e.target.value;

        const linkId = `google-font-${selectedFont.replaceAll(" ", "-")}`;
        if (!document.getElementById(linkId)) {
            const link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replaceAll(" ", "+")}`;
            document.head.appendChild(link);
        }

        document.execCommand("fontName", false, selectedFont);
    };

    const handleAlign = (event) =>{
        const value = event.target.value
        document.execCommand(value,false,null)
    }

    const handleUpdate = () => {
        axios.put(`http://localhost:3030/Document/update/${id}`,{
            content
        })
    }

    useEffect(() => {

        const fetchFonts = async () => {
            const fonts = await FetchFonts();
            setFontNames(fonts);
        };

        fetchFonts()

    }, []);


    return (
        <>
            <div className={'flex rounded bg-white m-2 p-2 shadow-sm gap-2'}>

                <div className="w-px bg-black"></div>
                <button className={'ToolBar-Button px-2'}
                        onClick={handleBold}><b>B</b></button>

                <button className={'ToolBar-Button px-3'}
                        onClick={handleItalic}><i>I</i></button>

                <button className={'ToolBar-Button px-2'}
                        onClick={handleUnderline}><u>U</u></button>

                <button className={'ToolBar-Button px-2'} onClick={() => setShowColorPicker(!showColorPicker)}>Text Color</button>

                <div className="w-px bg-black"></div>

                <div className={"ToolBar-Button pr-2"}>
                    <select className={"innerElement"} onChange={handleHeading}>
                        <option value={'p'}>Normal text </option>
                        <option value={'h1'}>Heading 1</option>
                        <option value={'h2'}>Heading 2</option>
                        <option value={'h3'}>Heading 3</option>
                    </select>
                </div>

                <div className={'ToolBar-Button pr-2'}>
                    <select className={'innerElement'}  onChange={handleFont}>
                        <option value={'Arial'}>Arial</option>
                        {fontNames && fontNames.map(name =>
                            <option key={name} value={name}> {name}</option>
                        )}
                    </select>
                </div>


                <div className="w-px bg-black"></div>

                <div className={"flex"}>
                    <button className={"ToolBar-Button px-3"} onClick={handleDecrement}><b>-</b></button>
                    <h1 className={'mx-2 mt-1'}>{fontSize}</h1>
                    <button className={"ToolBar-Button px-3"} onClick={handleIncrement}><b>+</b></button>
                </div>

                <div className="w-px bg-black"></div>

                <div className={"ToolBar-Button pr-2"}>
                    <select className={'innerElement'} onChange={handleAlign}>
                        <option value={'justifyLeft'}>Left</option>
                        <option value={'justifyCenter'}>Center</option>
                        <option value={'justifyRight'}>Right</option>
                        <option value={'justifyFull'}>Justify</option>
                    </select>
                </div>

                <div>
                    <button className={'ToolBar-Button px-2 py-1'} onClick={handleUpdate}>Update</button>
                </div>

            </div>

            {showColorPicker && (
                <div className="absolute left-0 ml-42 grid grid-cols-7 gap-2 p-1 border rounded bg-white w-60 shadow-lg z-50">
                    {colors.map((color) => (
                        <div key={color} className={'hover:bg-gray-300 rounded transition-all duration-200 w-7 h-7 flex justify-center'}>
                            <button
                                onClick={() => {
                                    handleColor(color);
                                    setShowColorPicker(false);
                                }}
                                className="mt-0.5 w-6 h-6 rounded-4xl border border-gray-300 cursor-pointer"
                                style={{ backgroundColor: color }}
                            />
                        </div>
                    ))}
                </div>
            )}

        </>
    )
}

export default ToolBar