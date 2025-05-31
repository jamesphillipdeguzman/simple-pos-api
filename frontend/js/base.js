window.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const saleForm = document.getElementById("saleForm");
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const userInfoElement = document.getElementById("userInfo");

  const authState = {
    isAuthenticated: false,
  };

  // Initial UI
  function updateAuthUI() {
    loginButton.style.display = authState.isAuthenticated ? "none" : "block";
    logoutButton.style.display = authState.isAuthenticated ? "block" : "none";
    productForm.style.display = authState.isAuthenticated ? "flex" : "none";
    saleForm.style.display = "none";
    userInfoElement.textContent = authState.isAuthenticated
      ? "Welcome, User"
      : "Welcome, Guest";
  }

  updateAuthUI();

  //  Handle Google login
  loginButton.addEventListener("click", () => {
    const popup = window.open(
      "https://simple-pos-api.onrender.com/auth/google",
      "_blank",
      "width=500,height=600"
    );

    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
      }
    }, 500);

    //  Only once
    const onAuthMessage = (event) => {
      if (event.origin !== "https://simple-pos-api.onrender.com") return;
      if (event.data.success) {
        authState.isAuthenticated = true;
        updateAuthUI();
        console.log("User authenticated.");
        window.removeEventListener("message", onAuthMessage); // remove listener
      }
    };

    window.addEventListener("message", onAuthMessage);
  });

  //  Logout
  logoutButton.addEventListener("click", async () => {
    try {
      const res = await fetch(
        "https://simple-pos-api.onrender.com/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      authState.isAuthenticated = false;
      updateAuthUI();
    } catch (err) {
      console.error("Logout error", err);
      authState.isAuthenticated = false;
      updateAuthUI();
    }
  });

  //  Utility: Check login before submitting
  function checkAuthAndSubmit(e) {
    if (!authState.isAuthenticated) {
      e.preventDefault();
      alert("Please login first.");
      return false;
    }
    return true;
  }

  //  Product submit handler (same as before)
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

    try {
      const res = await fetch(
        "https://simple-pos-api.onrender.com/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(product),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create product.");
        return;
      }

      alert("Product created successfully!");
      saleForm.style.display = "flex";
      saleForm.reset();

      document.getElementById("productId").value = data._id || data.id;
      document.getElementById("priceAtSale").value = data.price.toFixed(2);
    } catch (err) {
      console.error("Product creation error", err);
      alert("Failed to create product.");
    }
  });

  //  Sale form quantity input
  document.getElementById("quantity").addEventListener("input", () => {
    const quantity = parseInt(document.getElementById("quantity").value);
    const price = parseFloat(document.getElementById("priceAtSale").value);
    if (!isNaN(quantity) && !isNaN(price)) {
      document.getElementById("totalAmount").value = (quantity * price).toFixed(
        2
      );
    }
  });

  //  Sale form submit
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

    try {
      const res = await fetch("https://simple-pos-api.onrender.com/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(sale),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create sale.");
        return;
      }

      alert("Sale recorded!");
      productForm.reset();
      saleForm.style.display = "none";
    } catch (err) {
      console.error("Sale error", err);
      alert("Failed to create sale.");
    }
  });
});
