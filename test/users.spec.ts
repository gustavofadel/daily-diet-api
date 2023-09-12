import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it.only('should be able to register a new user', async () => {
    await request(app.server)
      .post('/users/register')
      .send({
        name: 'New user',
        email: 'newuser@example.com',
      })
      .expect(201)
  })

  it('should be able to login', async () => {
    await request(app.server).post('/users/register').send({
      name: 'New user',
      email: 'newuser@example.com',
    })

    await request(app.server)
      .post('/users/login')
      .send({
        email: 'newuser@example.com',
      })
      .expect(200)
  })

  it('should be able to list the meal registered by the user', async () => {
    await request(app.server).post('/users/register').send({
      name: 'New user',
      email: 'newuser@example.com',
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'newuser@example.com',
    })

    const cookies = loginResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Meal Title',
        description: 'Meal Description',
        date: '13/09/2023',
        hour: '08:00',
        inDiet: true,
      })
      .set('Cookie', cookies)

    const listMealsResponse = await request(app.server)
      .get('/users/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Meal Title',
        description: 'Meal Description',
        datetime: '2023-09-13 08:00',
        in_diet: 1,
      }),
    ])
  })

  it('should be able to list user metrics', async () => {
    await request(app.server).post('/users/register').send({
      name: 'New user',
      email: 'newuser@example.com',
    })

    const loginResponse = await request(app.server).post('/users/login').send({
      email: 'newuser@example.com',
    })

    const cookies = loginResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Diet Meal',
        description: 'Diet Meal Description',
        date: '13/09/2023',
        hour: '08:00',
        inDiet: true,
      })
      .set('Cookie', cookies)

    await request(app.server)
      .post('/meals')
      .send({
        name: 'Non-Diet Meal',
        description: 'Non-Diet Meal Description',
        date: '13/09/2023',
        hour: '12:00',
        inDiet: false,
      })
      .set('Cookie', cookies)

    const metricsResponse = await request(app.server)
      .get('/users/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(metricsResponse.body).toEqual(
      expect.objectContaining({
        mealsCount: 2,
        inDietMealsCount: 1,
        notInDietMealsCount: 1,
        longestInDietMealsStreak: 1,
      }),
    )
  })
})
