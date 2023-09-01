const { User, Bootcamp } = require('../models');
const { StatusCodes } = require('http-status-codes');

const findUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const usuario = await User.findByPk(id, {
            include: [
                {
                    model: Bootcamp,
                    as: 'bootcamp',
                    attributes: ['title', 'cue', 'description'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        if (!usuario) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: `Usuario id ${id} no fue encontrado`
            });
            return;
        }
        console.log(`Se ha encontrado el usuario ${JSON.stringify(usuario, null, 4)}`);
        res.status(StatusCodes.OK).json({
            message: `Usuario ${usuario.firstName} ${usuario.lastName} fue encontrado con éxito`,
            user: usuario
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const findAllUser = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            include: [
                {
                    model: Bootcamp,
                    as: 'bootcamp',
                    attributes: ['title', 'cue', 'description'],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        console.log(`Se han encontrado los usuarios ${JSON.stringify(usuarios, null, 4)}`);
        res.status(StatusCodes.OK).json({
            message: `Se encontraron ${usuarios.length} usuarios`,
            users: usuarios
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const updateUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = req.body;
        let nroActualizados = [], nroActualizado;

        if (!(user.firstName && user.lastName && id)) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }
        const usuario = await User.findByPk(id);
        if (usuario) {
            if ((usuario.firstName !== user.firstName) || (usuario.lastName !== user.lastName)) {
                nroActualizados = await User.update({
                    firstName: user.firstName,
                    lastName: user.lastName
                }, {
                    where: { id: id }
                });
                nroActualizado = nroActualizados[0];
                console.log(`Actualizados: ${nroActualizados}`);
                console.log(`Se ha actualizado el usuario con id ${id}`);
            } else {
                nroActualizado = -1;
            }
        } else {
            nroActualizado = 0;
        }

        if (nroActualizado) {
            if (nroActualizado !== -1) {
                res.status(StatusCodes.CREATED).json({
                    message: `Usuario id ${id} fue actualizado con éxito`
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: `Usuario id ${id} no fue actualizado. No había nada que actualizar.`
                });
            }
        } else {
            res.status(StatusCodes.NOT_FOUND).json({
                message: `Usuario id ${id} no fue encontrado`
            });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

const deleteUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const nroBorrados = await User.destroy({
            where: { id }
        });

        console.log(`Borrados: ${nroBorrados}`);
        if (!nroBorrados) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: `Usuario id ${id} no fue encontrado`
            });
            return
        }
        res.status(StatusCodes.CREATED).json({
            message: `Usuario id ${id} fue borrado con éxito`
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}


module.exports = {
    findUserById,
    findAllUser,
    updateUserById,
    deleteUserById
}