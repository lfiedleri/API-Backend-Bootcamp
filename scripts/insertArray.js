const User = require('../app/models/user.model');
const Bootcamp = require('../app/models/bootcamp.model')
const sequelize = require('../app/config/db.config');

const users = [
    { 
        firstName: "Mateo", 
        lastName: "Diaz",
        email: "mateo.diaz@correo.com",
        password: 12345678
    }, 
    { 
        firstName: "Santiago", 
        lastName: "Mejias",
        email: "santiago.mejias@correo.com",
        password: 12345678
    }, 
    { 
        firstName: "Lucas", 
        lastName: "Rojas",
        email: "lucas.rojas@correo.com",
        password: 12345678
    }, 
    { 
        firstName: "Facundo", 
        lastName: "Fernandez",
        email: "facundo.fernandez@correo.com",
        password: 12345678
    }
];

const bootcamps = [
    { 
        title: "Introduciendo El Bootcamp De React", 
        cue: 10,
        description: "React es la librería más usada en JavaScript para el desarrollo de interfaces"
    }, 
    { 
        title: "Bootcamp Desarrollo Web Full Stack", 
        cue: 12,
        description: "Crearás aplicaciones web utilizando las tecnologías y lenguajes más actuales y populares, como: JavaScript, nodeJS, Angular, MongoDB, ExpressJS"
    }, 
    { 
        title: "Crearás aplicaciones web utilizando las tecnologías y lenguajes más actuales y populares, como: JavaScript, nodeJS, Angular, MongoDB, ExpressJS", 
        cue: 18,
        description: "Domina Data Science, y todo el ecosistema de lenguajes y herramientas de Big Data, e intégralos con modelos avanzados de Artificial Intelligence y Machine Learning"
    }
];

(async () => {
    try {
        await User.bulkCreate(users, { validate: true });
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
})();

(async () => {
    try {
        await Bootcamp.bulkCreate(bootcamps, { validate: true });
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
})();