const fs = require("fs");
const path = require("path");

const getProductsFilePath = () => {
  return path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products.json"
  );
};

const getProductsFromFile = (cb) => {
  const p = getProductsFilePath();

  fs.readFile(p, "utf-8", (err, fileContent) => {
    try {
      const products = JSON.parse(fileContent);
      cb(products);
    } catch (parseErr) {
      cb([]);
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
 
    const p = getProductsFilePath();

    getProductsFromFile((products) => {
      if (this.id) {
        const exisitingProductIndex = products.findIndex(prod => prod.id === this.id)
        const updatedProducts = [...products];
        updatedProducts[exisitingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts, null, 2), (err) => {
          if (err) console.log("Помилка при записі:", err);
        });
      } else {

        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products, null, 2), (err) => {
          if (err) console.log("Помилка при записі:", err);
        });
      }

    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile( products => {
      const product = products.find(p => p.id === id);
      cb(product)
    })
  }
};
