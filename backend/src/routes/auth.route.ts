import express from "express"
import { login, logOut, register } from "../controllers/auth.Controller.js"
import { generateRefreshToken } from "../util/token.js"


const router = express.Router()


// register route
router.post("/register", register)

// login route
router.post("/login", login)

// refresh token route
router.post("/refreshToken", generateRefreshToken)

// logout route
router.post("/logOut", logOut)



export default router
