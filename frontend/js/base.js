window.addEventListener("DOMContentLoaded", () => {
  let productForm;
  let saleForm;
  let productData;
  let saleData;

  // Added missing declarations for these
  let loginButton;
  let logoutButton;
  let userInfo;

  // Check if user is authenticated before allowing form submissions
  function checkAuthAndSubmit(e, formType) {
    if (!authState.isAuthenticated) {
      e.preventDefault();
      alert("Please login first to create products or sales");
      return false;
    }
    return true;
  }

  productForm = document.getElementById("productForm");
  saleForm = document.getElementById("saleForm");
  loginButton = document.getElementById("loginButton");
  userInfo = document.getElementById("userInfo");

  // --- Set up totalAmount calculation when quantity changes ---
  const quantityInput = document.getElementById("quantity");
  const priceAtSaleInput = document.getElementById("priceAtSale");
  const totalAmountInput = document.getElementById("totalAmount");

  quantityInput.addEventListener("input", () => {
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceAtSaleInput.value);

    if (!isNaN(quantity) && !isNaN(price)) {
      totalAmountInput.value = (quantity * price).toFixed(2);
    } else {
      totalAmountInput.value = "";
    }
  });
  // -----------------------------------------------------------------------

  loginButton.addEventListener("click", () => {
    console.log("userInfo text:", userInfo.textContent);

    if (
      userInfo.textContent &&
      userInfo.textContent.trim() !== "Welcome, Guest"
    ) {
      productForm.style.display = "flex";
    } else {
      userInfo.textContent = "Welcome guest"; // Set first
      productForm.style.display = "none";

      // Delay alert to let DOM update
      setTimeout(() => {
        alert("Please sign in with Google to access this feature.");
      }, 0);
    }
  });

  logoutButton.addEventListener("click", () => {
    productForm.style.display = "none";
  });

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check authentication
    if (!checkAuthAndSubmit(e, "product")) return;

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

    try {
      const productResponse = await fetch(
        "https://simple-pos-api.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(product),
        }
      );

      productData = await productResponse.json();

      if (!productResponse.ok) {
        if (productResponse.status === 401) {
          alert("Your session has expired. Please login again.");
          authState.isAuthenticated = false;
          updateAuthUI();
          return;
        }
        alert(`Error: ${productData.message}`);
        return;
      }

      alert("Product created successfully!");
      saleForm.reset();
      saleForm.style.display = "flex";

      document.getElementById("productId").value =
        productData._id || productData.id;
      document.getElementById("priceAtSale").value =
        productData.price.toFixed(2);
    } catch (error) {
      console.error("Error submitting product", error);
      alert("Error creating product. Please try again.");
    }
  });

  saleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check authentication
    if (!checkAuthAndSubmit(e, "sale")) return;

    // Second, create the sale
    const sale = {
      productId: document.getElementById("productId").value,
      priceAtSale: parseFloat(document.getElementById("priceAtSale").value),
      quantity: parseInt(document.getElementById("quantity").value),
      totalAmount: parseFloat(document.getElementById("totalAmount").value),
      cashierName: document.getElementById("cashierName").value,
      paymentMethod: document.getElementById("paymentMethod").value,
    };

    try {
      const saleResponse = await fetch(
        "https://simple-pos-api.onrender.com/api/sales",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(sale),
        }
      );

      saleData = await saleResponse.json();

      if (!saleResponse.ok) {
        if (saleResponse.status === 401) {
          alert("Your session has expired. Please login again.");
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
