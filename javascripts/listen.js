// TODO: these globals could all quite happily live in an object called "liveTranscript" or something, to avoid getting in the global namespace.
// TODO: likewise, all these global functions can live in that object too.
// TODO: this whole script can move to its own file.
// TODO: we can establish stadards for the kind of JS permitted in the project. _This_ page requires chrome and could use most ES6+ features that are implemented in Chrome, but the observer page is targeted to any possible display that can run enough JS for firebase.
// TODO: Transcripts should be really simple to use and broadcast. But right now there is just read/write access to the DB for anyody who wants it. I would like to have no login whatsoever and still have the person who started a listening session ALWAYS remain in charge of it, so it couldn't be over written. There are probably many ways to do it. Right now if I am recording a named transcript, and somebody else names their transcript the same name as mine, we are both then feeding into the same exact DB location. That's dumb. But there are cases where you WOULD want to resume an existing named transcript at right now you just type in the name and pick up where you left off. Really curious to see how we can make this "just work" by maybe caching something in a cookie or local storage or whatever.
// TODO: I haven't dug into Zenscroll enough to know how it handles being called repeatedly, but sometimes I see jankyness and we may need to look at how to only call Zenscroll if we are not already scrolling. My naive version of that didn't work as expected.

import { config, darkThemeOn, toggleDarkTheme } from "./common";
import zenscroll from "zenscroll";

// ----------------------------------------------------------------------------
// Create a singleton to hold global variables.
//
// "flt" stands for "free live transcript."
var flt = {
  database: null,
  transcript: document.querySelector("#transcript"),
  transcriptID: "",
  snippetIDs: [],
  listening: false,
  wordsPushedToTranscript: 0,
  charLengthOfPushes: 0,
  currentLineID: "",
  lastResultCache: "",
  observeLinkRoot: "https://markthomasnoonan.com/transcription/observe.html",
  //    scrolling: false,
  transcriptStartTime: "",
  haveListenedOnce: false,
  line: null,
  recognition: null,
  interim: null
};
// ----------------------------------------------------------------------------
flt.getExport = function() {
  if (flt.listening) {
    // important, cause things go crazy if we're still adding to the transcript after export.
    flt.toggle();
  }
  var wrapper = document.createElement("div");
  wrapper.innerHTML = "<hr><b>Transcript in JSON format:<b>";
  var text = flt.exportCurrentTranscript();
  var textArea = document.createElement("textarea");
  textArea.textContent = text;
  textArea.setAttribute("class", "transcript-export");
  wrapper.appendChild(textArea);
  flt.transcript.appendChild(wrapper);
};
// ----------------------------------------------------------------------------
flt.exportCurrentTranscript = function() {
  var transcriptExportAsJSON = {};
  var lines = Array.from(flt.transcript.querySelectorAll("div"));
  lines.forEach(function(line) {
    var lineContent = Array.from(line.querySelectorAll("span"))
      .map(line => line.textContent)
      .join(" ");
    var msSinceStart =
      Number(line.id.substr(4)) - Number(flt.transcriptStartTime);

    transcriptExportAsJSON[msSinceStart] = lineContent;
  });
  return JSON.stringify(transcriptExportAsJSON);
};
// ----------------------------------------------------------------------------
flt.getSubTime = function(timeInMs) {
  var hours = Math.floor(timeInMs / (1000 * 60 * 60));
  var hh = hours > 9 ? hours : "0" + hours;

  var minutes = Math.floor((timeInMs - hours * 60 * 60 * 1000) / (1000 * 60));
  var mm = minutes > 9 ? minutes : "0" + minutes;
  debugger;
  var seconds = Math.floor(
    (timeInMs - (hours * 60 * 60 * 1000 - minutes * 60 * 1000)) / 1000
  );
  var ss = seconds > 9 ? seconds : "0" + seconds;

  var milliseconds = Math.floor(
    timeInMs - (hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000)
  );
  var ms =
    milliseconds > 9
      ? milliseconds.toString().substring(0, 2)
      : "0" + milliseconds;

  return hh + ":" + mm + ":" + ss + "." + ms;
};
// ----------------------------------------------------------------------------
flt.convertToSubFormat = function(transcriptAsJson) {
  var subText = "";
  var previousEndTime = "00:00:00.00";

  for (var line in transcriptAsJson) {
    subText += "\n" + previousEndTime;
    subText += line;
  }
  return subText;
};
// ----------------------------------------------------------------------------
if (document.getElementById("transcriptIDForm")) {
  document
    .getElementById("transcriptIDForm")
    .addEventListener("submit", function(event) {
      event.preventDefault();
      flt.saveTranscriptID();
    });
}

// ----------------------------------------------------------------------------
flt.recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();
flt.recognition.lang = document.getElementById("select-language").value;
flt.recognition.interimResults = true;
flt.recognition.maxAlternatives = 1;
flt.interim = document.querySelector("#interim");

//TODO: refactor this onresult function for clarity. Especially, just extract it and give it a name so that it's just recognition.onresult = manageInterimResults or something... most of the blocks in this function could be given their own name.
flt.recognition.onresult = function(event) {
  if (!flt.currentLineID) {
    flt.currentLineID = Date.now(); // this is what we will really use to handle "replay" timing I think. - Mark
    flt.line = document.createElement("div");
    flt.line.id = "line" + flt.currentLineID;
    flt.transcript.appendChild(flt.line);
  }

  var resultText = event.results[0][0].transcript;
  var resultWords = resultText.split(" ");
  var minLengthNeeded = 10 + flt.wordsPushedToTranscript;

  if (resultWords.length > minLengthNeeded) {
    var wordsToPush = [];
    for (
      var i = flt.wordsPushedToTranscript;
      i < flt.wordsPushedToTranscript + 5;
      i++
    ) {
      wordsToPush.push(resultWords[i]);
    }
    flt.pushWordsToTranscript(wordsToPush);
    flt.wordsPushedToTranscript += 5;

    flt.charLengthOfPushes += wordsToPush.join(" ").length;
  }
  if (flt.charLengthOfPushes) {
    // the math here is to include the correct number of spaces in what we are removing from the
    // beginning of the string. The goal is to not have the bottom fill up with text, obscuring the main
    // part of the screen but also forcing people who are watching the the stream to wait for
    // a pause so that the transcript can catch up.
    flt.interim.textContent = resultText.substring(
      flt.charLengthOfPushes + flt.wordsPushedToTranscript / 5
    );
    flt.lastResultCache = resultText.substring(
      flt.charLengthOfPushes + flt.wordsPushedToTranscript / 5
    );
  } else {
    flt.interim.textContent = resultText;
    flt.lastResultCache = resultText;
  }
  zenscroll.toY(document.body.scrollHeight, 1500);
};
// ----------------------------------------------------------------------------
// TODO: name, extract, and refactor the on-end function for clarity. Maybe I should comment some of the weirder stuff here to explain its purpose better.
flt.recognition.onend = function(event) {
  if (flt.lastResultCache != "") {
    var words = flt.lastResultCache.split(" ");
    var numWords = words.length;
    if (!flt.line) {
      flt.line = document.createElement("div");
    }
    var snippetIdRoot = Date.now();
    for (var i = 0; i < words.length; i++) {
      var snippetID = "snippet" + snippetIdRoot + "-" + i;
      var span = document.createElement("span");
      span.className = "snippet";
      span.id = snippetID;
      span.setAttribute("contenteditable", "true");
      span.append(words[i]);
      flt.line.appendChild(span);
      flt.addEditingListener(snippetID, span);
    }

    if (flt.transcriptID !== "") {
      flt.snippetIDs.push(snippetID);
      flt.database
        .ref("transcripts/" + flt.transcriptID + "/" + snippetIdRoot)
        .set(flt.recognition.lang + "|" + words.join("|"), flt.completion);
    }

    flt.interim.textContent = "";
    flt.lastResultCache = "";
    flt.wordsPushedToTranscript = 0;
    flt.charLengthOfPushes = 0;
    flt.currentLineID = "";
    flt.line = null;
  }

  if (flt.listening === false) {
    return;
  } else {
    zenscroll.toY(document.body.scrollHeight, 2000);
    flt.recognition.start();
  }
};
// ----------------------------------------------------------------------------
// TODO: remove logging. Give a more descriptive name than toggle, since we have this toggle for using the mic, and another for using the light/dark themes.
flt.toggle = function() {
  if (!flt.haveListenedOnce) {
    flt.haveListenedOnce = true;
    flt.transcriptStartTime = Date.now();
    console.log("transcript started at " + flt.transcriptStartTime);
  }

  flt.listening = !flt.listening;

  var domStatus = document.querySelector("#status");
  domStatus.textContent = "Listening";
  domStatus.setAttribute("class", "live");

  Array.from(document.getElementsByClassName("startListen")).map(function(
    element
  ) {
    element.setAttribute(
      "style",
      flt.listening ? "display:none" : "display:inline"
    );
  });
  Array.from(document.getElementsByClassName("stopListen")).map(function(
    element
  ) {
    element.setAttribute(
      "style",
      flt.listening ? "display:inline" : "display:none"
    );
  });
  if (!flt.listening) {
    flt.recognition.stop();
    flt.interim.textContent = "";
    domStatus.textContent = "Not Listening";
    domStatus.setAttribute("class", "dead");
  } else {
    flt.recognition.start();
    domStatus.textContent = "Listening";
    domStatus.setAttribute("class", "live");
  }
};
// ----------------------------------------------------------------------------
flt.pushWordsToTranscript = function(arrayOfWords) {
  var snippetIdRoot = Date.now();
  for (var i = 0; i < arrayOfWords.length; i++) {
    var snippetID = "snippet" + snippetIdRoot + "-" + i;
    var span = document.createElement("span");
    span.className = "snippet";
    span.id = snippetID;
    span.setAttribute("contenteditable", "true");
    span.append(arrayOfWords[i]);
    flt.addEditingListener(snippetID, span);
    flt.line.appendChild(span);
  }
  if (flt.transcriptID !== "") {
    flt.snippetIDs.push(snippetID);
    flt.database
      .ref("transcripts/" + flt.transcriptID + "/" + snippetIdRoot)
      .set(arrayOfWords.join("|"), flt.completion);
  }
};
// ----------------------------------------------------------------------------
// TODO I think I can make this a little clearer.
flt.saveTranscriptID = function() {
  firebase.initializeApp(config);
  flt.database = firebase.database();

  flt.transcriptID = document.getElementById("newTranscriptID").value;
  var observeLink = flt.observeLinkRoot + "?" + flt.transcriptID;
  document.getElementById("name-transcript").innerHTML = "";
  document.getElementById("transcriptIDForm").innerHTML =
    'Link for others to watch: <a href="' +
    observeLink +
    '" target="_blank">' +
    observeLink +
    "</a>";
};
// ----------------------------------------------------------------------------
flt.addEditingListener = function(editedID, newElement) {
  var textChanged = false;
  var blurListenerAdded = false;
  var element = newElement;
  //document.getElementById(editedID);
  element.addEventListener("click", selectWord);
  element.addEventListener("focus", selectWord);

  // TODO: name and extract this function that runs on keydown
  element.addEventListener("keydown", function(e) {
    // esc and enter should confirm the edited word
    if (e.keyCode == 27) {
      element.blur();
      window.getSelection().removeAllRanges();
    } else if (e.keyCode == 13) {
      element.blur();
      e.preventDefault();
      window.getSelection().removeAllRanges();
    }

    if (
      (!textChanged && e.keyCode == 9) ||
      (!textChanged && e.shiftKey && e.keyCode == 9)
    ) {
      // do nothing - there must be a better way to express this!
      // TODO: rewrite this conditional to be more clear. Maybe using something more obvious than the keycodes would be a good start?
    } else if (!blurListenerAdded && flt.transcriptID !== "") {
      textChanged = true;
      blurListenerAdded = true;
      addBlurListener();
    }
  });

  function addBlurListener() {
    element.addEventListener("blur", function(e) {
      var newText = element.textContent;
      var editedTimestamp = editedID.substr(7, 13);
      var editedIndex = editedID.split("-")[1];
      flt.database
        .ref("transcripts/" + flt.transcriptID + "/" + editedTimestamp)
        .once("value")
        .then(function(snapshot) {
          var lineAsArry = snapshot.val().split("|");
          lineAsArry[editedIndex] = newText;
          var updatedLine = lineAsArry.join("|");
          flt.database
            .ref("transcripts/" + flt.transcriptID + "/" + editedTimestamp)
            .set(updatedLine, flt.completion);
          flt.database
            .ref("transcripts/" + flt.transcriptID + "/just-updated")
            .set(editedTimestamp, flt.completion);
        });
    });
  }

  // TODO: This came from a stackoverflow answer and seems to work just fine, but I'm open to any other/better ways of selecting a word when it is clicked on so that the user can replace it just by typing.
  function selectWord() {
    var range, selection;
    if (window.getSelection && document.createRange) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(this);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(this);
      range.select();
    }
  }
};
// ----------------------------------------------------------------------------
// TODO: rename this. It's just the callback that runs when firebase is done saving what we put in there. Maybe call it firebaseCompletion or something is better?
flt.completion = function(error) {
  console.log("completed");
  if (error) {
    console.log("Data could not be saved." + error);
  } else {
    console.log("Data saved successfully.");
  }
};
// ----------------------------------------------------------------------------
// init will add all our listeners and do any other set up that we need.
function init() {
  document
    .querySelector("#theme-toggle")
    .addEventListener("click", toggleDarkTheme);

  document
    .querySelector("#select-language")
    .addEventListener("change", function(event) {
      flt.recognition.lang = event.target.value;
    });
}
Array.from(document.querySelectorAll(".listen-toggle")).forEach(element => {
  element.addEventListener("click", flt.toggle);
});
document
  .querySelector("#export-button")
  .addEventListener("click", flt.getExport);

init();
