import express from "express"
import { globalSearch } from "../controllers/search.controller.js"
import { optionalAuth } from "../middleware/optionalAuth.js"


const searchRouter = express.Router()


// global search route (shops and items)
// optionalAuth resolves req.userId when a token exists, guests still pass through
searchRouter.get("/", optionalAuth, globalSearch)


export default searchRouter
