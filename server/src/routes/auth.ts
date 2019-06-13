import config from 'config';
import { IRouterContext } from 'koa-tree-router';
import { IUser } from '../utils/middleware';
/**
 * Authentication routes.
 */

/**
 * Get token route.
 * Responds with a token for the user.
 *
 * @export
 * @param {IRouterContext} Koa context.
 * @param { () => Promise<any>} Koa next.
 */
export async function authRoute(ctx: IRouterContext, next: () => Promise<any>) {
    const username = ctx.params.username;
    const password = <string>ctx.query.password;
    const registeredUsers = <IUser[]>config.get('users');
    const validRequest = registeredUsers.filter(user => {
        return (user.username === username && user.password === password);
    }).length;
    if (validRequest) {
        ctx.body = {
            username,
            token: Buffer.from(`${username}:${password}`).toString('base64'),
        };
    } else {
        ctx.status = 401;
        ctx.body = {
            error: 'Unauthorized',
            username,
        };
    }
    await next();
}
