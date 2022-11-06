import React from "react"
import parse from 'html-react-parser' // dealing with weird html special character(/*"")
import Answer from "./Answer"


export default function Card(props) {
    const answerElement = props.shuffleAnswer.map((answer,index)=> {
        return (
            <Answer
            key={index}
            shuffleAnswer={answer}
            correct_answer={props.correct_answer}
            handleChoiceClick={props.handleChoiceClick}
            questionIdx={props.questionIdx}
            showScore={props.showScore}
            userAnswer={props.userAnswer}
     
        />
        )
    })
        
            
    return (
        <div className="card">
            <h3 className="question">{parse(props.question)}</h3>
            <div className="choice-container">
                {answerElement}
            </div>
            <hr/>
        </div>
    )
}