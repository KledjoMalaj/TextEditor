import {useEffect, useReducer, useState} from "react";
import {FetchFonts} from "../apis.js";
import axios from "axios";


function ToolBar({content,id}){
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [fontSize,setFontSize] = useState(3)
    const [fontNames,setFontNames] = useState([])
    const [ColorNow,setColorNow] = useState('black')

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

    const handleUpdate = () => {
        axios.put(`http://localhost:3030/Documents/update/${id}`,{
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
            <div className={'flex justify-between  rounded bg-white m-2 p-2 shadow-sm gap-2'}>


                <div className={"flex gap-2"}>
                    <button className={`ToolBar-Button px-2 ${state.bold ? "bg-blue-300" : "bg-gray-200"}`}
                            onClick={()=>{
                                document.execCommand('bold', false, null);
                                dispatch({type:'BOLD'})
                            }}>
                        <b>B</b>
                    </button>

                    <button className={`ToolBar-Button px-3 ${state.italic ? "bg-blue-300" : "bg-gray-200"}`}
                            onClick={()=>{
                                document.execCommand('italic',false,null)
                                dispatch({type:"ITALIC"})
                            }}>
                        <i>I</i>
                    </button>

                    <button className={`ToolBar-Button px-2 ${state.underline ? "bg-blue-300" : "bg-gray-200"}`}
                            onClick={()=>{
                                document.execCommand('underline',false,null)
                                dispatch({type:"UNDERLINE"})
                            }}>
                        <u>U</u>
                    </button>
                </div>

                <div className={"flex gap-2"}>
                    <button className={`ToolBar-Button px-2 bg-gray-200 py-1`}
                            onClick={() => setShowColorPicker(!showColorPicker)}>
                        Text Color <div className={"w-18 h-1"} style={{backgroundColor:ColorNow}}></div> </button>



                        <select className={"ToolBar-Button px-2 bg-gray-200"} onChange={handleHeading}>
                            <option value={'p'}>Normal text </option>
                            <option value={'h1'}>Heading 1</option>
                            <option value={'h2'}>Heading 2</option>
                            <option value={'h3'}>Heading 3</option>
                        </select>


                        <select className={'ToolBar-Button px-2 bg-gray-200'}  onChange={handleFont}>
                            <option value={'Arial'}>Arial</option>
                            {fontNames && fontNames.map(name =>
                                <option key={name} value={name}> {name}</option>
                            )}
                        </select>

                    <div className={"flex"}>
                        <button className={"ToolBar-Button px-3 bg-gray-200"} onClick={handleDecrement}><b>-</b></button>
                        <h1 className={'mx-2 mt-1'}>{fontSize}</h1>
                        <button className={"ToolBar-Button px-3 bg-gray-200"} onClick={handleIncrement}><b>+</b></button>
                    </div>

                        <select className={'ToolBar-Button  px-2 bg-gray-200'} onChange={handleAlign}>
                            <option value={'justifyLeft'}>Left</option>
                            <option value={'justifyCenter'}>Center</option>
                            <option value={'justifyRight'}>Right</option>
                            <option value={'justifyFull'}>Justify</option>
                        </select>

                </div>

                <div className={'flex'}>

                        <button className={'ToolBar-Button px-2  bg-gray-200'} onClick={handleUpdate}>Update</button>

                </div>


            </div>



            {showColorPicker && (
                <div className="absolute left-0 ml-42 grid grid-cols-7 gap-2 p-1 border rounded bg-white w-60 shadow-lg z-50">
                    {colors.map((color) => (
                        <div key={color} className={'hover:bg-gray-300 rounded transition-all duration-200 w-7 h-7 flex justify-center'}>
                            <button
                                onClick={() => {
                                    document.execCommand('foreColor',false,color)
                                    setColorNow(color)
                                    dispatch({type:"COLOR"})
                                    setShowColorPicker(false)
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