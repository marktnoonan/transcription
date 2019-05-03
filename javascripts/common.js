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

export { config, toggleDarkTheme, toggleHeader, fontMinus, fontPlus };


// function fontChanger() {
// 	var currentSize = window.getComputedStyle(words).fontSize;
// 	switch (currentSize) {
// 	  case '25px':
// 		words.style.fontSize = '50px';
// 		break;
// 	  case '50px':
// 		words.style.fontSize = '75px';
// 		break;
// 	  case '75px':
// 		words.style.fontSize = '25px';
// 		break;
// 	}
//   }