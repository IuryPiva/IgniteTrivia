import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing } from "../../theme"
import { Question, useStores } from "../../models"
import { decodeHTMLEntities } from "../../utils/html-decode"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.lighterGrey,
  flex: 1,
  paddingHorizontal: spacing.large,
}

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.huge,
  marginBottom: spacing.medium,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}
const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: spacing.medium,
}

const ANSWER: TextStyle = {
  paddingVertical: spacing.smaller,
}

const ANSWER_WRAPPER: ViewStyle = {
  marginBottom: spacing.large,
}

export const QuestionScreen = observer(function QuestionScreen() {
  const [refreshing, setRefreshing] = useState(false)

  // Pull in one of our MST stores
  const { questionStore } = useStores()
  const { questions } = questionStore

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = () => {
    setRefreshing(true)
    questionStore.getQuestions()
    setRefreshing(false)
  }

  const renderQuestion = ({ item }) => {
    const question: Question = item

    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={decodeHTMLEntities(question.question)} />
        <View>
          {question.allAnswers.map((a, index) => {
            return (
              <View key={index} style={ANSWER_WRAPPER}>
                <Text style={ANSWER} text={decodeHTMLEntities(a)}></Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
  return (
    <Screen style={ROOT} preset="scroll">
      <View style={HEADER_CONTAINER}>
        <Text preset="header" tx="questionScreen.header" />
      </View>
      <FlatList
        style={QUESTION_LIST}
        data={questionStore.questions}
        renderItem={renderQuestion}
        extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
        keyExtractor={(item) => item.id}
        onRefresh={fetchQuestions}
        refreshing={refreshing}
      ></FlatList>
    </Screen>
  )
})
