import supertest from 'supertest'
import { Api } from '../api'


export const fetchSlots = (api: Api, from: Date, to: Date): supertest.Test =>
  api.post('').send({
    query: `
      query slots ($from: DateTime!, $to: DateTime!) {
        slots (from:$from, to:$to) {
          doctorId
          start
          end
        }
      }
    `,
    variables: {
      from,
      to
    }
  });
