var transcript = document.querySelector('#transcript')
var transcriptID = ''
var darkThemeOn = false
var transcriptStartTime = ''
var haveListenedOnce = false
var exampleJSON = {
	'1319': "let's see how json stringify works with it",
	'11310': 'if I add more text I get more words',
	'17192':
		'not let me figure out the time after that I  I need to replay on the other side'
}

function playTranscript() {
	transcript.innerHTML = 'Starting subtitles <br>'
	const transcriptJsonStr = JSON.parse(
		document.querySelector('#paste-transcript').value
	)
	const numberOfLines = Object.keys(transcriptJsonStr).length
	let progressThroughLines = 0

	function scheduleLinesToBeAddedToPage(transcriptJsonStr, timestamp) {
		setTimeout(function() {
			line = document.createElement('div')
			var seconds = Math.floor((timestamp / 1000) % 60)
			line.innerHTML =
				'<span style="color: grey; font-size: 0.6em">' + seconds + '</span> '
			line.append(transcriptJsonStr[timestamp])
			transcript.appendChild(line)
			zenscroll.toY(document.body.scrollHeight, 1500)
			progressThroughLines++
			console.log(numberOfLines, progressThroughLines)
			if (progressThroughLines === numberOfLines) {
				console.log("I'm going to repeat in 25s.") // needs to be user-configureable, obviously! TODO
				setTimeout(function() {
					playTranscript()
				}, 23000)
			}
		}, Number(timestamp))
	}

	for (let timestamp in transcriptJsonStr) {
		console.log(Number(timestamp), transcriptJsonStr[timestamp])
		scheduleLinesToBeAddedToPage(transcriptJsonStr, timestamp)
	}
}

function pushWordsToTranscript(arrayOfWords) {
	var snippetIdRoot = Date.now()
	for (var i = 0; i < arrayOfWords.length; i++) {
		var snippetID = 'snippet' + snippetIdRoot + '-' + i
		var span = document.createElement('span')
		span.className = 'snippet'
		span.id = snippetID
		span.setAttribute('contenteditable', 'true')
		span.append(arrayOfWords[i])
		if (transcriptID !== '') {
			snippetIDs.push(snippetID)
			database
				.ref('transcripts/' + transcriptID + '/' + snippetID)
				.set(arrayOfWords[i], completion)
		}
		addEditingListener(snippetID, span)

		line.appendChild(span)
	}
}

function toggleDarkTheme() {
	if (darkThemeOn == false) {
		document.body.style.background = '#121212'
		document.body.style.color = '#ffffff'
		document.querySelector('header').style.backgroundColor = '#121212'
		darkThemeOn = true
	} else {
		document.body.style.background = '#ffffff'
		document.body.style.color = '#000000'
		document.querySelector('header').style.backgroundColor = '#f0f8ff'
		darkThemeOn = false
	}
}
