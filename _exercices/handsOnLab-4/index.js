const ManagerUsuarios = require("./ManagerUsuarios.js");

async function init () {
  try {
    const managerUsuarios = new ManagerUsuarios("Usuarios");

    await managerUsuarios.crearUsuario("Ilan", "Fritzler", 28, "Progamacion Backend");
    await managerUsuarios.crearUsuario("Jason", "Doe", 33, "React JS");
    await managerUsuarios.crearUsuario("Alice", "Kruger", 35, "Javascript");
    const users = await managerUsuarios.consultarUsuarios();
    console.log(users);

  }catch(error) {
    console.log(error.message)
  }
}

init()