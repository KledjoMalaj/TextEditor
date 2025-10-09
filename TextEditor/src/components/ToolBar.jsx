import {useState} from "react";

function ToolBar(){
    const [showColorPicker, setShowColorPicker] = useState(false);

    const colors = [
        '#000000', '#434343', '#666666', '#999999', '#b7b7b7',
        '#ffffff', '#ff0000', '#ff9900', '#ffff00', '#00ff00',
        '#00ffff', '#0000ff', '#9900ff', '#ff00ff'
    ];

    const handleColor = (color) => {
        document.execCommand('foreColor', false, color);
    }

    const handleBold = () =>{
        const selectedText = window.getSelection()
        if (selectedText.toString().length > 0) {
            document.execCommand('bold',false, null)
        } else{
            console.log('Nothing is selected')
        }
    }

    const handleItalic = () => {
        const selectedText = window.getSelection()
        if (selectedText.toString().length > 0) {
            document.execCommand('italic',false,null)
        } else {
            console.log('Nothing is selected')
        }
    }

    const handleUnderline = () => {
        const selectedText = window.getSelection()
        if(selectedText.toString().length > 0){
            document.execCommand('underline', false, null)
        } else {
            console.log('Nothing is selected')
        }
    }

    const handleHeading = (event) => {
        const value = event.target.value
        document.execCommand('formatBlock', false, '<' + value + '>')
    }




    return (
        <>
            <div className={'flex rounded bg-white m-2 p-2 shadow-sm gap-2'}>

                <div className="w-px bg-black"></div>
                <button className={'ToolBar-Button'}
                        onClick={handleBold}><b>B</b></button>

                <button className={'ToolBar-Button'}
                        onClick={handleItalic}><i>I</i></button>

                <button className={'ToolBar-Button'}
                        onClick={handleUnderline}><u>U</u></button>

                <button className={'ToolBar-Button'} onClick={() => setShowColorPicker(!showColorPicker)}>Text Color</button>

                <div className="w-px bg-black"></div>

                <select className={'ToolBar-Button p-1'} onChange={handleHeading}>
                    <option value={'p'}>Normal text </option>
                    <option value={'h1'}>Heading 1</option>
                    <option value={'h2'}>Heading 2</option>
                    <option value={'h3'}>Heading 3</option>
                </select>



            </div>

            {showColorPicker && (
                <div className="grid grid-cols-7 gap-1 p-2 border rounded bg-white w-50">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => {
                                handleColor(color);
                                setShowColorPicker(false);
                            }}
                            className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            )}

        </>
    )
}

export default ToolBar