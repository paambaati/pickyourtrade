import { IRouterContext } from 'koa-tree-router';

/**
 * Generic routes.
 */

/**
 * Ping route.
 * Responds with a pong response.
 *
 * @export
 * @param {IRouterContext} Koa context.
 * @param { () => Promise<any>} Koa next.
 */
export async function pingRoute(ctx: IRouterContext, next: () => Promise<any>) {
    ctx.body = {
        err: false,
        pong: true,
    };
    await next();
}
