import { Request, Response } from 'express';
import { orderService } from '../services/orderService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getOrders();
    return sendSuccess(res, orders, 'Orders fetched successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch orders', 500);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, deliveryOption, notes, items, orderType } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 'Cart is empty. Please add items to place an order.', 400);
    }

    const result = await orderService.createOrder({
      customerName,
      customerPhone,
      deliveryOption,
      notes,
      items,
      orderType: orderType || 'DIRECT'
    });

    return sendSuccess(res, result, 'Order placed successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to place order', 500);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return sendError(res, 'Invalid order status', 400);
    }

    const updated = await orderService.updateOrderStatus(id, status);
    if (!updated) {
      return sendError(res, `Order '${id}' not found`, 404);
    }

    return sendSuccess(res, updated, 'Order status updated');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update order status', 500);
  }
};
