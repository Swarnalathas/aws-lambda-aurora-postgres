
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('employee_info', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull : false
      },
      emp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },{
      freezeTableName: true
    },
    {
      timestamps: false
  })
  }