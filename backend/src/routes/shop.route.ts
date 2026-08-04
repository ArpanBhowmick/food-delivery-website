import express from "express"
import { verifyJWT } from "../middleware/verifyJWT.js"
import { createShop, editShop, getOwnerShops } from "../controllers/shop.controller.js"
import { upload } from "../middleware/multer.js"


const shopRouter = express.Router() 


// create shop route
shopRouter.post("/",verifyJWT, upload.single("image"), createShop)

// update shop route
shopRouter.put("/:shopId", verifyJWT, upload.single("image"), editShop)

// get all owner shops route
shopRouter.get("/", verifyJWT, getOwnerShops)


export default shopRouter




