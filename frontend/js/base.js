window.addEventListener("DOMContentLoaded", () => {
  let productForm;
  let saleForm;
  let productData;
  let saleData;

  productForm = document.getElementById("productForm");
  saleForm = document.getElementById("saleForm");

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // First, create a product

    const product = {
      name: document.getElementById("name").value,
      sku: parseInt(document.getElementById("sku").value),
      stock: parseInt(document.getElementById("stock").value),
      description: document.getElementById("description").value,
      price: parseFloat(document.getElementById("price").value),
      category: document.getElementById("category").value,
      supplier: document.getElementById("supplier").value,
    };

    if (!product.name || isNaN(product.price) || isNaN(product.stock)) {
      alert("Please fill all required product fields.");
      return;
    }

    try {
      const productResponse = await fetch(
        "http://127.0.0.1:3001/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send cookie like connect.sid
          body: JSON.stringify(product),
        }
      );

      productData = await productResponse.json();
      if (!productResponse.ok) {
        alert(`Error: ${productData.message}`);
        console.log(`Error: ${productData.message}`);
        return; // exit here to prevent sale creation if product creation failed...
      }

      alert("Product created successfully!");
      console.log("Product created", productData);

      // Clear old sale form data
      saleForm.reset();
      saleForm.style.display = "flex";

      // Populate the Sale ID with the productData.id
      document.getElementById("productId").value =
        productData._id || productData.id;

      // Prefill the price at sale
      document.getElementById("priceAtSale").value =
        productData.price.toFixed(2);
    } catch (error) {
      console.error("Error submitting product", error);
    }
  });

  // Listener for quantity to compute totalAmount in sales form
  document.getElementById("quantity").addEventListener("input", () => {
    const quantity = parseInt(document.getElementById("quantity").value);
    const priceAtSale = parseFloat(
      document.getElementById("priceAtSale").value
    );
    if (!isNaN(quantity) && !isNaN(priceAtSale)) {
      document.getElementById("totalAmount").value = (
        quantity * priceAtSale
      ).toFixed(2);
    }
  });

  saleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Second, create the sale

    const sale = {
      productId: document.getElementById("productId").value,
      priceAtSale: parseFloat(document.getElementById("priceAtSale").value),
      quantity: parseInt(document.getElementById("quantity").value),
      totalAmount: parseFloat(document.getElementById("totalAmount").value),
      cashierName: document.getElementById("cashierName").value,
      paymentMethod: document.getElementById("paymentMethod").value,
    };

    if (
      !sale.cashierName ||
      isNaN(sale.priceAtSale) ||
      isNaN(sale.quantity) ||
      isNaN(sale.totalAmount) ||
      !sale.paymentMethod
    ) {
      alert("Please fill all required sale fields.");
      return;
    }

    try {
      const saleResponse = await fetch("http://127.0.0.1:3001/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookie like connect.sid
        body: JSON.stringify(sale),
      });

      saleData = await saleResponse.json();
      if (!saleResponse.ok) {
        alert(`Error: ${saleData.message}`);
        console.log(`Error: ${saleData.message}`);
        return;
      }

      alert("Sale created successfully!");
      console.log("Sale created", saleData);

      // Hide sale form after transaction
      saleForm.style.display = "none";
      // Clear product form
      productForm.reset();
    } catch (error) {
      console.error("Error submitting sale", error);
    }
  });
});
