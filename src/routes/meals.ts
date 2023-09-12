import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkIfUserIsLoggedIn } from '../middlewares/check-if-user-is-logged-in'
import { formatDateTime } from '../utils/format-datetime'

export async function mealRoutes(app: FastifyInstance) {
  app.get(
    '/:id',
    { preHandler: [checkIfUserIsLoggedIn] },
    async (request, reply) => {
      const { loggedUser } = request.cookies

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          id,
          user_id: loggedUser,
        })
        .first()

      if (!meal) {
        return reply.status(404).send()
      }

      return { meal }
    },
  )

  app.post(
    '/',
    { preHandler: [checkIfUserIsLoggedIn] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        hour: z.string(),
        inDiet: z.boolean(),
      })

      const { name, description, date, hour, inDiet } =
        createMealBodySchema.parse(request.body)

      const { loggedUser } = request.cookies

      await knex('meals').insert({
        id: randomUUID(),
        user_id: loggedUser,
        name,
        description,
        datetime: formatDateTime(date, hour),
        in_diet: inDiet,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkIfUserIsLoggedIn] },
    async (request, reply) => {
      const { loggedUser } = request.cookies

      const updateMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          id,
          user_id: loggedUser,
        })
        .first()

      if (!meal) {
        return reply.status(404).send()
      }

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        hour: z.string(),
        inDiet: z.boolean(),
      })

      const { name, description, date, hour, inDiet } =
        updateMealBodySchema.parse(request.body)

      await knex('meals')
        .where({
          id,
          user_id: loggedUser,
        })
        .update({
          name,
          description,
          datetime: formatDateTime(date, hour),
          in_diet: inDiet,
        })

      return reply.status(200).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkIfUserIsLoggedIn] },
    async (request, reply) => {
      const { loggedUser } = request.cookies

      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = deleteMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          id,
          user_id: loggedUser,
        })
        .first()

      if (!meal) {
        return reply.status(404).send()
      }

      await knex('meals')
        .where({
          id,
          user_id: loggedUser,
        })
        .del()

      return reply.status(204).send()
    },
  )
}
