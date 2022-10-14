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
	document.querySelector('body').classList.toggle('dark')
}

function fontMinus() {
	var transcript = document.querySelector("#transcript");
	var interim = document.querySelector("#interim")
	var currentSize = parseFloat(window.getComputedStyle(transcript).fontSize);
	if (currentSize != 16) {
		var newSize = (currentSize - 10 ) + 'px';
		transcript.style.fontSize =  newSize;
		interim.style.fontSize =  newSize;
	}
}

function fontPlus() {
	var transcript = document.querySelector("#transcript");
	var interim = document.querySelector("#interim")
	var currentSize = parseFloat(window.getComputedStyle(transcript).fontSize);
	if (currentSize != 76) {
		var newSize = (currentSize + 10 ) + 'px';
		transcript.style.fontSize =  newSize;
		interim.style.fontSize =  newSize;
	}
}

function toggleHeader() {
	var header = document.querySelector("header");
	header.classList.toggle('translate');
	var button = document.querySelector("#header-toggle-button");
	if (button.innerText == "Hide Header") {
		button.innerText = "Show Header";
	}
	else {
		button.innerText = "Hide Header";
	}
}

function exportToggle() {

	navigator.clipboard.writeText(document.querySelector('.transcript-export').textContent);

}

function nameToggle() {
	const about = document.querySelector('.about-box')
	const exporttext = document.querySelector(".export-box")
	const name = document.querySelector(".name-box")
	if (name.classList.contains('hidden')) {
		exporttext.classList.add('hidden');
		name.classList.remove('hidden');
		document.querySelector("#exit-popup").focus()
	} else {
		name.classList.add('hidden');
	}
}

function closePopup() {
	const name = document.querySelector(".name-box");
	if (!name.classList.contains('hidden'))  {
		name.classList.add('hidden');
	}
}

export { config, toggleDarkTheme, toggleHeader, fontMinus, fontPlus, closePopup, exportToggle, nameToggle };