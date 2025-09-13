import { Request, Response, NextFunction } from "express";

export function validateNote(req: Request, res: Response, next: NextFunction) {
    const {title, content} = req.body

    if (!title || typeof title !== "string" || title.trim() === ""){
        return next({status: 400, message: "Title is required and must be non-empty string"})
    }

    if (!content || typeof content !== "string" || content.trim() === ""){
        return next({status: 400, message: "Content is required and must be non-empty string"})
    }

    next()
}