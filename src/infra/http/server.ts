import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createLinkRoute } from '@/infra/http/routes/create-link'
import { deleteLinkRoute } from '@/infra/http/routes/delete-link'
import { exportLinksRoute } from '@/infra/http/routes/export-links'
import { getLinksRoute } from '@/infra/http/routes/get-links'
import { getOriginalUrlLinkRoute } from '@/infra/http/routes/get-original-url-link'
import { incrementClickLinkRoute } from '@/infra/http/routes/increment-click-link'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Url Shortener',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

server.register(createLinkRoute)
server.register(deleteLinkRoute)
server.register(exportLinksRoute)
server.register(getLinksRoute)
server.register(getOriginalUrlLinkRoute)
server.register(incrementClickLinkRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
