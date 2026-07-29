import express from "express"
import { verifyJWT } from "../middleware/verifyJWT.js"
import { createShop, editShop } from "../controllers/shop.controller.js"
import { upload } from "../middleware/multer.js"


const shopRouter = express.Router() 


// create shop route
shopRouter.post("/",verifyJWT, upload.single("image"), createShop)

// update shop route
shopRouter.put("/:shopId", verifyJWT, upload.single("image"), editShop)


export default shopRouter




