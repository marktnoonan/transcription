


export default function getExport (flt) {
  if (flt.listening) {
    // important, cause things go crazy if we're still adding to the transcript after export.
    flt.toggle();
  }
  var wrapper = document.querySelector(".export-box");
  var text = JSON.parse(exportCurrentTranscript(flt));
  console.log(text)
  var textArea = document.createElement("textarea");
  textArea.textContent = Object.values(text).join("\r\n");
  textArea.setAttribute("class", "transcript-export");
  var textbox = document.querySelector(".transcript-export")
    if (wrapper.contains(textbox)) {
      wrapper.removeChild(textbox);
      wrapper.appendChild(textArea);
      flt.transcript.appendChild(wrapper);
    } else {
    wrapper.appendChild(textArea);
    flt.transcript.appendChild(wrapper);
    }
};
// ----------------------------------------------------------------------------
function exportCurrentTranscript (flt) {
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
function getSubTime (timeInMs) {
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
function convertToSubFormat (transcriptAsJson) {
  var subText = "";
  var previousEndTime = "00:00:00.00";

  for (var line in transcriptAsJson) {
    subText += "\n" + previousEndTime;
    subText += line;
  }
  return subText;
};