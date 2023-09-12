// eslint-disable-next-line
import { Knex } from 'knex'

client = Knex.Client

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: string
    }

    meals: {
      id: string
      user_id: string
      name: string
      description: string
      datetime: string
      in_diet: boolean
    }
  }
}
