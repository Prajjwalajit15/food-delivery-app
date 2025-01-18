import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodControllers.js';
import multer from 'multer'; 
// using multer we will creat image storing system

const foodRouter = express.Router();

// Image storage Engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage});


foodRouter.post("/add",upload.single("image"),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;

