const wordsToSayInput = document.getElementById('words-to-say')
let targetWords
let checkingWords = false

wordsToSayInput.addEventListener('keyup', ()  => {
    if (!checkingWords) {
        checkingWords = true    
    }
    targetWords = wordsToSayInput.value.split(' ')
})

function searchForWordInTranscript (word) {
    var wordsInTranscript = [].slice.call(transcript.getElementsByClassName('snippet')).map(el => el.textContent)
    if (wordsInTranscript.includes(word)) {
        window.alert('Nice job! You said "' + word + '"!')
        transcript.innerHTML = ''
    }
}

function checkWords () {
    if (targetWords.length) {
        targetWords.forEach((word) => {
            searchForWordInTranscript(word)
        })
    }
}
