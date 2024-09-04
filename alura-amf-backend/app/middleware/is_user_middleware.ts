import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsUserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.auth.user) {
      return ctx.response.unauthorized({
        errors: [{ message: 'You are not allowed to perform this action.' }],
      })
    }

    const user = ctx.auth.user
    if (user.id !== ctx.params.id) {
      return ctx.response.unauthorized({
        errors: [{ message: 'You are not allowed to perform this action.' }],
      })
    }
    const output = await next()
    return output
  }
}
