import { QuestionSnapshot } from "../../models/question/question"
import { GeneralApiProblem } from "./api-problem"

export type GetQuestionsResult = { kind: "ok"; questions: QuestionSnapshot[] } | GeneralApiProblem

