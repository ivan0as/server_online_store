const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define ('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    phoneNumber: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, allowNull: false},
})

const Sales = sequelize.define('sales', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING, defaultValue: "PROCESSING"},
    paymentType: {type: DataTypes.STRING, allowNull: false},
    deliveryType: {type: DataTypes.STRING, allowNull: false},
    clientAddress: {type: DataTypes.STRING},
})

const SalesLineups = sequelize.define('sales_lineups', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.INTEGER, allowNull: false},
    priceOne: {type: DataTypes.INTEGER, allowNull: false},
    priceAll: {type: DataTypes.INTEGER, allowNull: false},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Producer = sequelize.define('producer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Country = sequelize.define('country', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const GeneralType = sequelize.define('general_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Slider = sequelize.define('slider', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    img: {type: DataTypes.STRING, allowNull: false},
    url: {type: DataTypes.STRING, allowNull: false},
})

const Pharmacy = sequelize.define('pharmacy', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    address: {type: DataTypes.STRING, unique: true, allowNull: false},
})

User.hasMany(Basket)
Basket.belongsTo(User)

User.hasMany(Sales)
Sales.belongsTo(User)

Sales.hasMany(SalesLineups)
SalesLineups.belongsTo(Sales)

Product.hasMany(Basket)
Basket.belongsTo(Product)

Product.hasMany(SalesLineups)
SalesLineups.belongsTo(Product)

Producer.hasMany(Product)
Product.belongsTo(Producer)

Country.hasMany(Product)
Product.belongsTo(Country)

Type.hasMany(Product)
Product.belongsTo(Type)

GeneralType.hasMany(Type)
Type.belongsTo(GeneralType)

Pharmacy.hasMany(Sales)
Sales.belongsTo(Pharmacy)

module.exports = {
    User,
    Basket,
    Sales,
    SalesLineups,
    Product,
    Type,
    Producer,
    Country,
    GeneralType,
    Slider,
    Pharmacy,
}