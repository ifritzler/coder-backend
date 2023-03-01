class ProductManager {
  constructor() {
    this.products = [];
    this.rowCount = 0;
  }

  getNextId() {
    return this.rowCount + 1
  }

  setNewId(callback) {
    if(!callback) {
      this.rowCount += 1
    } else {
      this.rowCount = callback(this.rowCount)
    }
    return this.rowCount
  }

  async addProduct(productData) {
    try {
      const newId = this.getNextId()
      const { title, description, price, thumbnail, code, stock } = productData;
      if(!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error('Invalid or missing properties on addProduct');
      }
  
      if(this.products.find(product => product.code === code)) {
        throw new Error(`The product with code: ${ code } is already exists`);
      }
  
      const newProduct = { id: newId, title, description, price, thumbnail, code, stock };
      this.products = [...this.products, newProduct];
      this.setNewId()
  
      return newProduct
    }catch ( error ) {
      console.error(error.message)
    }
  }

  async getProducts() {
    return this.products
  }

  async getProductById(productId) {
    try {
      const productFound = this.products.find(product => product.id === productId)
      if(!productFound) {
        throw new Error(`The product with id: ${ productId } does not found`);
      }
      return productFound
    }catch ( error ) {
      console.error(error.message)
    }
  }
}

// IFII function
// PASOS PROCESO DE TESTING
(async () => {
    console.log('Start program');

    // 1
    const productManager = new ProductManager();
    // 2
    console.log(await productManager.getProducts());
    // 3
    const firstProduct = await productManager.addProduct({
      title: "producto prueba", 
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25
    });
    // 4
    console.log(firstProduct.id)
    // 5
    console.log(await productManager.getProducts());
    // 6 
    const secondProductWithError = await productManager.addProduct({
      title: "producto prueba", 
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin imagen",
      code: "abc123",
      stock: 25
    });
    console.log({secondProductWithError})

    // 7
    // this console log is ok
    console.log(await productManager.getProductById(1));
    // this throw an error because the product is not found
    console.log(await productManager.getProductById(2));
})()