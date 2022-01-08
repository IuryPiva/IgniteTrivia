import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { QuestionSnapshot } from "../../models/question/question"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import uuid from "react-native-uuid"
import { getGeneralApiProblem } from "./api-problem"

const API_PAGE_SIZE = 5

const convertQuestion = (raw: any): QuestionSnapshot => {
  const id = uuid.v1().toString()

  return {
    id: id,
    category: raw.category,
    type: raw.type,
    difficulty: raw.difficulty,
    question: raw.question,
    correctAnswer: raw.correct_answer,
    incorrectAnswers: raw.incorrect_answers,
  }
}
/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of trivia questions.
   */
  async getQuestions(): Promise<Types.GetQuestionsResult> {
    const response: ApiResponse<any> = await this.apisauce.get("", { amount: API_PAGE_SIZE })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawQuestions = response.data.results
      const convertedQuestions: QuestionSnapshot[] = rawQuestions.map(convertQuestion)
      console.tron.log(convertedQuestions.length)
      return { kind: "ok", questions: convertedQuestions }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
