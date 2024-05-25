const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const port = process.env.PORT || 3000;

const serviceAccount = require("./privateKey/products-67eef-firebase-adminsdk-x5ed1-2b5882cd77.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://products-67eef-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const db = admin.database();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000/products",
  })
); // Enable CORS for all routes

// Set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Auth-Token, Origin, Authorization"
  );
  next();
});

app.post("/products", (req, res) => {
  try {
    const products = req.body;
    console.log("Received products:", products);

    const productsRef = db.ref("products");
    products.forEach((product) => {
      const newProductRef = productsRef.push();
      newProductRef
        .set(product)
        .then(() => {
          console.log("Product added successfully.");
        })
        .catch((error) => {
          console.error("Error adding product: ", error);
        });
    });

    res.status(200).send("Products received successfully.");
  } catch (error) {
    console.error("Error processing products:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/products", (req, res) => {
  const productsRef = db.ref("products");
  productsRef.once(
    "value",
    (snapshot) => {
      const data = snapshot.val();
      res.status(200).json(data);
    },
    (error) => {
      console.error("Error fetching data: ", error);
      res.status(500).send("Internal Server Error");
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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
    fetch("http://theomnivorouspalaceform.kesug.com/products", {
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
