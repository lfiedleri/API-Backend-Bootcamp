const { User, Bootcamp } = require('../models');
const { StatusCodes } = require('http-status-codes');

const createBootcamp = async (req, res) => {
    try {
        const { title, cue, description } = req.body;
        //const user = req.body;
        if (!(title && cue && description)) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }
        const bootcamp = await Bootcamp.create({
            title,
            cue,
            description
        });
        console.log(`Se ha creado el bootcamp ${JSON.stringify(bootcamp, null, 4)}`);
        res.status(StatusCodes.CREATED).json({
            message: `Bootcamp ${bootcamp.title} fue creado con éxito`,
            bootcamp: bootcamp
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const addUserToBootcamp = async (req, res) => {
    try {
        const { idBootcamp, idUser } = req.body;
        const bootcamp = await Bootcamp.findByPk(Number(idBootcamp));
        if (!bootcamp) {
            console.log(`No se encontró bootcamp con id ${idBootcamp}`);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: `No se encontró bootcamp con id ${idBootcamp}`
            });
            return;
        }
        const usuario = await User.findByPk(Number(idUser));
        if (!usuario) {
            console.log(`No se encontró usuario con id ${idUser}`);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: `No se encontró usuario con id ${idUser}`
            });
            return;
        }
        await bootcamp.addUser(usuario);
        console.log(`Agregado el usuario id ${usuario.id} al bootcamp con id ${bootcamp.id}`);
        res.status(StatusCodes.CREATED).json({
            message: `Se agregó usuario id ${idUser} al bootcamp id ${idBootcamp}`,
            bootcamp: bootcamp
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const findById = async (req, res) => {
    try {
        const { id } = req.params;
        const bootcamp = await Bootcamp.findByPk(Number(id), {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        if (!bootcamp) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: `Bootcamp id ${id} no fue encontrado`
            });
            return;
        }
        res.status(StatusCodes.OK).json({
            message: `Bootcamp ${bootcamp.title} fue encontrado con éxito`,
            bootcamp: bootcamp
        });
        console.log(`Se ha encontrado el bootcamp ${JSON.stringify(bootcamp, null, 4)}`);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const findAllBootcamp = async (req, res) => {
    try {
        const bootcamps = await Bootcamp.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        console.log(`Se han encontrado los proyectos ${JSON.stringify(bootcamps, null, 4)}`);
        res.status(StatusCodes.OK).json({
            message: `Se encontraron ${bootcamps.length} bootcamps`,
            bootcamps: bootcamps
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

module.exports = {
    createBootcamp,
    addUserToBootcamp,
    findById,
    findAllBootcamp
}


