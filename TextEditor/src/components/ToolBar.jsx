import {useEffect, useReducer, useState} from "react";
import {FetchFonts} from "../apis.js";
import axios from "axios";
import { API_URL } from "../config.js";
import DownloadOptions from "./DownloadOptions.jsx";


function ToolBar({content,id,title}){

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [fontSize,setFontSize] = useState(3)
    const [fontNames,setFontNames] = useState([])
    const [ColorNow,setColorNow] = useState('black')
    const [ShowDownloadOptions,setShowDownloadOptions] = useState(false)

    const [state,dispatch] = useReducer((state,action)=>{
        switch (action.type){
            case "BOLD":
                return {...state, bold: !state.bold}
            case "ITALIC":
                return {...state, italic: !state.italic}
            case "UNDERLINE":
                return {...state, underline: !state.underline}
            case "COLOR":
                return {...state, color: !state.color}
            default :
                return state
        }

    },{
        bold:false,
        italic:false,
        underline:false,
        color:"black"
    })

    const colors = [
        '#000000', '#434343', '#666666', '#999999', '#b7b7b7',
        '#ffffff', '#ff0000', '#ff9900', '#ffff00', '#00ff00',
        '#00ffff', '#0000ff', '#9900ff', '#ff00ff'
    ];


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

    const handleUpdate = async () => {
        try {
            await axios.put(
                `${API_URL}/Documents/update/${id}`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

        } catch (err) {
            console.error(err);
            alert("Update unsuccessful ");
        }
    };

    useEffect(() => {

        const fetchFonts = async () => {
            const fonts = await FetchFonts();
            setFontNames(fonts);
        };

        fetchFonts()

    }, []);


    return (
        <>


            <div className={'flex flex-wrap justify-between items-center rounded bg-white m-2 p-2 shadow-sm gap-2 md:gap-4'}>

                <div className={"flex gap-2 order-1 "}>
                    <button className={`px-3 py-2 rounded cursor-pointer ${state.bold ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={()=>{
                                document.execCommand('bold', false, null);
                                dispatch({type:'BOLD'})
                            }}>
                        <b>B</b>
                    </button>

                    <button className={`px-3 py-2 rounded cursor-pointer ${state.italic ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={()=>{
                                document.execCommand('italic',false,null)
                                dispatch({type:"ITALIC"})
                            }}>
                        <i>I</i>
                    </button>

                    <button className={`px-3 py-2 rounded cursor-pointer ${state.underline ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={()=>{
                                document.execCommand('underline',false,null)
                                dispatch({type:"UNDERLINE"})
                            }}>
                        <u>U</u>
                    </button>

                    <div className={'bg-gray-200 px-3 py-2 rounded cursor-pointer hover:bg-gray-300 text-sm sm:text-base sm:w-auto'}
                    onClick={()=>setShowDownloadOptions(!ShowDownloadOptions)}>
                        <h1>Download</h1>
                    </div>
                </div>

                <div className={"flex flex-wrap gap-2 items-center order-2 md:order-2 w-full md:w-auto"}>
                    <button className={`px-3 py-2 rounded bg-gray-200 flex items-center gap-2 cursor-pointer whitespace-nowrap`}
                            onClick={() => setShowColorPicker(!showColorPicker)}>
                        <span className="hidden sm:inline">Text Color</span>
                        <span className="sm:hidden">Color</span>
                        <div className={"w-6 h-1.5 rounded"} style={{backgroundColor:ColorNow}}></div>
                    </button>

                    <select className={"px-2 sm:px-3 py-2 rounded bg-gray-200 cursor-pointer text-sm sm:text-base"} onChange={handleHeading}>
                        <option value={'p'}>Normal</option>
                        <option value={'h1'}>H1</option>
                        <option value={'h2'}>H2</option>
                        <option value={'h3'}>H3</option>
                    </select>

                    <select className={'px-2 sm:px-3 py-2 rounded bg-gray-200 cursor-pointer text-sm sm:text-base max-w-[120px] sm:max-w-none'} onChange={handleFont}>
                        <option value={'Arial'}>Arial</option>
                        {fontNames && fontNames.map(name =>
                            <option key={name} value={name}>{name}</option>
                        )}
                    </select>

                    <div className={"flex items-center bg-gray-200 rounded"}>
                        <button className={"px-2 sm:px-3 py-2 hover:bg-gray-300 cursor-pointer"} onClick={handleDecrement}>-</button>
                        <span className={'px-2 sm:px-3 font-medium text-sm sm:text-base'}>{fontSize}</span>
                        <button className={"px-2 sm:px-3 py-2 hover:bg-gray-300 cursor-pointer"} onClick={handleIncrement}>+</button>
                    </div>

                    <select className={'px-2 sm:px-3 py-2 rounded bg-gray-200 cursor-pointer text-sm sm:text-base'} onChange={handleAlign}>
                        <option value={'justifyLeft'}>Left</option>
                        <option value={'justifyCenter'}>Center</option>
                        <option value={'justifyRight'}>Right</option>
                        <option value={'justifyFull'}>Justify</option>
                    </select>


                </div>

                <button className={'px-4 sm:px-6 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 cursor-pointer order-3 w-full sm:w-auto'} onClick={handleUpdate}>
                    Save
                </button>
            </div>

            {showColorPicker && (
                <div className="fixed md:absolute top-16 md:top-auto left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 md:ml-42
                    grid grid-cols-5 md:grid-cols-7 gap-3 md:gap-2 p-4 md:p-2
                    border rounded-lg bg-white w-[90vw] max-w-xs md:w-60
                    shadow-2xl md:shadow-lg z-50">
                    {colors.map((color) => (
                        <div key={color} className={'hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-all duration-150 \n' +
                            '                           w-12 h-12 md:w-7 md:h-7 flex items-center justify-center'}>
                            <button
                                onClick={() => {
                                    document.execCommand('foreColor',false,color)
                                    setColorNow(color)
                                    dispatch({type:"COLOR"})
                                    setShowColorPicker(false)
                                }}
                                className="w-10 h-10 md:w-6 md:h-6 rounded-lg md:rounded border-2 md:border border-gray-300 cursor-pointer
                                shadow-sm hover:shadow-md transition-shadow"
                                style={{ backgroundColor: color }}
                            />
                        </div>
                    ))}
                </div>
            )}


            {ShowDownloadOptions && <DownloadOptions title={title} onClose={()=>setShowDownloadOptions(false)}/>}

        </>
    )
}

export default ToolBar