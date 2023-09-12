import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkIfUserIsLoggedIn } from '../middlewares/check-if-user-is-logged-in'

export async function userRoutes(app: FastifyInstance) {
  app.get(
    '/meals',
    { preHandler: [checkIfUserIsLoggedIn] },
    async (request) => {
      const { loggedUser } = request.cookies

      const meals = await knex('meals').where('user_id', loggedUser).select()

      return { meals }
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkIfUserIsLoggedIn] },
    async (request) => {
      const { loggedUser } = request.cookies

      const meals = await knex('meals')
        .where('user_id', loggedUser)
        .orderBy('datetime')

      const mealsCount = meals.length
      const inDietMealsCount = meals.filter((item) => item.in_diet).length
      const notInDietMealsCount = meals.filter((item) => !item.in_diet).length
      const longestInDietMealsStreak = meals.reduce(
        (result, item) => {
          if (item.in_diet) {
            result.currentStreak++
          } else {
            result.currentStreak = 0
          }

          result.longestStreak = Math.max(
            result.longestStreak,
            result.currentStreak,
          )

          return result
        },
        { currentStreak: 0, longestStreak: 0 },
      ).longestStreak

      return {
        mealsCount,
        inDietMealsCount,
        notInDietMealsCount,
        longestInDietMealsStreak,
      }
    },
  )

  app.post('/register', async (request, reply) => {
    const registerUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = registerUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
    })

    return reply.status(201).send()
  })

  app.post('/login', async (request, reply) => {
    const loginUserBodySchema = z.object({
      email: z.string(),
    })

    const { email } = loginUserBodySchema.parse(request.body)

    const user = await knex('users').where({ email }).first()

    if (user) {
      reply.setCookie('loggedUser', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return reply.status(200).send()
    }

    return reply.status(404).send()
  })
}
