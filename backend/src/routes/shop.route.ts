import express from "express"
import { verifyJWT } from "../middleware/verifyJWT.js"
import { createShop, editShop, getOwnerShops, getShopById, getShopsByCity } from "../controllers/shop.controller.js"
import { upload } from "../middleware/multer.js"


const shopRouter = express.Router() 


// create shop route
shopRouter.post("/",verifyJWT, upload.single("image"), createShop)

// update shop route
shopRouter.put("/:shopId", verifyJWT, upload.single("image"), editShop)

// get all owner shops route
shopRouter.get("/owner", verifyJWT, getOwnerShops)

// get all shops by city route
shopRouter.get("/city", verifyJWT, getShopsByCity)


// get shop by id route
shopRouter.get("/:shopId", verifyJWT, getShopById)


export default shopRouter




