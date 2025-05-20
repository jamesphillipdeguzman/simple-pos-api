import { findAllSales } from '../services/sale.service.js';

// GET
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
