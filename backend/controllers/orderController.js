import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173"; 
    const USD_TO_INR = 80; // Exchange rate

    try {
        const { userId, items, amount, address } = req.body;

        // Validate request data
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: userId, items, amount, or address.",
            });
        }

        // Save the new order to the database
        const newOrder = new orderModel({
            userId,
            items,
            amount, // Keep original amount in dollars
            address,
        });
        await newOrder.save();

        // Clear the user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Prepare line items for Stripe Checkout
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * USD_TO_INR * 100), // Convert USD to INR and then to paise
            },
            quantity: item.quantity, // Reflect the item's quantity
        }));

        // Add delivery charges as a separate line item
        const delivery_charge_in_inr = 2; // Delivery charge in USD
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: Math.round(delivery_charge_in_inr * USD_TO_INR * 100), // Convert USD to INR
            },
            quantity: 1,
        });

        // Direct the user to their orders page on success
        const successUrl = "https://food-delivery-app-frontend-u2z4.onrender.com/myorders"; 

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: successUrl, // Redirect directly to the "My Orders" page on success
            cancel_url: successUrl, // You can also send them to the same page if payment is canceled
        });

        // Respond with the session URL
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error in placeOrder:", error); // Log detailed error
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const verifyOrder = async (req,res)=>{

    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not paid"})
        }
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
}

// user orders for frontend
const userOrders = async (req,res)=>{
    try{
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Listing orders for admin panl
const listOrders = async (req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// api for updating order status
const updateStatus = async (req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export { placeOrder,verifyOrder, userOrders, listOrders, updateStatus };
