import db from "../db"
import { Request, Response, NextFunction } from "express";

export class NoteController {
    async createNote(req: Request, res: Response, next: NextFunction) {
        try{
            const {title, content} = req.body
            const result = await db.query("INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *", [title, content])
            res.status(201).json(result.rows[0])

        }catch(err){
            next(err)
        }
    }

    async getNotes(req: Request, res: Response, next: NextFunction) {
        try{
            const result = await db.query("SELECT * FROM notes")
            res.status(200).json(result.rows)
        }catch(err){
            next(err)
        }
    }

    async getSingleNote(req: Request, res: Response, next: NextFunction) {
        try{
            const id = req.params.id


            const note = await db.query("SELECT * FROM notes where id = $1", [id])

            res.status(200).json(note.rows[0])
        }catch(err){
            next(err)
        }
    }
    async updateNote(req: Request, res: Response, next: NextFunction) {
        try{
            const id = req.params.id
            const {title, content} = req.body

            const note = await db.query("UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *", [title, content, id])


            res.status(200).json(note.rows[0])
            
        }catch(err){
            next(err)
        }
    }
    async deleteNote(req: Request, res: Response, next: NextFunction) {
        try{
            const id = req.params.id

            const note = await db.query("DELETE FROM NOTES WHERE id = $1",[id])

            res.status(200).json({message: "Note Deleted"})

        }catch(err){
            next(err)
        }
    }
}