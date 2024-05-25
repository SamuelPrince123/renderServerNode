const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const serviceAccount = require("./privateKey/products-67eef-firebase-adminsdk-x5ed1-2b5882cd77.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://products-67eef-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const db = admin.database();

app.use(bodyParser.json());

// Enable CORS for specific origin
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
