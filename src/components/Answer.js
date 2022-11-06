import React from "react"
import parse from 'html-react-parser'
import useSound from "use-sound"
import ding from "../assets/ding.mp3"

export default function Answer(props) {
    const choiceStyle = () => {
        // if ((props.correct_answer === props.userAnswer.userAnswer) && ((props.correct_answer === props.shuffleAnswer))) {
        //     return "choice-correcto"
        // }
        // else 
        if((props.shuffleAnswer === props.userAnswer.userAnswer) && ((props.correct_answer !== props.userAnswer.userAnswer))) {
            return "choice-wrong"
        }else if((props.shuffleAnswer === props.correct_answer) && ( props.correct_answer !== props.userAnswer  )) {
            return "choice-correct"
        }else return "choice-fade"
    }
    
    const clickStyle = () => {
        if (props.shuffleAnswer === props.userAnswer.userAnswer) {
            return 'choice-clicked'
        }else return 'choice'
    }
      
    const [letsDing] = useSound(ding) 
    
    return (
        <div> 
        {props.showScore?
        <button 
            className={choiceStyle()}>
            {parse(props.shuffleAnswer)}
        </button>:
        <button 
            onClick={() => {
                letsDing()
                props.handleChoiceClick(props.shuffleAnswer, props.questionIdx)}}
            className={clickStyle()}>
            {parse(props.shuffleAnswer)}
        </button>}
        </div>
    )
}
