import React from "react"
import {useState, useEffect, useRef } from "react"
import Card from "./components/Card"
import { reconstruct } from "./helper"
import useSound from "use-sound"
import music from './assets/music.mp3'

export default function App() {
    const [isHomePage, setIsHomePage] = useState(true)
    //Dealing with category
    const [category, setCategory] = useState([])
    const [cateId, setCateId] = useState(0)
    //Dealing with data
    const [quizData, setQuizData] = useState([]) 
    const [answerData, setAnswerData] = useState([]) // should change this to useRef because
    //this answerData don't need to be rendered, then we can get rid of useEffect at the bottom
    // but I will left this as it as is a reminder.
    
    const [needRestart, setNeedRestart] = useState(0)
    //Scoring
    const [totalScore, setTotalScore] = useState({
        score:0,
        showScore:false
    })
    const [letsMusic] = useSound(music)

    function startQuiz() {
        setIsHomePage(false)
    }
    
    function restart() {
        setNeedRestart(current => current + 1)
        setTotalScore({score:0, showScore:false})
        setAnswerData([])
        setQuizData([])
        letsMusic()
    }

    const cate = category.map(cat => {
        return (
            <option value={cat.name} key={cat.id}>{cat.name}</option>
            )
    })
    
    
    function handleCheckAnswer() {  
        let score = 0
        for (let i = 0; i < answerData.length ; i++) {
            if (quizData[i].correct_answer === answerData[i].userAnswer) {
            score = score + 1
            }
        }
        setTotalScore({score:score, showScore:true})
        
    }
    function handleChange(e){
        setCateId(category.filter(cate => cate.name === e.target.value)[0].id)
    }
    
    useEffect(() => {
        
        fetch("https://opentdb.com/api_category.php")
        .then(res => res.json())
        .then(cate => setCategory(cate.trivia_categories))
        
    },[])
    
    let API = `https://opentdb.com/api.php?amount=5&category=${cateId}`
    useEffect(() => {
        fetch(API)
        .then(res => res.json()) 
        .then(data =>  setQuizData(reconstruct(data.results)))
    }, [cateId, needRestart])
    
       //if new answer replace the old one
    function handleChoiceClick(data, questionIndex) { 
        answerData.map(x=>x.questionIndex).includes(questionIndex)&&
        setAnswerData(current => {
            return current.filter(item => item.questionIndex !== questionIndex)
        })
        
        setAnswerData(current => {
            return [
                ...current, 
                {questionIndex:questionIndex, userAnswer:data}]
                .sort((a,b) => {
                    return a.questionIndex - b.questionIndex
            })
        }) 
    }
    useEffect(()=>{
        setQuizData(current => current.map((data,index) => Object.assign(data, {userAnswer:answerData[index]})))  
    },[answerData])
  
    const card = quizData.map((data, index) => {
        return (
            <Card 
                key={data.question} 
                question={data.question}
                correct_answer={data.correct_answer}
                shuffleAnswer={data.all_answer}
                handleChoiceClick={handleChoiceClick} 
                questionIdx={index}
                userAnswer={data.userAnswer === undefined?{userAnswer:false}:data.userAnswer}
                showScore={totalScore.showScore}
            />
        )
    })
    

    return (
        <div>
            <img className="orange" src="./orange.png"/>
            {isHomePage? 
            <div className="home-page">
                <img className="bigblue" src="./bigblue.png"/>
                <h1>Quizzy </h1>
                <p>Try your best to anwers these fun 5 question about</p>
                {category.length===0?
                    <p>Loading. . .</p>:
                    <select className="cate-selector" onChange={handleChange}>
                         {cate}
                    </select>}
                <button onClick={startQuiz} className="start-btn">Start Quiz </button>
            </div>:
            <div className="quiz-page">
                {card}
                <img className="blueblob" src="./blobs.png"/>
                <div className="check-btn-container"> 
                {totalScore.showScore && 
            <p className="score">You scored {totalScore.score}/{quizData.length} correct answers</p>}
                    {!totalScore.showScore?
                        (quizData.length?
                            <button
                            disabled={answerData.length !== quizData.length}
                            onClick={handleCheckAnswer}
                            className="check-btn">
                            Check Answer
                            </button>:
                            <p className="loading">Loading . . .</p>)
                            :
                    <button 
                    onClick={restart}
                    className="check-btn">
                       Restart
                    </button>
                    }
                
                     
                </div>
            </div>}
            
        </div>
    )
}

