const fs = require("fs/promises");

module.exports = class ManagerUsuarios {
  #usuarios;
  #filename;
  #lastIndex;
  constructor(filename = "Usuarios") {
    this.#filename = `${ filename }.json`;
    this.#usuarios = [];
    this.#lastIndex = 0;
  }

  #getLastIndex() {
    return this.#lastIndex;
  }
  
  #setLastIndex(value) {
    this.#lastIndex = value;
  }

  async crearUsuario(nombre, apellido, edad, curso) {
    if(!nombre || !apellido || !edad || !curso) {
      throw new Error("Faltan algunos campos para la creacion de usuario.");
    };
    const nuevoUsuario = {
      id: this.#getLastIndex() + 1,
      nombre, apellido, edad, curso
    };

    try {
      const data = await fs.readFile(this.#filename, { encoding: "utf-8" });
      const oldData = await JSON.parse(data);
      const newData = [...oldData, nuevoUsuario];
      await fs.writeFile(this.#filename, JSON.stringify(newData, null, "\t"));

    }catch(error) {
      await fs.writeFile(this.#filename, JSON.stringify([nuevoUsuario], null, "\t"));
    }finally {
      this.#setLastIndex(this.#getLastIndex() + 1)
    }
  }
  async consultarUsuarios() {
    try {
      const data = await fs.readFile(this.#filename, { encoding: "utf-8" });
      const parsed = await JSON.parse(data);
      return parsed;
    }catch(error) {
      return []
    }
  }
}