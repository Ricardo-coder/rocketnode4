import { Request, Response } from 'express'
import { getCustomRepository, Not, IsNull } from 'typeorm'
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository'

class NpsController {
  async execute (request: Request, response: Response) {
    const { survey_id } = request.params

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    })

    const detractor = surveysUsers.filter(survey => survey.value >= 0 && survey.value <= 6).length
    const promoters = surveysUsers.filter(survey => survey.value >= 9 && survey.value <= 10).length
    const passive = surveysUsers.filter(survey => survey.value >= 7 && survey.value <= 8).length
    const total = surveysUsers.length

    const calculate = Number((((promoters - detractor) / total) * 100).toFixed(2))

    return response.json({
      detractor,
      promoters,
      passive,
      total,
      nps: calculate
    })
  }
}

export { NpsController }
