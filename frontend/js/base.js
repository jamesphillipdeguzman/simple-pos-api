document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

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
    const response = await fetch("http://127.0.0.1:3001/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Send cookie like connect.sid
      body: JSON.stringify(product),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Product created successfully!");
      console.log("Product created", data);
    } else {
      alert(`Error: ${data.message}`);
      console.log(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error submitting product", error);
  }
});
