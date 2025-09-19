import express from "express";
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus 
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrderStatus);

export default router;