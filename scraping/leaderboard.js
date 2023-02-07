import { TEAMS, PRESIDENTS, writeDBFile } from '../db/index.js'
import { URLS, scrape } from './utils'

async function getLeaderBoard () {
  const $ = await scrape(URLS.leaderBoard)
  const $rows = $('table tbody tr')
  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
    concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  const getTeamFrom = ({ name }) => {
    const { presidentId, ...restOfTeam } = TEAMS.find((team) => team.name === name)
    const president = PRESIDENTS.find((president) => president.id === presidentId)
    return { ...restOfTeam, president }
  }

  const cleanText = (text) => text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  const leaderBoard = []
  $rows.each((_, el) => {
    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $(el).find(selector).text()
      const cleanedValue = cleanText(rawValue)

      const value = typeOf === 'number'
        ? Number(cleanedValue)
        : cleanedValue

      return [key, value]
    })

    const { team: teamName, ...leaderboardForTeam } = (Object.fromEntries(leaderBoardEntries))
    const team = getTeamFrom({ name: teamName })
    leaderBoard.push({
      ...leaderboardForTeam,
      team
    })
  })

  console.log('Scrape was successfull')
  return leaderBoard
}

const leaderBoard = await getLeaderBoard()

//  process.cwd() devuelve el working directory desde el que se ejecuta el script
await writeDBFile('leaderboard', leaderBoard)
