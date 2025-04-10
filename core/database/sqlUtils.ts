import { ConnectionPool } from 'mssql'

/**
 * Builds and executes a dynamic UPDATE SQL query.
 *
 * @param {string} tableName - The name of the table to update.
 * @param {Record<string, any>} updates - An object containing column names as keys and their new values.
 * @param {string} whereClause - The WHERE condition to specify which records to update.
 * @returns {(pool: ConnectionPool) => Promise<void>} - A function that takes a database connection pool and executes the update query.
 *
 * @throws {Error} If the `updates` object is empty.
 *
 * @example
 * // Update multiple fields for a user
 * const updateUserFields = buildUpdateQuery('Users', { name: 'Jane Doe', status: 'active' }, 'id = @id');
 */
export const buildUpdateQuery =
  (tableName: string, updates: Record<string, unknown>, whereClause: string) =>
  async (pool: ConnectionPool) => {
    // Ensure that at least one update value is provided
    if (Object.keys(updates).length === 0) {
      throw new Error('No update values have been provided')
    }

    const request = pool.request()

    // Add the parameters to the request
    Object.keys(updates).forEach(key => {
      request.input(key, updates[key])
    })

    // Build the SET clause dynamically (e.g., "name = @name, status = @status")
    const setClause = Object.keys(updates)
      .map(key => `${key} = @${key}`)
      .join(', ')

    await request.query(
      `UPDATE ${tableName}
      SET ${setClause}
      WHERE ${whereClause}`
    )
  }

/**
 * Builds and executes a dynamic SELECT SQL query.
 *
 * @template T - The expected return type for the query results.
 * @param {string} tableName - The name of the table to query.
 * @param {string[]} columns - The list of columns to select (use `[]` for all columns).
 * @param {string} [whereClause] - Optional WHERE clause for filtering records.
 * @returns {(pool: ConnectionPool) => Promise<T[]>} - A function that takes a database connection pool and returns a Promise resolving to an array of records of type `T`.
 *
 * @example
 * // Fetch all users (all columns)
 * const selectAllUsers = buildSelectQuery<User>('Users', []);
 * const users = await selectAllUsers(pool);
 *
 * @example
 * // Fetch users with specific columns and a WHERE clause
 * const selectActiveUsers = buildSelectQuery<User>('Users', ['id', 'name'], 'status = "active"');
 * const activeUsers = await selectActiveUsers(pool);
 */
export const buildSelectQuery =
  <T>(tableName: string, columns: string[], whereClause?: string) =>
  async (pool: ConnectionPool): Promise<T[]> => {
    const request = pool.request()

    // Build the column selection clause:
    // - If specific columns are provided, join them into a comma-separated string (e.g., "id, name, email").
    // - If no columns are specified, default to "*" (select all columns).
    const columnClause = columns.length > 0 ? columns.join(', ') : '*'

    // Construct the WHERE clause if a condition is provided, otherwise leave it empty
    const whereStatement = whereClause ? `WHERE ${whereClause}` : ''

    // Execute the SQL query and retrieve the result set
    const result = await request.query(
      `SELECT ${columnClause} FROM ${tableName} ${whereStatement}`
    )

    const records = result.recordset as T[]

    return records
  }

/**
 * Builds and executes a dynamic DELETE SQL query.
 *
 * @param {string} tableName - The name of the table where records will be deleted.
 * @param {string} whereClause - The WHERE condition to specify which records to delete.
 * @returns {(pool: ConnectionPool) => Promise<void>} - A function that takes a database connection pool and executes the delete query.
 *
 * @throws {Error} If no `whereClause` is provided (to prevent accidental full-table deletion).
 *
 * @example
 * // Delete a user by ID
 * const deleteUser = buildDeleteQuery('Users', 'id = @id');
 */
export const buildDeleteQuery =
  (tableName: string, whereClause: string) =>
  async (pool: ConnectionPool): Promise<void> => {
    // Prevent accidental full table deletion
    if (!whereClause) {
      throw new Error(
        'WHERE clause is required for DELETE operation to prevent full table deletion.'
      )
    }

    const request = pool.request()

    await request.query(`DELETE FROM ${tableName} WHERE ${whereClause}`)
  }

/**
 * Builds and executes a dynamic INSERT SQL query.
 *
 * @param {string} tableName - The name of the table where the record will be inserted.
 * @param {Record<string, unknown>} data - An object containing column names as keys and their corresponding values to insert.
 * @returns {(pool: ConnectionPool) => Promise<void>} - A function that takes a database connection pool and executes the insert query.
 *
 * @throws {Error} If the `data` object is empty.
 *
 * @example
 * // Insert a new user
 * const insertUser = buildInsertQuery('Users', { name: 'John Doe', email: 'john@example.com' });
 */
export const buildInsertQuery =
  (tableName: string, data: Record<string, unknown>) =>
  async (pool: ConnectionPool): Promise<void> => {
    // Ensure that at least one value is provided
    if (Object.keys(data).length === 0) {
      throw new Error('No insert values have been provided')
    }

    const request = pool.request()

    // Add the parameters to the request
    Object.keys(data).forEach(key => {
      request.input(key, data[key])
    })

    // Generate column names and parameterized values for the INSERT statement
    const columns = Object.keys(data).join(', ')
    const values = Object.keys(data)
      .map(key => `@${key}`)
      .join(', ')

    await request.query(
      `INSERT INTO ${tableName} (${columns}) VALUES (${values})`
    )
  }
