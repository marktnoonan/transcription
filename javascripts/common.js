var config = {
	apiKey: "AIzaSyD591s8Of9vqduC2ZAakt9mMQRin4wCFSQ",
	authDomain: "live-transcript.firebaseapp.com",
	databaseURL: "https://live-transcript.firebaseio.com",
	projectId: "live-transcript",
	storageBucket: "",
	messagingSenderId: "1024703297861"
};

var darkThemeOn = false;
var database;

function toggleDarkTheme() {
	if (darkThemeOn == false) {
		document.body.style.background = "#121212";
		document.body.style.color = "#ffffff";
		document.querySelector("header").style.backgroundColor = "#121212";
		if (document.querySelector(".credit")) {
			document.querySelector(".credit").style.color = "#ffffff";
		}
		darkThemeOn = true;
	} else {
		document.body.style.background = "#ffffff";
		document.body.style.color = "#000000";
		document.querySelector("header").style.backgroundColor = "#f0f8ff";
		if (document.querySelector(".credit")) {
			document.querySelector(".credit").style.color = "#000";
		}
		darkThemeOn = false;
	}
}

function fontMinus() {
	var transcript = document.querySelector("#transcript");
	var currentSize = parseFloat(window.getComputedStyle(transcript).fontSize);
	if (currentSize != 16) {
		transcript.style.fontSize =  (currentSize - 10 ) + 'px';
	}
}

function fontPlus() {
	var transcript = document.querySelector("#transcript");
	var currentSize = parseFloat(window.getComputedStyle(transcript).fontSize);
	if (currentSize != 76) {
		transcript.style.fontSize =  (currentSize + 10 ) + 'px';
	}
}


function toggleHeader() {
	var header = document.querySelector("header");
	console.log(header.classList.contains('hidden'))
	if (!header.classList.contains('hidden')) {
		header.classList.add('hidden')
	} else {
		header.classList.remove('hidden')
	}
}

function openForm() {
    const form = document.querySelector('.settings-box')
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden')
    }
}

function closeForm() {
    const form = document.querySelector('.settings-box')
    form.classList.add('hidden')
}

export { config, toggleDarkTheme, toggleHeader, fontMinus, fontPlus, openForm, closeForm };