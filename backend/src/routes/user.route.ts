import express from "express"
import { verifyJWT } from "../middleware/verifyJWT.js"
import { getCurrentUser, updateLocation } from "../controllers/user.controller.js"


const userRouter = express.Router() 


// get all users route 

userRouter.get("/me",verifyJWT, getCurrentUser)

// update user location route
userRouter.put("/location", verifyJWT, updateLocation)


export default userRouter




