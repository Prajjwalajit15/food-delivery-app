import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://prajjwal:mickey123@cluster0.2f5jx.mongodb.net/food-del');
        console.log("DB connected successfully");
    } catch (error) {
        console.error("Error connecting to DB:", error.message);
        process.exit(1); // Exit the process with failure
    }
};
