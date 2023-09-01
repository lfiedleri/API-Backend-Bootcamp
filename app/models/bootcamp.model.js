const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Bootcamp = sequelize.define('bootcamp', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El título es requerido'
            },
            notEmpty: {
                msg: 'Debe ingresar un título'
            }
        }
    },
    cue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El cue es requerido'
            },
            notEmpty: {
                msg: 'Debe ingresar un cue'
            }
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La descripción es requerido'
            },
            notEmpty: {
                msg: 'Debe ingresar una descripción'
            }
        }
    }
});

module.exports = Bootcamp;

