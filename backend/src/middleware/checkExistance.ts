import { Request, Response, NextFunction } from "express";
import db from '../db'

export async function checkExistanseNote (req: Request, res: Response, next: NextFunction) {
    try{
        const id = req.params.id
        const noteSelect = await db.query("SELECT * FROM notes WHERE id = $1",[id])
            if (noteSelect.rows.length === 0) {
                return next({status: 404, message: "Note not found"})
            }
        
        next()
    }catch(err){
        next(err)
    }
    
}