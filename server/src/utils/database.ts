/**
 * SQLite3 Database utility.
 */

import DB from 'better-sqlite3-helper';

/**
 * Database Singleton class.
 *
 * Connects to SQLite3 DB and runs migrations on first init.
 */
export default class Database {
    public db: any;
    /**
     * Database class.
     * @param filename - Name of DB file. Set to undefined to use in-memory.
     * @param memory - Use in-memory mode. Defaults to `false`.
     * @param migrations - Name of migrations directory.
     */
    public constructor(filename?: string | undefined, memory?: boolean, migrations?: string | undefined) {
        this.db = DB({
            path: filename || './data/pyt.db',
            memory: memory || false,
            migrate: {
                force: false,
                table: 'migration',
                migrationsPath: migrations || './data/migrations',
            },
        });
        return this;
    }

    /**
     * Insert row into table.
     * @param table - Name of table to insert data into.
     * @param row - Data to insert.
     * @returns inserted row.
     */
    public insert(table: string, row: object) {
        try {
            const inserted = this.db.insert(table, row);
            return inserted;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update row on table.
     * @param table - Name of table to update data in.
     * @param row - Data to update.
     * @param where - 'WHERE' clause.
     * @returns updated row.
     */
    public update(table: string, data: object, where: object) {
        try {
            const updated = this.db.update(table, data, where);
            return updated;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Select rows from table.
     * @param table - Name of table to retrieve data from.
     * @returns Rows (null if select failed).
     */
    public select(query: string) {
        try {
            return this.db.query(query);
        } catch (err) {
            throw err;
        }
    }
}
