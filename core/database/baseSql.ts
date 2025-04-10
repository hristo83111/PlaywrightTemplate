import { connect, ConnectionPool, config as SqlConfig } from 'mssql'
import { getEnvironment } from 'settings/settings'

// Types
import { DatabaseName } from 'core/database/types/DatabaseName'
import { SqlServerName } from 'core/database/types/SqlServerName'

// Mapping of database names to their SQL Server instances.
const serverNamesMap = new Map<string, SqlServerName>([
  ['QA-Admin', SqlServerName.QA_SQL07],
  ['QA-Conduit', SqlServerName.QA_SQL08],
  ['Stage-Admin', SqlServerName.Stage_SQL01],
  ['Stage-Conduit', SqlServerName.Stage_SQL02]
])

/**
 * Retrieves the SQL Server instance name based on the database name and environment.
 *
 * @param {DatabaseName} databaseName - The name of the database.
 * @returns {SqlServerName | undefined} - The corresponding SQL Server instance or undefined if not found.
 */
const getServerName = (databaseName: DatabaseName): SqlServerName | undefined =>
  serverNamesMap.get(`${getEnvironment()}-${databaseName}`)

/**
 * Retrieves the database user credentials based on the given SQL Server instance.
 *
 * @param {SqlServerName | undefined} sqlServerName - The SQL Server instance.
 * @returns {[string, string]} - An array containing the username and password.
 *
 * @throws {Error} If an unknown SQL Server is provided.
 */
export const getUser = (sqlServerName: SqlServerName) => {
  switch (sqlServerName) {
    case SqlServerName.QA_SQL07:
    case SqlServerName.Stage_SQL01:
      return [
        process.env.DATABASE_ADMIN_USERNAME,
        process.env.DATABASE_ADMIN_PASSWORD
      ]
    case SqlServerName.QA_SQL08:
    case SqlServerName.Stage_SQL02:
      return [
        process.env.DATABASE_CONDUIT_USERNAME,
        process.env.DATABASE_CONDUIT_PASSWORD
      ]
    default:
      throw new Error(`Unknown SQL Server ${sqlServerName}.`)
  }
}

/**
 * Builds the database configuration object for establishing a connection.
 *
 * @param {DatabaseName} databaseName - The name of the database.
 * @returns {SqlConfig} - The SQL configuration object.
 */
const buildConfig = (databaseName: DatabaseName): SqlConfig => {
  const serverName = getServerName(databaseName)
  const user = getUser(serverName!)

  return {
    user: user[0],
    password: user[1],
    server: serverName ?? '',
    database: databaseName,
    options: {
      trustedConnection: true,
      trustServerCertificate: true
    },
    requestTimeout: 300000
  }
}

/**
 * Establishes a connection to the specified database.
 *
 * @param {DatabaseName} databaseName - The database to connect to.
 * @returns {Promise<ConnectionPool>} - A promise resolving to an open SQL connection pool.
 */
const connectToDb = async (
  databaseName: DatabaseName
): Promise<ConnectionPool> => {
  const dbConfig = buildConfig(databaseName)

  return connect(dbConfig)
}

/**
 * Executes a SQL function within a managed database connection.
 *
 * @template T - The return type of the SQL function.
 * @param {DatabaseName} databaseName - The name of the database to connect to.
 * @param {(pool: ConnectionPool) => Promise<T>} sqlFunc - The SQL function to execute.
 * @returns {Promise<T>} - A promise resolving to the result of the SQL function.
 *
 * @example
 * // Execute a query to fetch user details
 * const getUserDetails = async (pool: mssql.ConnectionPool) => {
 *   return await buildSelectQuery<User>('Users', ['id', 'name'])(pool);
 * };
 *
 * const userDetails = await executeQuery('Moneycorp', getUserDetails);
 */
export const executeQuery = async <T>(
  databaseName: DatabaseName,
  sqlFunc: (pool: ConnectionPool) => Promise<T>
): Promise<T> => {
  const connection = await connectToDb(databaseName)

  try {
    return await sqlFunc(connection)
  } finally {
    await connection.close() // Ensure the connection is always closed
  }
}
