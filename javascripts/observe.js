firebase.initializeApp(config);
var database = firebase.database();
var transcriptRef;
var transcriptID = "";
var mostRecentSnippetTime = "";
var transcriptIDForm = document.getElementById("transcriptIDForm");
var transcript = document.querySelector("#transcript");
var translating = false;
var languageSelect = document.querySelector("#language-select");
var sourceLanguage = "";
var yandexApiKey =
  "trnsl.1.1.20180130T012212Z.d0c7c8f7f3d14aa8.bf92828f085a7e1a17b6f83c774a5ca50e8fb7e5";
var yandexLangs = {
  af: "Afrikaans",
  am: "Amharic",
  ar: "Arabic",
  az: "Azerbaijani",
  ba: "Bashkir",
  be: "Belarusian",
  bg: "Bulgarian",
  bn: "Bengali",
  bs: "Bosnian",
  ca: "Catalan",
  ceb: "Cebuano",
  cs: "Czech",
  cy: "Welsh",
  da: "Danish",
  de: "German",
  el: "Greek",
  en: "English",
  eo: "Esperanto",
  es: "Spanish",
  et: "Estonian",
  eu: "Basque",
  fa: "Persian",
  fi: "Finnish",
  fr: "French",
  ga: "Irish",
  gd: "Scottish Gaelic",
  gl: "Galician",
  gu: "Gujarati",
  he: "Hebrew",
  hi: "Hindi",
  hr: "Croatian",
  ht: "Haitian",
  hu: "Hungarian",
  hy: "Armenian",
  id: "Indonesian",
  is: "Icelandic",
  it: "Italian",
  ja: "Japanese",
  jv: "Javanese",
  ka: "Georgian",
  kk: "Kazakh",
  km: "Khmer",
  kn: "Kannada",
  ko: "Korean",
  ky: "Kyrgyz",
  la: "Latin",
  lb: "Luxembourgish",
  lo: "Lao",
  lt: "Lithuanian",
  lv: "Latvian",
  mg: "Malagasy",
  mhr: "Mari",
  mi: "Maori",
  mk: "Macedonian",
  ml: "Malayalam",
  mn: "Mongolian",
  mr: "Marathi",
  mrj: "Hill Mari",
  ms: "Malay",
  mt: "Maltese",
  my: "Burmese",
  ne: "Nepali",
  nl: "Dutch",
  no: "Norwegian",
  pa: "Punjabi",
  pap: "Papiamento",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  si: "Sinhalese",
  sk: "Slovak",
  sl: "Slovenian",
  sq: "Albanian",
  sr: "Serbian",
  su: "Sundanese",
  sv: "Swedish",
  sw: "Swahili",
  ta: "Tamil",
  te: "Telugu",
  tg: "Tajik",
  th: "Thai",
  tl: "Tagalog",
  tr: "Turkish",
  tt: "Tatar",
  udm: "Udmurt",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  xh: "Xhosa",
  yi: "Yiddish",
  zh: "Chinese"
};

languageSelect.addEventListener("change", function() {
  translating = false;
});

transcriptIDForm.addEventListener("submit", function(event) {
  event.preventDefault();
  updateTranscriptID();
});

if (window.location.search && !transcriptID) {
  document.getElementById(
    "newTranscriptID"
  ).value = window.location.search.substr(1);
  updateTranscriptID();
}

function processUpdate(id) {
  database
    .ref("transcripts/" + transcriptID + "/" + id)
    .once("value")
    .then(function(snapshot) {
      if (!translating) {
        document.getElementById(id).textContent = snapshot.val();
      }
    });
}

function updateTranscriptID() {
  transcriptID = document.getElementById("newTranscriptID").value;
  transcriptRef = database.ref("transcripts/" + transcriptID);
  getPreExistingTranscript();
}

function getPreExistingTranscript() {
  var snippetsArray = [];
  document.querySelector("#transcript-id").textContent =
    "(ID: " + transcriptID + ")";
  var htmlBuffer = "";

  transcriptRef.once("value").then(function(snapshot) {
    console.log("initial data grab");

    var snippets = snapshot.val();
    var sentence = "";
    var translationBuffer = "";
    for (var snippetID in snippets) {
      if (!snippetsArray.includes(snippetID) && snippetID !== "just-updated") {
        mostRecentSnippetTime = snippetID;

        sentence = snippets[snippetID].replace(/\|/g, " ");
        snippetsArray.push(snippetID);
        htmlBuffer +=
          '<span class="snippet" id="' +
          snippetID +
          '">' +
          removeLanguageFromStartOfSnippet(snippets[snippetID]).replace(
            /\|/g,
            " "
          ) +
          "</span> <br />";

        if (translating) {
          console.log("pushing a line after translating");
          translateText(sentence, snippetID).then(result => {
            var line = document.createElement("div");
            line.id = result.id;
            line.textContent = result.text[0];
            transcript.appendChild(line);
            window.scrollTo(0, document.body.scrollHeight);
          });
          htmlBuffer += "<br />";
          sentence = "";
        }
        window.scrollTo(0, document.body.scrollHeight);
      } else if (snippetID === "just-updated") {
        if (document.getElementById(snippets[snippetID])) {
          processUpdate(snippets[snippetID]);
        }
      }
    }
    if (!translating) {
      transcript.innerHTML = htmlBuffer;
    }
    window.scrollTo(0, document.body.scrollHeight);
    listenForNewLines();
  });
}

function removeLanguageFromStartOfSnippet(snippetText) {
  var lengthToRemove = snippetText.match(/[a-zA-Z-]+/)[0].length + 1;
  return snippetText.slice(lengthToRemove);
}

function listenForNewLines() {
  transcriptRef.on("value", function(snapshot) {
    var htmlBuffer = "";
    var snippets = snapshot.val();
    for (var snippetID in snippets) {
      if (snippetID === "just-updated") {
        if (!translating) {
          document.getElementById(
            snippets["just-updated"]
          ).textContent = removeLanguageFromStartOfSnippet(
            snippets[snippets["just-updated"]]
          ).replace(/\|/g, " ");
        } else {
          translateText(
            snippets[snippets["just-updated"]].replace(/\|/g, " "),
            snippetID
          ).then(function(result) {
            document.getElementById(snippets["just-updated"]).textContent =
              result.text[0];
          });
        }
      } else {
        var timestamp = snippetID;
        if (timestamp > mostRecentSnippetTime) {
          if (translating) {
            htmlBuffer = ""; // undoing the work above
            console.log("pushing a line after translating");
            translateText(
              snippets[snippetID].replace(/\|/g, " "),
              snippetID
            ).then(result => {
              var line = document.createElement("div");
              line.id = result.id;
              line.textContent = result.text[0];
              transcript.appendChild(line);
              window.scrollTo(0, document.body.scrollHeight);
            });
          } else {
            htmlBuffer +=
              '<span class="snippet" id="' +
              snippetID +
              '">' +
              removeLanguageFromStartOfSnippet(snippets[snippetID]).replace(
                /\|/g,
                " "
              ) +
              "</span>";
            htmlBuffer += "<br>";
            transcript.innerHTML += htmlBuffer;
            window.scrollTo(0, document.body.scrollHeight);
          }
        }
      }
    }
    mostRecentSnippetTime = timestamp;
  });
}

function translateText(text, id) {
  if (!translating) {
    document.querySelector("#interim").innerHTML =
      '<a href="http://translate.yandex.com/">Powered by Yandex.Translate</a>';
    translating = true;
    transcript.innerHTML = "";
    getPreExistingTranscript();
    return;
  }

  var targetLanguage = languageSelect.value;
  var sourceLanguage = text.match(/[a-zA-Z]+/)[0];
  text = removeLanguageFromStartOfSnippet(text);

  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" +
        yandexApiKey +
        "&text=" +
        encodeURIComponent(text) +
        "&lang=" +
        sourceLanguage +
        "-" +
        targetLanguage
    );
    xhr.onload = function() {
      if (xhr.status === 200) {
        //			transcript.innerHTML = JSON.parse(xhr.responseText).text
        resolve({
          text: JSON.parse(xhr.responseText).text,
          id: id
        });
      } else {
        reject("Request failed.  Returned status of " + xhr.status);
      }
    };
    xhr.send();
  });
}
