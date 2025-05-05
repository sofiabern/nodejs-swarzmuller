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
  constructor(title) {
    this.title = title;
  }

  save() {
    const p = getProductsFilePath();

    getProductsFromFile((products) => {
      products.push(this);

      fs.writeFile(p, JSON.stringify(products, null, 2), (err) => {
        if (err) console.log("Помилка при записі:", err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
