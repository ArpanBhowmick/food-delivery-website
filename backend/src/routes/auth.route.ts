import express from "express"
import { login, logOut, refreshAccessToken, register } from "../controllers/auth.controller.js"


const authRouter = express.Router()


// register route
authRouter.post("/register", register)

// login route
authRouter.post("/login", login)

// refresh token route
authRouter.post("/refreshToken", refreshAccessToken)

// logout route
authRouter.post("/logOut", logOut)



export default authRouter
