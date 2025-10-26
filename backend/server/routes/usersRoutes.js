import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import {authenticateToken} from "../middleware/users.js";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/register', async (req,res)=>{
    const {email,password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (email,password) VALUES (?,?)';

    db.run(sql,[email,hashedPassword],function(err){
        if(err){
            if (err.message.includes('UNIQUE')){
                return res.status(400).json({error:'Email already exists'})
            }
            return res.status(500).json({error:err.message})
        }

        res.json({
            id: this.lastID,
            email,
            message: 'User registered successfully'
        })
    })
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?'

    db.get(sql,[email],async (err,user)=>{
        if (err) {
            return res.status(500).json({error:err.message})
        }
        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid){
            return res.status(401).json({error:"Invalid password"})
        }

        const token = jwt.sign(
            {id:user.id,email:user.email},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'1h'}
        )

        res.json({
            token,
            user: {id:user.id,email:user.email}
        })
    })
})

router.get('/me',authenticateToken,async (req,res)=>{
    const sql = 'SELECT * FROM users WHERE id = ?'
    const params = req.user.id

    db.get(sql,params,(err,row)=>{
        if(err){
            return res.status(500).json({error:err.message})
        }
        if(!row){
            return res.status(404).json({error:"User Not Found"})
        }

        res.json(row)
    })
})


export default router