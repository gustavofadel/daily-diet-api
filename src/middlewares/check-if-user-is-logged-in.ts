import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkIfUserIsLoggedIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const loggedUser = request.cookies.loggedUser

  if (!loggedUser) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
