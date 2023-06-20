const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Faculty } = require("./Faculty");
const { PersonalUserRole } = require("./PersonalUserRole");

const EducationalProgram = sequelize.define("EducationalProgram", {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    educational_program: {
        type: DataTypes.STRING
    },
    id_faculty: {
        type: DataTypes.BIGINT
    }
}, {
    timestamps: false,
    freezeTableName: true
});

EducationalProgram.hasOne(Faculty, {
    foreignKey: "id",
    targetKey: "id_faculty",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Faculty.belongsTo(EducationalProgram, {
    foreignKey: "id",
    targetKey: "id_faculty"
});

EducationalProgram.hasMany(PersonalUserRole, {
    foreignKey: "id_career",
    sourceKey: "id",
});

PersonalUserRole.belongsTo(EducationalProgram, {
    foreignKey: "id_career",
    targetKey: "id"
})



module.exports = { EducationalProgram };