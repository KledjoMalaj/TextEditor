import express from "express"
import db from "./db.js"
import cors from "cors"

const app = express();
const port = 3030

app.use(express.json());

app.post('/Documents/add',(req,res)=>{
    const {title,content} = req.body
    const sql = 'INSERT INTO documents (title,content) VALUES (?,?)';
    db.run(sql,[title,content], function (err){
        if(err) {
            return res.status(500).json({error:err.message})
        }
        res.json({ id: this.lastID, title, content });
    })

})

app.get('/Documents/get/:title',(req,res)=>{
    const {title} = req.params
    const sql = 'Select * From documents WHERE title = ?'
    db.get(sql,[title],(err, row)=>{
        if(err){
            return res.status(500).json({error:err.message})
        }
        if(!row){
            return res.status(404).json({error:"Document not Found"})
        }
        res.json(row)
    })
})


app.listen(port,() => {
    console.log(`Server running On port => ${port}`)
})