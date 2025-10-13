import express from "express"
import db from "./db.js"
import cors from "cors"

const app = express();
const port = 3030


app.use(cors())
app.use(express.json());

app.post('/Documents/add',(req,res)=>{
    const {title} = req.body
    const sql = 'INSERT INTO documents (title) VALUES (?)';
    db.run(sql,[title], function (err){
        if(err) {
            return res.status(500).json({error:err.message})
        }
        res.json({ id: this.lastID, title });
    })

})

app.get('/Documents/get/:id',(req,res)=>{
    const {id} = req.params
    const sql = 'Select * From documents WHERE id = ?'
    db.get(sql,[id],(err, row)=>{
        if(err){
            return res.status(500).json({error:err.message})
        }
        if(!row){
            return res.status(404).json({error:"Document not Found"})
        }
        res.json(row)
    })
})

app.get('/Documents/getAll',(req,res)=>{
    const sql = 'SELECT * FROM documents'
    db.all(sql,(err, row)=>{
        if(err){
            return res.status(500).json({error:err.message})
        }
        if(!row){
            return res.status(404).json({error:"Documents not found"})
        }
        res.json(row)
    })
})

app.put('/Document/update/:id',(req,res)=>{
    const {id} = req.params;
    const {content} = req.body

    const sql = 'UPDATE documents SET content = ? , updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    db.run(sql,[content,id],function(err){
        if(err){
            return res.status(500).json({error:err.message})
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ id, content, updated: true });
        })
})

app.delete('/Document/delete/:id',(req,res)=>{
    const {id} = req.params
    const sql = 'DELETE FROM documents WHERE id = ?'

    db.run(sql,[id],function(err){
        if(err){
            res.status(500).json({error:err.message})
        }
        res.json('Document Deleted')
    })
})



app.listen(port,() => {
    console.log(`Server running On port => ${port}`)
})