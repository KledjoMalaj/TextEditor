const Api_Key = 'AIzaSyBdmmaEu379gaH6FFx9EReXeyPhxQiOqpQ'

export async function FetchFonts(){
    const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${Api_Key}`)
    const data = await res.json()
    const fontNames = data.items.map(f => f.family);
    return fontNames
}


