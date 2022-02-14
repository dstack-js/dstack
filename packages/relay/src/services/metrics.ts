import type { FastifyInstance } from 'fastify'
import client from 'prom-client'

export const peersMetric = new client.Gauge({
  name: 'webrtc_star_peers',
  help: 'peers online now'
})
export const dialsSuccessTotal = new client.Counter({
  name: 'webrtc_star_dials_total_success',
  help: 'successfully completed dials since relay started'
})
export const dialsFailureTotal = new client.Counter({
  name: 'webrtc_star_dials_total_failure',
  help: 'failed dials since relay started'
})
export const dialsTotal = new client.Counter({
  name: 'webrtc_star_dials_total',
  help: 'all dials since relay started'
})
export const joinsSuccessTotal = new client.Counter({
  name: 'webrtc_star_joins_total_success',
  help: 'successfully completed joins since relay started'
})
export const joinsFailureTotal = new client.Counter({
  name: 'webrtc_star_joins_total_failure',
  help: 'failed joins since relay started'
})
export const joinsTotal = new client.Counter({
  name: 'webrtc_star_joins_total',
  help: 'all joins since relay started'
})

export const setMetrics = (fastify: FastifyInstance) => {
  fastify.get('/metrics', async (req, res) => {
    res.header('Content-Type', client.contentType)
    res.send(await client.register.metrics())
  })
}
