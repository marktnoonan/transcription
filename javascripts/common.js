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
	console.log(header.classList.contains('translate'));
	if (!header.classList.contains('translate')) {
		header.classList.add('translate');
	} else {
		header.classList.remove('translate');
	}
}

function settingsToggle() {
	const settings = document.querySelector('.settings-box')
	const about = document.querySelector('.about-box')
	const exporttext = document.querySelector(".export-box")
	const name = document.querySelector(".name-box")
    if (settings.classList.contains('hidden')) {
			settings.classList.remove('hidden');
			about.classList.add('hidden');
			exporttext.classList.add('hidden');
			name.classList.add('hidden');
    } else {
			settings.classList.add('hidden');
	}
}

function aboutToggle() {
	const settings = document.querySelector('.settings-box')
	const about = document.querySelector('.about-box')
	const exporttext = document.querySelector(".export-box")
	const name = document.querySelector(".name-box")
    if (about.classList.contains('hidden')) {
			settings.classList.add('hidden');
			about.classList.remove('hidden');
			exporttext.classList.add('hidden');
			name.classList.add('hidden');
    } else {
			about.classList.add('hidden');
	}
}

function exportToggle() {
	const settings = document.querySelector('.settings-box')
	const about = document.querySelector('.about-box')
	const exporttext = document.querySelector(".export-box")
	const name = document.querySelector(".name-box")
	if (exporttext.classList.contains('hidden')) {
		settings.classList.add('hidden');
		about.classList.add('hidden');
		exporttext.classList.remove('hidden');
		name.classList.add('hidden');
	} else {
		exporttext.classList.add('hidden');
	}
}

function nameToggle() {
	const settings = document.querySelector('.settings-box')
	const about = document.querySelector('.about-box')
	const exporttext = document.querySelector(".export-box")
	const name = document.querySelector(".name-box")
	if (name.classList.contains('hidden')) {
		settings.classList.add('hidden');
		about.classList.add('hidden');
		exporttext.classList.add('hidden');
		name.classList.remove('hidden');
	} else {
		name.classList.add('hidden');
	}
}

function closePopup() {
	const settings = document.querySelector('.settings-box')
	const about = document.querySelector('.about-box');
	const exportBox = document.querySelector(".export-box");
	const name = document.querySelector(".name-box");
	if (!settings.classList.contains('hidden') || !about.classList.contains('hidden') || !exportBox.classList.contains('hidden') || !name.classList.contains('hidden'))  {
		settings.classList.add('hidden');
		about.classList.add('hidden');
		exportBox.classList.add('hidden');
		name.classList.add('hidden');
	}
}

export { config, toggleDarkTheme, toggleHeader, fontMinus, fontPlus, settingsToggle, aboutToggle, closePopup, exportToggle, nameToggle };