const fs = require("fs/promises");

// async IFII function
// Otra forma de ejecutar este entorno asincrono seria guardar la funcion asincrona en una variable
// y ejecutarla debajo. Creo que esta manera para algo tan simple es suficiente.
(async () => {
  try {
    const fileData = await fs.readFile("package.json", { encoding: "utf-8" });
    const info = {
      contenidoStr: fileData,
      contenidoObj: JSON.parse(fileData),
      size: fileData.length
    };

    console.log(info);

    await fs.writeFile("info.json", JSON.stringify(info, null, "\t"));
  }catch(error) {
    throw new Error(error.message);
  }
})()