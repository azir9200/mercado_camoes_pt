import { Request, Response } from 'express';
import { storeService } from '../services/storeService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getStoreDetails = (req: Request, res: Response) => {
  try {
    const info = storeService.getStoreInfo();
    return sendSuccess(res, info, 'Store information retrieved successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to retrieve store info', 500);
  }
};

export const checkoutOrder = (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, deliveryOption, notes, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 'Cart is empty. Please add items to checkout.', 400);
    }

    const result = storeService.processOrderCheckout({
      customerName: customerName || 'Guest Customer',
      customerPhone: customerPhone || '',
      deliveryOption: deliveryOption || 'pickup',
      notes,
      items
    });

    return sendSuccess(res, result, 'Order checkout processed', 200);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to process order', 400);
  }
};
