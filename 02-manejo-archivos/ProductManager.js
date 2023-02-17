const fs = require("fs");
module.exports = class ProductManager {
  #rowCount;
  #path;
  constructor(path) {
    this.#path = path;

    (async () => {
      const raw = await fs.promises.readFile(path, { encoding: "utf-8" });
      const data = JSON.parse(raw);
      const lastId = data[data.length - 1].id;
      return lastId;
    })().then(result => {
      this.#rowCount = result;
    }).catch(e => {
      this.#rowCount = 0;
    })

  }

  #getNextId() {
    return this.#rowCount + 1;
  }

  #setNewId(callback) {
    if(!callback) {
      this.#rowCount += 1;
    } else {
      this.#rowCount = callback(this.#rowCount);
    }
    return this.#rowCount;
  }

  async addProduct(productData) {
    const newId = this.#getNextId()
    const { title, description, price, thumbnail, code, stock } = productData;
    if(!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Invalid or missing properties on addProduct');
    }
    
    const newProduct = { id: newId, title, description, price, thumbnail, code, stock };
    let data;
    try {
      const file = await fs.promises.readFile(this.#path, { encoding: "utf-8" });
      data = JSON.parse(file);
    }
    catch(error) {
      // Case when file does not exist.
      await fs.promises.writeFile(this.#path, JSON.stringify([newProduct], null, "\t"));
      this.#setNewId();
      return newProduct;
    }
    // Case when file exists
    if(data.find(product => product.code === code)) {
      throw new Error(`The product with code: ${ code } is already exists`);
    }
    const newProducts = [...data, newProduct];
    await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, "\t"));
    this.#setNewId();
    return newProduct;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.#path, { encoding: "utf-8" });
      return JSON.parse(data);
    }
    catch(error) {
      return [];
    }
  }

  async getProductById(productId) {
    try {
      const response = await fs.promises.readFile(this.#path, { encoding: "utf-8" });
      const data = JSON.parse(response);
      const productFound = data.find(product => product.id === productId);
      if(!productFound) {
        throw new Error(`The product with id: ${ productId } does not found`);
      }
      return productFound;
    }
    catch(error) {
      throw error;
    }
  }

  async updateProductById(productId, changes) {
    try {
      const response = await fs.promises.readFile(this.#path, { encoding: "utf-8" });
      const data = JSON.parse(response);
      const productFound = data.find(product => product.id === productId);
      if(!productFound) {
        throw new Error(`The product with id: ${ productId } does not found`);
      }
      const updated = { ...productFound, ...changes };
      const newData = data.map(product => {
        if(product.id === productId) {
          return updated;
        }
        return product;
      })
      await fs.promises.writeFile(this.#path, JSON.stringify(newData, null, "\t"));
      return updated;
    }
    catch(error) {
      throw error;
    }
  }

  async deleteProductById(productId) {
    try {
      const response = await fs.promises.readFile(this.#path, { encoding: "utf-8" });
      const data = JSON.parse(response);
      if(!data.find(product => product.id === productId)) {
        throw(new Error(`Product with id ${productId} does not exists`));
      }
      const newData = data.filter(product => product.id !== productId);
      console.log({productId, preDeleted: data, postDeleted: newData})
      await fs.promises.writeFile(this.#path, JSON.stringify(newData, null, "\t"));
    }
    catch(error) {
      throw error
    }
  }
}
