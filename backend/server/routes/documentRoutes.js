import express from 'express';
import db from '../db.js';
import {authenticateToken} from "../middleware/users.js";

const router = express.Router();

router.post('/add',authenticateToken, (req, res) => {
    const {title} = req.body
    const userId = req.user.id
    const sql = 'INSERT INTO documents (title, user_id) VALUES (?, ?)'
    db.run(sql, [title,userId], function (err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.json({id: this.lastID, title});
    })
})

router.get('/get/:id', (req, res) => {
    const {id} = req.params
    const sql = 'Select * From documents WHERE id = ?'
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        if (!row) {
            return res.status(404).json({error: "Document not Found"})
        }
        res.json(row)
    })
})

router.get('/getAll',authenticateToken, (req, res) => {
    const userId = req.user.id
    const sql = 'SELECT * FROM documents WHERE user_id = ?'
    db.all(sql,userId, (err, row) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.json(row)
    })
})

router.put('/update/:id', (req, res) => {
    const {id} = req.params;
    const {content} = req.body

    const sql = 'UPDATE documents SET content = ? , updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    db.run(sql, [content, id], function (err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        if (this.changes === 0) {
            return res.status(404).json({error: 'Document not found'});
        }
        res.json({id, content, updated: true});
    })
})

router.delete('/delete/:id', (req, res) => {
    const {id} = req.params
    const sql = 'DELETE FROM documents WHERE id = ?'

    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.json('Document Deleted')
    })
})

router.put('/Rename/:id', (req, res) => {
    const {id} = req.params
    const {title} = req.body
    const sql = 'UPDATE documents SET title = ? , updated_at = CURRENT_TIMESTAMP WHERE id = ?'

    db.run(sql, [title, id], function (err) {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        if (this.changes === 0) {
            return res.status(404).json({error: 'Document not found'});
        }
        res.json({id, title, updated: true});
    })
})

export default router;