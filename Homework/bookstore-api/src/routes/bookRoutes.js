import express from "express";
import { getAllBooks, getBookById, createBook } from "../controllers/bookcontroller.js";
import validateBook from "../middleware/validateBook.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", validateBook, createBook);

export default router;