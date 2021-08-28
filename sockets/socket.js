const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
console.log('init server');

bands.addBand( new Band( 'Carlos Rivera' ) );
bands.addBand( new Band( 'Ariana Grande' ) );
bands.addBand( new Band( 'Héroes del Silencio' ) );
bands.addBand( new Band( 'Metallica' ) );
bands.addBand( new Band( 'The Weeknd' ) );
bands.addBand( new Band( 'Luis Miguel' ) );

//Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
     });

     client.on('mensaje', (payload) =>{
        console.log('Mensaje desde el cliente(vista)', payload);
        io.emit('mensaje', {Servidor: 'Nuevo mensaje desde node.js'});
     })

     client.on('vote-band', (payload) =>{
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands());
        console.log(payload);
     })

     client.on('add-band', (payload) => {
      const newBand = new Band( payload.name );
      bands.addBand( newBand );
      io.emit('active-bands', bands.getBands() );
  });

  client.on('delete-band', (payload) => {

   bands.deleteBand( payload.id );
   io.emit('active-bands', bands.getBands() );
});

   //   client.on('mandar-mensaje', ( payload ) =>{
   //      //console.log(payload);
   //       // io.emit('nuevo-mensaje', payload); esto emite a todos
   //       client.broadcast.emit('nuevo-mensaje', payload); //a todos menos el que lo emitió
   //   })

});