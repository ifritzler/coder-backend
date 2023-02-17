class ProductManager {
  #products;
  #rowCount;

  constructor() {
    this.#products = [];
    this.#rowCount = 0;
  }

  #getNextId() {
    return this.#rowCount + 1
  }

  #setNewId(callback) {
    if(!callback) {
      this.#rowCount += 1
    } else {
      this.#rowCount = callback(this.#rowCount)
    }
    return this.#rowCount
  }

  async addProduct(productData) {
    const newId = this.#getNextId()
    const { title, description, price, thumbnail, code, stock } = productData;
    if(!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Invalid or missing properties on addProduct');
    }

    if(this.#products.find(product => product.code === code)) {
      throw new Error(`The product with code: ${ code } is already exists`);
    }

    const newProduct = { id: newId, title, description, price, thumbnail, code, stock };
    this.#products = [...this.#products, newProduct];
    this.#setNewId()

    return newProduct
  }

  async getProducts() {
    return this.#products
  }

  async getProductById(productId) {
    const productFound = this.#products.find(product => product.id === productId)
    if(!productFound) {
      throw new Error(`The product with id: ${ productId } does not found`);
    }
    return productFound
  }
}
