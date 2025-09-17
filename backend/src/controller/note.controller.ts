import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';
import db from '../db';

// Простой интерфейс заметки
interface Note {
  id: number;
  title: string;
  content: string;
}

export class NoteController {
    async createNote(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { title, content }: { title: string; content: string } = req.body;
            
            const result: QueryResult<Note> = await db.query(
                "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *", 
                [title, content]
            );
            
            res.status(201).json(result.rows[0]);

        } catch (err: unknown) {
            next(err);
        }
    }

    async getNotes(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result: QueryResult<Note> = await db.query("SELECT * FROM notes");
            res.status(200).json(result.rows);
        } catch (err: unknown) {
            next(err);
        }
    }

    async getSingleNote(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const noteId: number = parseInt(id, 10);

            const result: QueryResult<Note> = await db.query(
                "SELECT * FROM notes WHERE id = $1", 
                [noteId]
            );

            res.status(200).json(result.rows[0]);
        } catch (err: unknown) {
            next(err);
        }
    }

    async updateNote(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const { title, content }: { title: string; content: string } = req.body;
            const noteId: number = parseInt(id, 10);

            const result: QueryResult<Note> = await db.query(
                "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *", 
                [title, content, noteId]
            );

            res.status(200).json(result.rows[0]);
            
        } catch (err: unknown) {
            next(err);
        }
    }

    async deleteNote(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const noteId: number = parseInt(id, 10);

            await db.query("DELETE FROM notes WHERE id = $1", [noteId]);

            res.status(200).json({ message: "Note Deleted" });

        } catch (err: unknown) {
            next(err);
        }
    }
}