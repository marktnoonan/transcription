firebase.initializeApp(config)
var database = firebase.database()
var transcriptID = ''
var transcriptIDForm = document.getElementById('transcriptIDForm')
var transcript = document.querySelector('#transcript')

transcriptIDForm.addEventListener('submit', function(event) {
	event.preventDefault()
	updateTranscriptID()
})

if (window.location.search) {
	document.getElementById(
		'newTranscriptID'
	).value = window.location.search.substr(1)
	updateTranscriptID()
}

function processUpdate(id) {
	database
		.ref('transcripts/' + transcriptID + '/' + id)
		.once('value')
		.then(function(snapshot) {
			document.getElementById(id).textContent = snapshot.val()
		})
}

function updateTranscriptID() {
	transcriptID = document.getElementById('newTranscriptID').value
	var snippetsArray = []
	document.querySelector('#transcript-id').textContent =
		'(ID: ' + transcriptID + ')'
	var transcriptRef = database.ref('transcripts/' + transcriptID)
	var htmlBuffer = ''

	transcriptRef.on('value', function(snapshot) {
		console.log('update')

		var snippets = snapshot.val()
		for (var snippet in snippets) {
			if (!snippetsArray.includes(snippet) && snippet !== 'just-updated') {
				snippetsArray.push(snippet)
				htmlBuffer +=
					'<span class="snippet" id="' +
					snippet +
					'">' +
					snippets[snippet] +
					'</span>'
				var snippetIterator = snippet.split('-')[1]
				if (snippetIterator === '0') {
					htmlBuffer += '<br />'
				}
				window.scrollTo(0, document.body.scrollHeight)
			} else if (snippet === 'just-updated') {
				if (document.getElementById(snippets[snippet])) {
					processUpdate(snippets[snippet])
				}
			}
		}
		transcript.innerHTML = htmlBuffer
		window.scrollTo(0, document.body.scrollHeight)
	})
}

function getAllWords() {
	var words = document.querySelectorAll('.snippet')
	return Array.prototype.map.call(words, function(snippet) {
		return snippet.textContent
	})
}

function translateText() {
	var yandexApiKey =
		'trnsl.1.1.20180130T012212Z.d0c7c8f7f3d14aa8.bf92828f085a7e1a17b6f83c774a5ca50e8fb7e5'
	var text = getAllWords()
	var xhr = new XMLHttpRequest()
	xhr.open(
		'GET',
		'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' +
			yandexApiKey +
			'&text=' +
			text.join('%20') +
			'&lang=en-es'
	)
	xhr.onload = function() {
		if (xhr.status === 200) {
			transcript.innerHTML = JSON.parse(xhr.responseText).text
		} else {
			alert('Request failed.  Returned status of ' + xhr.status)
		}
	}
	xhr.send()
}
