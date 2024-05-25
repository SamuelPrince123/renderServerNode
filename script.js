document.addEventListener("DOMContentLoaded", function () {
  const productForm = document.getElementById("productForm");
  const productList = document.getElementById("productList");
  const submitProductsButton = document.getElementById("submitProductsButton");
  const uploadMessage = document.getElementById("uploadMessage"); // Get the element where you want to display the upload message

  productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value; // Get category value

    if (name && price && category) {
      const listItem = document.createElement("li");
      listItem.textContent = `${name} - $${price} - Category: ${category}`; // Display category

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        productList.removeChild(listItem);
      });

      listItem.appendChild(deleteButton);
      productList.appendChild(listItem);

      // Clear input fields after adding product
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("category").value = ""; // Clear category input
    } else {
      alert("Please enter name, price, and category for the product.");
    }
  });

  submitProductsButton.addEventListener("click", function () {
    const products = [];
    const listItems = productList.querySelectorAll("li");

    listItems.forEach(function (listItem) {
      const product = {};
      const [name, price, category] = listItem.textContent.split(" - ");
      product.name = name;
      product.price = parseFloat(price.replace("$", ""));
      product.category = category.split(": ")[1]; // Extract category from the text
      products.push(product);
    });

    // Send products data to server
    sendDataToServer(products);
  });

  function sendDataToServer(products) {
    fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Server response:", data);
        // Show upload message
        uploadMessage.textContent = "Data uploaded successfully!";
      })
      .catch((error) => {
        console.error("Error submitting products:", error);
        // Optionally, you can handle errors that occur during the submission process
      });
  }
});
