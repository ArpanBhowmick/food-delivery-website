import express from "express"
import { verifyJWT } from "../middleware/verifyJWT.js"
import { upload } from "../middleware/multer.js"
import { addItem, deleteItem, editItem, getItemsByShop } from "../controllers/item.controller.js"


const itemRouter = express.Router() 


// add item route

itemRouter.post("/:shopId",verifyJWT, upload.single("image"), addItem)

// update/edit shop route
itemRouter.put("/:shopId/:itemId", verifyJWT, upload.single("image"), editItem)

// get all items by shop
itemRouter.get("/:shopId", verifyJWT, getItemsByShop)


// delete item
itemRouter.delete("/:shopId/:itemId", verifyJWT, deleteItem);

export default itemRouter




