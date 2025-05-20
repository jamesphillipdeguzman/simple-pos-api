import Sale from '../models/sale.model.js';

// GET
export const findAllSales = () => {
  return Sale.find();
};
