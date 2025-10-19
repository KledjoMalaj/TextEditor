import dotenv from 'dotenv'
const Api_Key = import.meta.env.Webfonts_Api_Key

export async function FetchFonts(){
    const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${Api_Key}`)
    const data = await res.json()
    const fontNames = data.items.map(f => f.family);
    return fontNames
}


