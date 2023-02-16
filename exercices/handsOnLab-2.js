class TicketManager {
  constructor() {
    this.events = []
    this._precioBaseDeGanancia = 0.15
    this._lastIndex = 0
  }

  getEventos() {
    return this.events
  }

  getLastIndex() {
    return this._lastIndex
  }

  agregarEvento(nombre, lugar, precio, capacidad = 50, fecha = new Date().toLocaleDateString()) {

    let newId = this.getLastIndex() + 1
    
    const participantes = []
    const precioMasImpustoBase = precio + this._precioBaseDeGanancia
    const newEvent = { 
      id: newId, 
      nombre, 
      lugar, 
      precio: precioMasImpustoBase, 
      capacidad, 
      fecha, 
      participantes 
    }

    this.events = [...this.events, newEvent]
    this._lastIndex = newId
  }

  agregarUsuario(eventId, idUsuario) {
    const eventFoundIndex = this.events.findIndex(event => event.id === eventId)
    if(eventFoundIndex === -1 || this.events[eventFoundIndex].participantes.includes(idUsuario)){
      return false
    }
    // Inmutability
    const eventUpdated = {
      ...this.events[eventFoundIndex], 
      participantes: [
        ...this.events[eventFoundIndex].participantes, 
        idUsuario
      ]
    }
    this.events = this.events.map(event => {
      if(event.id === eventId) {
        return eventUpdated
      }
      return event
    })
    return true
  }

  ponerEventoEnGira(eventId, nuevaLocalidad, nuevaFecha) {
    const event = this.events.find(event => event.id === eventId)
    if(!event) return

    const id = this.getLastIndex() + 1
    const newEvent = {...event, lugar: nuevaLocalidad, fecha: nuevaFecha, id, participantes: []}
    this.events = [...this.events, newEvent]
    this._lastIndex = id
  }
}

const ticketManager = new TicketManager()
console.log(ticketManager)

ticketManager.agregarEvento("Loolapalooza 1", "Hipodromo de Buenos Aires", 4.70, 5000)
ticketManager.agregarEvento("Loolapalooza 2", "Hipodromo de Buenos Aires", 5, 4000, new Date("2023-6-15").toLocaleDateString())

ticketManager.agregarUsuario(1, 1)
ticketManager.agregarUsuario(1, 1)
ticketManager.agregarUsuario(2, 1)
ticketManager.agregarUsuario(1, 2)
ticketManager.agregarUsuario(1, 3)
ticketManager.agregarUsuario(3, 1)
ticketManager.agregarUsuario(3, 2)

ticketManager.ponerEventoEnGira(1, "Mar del Plata", new Date("2023-6-16").toLocaleDateString())

ticketManager.agregarUsuario(3, 1)
ticketManager.agregarUsuario(3, 2)

console.info(ticketManager.getEventos())
console.info(ticketManager.events[0].participantes)
console.info(ticketManager.events[1].participantes)
console.info(ticketManager.events[2].participantes)