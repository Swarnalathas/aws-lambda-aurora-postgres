const connectToDatabase = require('./db') // initialize connection
// simple Error constructor for handling HTTP error codes
function HTTPError (statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

module.exports.healthCheck = async () => {
  await connectToDatabase()
  console.log('Connection successful.')
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Connection successful.' })
  }
}

module.exports.create = async (event) => {
  try {
    const inputObj = JSON.parse(event.body)
    const { Employee } = await connectToDatabase()
    const emp = await Employee.create(inputObj)
    return {
      statusCode: 200,
      body: JSON.stringify(emp)
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not create the Employee.'
    }
  }
}

module.exports.getOne = async (event) => {
  try {
    const { Employee } = await connectToDatabase()
    const emp = await Employee.findAll({where : {id:event.pathParameters.id}})
    if (!emp) throw new HTTPError(404, `Employee with id: ${event.pathParameters.id} was not found`)
    return {
      statusCode: 200,
      body: JSON.stringify(emp)
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could not fetch the Employee.'
    }
  }
}

module.exports.getAll = async () => {
  try {
    const { Employee } = await connectToDatabase()
    const emp = await Employee.findAll()
    return {
      statusCode: 200,
      body: JSON.stringify(emp)
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the Employee.'
    }
  }
}

module.exports.update = async (event) => {
  try {
    const input = JSON.parse(event.body)
    const { Employee } = await connectToDatabase()
    await Employee.update(input, {where : {id: event.pathParameters.id},
            returning: true, 
            plain: true})
            .then(function (result) {
            console.log(result);   
            });
    const emp = await Employee.findAll({where : {id:event.pathParameters.id}})       
    return {
      statusCode: 200,
      body: JSON.stringify(emp)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could not update the Employee.'
    }
  }
}

module.exports.destroy = async (event) => {
  try {
    const { Employee } = await connectToDatabase()
    const emp = await Employee.findAll({where : {id:event.pathParameters.id}})
    if (!emp) throw new HTTPError(404, `Employee with id: ${event.pathParameters.id} was not found`)
    await Employee.destroy({
      where: {
        id:event.pathParameters.id
      }
  })
    return {
      statusCode: 200,
      body: JSON.stringify(emp)
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could destroy fetch the Employee.'
    }
  }
}