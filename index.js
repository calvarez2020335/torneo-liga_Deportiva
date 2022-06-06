const mongoose = require('mongoose');
const usuarioControler = require('./src/controllers/usuario.controller')
const app = require('./app');

mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;                                                                  
mongoose.connect('mongodb+srv://admin:admin123@cluster0.knu6h7m.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Conectado a la base de datos.");
    usuarioControler.adminInicio();

    app.listen(process.env.PORT || 3000, function () {
        console.log("Corriendo en el puerto 3000!")
    })

}).catch(error => console.log(error));