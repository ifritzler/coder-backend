const ProductManager = require("./ProductManager.js");

// IFII function
// PASOS PROCESO DE TESTING
(async () => {
  try {
    console.log('Start program');

    // 1
    const productManager = new ProductManager("./productos.json");
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
    // this console log is ok
    console.log(await productManager.getProductById(1));
    // this throw an error because the product is not found
    console.info("Descomentá el codigo debajo para probar el error del getProductById");
    // console.log(await productManager.getProductById(2));

    // 7
    const productUpdated = await productManager.updateProductById(1, { price: 999 });
    const productsUpdated = await productManager.getProducts()
    console.log({productUpdated, productsUpdated});

    // 8
    await productManager.deleteProductById(1);
  } catch (error) {
    console.error(error.message)
  }

})()