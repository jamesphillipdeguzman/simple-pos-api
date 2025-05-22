export default {
  schemas: {
    Product: {
      type: 'object',
      required: ['name', 'sku', 'stock', 'category', 'supplier', 'createdAt'],
      properties: {
        name: { type: 'string' },
        sku: { type: 'number' },
        stock: { type: 'number' },
        description: { type: 'string' },
        price: { type: 'number', minimum: 0 },
        category: { type: 'string' },
        supplier: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
    Sale: {
      type: 'object',
      required: [
        'productId',
        'priceAtSale',
        'quantity',
        'totalAmount',
        'date',
        'cashierName',
        'paymentMethod',
      ],
      properties: {
        productId: {
          type: 'string',
          description: 'MongoDB ObjectId reference to the Product',
        },
        priceAtSale: { type: 'number', minimum: 0 },
        quantity: { type: 'number', minimum: 0 },
        totalAmount: { type: 'number', minimum: 0 },
        date: {
          type: 'string',
          format: 'date-time',
          description: 'Date and time of the sale',
        },
        cashierName: { type: 'string', default: 'unknown' },
        paymentMethod: {
          type: 'string',
          enum: ['cash', 'credit', 'debit', 'paypal'],
          default: 'cash',
        },
      },
    },
  },
};
