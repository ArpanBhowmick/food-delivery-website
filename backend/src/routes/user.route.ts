import express from "express"
import { verifyJWT } from "../middleware/verifyJWT.js"
import { getCurrentUser } from "../controllers/user.controller.js"


const userRouter = express.Router() 


// get all users route 

userRouter.get("/me",verifyJWT, getCurrentUser)


export default userRouter




