// TODO: these globals could all quite happily live in an object called "liveTranscript" or something, to avoid getting in the global namespace.
// TODO: likewise, all these global functions can live in that object too.
// TODO: this whole script can move to its own file.
// TODO: we can establish stadards for the kind of JS permitted in the project. _This_ page requires chrome and could use most ES6+ features that are implemented in Chrome, but the observer page is targeted to any possible display that can run enough JS for firebase.
// TODO: Transcripts should be really simple to use and broadcast. But right now there is just read/write access to the DB for anyody who wants it. I would like to have no login whatsoever and still have the person who started a listening session ALWAYS remain in charge of it, so it couldn't be over written. There are probably many ways to do it. Right now if I am recording a named transcript, and somebody else names their transcript the same name as mine, we are both then feeding into the same exact DB location. That's dumb. But there are cases where you WOULD want to resume an existing named transcript at right now you just type in the name and pick up where you left off. Really curious to see how we can make this "just work" by maybe caching something in a cookie or local storage or whatever.
// TODO: I haven't dug into Zenscroll enough to know how it handles being called repeatedly, but sometimes I see jankyness and we may need to look at how to only call Zenscroll if we are not already scrolling. My naive version of that didn't work as expected.

var transcript = document.querySelector('#transcript')
var transcriptID = ''
var snippetIDs = []
var listening = false
var wordsPushedToTranscript = 0
var charLengthOfPushes = 0
var currentLineID = ''
var lastResultCache = ''
var observeLinkRoot = 'https://markthomasnoonan.com/transcription/observe.html'
var scrolling = false
var transcriptStartTime = ''
var haveListenedOnce = false

function getExport() {
	var text = exportCurrentTranscript()
	console.log(text)
}

function exportCurrentTranscript() {
	var transcriptExportAsJSON = {}
	var lines = Array.from(transcript.querySelectorAll('div'))
	lines.forEach(function(line) {
		var lineContent = Array.from(line.querySelectorAll('span'))
			.map(line => line.textContent)
			.join(' ')
		var msSinceStart = Number(line.id.substr(4)) - Number(transcriptStartTime)

		transcriptExportAsJSON[msSinceStart] = lineContent
	})
	return JSON.stringify(transcriptExportAsJSON)
}

function getSubTime(timeInMs) {
	var hours = Math.floor(timeInMs / (1000 * 60 * 60))
	var hh = hours > 9 ? hours : '0' + hours

	var minutes = Math.floor((timeInMs - hours * 60 * 60 * 1000) / (1000 * 60))
	var mm = minutes > 9 ? minutes : '0' + minutes
	debugger
	var seconds = Math.floor(
		(timeInMs - (hours * 60 * 60 * 1000 - minutes * 60 * 1000)) / 1000
	)
	var ss = seconds > 9 ? seconds : '0' + seconds

	var milliseconds = Math.floor(
		timeInMs - (hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000)
	)
	var ms =
		milliseconds > 9
			? milliseconds.toString().substring(0, 2)
			: '0' + milliseconds

	return hh + ':' + mm + ':' + ss + '.' + ms
}

function convertToSubFormat(transcriptAsJson) {
	var subText = ''
	var previousEndTime = '00:00:00.00'

	for (var line in transcriptAsJson) {
		subText += '\n' + previousEndTime
		subText += line
	}
	return subText
}

if (document.getElementById('transcriptIDForm')) {
	document
		.getElementById('transcriptIDForm')
		.addEventListener('submit', function(event) {
			event.preventDefault()
			saveTranscriptID()
		})
}

var recognition = new (window.SpeechRecognition ||
	window.webkitSpeechRecognition ||
	window.mozSpeechRecognition ||
	window.msSpeechRecognition)()
recognition.lang = 'en-US'
recognition.interimResults = true
recognition.maxAlternatives = 1
var interim = document.querySelector('#interim')

//TODO: refactor this onresult function for clarity. Especially, just extract it and give it a name so that it's just recognition.onresult = manageInterimResults or something... most of the blocks in this function could be given their own name.
recognition.onresult = function(event) {
	if (!currentLineID) {
		currentLineID = Date.now() // this is what we will really use to handle "replay" timing I think. - Mark
		line = document.createElement('div')
		line.id = 'line' + currentLineID
		transcript.appendChild(line)
	}

	var resultText = event.results[0][0].transcript
	var resultWords = resultText.split(' ')
	var minLengthNeeded = 10 + wordsPushedToTranscript

	if (resultWords.length > minLengthNeeded) {
		var wordsToPush = []
		for (
			var i = wordsPushedToTranscript;
			i < wordsPushedToTranscript + 5;
			i++
		) {
			wordsToPush.push(resultWords[i])
		}
		pushWordsToTranscript(wordsToPush)
		wordsPushedToTranscript += 5

		charLengthOfPushes += wordsToPush.join(' ').length
	}
	if (charLengthOfPushes) {
		// the math here is to include the correct number of spaces in what we are removing from the
		// beginning of the string. The goal is to not have the bottom fill up with text, obscuring the main
		// part of the screen but also forcing people who are watching the the stream to wait for
		// a pause so that the transcript can catch up.
		interim.textContent = resultText.substring(
			charLengthOfPushes + wordsPushedToTranscript / 5
		)
		lastResultCache = resultText.substring(
			charLengthOfPushes + wordsPushedToTranscript / 5
		)
	} else {
		interim.textContent = resultText
		lastResultCache = resultText
	}
	zenscroll.toY(document.body.scrollHeight, 1500)
}

// TODO: name, extract, and refactor the on-end function for clarity. Maybe I should comment some of the weirder stuff here to explain its purpose better.
recognition.onend = function(event) {
	if (lastResultCache != '') {
		var words = lastResultCache.split(' ')
		var numWords = words.length
		if (!line) {
			line = document.createElement('div')
		}
		var snippetIdRoot = Date.now()
		for (var i = 0; i < words.length; i++) {
			var snippetID = 'snippet' + snippetIdRoot + '-' + i
			var span = document.createElement('span')
			span.className = 'snippet'
			span.id = snippetID
			span.setAttribute('contenteditable', 'true')
			span.append(words[i])
			line.appendChild(span)
			addEditingListener(snippetID, span)
		}

		if (transcriptID !== '') {
			snippetIDs.push(snippetID)
			database
				.ref('transcripts/' + transcriptID + '/' + snippetIdRoot)
				.set(words.join('|'), completion)
		}

		interim.textContent = ''
		lastResultCache = ''
		wordsPushedToTranscript = 0
		charLengthOfPushes = 0
		currentLineID = ''
		line = null
	}

	if (listening === false) {
		return
	} else {
		zenscroll.toY(document.body.scrollHeight, 2000)
		recognition.start()
	}
}

// TODO: remove logging. Give a more descriptive name than toggle, since we have this toggle for using the mic, and another for using the light/dark themes.
function toggle() {
	if (!haveListenedOnce) {
		haveListenedOnce = true
		transcriptStartTime = Date.now()
		console.log('transcript started at ' + transcriptStartTime)
	}

	listening = !listening

	document.querySelector('#status').textContent = 'Listening'
	Array.from(document.getElementsByClassName('startListen')).map(function(
		element
	) {
		element.setAttribute('style', listening ? 'display:none' : 'display:inline')
	})
	Array.from(document.getElementsByClassName('stopListen')).map(function(
		element
	) {
		element.setAttribute('style', listening ? 'display:inline' : 'display:none')
	})
	if (!listening) {
		recognition.stop()
		interim.textContent = ''
		document.querySelector('#status').textContent = 'Not Listening'
	} else {
		recognition.start()
		document.querySelector('#status').textContent = 'Listening'
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
		addEditingListener(snippetID, span)
		line.appendChild(span)
	}
	if (transcriptID !== '') {
		snippetIDs.push(snippetID)
		database
			.ref('transcripts/' + transcriptID + '/' + snippetIdRoot)
			.set(arrayOfWords.join('|'), completion)
	}
}
// TODO I think I can make this a little clearer.
function saveTranscriptID() {
	firebase.initializeApp(config)
	database = firebase.database()

	transcriptID = document.getElementById('newTranscriptID').value
	var observeLink = observeLinkRoot + '?' + transcriptID
	document.getElementById('name-transcript').innerHTML = ''
	document.getElementById('transcriptIDForm').innerHTML =
		'Link for others to watch: <a href="' +
		observeLink +
		'" target="_blank">' +
		observeLink +
		'</a>'
}

function addEditingListener(editedID, newElement) {
	var textChanged = false
	var blurListenerAdded = false
	var element = newElement
	//document.getElementById(editedID);
	element.addEventListener('click', selectWord)
	element.addEventListener('focus', selectWord)

	// TODO: name and extract this function that runs on keydown
	element.addEventListener('keydown', function(e) {
		// esc and enter should confirm the edited word
		if (e.keyCode == 27) {
			element.blur()
			window.getSelection().removeAllRanges()
		} else if (e.keyCode == 13) {
			element.blur()
			e.preventDefault()
			window.getSelection().removeAllRanges()
		}

		if (
			(!textChanged && e.keyCode == 9) ||
			(!textChanged && e.shiftKey && e.keyCode == 9)
		) {
			// do nothing - there must be a better way to express this!
			// TODO: rewrite this conditional to be more clear. Maybe using something more obvious than the keycodes would be a good start?
		} else if (!blurListenerAdded && transcriptID !== '') {
			textChanged = true
			blurListenerAdded = true
			addBlurListener()
		}
	})

	function addBlurListener() {
		element.addEventListener('blur', function(e) {
			var newText = element.textContent
			// database
			// 	.ref('transcripts/' + transcriptID + '/' + editedID)
			// 	.set(newText, completion)
			// database
			// 	.ref('transcripts/' + transcriptID + '/just-updated')
			// 	.set(editedID, completion)
		})
	}

	// TODO: This came from a stackoverflow answer and seems to work just fine, but I'm open to any other/better ways of selecting a word when it is clicked on so that the user can replace it just by typing.
	function selectWord() {
		var range, selection
		if (window.getSelection && document.createRange) {
			selection = window.getSelection()
			range = document.createRange()
			range.selectNodeContents(this)
			selection.removeAllRanges()
			selection.addRange(range)
		} else if (document.selection && document.body.createTextRange) {
			range = document.body.createTextRange()
			range.moveToElementText(this)
			range.select()
		}
	}
}

// TODO: rename this. It's just the callback that runs when firebase is done saving what we put in there. Maybe call it firebaseCompletion or something is better?
function completion(error) {
	console.log('completed')
	if (error) {
		console.log('Data could not be saved.' + error)
	} else {
		console.log('Data saved successfully.')
	}
}
