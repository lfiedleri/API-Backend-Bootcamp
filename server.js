const express = require('express');
const app = express();
require('dotenv').config();
const { StatusCodes } = require('http-status-codes');
const userRoutes = require("./app/routes/user.routes");
const bootcampRoutes = require("./app/routes/bootcamp.routes")
const { User } = require('./app/models');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const util = require('util');
const sign = util.promisify(jwt.sign);
const { 
    verifySingUp,
    verifyToken 
} = require('./app/middleware');

const PORT = process.env.PORT;


// Creamos la variable de configuración para CORS
const corsOpt = {
    origin: '*', // Se debe reemplazar el * por el dominio de nuestro front
    optionsSuccessStatus: 200 // Es necesario para navegadores antiguos o algunos SmartTVs
}

//************middlewares********
app.use(express.json());//body-parser de express
app.use(express.urlencoded({ extended: true }));//body-parser de express
app.use(cors(corsOpt));
//*******************************

//***********rutas***************
app.use('/api/user', verifyToken); // protegemos todas las rutas de user
app.use('/api/user', userRoutes);
app.use('/api/bootcamp', bootcampRoutes);
//*******************************


/*Registro de  nuevo usuario
http://localhost:3000/api/signup
body:
{
    "firstName": "Nombre",
    "lastName": "Apellido",
    "email": "mail@email.com",
    "password": "mypassword"
}
*/
app.post('/api/signup', verifySingUp, async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        console.log("Salt generado: " + salt);
        const encryptedPassword = await bcrypt.hash(password, salt);
        console.log("\nPassword encriptado: " + encryptedPassword);

        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(), 
            password: encryptedPassword,
        });

        const token = await sign(
            {
                userId: user.id,
                email
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "3m",
            }
        );

        console.log("\nToken Generado: " + token);

        res.status(StatusCodes.OK).json({
            user,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});


/** login usuario registrado
http://localhost:3000/api/signin
body:
{
    "email": "lfiedler@correo.com",
    "password": "mypassword"
}
*/
app.post('/api/signin', async (req, res) => {
    try {
        const { email,  password } = req.body;

        if (!(email && password)) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: 'Todos los datos son requeridos, email y password' });
            return;
        }

        // Validando la existencia del usuario en la base de datos
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log('bcrypt.compare:>> ', await bcrypt.compare(password, user.password));
            // Se genera el Token
            const token = await sign(
                {
                    userId: user.id,
                    email
                },
                process.env.TOKEN_KEY, 
                {
                    expiresIn: "3m",
                }
            );
            // Impresion por el terminal del Token generado para el usuario
            console.log("Usuario: " + email + "\nToken: " + token);

            // Retornando los datos del usuario
            res.status(StatusCodes.OK).json({
                token,
                message: 'Autenticado'
            });
            return;
        }
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Credenciales invalidas'});
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

app.listen(PORT, () => console.log(`Iniciando en puerto ${PORT}`));