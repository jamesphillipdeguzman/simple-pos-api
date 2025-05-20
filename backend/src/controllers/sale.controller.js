import { findAllSales, findSaleById } from '../services/sale.service.js';

// GET all sales
export const getSales = async (req, res) => {
  console.log('GET /api/sales was called.');
  try {
    const sales = await findAllSales();
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occured', error: error.message });
  }
};

// GET a sale by Id
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await findSaleById(id);
    res.status(200).json(sale);
    console.log(`GET /api/sales/${id} was called.`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The sale was not found', error: error.message });
  }
};
