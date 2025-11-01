import express from "express";
import * as crypto from "node:crypto";
import db from '../db.js'
import {authenticateToken} from "../middleware/users.js";

const router = express.Router()

router.post('/documents/:id/share', authenticateToken, (req,res)=>{
    const {id} = req.params
    const {role,expiresIn} = req.body
    const userId = req.user.id;

    db.get('SELECT * FROM documents WHERE id = ? AND user_id = ?', [id, userId], (err, doc) => {
        if (err) return res.status(500).json({error: err.message});
        if (!doc) return res.status(404).json({error: 'Document not found or unauthorized'});

        const shareToken = crypto.randomBytes(32).toString('hex');

        let expiresAt = null;
        if (expiresIn) {
            const days = parseInt(expiresIn.replace('d', ''));
            expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        }

        const sql = `INSERT INTO shared_documents (document_id, share_token, role, expires_at) VALUES (?, ?, ?, ?)`

        db.run(sql,[id, shareToken, role, expiresAt], function(err){
            if(err) return res.status(500).json({error:err.message})
            const shareURL = `${process.env.FRONTEND_URL}/shared/${shareToken}`

            res.json({
                id: this.lastID,
                shareToken,
                shareURL,
                role,
                expiresAt
            })
        })
    })
})

router.get('/shared/:token', (req,res)=>{
    const {token} = req.params

    const sql = `
        SELECT d.*, sd.role, sd.expires_at, sd.revoked_at
        FROM shared_documents sd
        JOIN documents d ON sd.document_id = d.id
        WHERE sd.share_token = ?
    `;

    db.get(sql, [token], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!result) return res.status(404).json({ error: 'Shared document not found' });

        // Check if revoked
        if (result.revoked_at) {
            return res.status(403).json({ error: 'This share link has been revoked' });
        }

        // Check if expired
        if (result.expires_at && new Date(result.expires_at) < new Date()) {
            return res.status(403).json({ error: 'This share link has expired' });
        }

        res.json({
            document: {
                id: result.id,
                title: result.title,
                content: result.content,
                created_at: result.created_at,
                updated_at: result.updated_at
            },
            role: result.role
        });
    });
})

export default router