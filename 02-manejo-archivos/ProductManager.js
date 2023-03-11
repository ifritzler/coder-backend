const fs = require("fs");
module.exports = class ProductManager {
  constructor(path) {
    this.path = path;
    (async () => {
      if (!fs.existsSync(path)) {
        this.rowCount = 0;
      } else {
        const raw = await fs.promises.readFile(path, { encoding: "utf-8" });
        console.log(raw)
        const data = JSON.parse(raw);
        this.rowCount = data[data.length - 1]?.id || 0;
      }
    })();
  }

  getNextId() {
    return this.rowCount + 1;
  }

  /**
   * Funcion que permite setear un nuevo id en el roucount de la clase
   * @param {function(rowCount)} callback Callback que recibe el contador de filas y permite manipular el nuevo valor del id
   * @returns void
   */
  setNewId(callback) {
    if (!callback) {
      this.rowCount += 1;
    } else {
      this.rowCount = callback(this.rowCount);
    }
    return this.rowCount;
  }

  async addProduct(productData) {
    try {
      // Valido que los campos esten presentes
      const { title, description, price, thumbnail, code, stock } = productData;
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Invalid or missing properties on addProduct");
      }
      // Voy creando el nuevo producto
      const newId = this.getNextId();
      const newProduct = {
        id: newId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      // Valido si existe el archivo y en caso de no existir guardo el producto como primer elemento del arreglo.
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify([newProduct], null, "\t")
        );
        this.setNewId();
        return newProduct;
      }
      // Caso donde el archivo ya existe. Leo el archivo y lo parseo
      const data = await this.getProducts()

      // Verifico que el codigo no exista
      const found = await this.getProductByCode(code);
      if (found) {
        throw new Error(`The product with code: ${code} is already exists`);
      }

      // Guardo el producto en el archivo
      const newProducts = [...data, newProduct];
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newProducts, null, "\t")
      );
      this.setNewId();
      return newProduct;
    } catch (error) {
      console.error(error.message);
    }
  }

  async getProductByCode(code) {
    if (!fs.existsSync(this.path)) return null;

    const data = await this.getProducts()
    return data.find((product) => product.code === code);
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) {
        return [];
      }
      const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
      return JSON.parse(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  async getProductById(productId) {
    try {
      const data = await this.getProducts()
      const productFound = data.find((product) => product.id === productId);
      if (!productFound) {
        throw new Error(`The product with id: ${productId} does not found`);
      }
      return productFound;
    } catch (error) {
      console.error(error.message);
    }
  }

  async updateProductById(productId, changes) {
    try {
      const productFound = await this.getProductById(productId);
      if (!productFound) {
        throw new Error(`The product with id: ${productId} does not found`);
      }
      const updated = { ...productFound, ...changes };
      
      const data = await this.getProducts()
      const newData = data.map((product) => {
        if (product.id === productId) {
          return updated;
        }
        return product;
      });
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newData, null, "\t")
      );
      return updated;
    } catch (error) {
      console.error(error.message);
    }
  }

  async deleteProductById(productId) {
    try {
      const data = await this.getProducts()
      const found = await this.getProductById(productId)
      if (!found) {
        throw new Error(`Product with id ${productId} does not exists`);
      }
      const newData = data.filter((product) => product.id !== productId);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(newData, null, "\t")
      );
    } catch (error) {
      throw error;
    }
  }
};
