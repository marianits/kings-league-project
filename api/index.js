import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import presidents from '../db/presidents.json'
import teams from '../db/teams.json'

const app = new Hono()

app.get('/', (ctx) => ctx.json([
  {
    endpoint: '/leaderboard',
    description: 'Returns the Kings League leaderboard'
  },
  {
    endpoint: '/presidents',
    description: 'Returns the Kings League presidents'
  },
  {
    endpoint: '/teams',
    description: 'Returns the Kings League teams'
  }
]))

app.get('/leaderboard', (ctx) => {
  return ctx.json(leaderboard)
})

app.get('/presidents', (ctx) => {
  return ctx.json(presidents)
})

app.get('/presidents/:id', (ctx) => {
  const id = ctx.req.param('id')
  const foundPresident = presidents.find(president => president.id === id)
  return foundPresident
    ? ctx.json(foundPresident)
    : ctx.json({ message: 'President not found' }, 404)
})

app.get('/teams', (ctx) => {
  return ctx.json(teams)
})

app.get('/leaderboard/:teamId', (ctx) => {
  const teamId = ctx.req.param('teamId')
  const foundTeam = leaderboard.find((stats) => stats.team.id === teamId)

  return foundTeam ? ctx.json(foundTeam) : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/static/*', serveStatic({ root: './' }))

app.notFound((c) => {
  const { pathname } = new URL(c.req.url)
  if (c.req.url.at(-1) === '/') {
    return c.redirect(pathname.slice(0, -1))
  }
  return c.json({ message: 'Not Found' }, 404)
})

export default app
