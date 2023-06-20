const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");
const { CategoryType } = require("./enum/CategoryType");

const BusinessUserRole = sequelize.define("Business", {
    category: {
        type: DataTypes.ENUM(CategoryType.PERSONAL_BLOG, CategoryType.PRODUCT_OR_SERVICE, CategoryType.ART, CategoryType.BAND_OR_MUSIC, CategoryType.RETAIL_PURCHASES_OR_SALES, CategoryType.HEALTH_OR_BEAUTY, CategoryType.GROCERY_STORES)
    },
    city: {
        type: DataTypes.STRING
    },
    postal_code: {
        type: DataTypes.STRING
    },
    postal_address: {
        type: DataTypes.STRING
    },
    contact_email: {
        type: DataTypes.STRING
    },
    phone_contact: {
        type: DataTypes.STRING
    },
    organization_name: {
        type: DataTypes.STRING
    },
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

BusinessUserRole.hasOne(UserRole, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(BusinessUserRole, {
    foreignKey: "id_user",
    targetKey: "id_user"
});

module.exports = { BusinessUserRole };