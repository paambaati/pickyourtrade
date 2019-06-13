import { IRouterContext } from 'koa-tree-router';
import Database from '../utils/database';

// Initializers.
const db = new Database(); // Returns singleton DB class.
const TABLE = 'portfolios';

/**
 * Portfolio routes.
 */

/**
 * Portfolio select route.
 * Responds with the results of a SELECT query on the database.
 *
 * @export
 * @param {IRouterContext} Koa context.
 * @param { () => Promise<any>} Koa next.
 */
export async function portfolioSelectRoute(ctx: IRouterContext, next: () => Promise<any>) {
    const username = ctx.params.username;
    const results = db.select(`SELECT * FROM ${TABLE} WHERE username = '${username}'`);
    ctx.body = results;
    await next();
}

/**
 * Portfolio insert route.
 * Responds with the results of an INSERT query on the database.
 *
 * @export
 * @param {IRouterContext} Koa context.
 * @param { () => Promise<any>} Koa next.
 */
export async function portfolioInsertRoute(ctx: IRouterContext, next: () => Promise<any>) {
    const username = ctx.params.username;
    const payload = ctx.request['body'];
    db.insert(TABLE, {
        username,
        ...payload,
    });
    ctx.body = {
        username,
        operation: 'INSERT',
        success: true,
        inserted: payload,
    };
    await next();
}

/**
 * Portfolio update route.
 * Responds with the results of an UPDATE query on the database.
 *
 * @export
 * @param {IRouterContext} Koa context.
 * @param { () => Promise<any>} Koa next.
 */
export async function portfolioUpdateRoute(ctx: IRouterContext, next: () => Promise<any>) {
    const username = ctx.params.username;
    const payload = ctx.request['body'];
    const { id, ...updates } = payload;
    db.update(TABLE, updates, { id, username });
    ctx.body = {
        username,
        operation: 'UPDATE',
        success: true,
        updated: payload,
    };
    await next();
}
