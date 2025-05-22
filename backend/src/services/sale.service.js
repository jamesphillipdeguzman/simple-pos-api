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

// PUT or UPDATE a sale
export const updateSaleById = (id, updates) => {
  return Sale.findByIdAndUpdate(id, updates, {
    new: true, // return the updated document
    runValidators: true, // run schema validators on update
    upsert: true, // update if exists, insert if not
  });
};

// DELETE a sale
export const deleteSaleById = (id) => {
  return Sale.findByIdAndDelete(id);
};
