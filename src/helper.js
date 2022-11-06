// Shuffle using Fisher-Yates (aka Knuth) algorithm.
function shuffle(array) {
    let currentIndex = array.length,  randomIndex
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]]
    }
return array
}

export function reconstruct(data) {
    return data.map(x => Object.assign(x, 
        {
            all_answer:shuffle([...x.incorrect_answers, x.correct_answer]),
            userAnswer:""
        })
    )
}