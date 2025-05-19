const Sequelize = require('sequelize')

const sequelize = new Sequelize("practice", "root", "soniab10022005", {
  host: "localhost", 
  dialect: "mysql",
});

module.exports = sequelize;