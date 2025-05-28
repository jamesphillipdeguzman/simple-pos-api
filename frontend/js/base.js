window.addEventListener("DOMContentLoaded", () => {
  let productForm;
  let saleForm;
  let productData;
  let saleData;

  // Check if user is authenticated before allowing form submissions
  function checkAuthAndSubmit(e, formType) {
    if (!authState.isAuthenticated) {
      e.preventDefault();
      alert('Please login first to create products or sales');
      return false;
    }
    return true;
  }

  productForm = document.getElementById("productForm");
  saleForm = document.getElementById("saleForm");

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check authentication
    if (!checkAuthAndSubmit(e, 'product')) return;

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
        "https://simple-pos-api.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(product),
        }
      );

      productData = await productResponse.json();
      if (!productResponse.ok) {
        if (productResponse.status === 401) {
          alert('Your session has expired. Please login again.');
          authState.isAuthenticated = false;
          updateAuthUI();
          return;
        }
        alert(`Error: ${productData.message}`);
        console.log(`Error: ${productData.message}`);
        return;
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
      alert("Error creating product. Please try again.");
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

    // Check authentication
    if (!checkAuthAndSubmit(e, 'sale')) return;

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
      const saleResponse = await fetch(
        "https://simple-pos-api.onrender.com/api/sales",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(sale),
        }
      );

      saleData = await saleResponse.json();
      if (!saleResponse.ok) {
        if (saleResponse.status === 401) {
          alert('Your session has expired. Please login again.');
          authState.isAuthenticated = false;
          updateAuthUI();
          return;
        }
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
      alert("Error creating sale. Please try again.");
    }
  });
});
