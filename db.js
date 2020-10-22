"use strict";
const Sequelize = require('sequelize')
const EmployeeModel = require('./models/Employee')
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
        timestamps: false
    }   
  }
)
const Employee = EmployeeModel(sequelize, Sequelize)
const Models = { Employee }
const connection = {}

module.exports = async () => {
  if (connection.isConnected) {
    console.log('=> Using existing connection.')
    return Models
  }

  await sequelize.sync({ force: false })
  await sequelize.authenticate()
  connection.isConnected = true
  console.log('=> Created a new connection.')
  return Models
}