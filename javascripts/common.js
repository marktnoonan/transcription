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
	console.log("I ran!");
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

export { config, darkThemeOn, toggleDarkTheme };
