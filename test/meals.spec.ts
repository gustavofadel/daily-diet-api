import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Meal routes', () => {
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

  it('should be able to create a new meal', async () => {
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
      .expect(201)
  })

  it('should be able to get a specific meal', async () => {
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

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Meal Title',
        description: 'Meal Description',
        datetime: '2023-09-13 08:00',
        in_diet: 1,
      }),
    )
  })

  it('should be able to update an existing meal', async () => {
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

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .send({
        name: 'Updated Meal Title',
        description: 'Updated Meal Description',
        date: '13/09/2023',
        hour: '08:30',
        inDiet: false,
      })
      .set('Cookie', cookies)
      .expect(200)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Updated Meal Title',
        description: 'Updated Meal Description',
        datetime: '2023-09-13 08:30',
        in_diet: 0,
      }),
    )
  })

  it('should be able to delete an existing meal', async () => {
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

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(404)
  })
})
