import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port = 4000;

// middleware 
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter);
// we have mount upload folder in image end point
app.use("/images",express.static('uploads')); 
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Staretd on https://localhost:${port}`);
})

// mongodb+srv://prajjwal:mickey123@cluster0.2f5jx.mongodb.net/?