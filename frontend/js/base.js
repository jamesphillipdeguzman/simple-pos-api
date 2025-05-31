window.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const saleForm = document.getElementById("saleForm");
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const userInfoElement = document.getElementById("userInfo");

  let productData;
  let saleData;

  const authState = {
    isAuthenticated: false,
    userName: null
  };

  // Flag to track if initial auth check finished
  let authChecked = false;

  function updateAuthUI() {
    console.log('Updating UI with auth state:', authState);

    if (authState.isAuthenticated && authState.userName) {
      productForm.style.display = "flex";
      saleForm.style.display = "none";
      userInfoElement.textContent = `Welcome, ${authState.userName}`;
    } else {
      productForm.style.display = "none";
      saleForm.style.display = "none";
      userInfoElement.textContent = "Welcome, Guest";
    }
  }

  async function checkLoginStatusFromBackend() {
    try {
      const res = await fetch(
        "https://simple-pos-api.onrender.com/auth/status",
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        authState.isAuthenticated = false;
        authState.userName = null;
        updateAuthUI();
        authChecked = true;
        return;
      }

      const data = await res.json();

      if (data.user && typeof data.user.name === "string") {
        authState.isAuthenticated = true;
        authState.userName = data.user.name;
      } else {
        authState.isAuthenticated = false;
        authState.userName = null;
      }
    } catch (error) {
      console.error("Error checking auth status", error);
      authState.isAuthenticated = false;
      authState.userName = null;
    }

    updateAuthUI();
    authChecked = true;
  }

  // Initial auth check
  checkLoginStatusFromBackend();

  loginButton.addEventListener("click", () => {
    if (!authChecked) {
      alert("Checking login status, please wait...");
      return;
    }
    if (!authState.isAuthenticated) {
      alert("Please sign in with Google to access this feature.");
    }
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
        authState.userName = null;
        updateAuthUI();
      }
    } catch (error) {
      console.error("Logout error", error);
      alert("An error occurred while logging out.");
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
      const response = await fetch(
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

      productData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          authState.isAuthenticated = false;
          updateAuthUI();
          return;
        }
        alert(`Error: ${productData.message}`);
        return;
      }

      alert("Product created successfully!");
      console.log("Product created", productData);

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
      const response = await fetch(
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

      saleData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          authState.isAuthenticated = false;
          updateAuthUI();
          return;
        }
        alert(`Error: ${saleData.message}`);
        return;
      }

      alert("Sale created successfully!");
      console.log("Sale created", saleData);

      saleForm.style.display = "none";
      productForm.reset();
    } catch (error) {
      console.error("Error submitting sale", error);
      alert("Error creating sale. Please try again.");
    }
  });
});
