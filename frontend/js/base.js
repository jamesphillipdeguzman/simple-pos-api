window.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const saleForm = document.getElementById("saleForm");
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const userInfoElement = document.getElementById("userInfo");

  let productData, saleData;

  const authState = {
    isAuthenticated: false,
  };

  function setFormEnabled(form, enabled) {
    const elements = form.querySelectorAll("input, select, textarea, button");
    elements.forEach((el) => {
      el.disabled = !enabled;
    });
  }

  function updateAuthUI() {
    if (authState.isAuthenticated) {
      loginButton.style.display = "none";
      logoutButton.style.display = "block";
      userInfoElement.textContent = "Welcome, User";
      setFormEnabled(productForm, true);
      setFormEnabled(saleForm, true);
    } else {
      loginButton.style.display = "block";
      logoutButton.style.display = "none";
      userInfoElement.textContent = "Welcome, Guest";
      setFormEnabled(productForm, false);
      setFormEnabled(saleForm, false);
    }
  }

  async function checkSession() {
    try {
      const res = await fetch(
        "https://simple-pos-api.onrender.com/auth/status",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      authState.isAuthenticated = !!data?.isAuthenticated;
    } catch {
      authState.isAuthenticated = false;
    } finally {
      updateAuthUI();
    }
  }

  loginButton.addEventListener("click", () => {
    window.location.href = "https://simple-pos-api.onrender.com/auth/google";
  });

  logoutButton.addEventListener("click", async () => {
    try {
      const res = await fetch(
        "https://simple-pos-api.onrender.com/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.ok) {
        authState.isAuthenticated = false;
        updateAuthUI();
      } else {
        alert("Logout failed.");
      }
    } catch (err) {
      console.error("Logout error", err);
      alert("An error occurred during logout.");
    }
  });

  function checkAuthAndSubmit(e) {
    if (!authState.isAuthenticated) {
      e.preventDefault();
      alert("Please login first to create products or sales.");
      return false;
    }
    return true;
  }

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
      const res = await fetch(
        "https://simple-pos-api.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(product),
        }
      );

      productData = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
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
      const res = await fetch("https://simple-pos-api.onrender.com/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sale),
      });

      saleData = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
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

  // Initial check for session
  checkSession();
});
