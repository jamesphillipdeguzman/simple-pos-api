window.addEventListener("DOMContentLoaded", () => {
  let productForm = document.getElementById("productForm");
  let saleForm = document.getElementById("saleForm");
  let loginButton = document.getElementById("loginButton");
  let userInfo = document.getElementById("userInfo");

  let productData;
  let saleData;

  // Assuming you have authState somewhere globally or declared here:
  const authState = { isAuthenticated: false };

  function updateAuthUI() {
    if (authState.isAuthenticated) {
      productForm.style.display = "flex";
      saleForm.style.display = "none";
      loginButton.style.display = "none";
      userInfo.textContent = "Welcome, User";
    } else {
      productForm.style.display = "none";
      saleForm.style.display = "none";
      loginButton.style.display = "block";
      userInfo.textContent = "Welcome, Guest";
    }
  }

  // Check if user is authenticated before allowing form submissions
  function checkAuthAndSubmit(e) {
    if (!authState.isAuthenticated) {
      e.preventDefault();
      alert("Please login first to create products or sales");
      return false;
    }
    return true;
  }

  // Show product form only if user info exists on login button click
  loginButton.addEventListener("click", () => {
    if (userInfo && userInfo.textContent !== "Welcome, Guest") {
      productForm.style.display = "flex";
    } else {
      alert("Please sign in with Google to access this feature.");
      productForm.style.display = "none";
    }
  });

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!checkAuthAndSubmit(e)) return;

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

    if (!checkAuthAndSubmit(e)) return;

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
        return;
      }

      alert("Sale created successfully!");
      saleForm.style.display = "none";
      productForm.reset();
    } catch (error) {
      console.error("Error submitting sale", error);
      alert("Error creating sale. Please try again.");
    }
  });

  // Initial UI setup
  updateAuthUI();
});
