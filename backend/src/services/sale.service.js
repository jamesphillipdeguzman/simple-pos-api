import Sale from '../models/sale.model.js';

// GET all sales
export const findAllSales = () => {
  return Sale.find();
};

// GET a sale by Id
export const findSaleById = (id) => {
  return Sale.findById(id);
};

// POST a sale
export const createSale = (data) => {
  return Sale.create(data);
};
