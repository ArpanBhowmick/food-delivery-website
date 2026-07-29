import express from "express"
import { verifyJWT } from "../middleware/verifyJWT.js"
import { upload } from "../middleware/multer.js"
import { addItem, editItem } from "../controllers/item.controller.js"


const itemRouter = express.Router() 


// add item route

itemRouter.post("/:shopId",verifyJWT, upload.single("image"), addItem)

// update/edit shop route
itemRouter.put("/:shopId/:itemId", verifyJWT, upload.single("image"), editItem)


export default itemRouter




