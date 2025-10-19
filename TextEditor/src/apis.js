const Api_Key = import.meta.env.VITE_WEBFONTS_API_KEY

export async function FetchFonts(){
    const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${Api_Key}`)
    const data = await res.json()
    const fontNames = data.items.map(f => f.family);
    return fontNames
}


