/* 
*Create and export configuration materials
*/

//Container for all environmental variables

const environments = {}

//Staging (default)

environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging'
}

environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
}

//Determine which environment should be exported out

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check that the current environment is one of the above, if not default to staging

const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment]: environments.staging;

//export the module

module.exports = environmentToExport;