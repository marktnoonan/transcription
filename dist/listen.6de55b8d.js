// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"javascripts/common.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleDarkTheme = toggleDarkTheme;
exports.toggleHeader = toggleHeader;
exports.fontMinus = fontMinus;
exports.fontPlus = fontPlus;
exports.closePopup = closePopup;
exports.exportToggle = exportToggle;
exports.nameToggle = nameToggle;
exports.config = void 0;
var config = {
  apiKey: "AIzaSyD591s8Of9vqduC2ZAakt9mMQRin4wCFSQ",
  authDomain: "live-transcript.firebaseapp.com",
  databaseURL: "https://live-transcript.firebaseio.com",
  projectId: "live-transcript",
  storageBucket: "",
  messagingSenderId: "1024703297861"
};
exports.config = config;
var darkThemeOn = false;
var database;

function toggleDarkTheme() {
  document.querySelector('body').classList.toggle('dark');
}

function fontMinus() {
  var transcript = document.querySelector("#transcript");
  var currentSize = parseFloat(window.getComputedStyle(transcript).fontSize);

  if (currentSize != 16) {
    transcript.style.fontSize = currentSize - 10 + 'px';
  }
}

function fontPlus() {
  var transcript = document.querySelector("#transcript");
  var currentSize = parseFloat(window.getComputedStyle(transcript).fontSize);

  if (currentSize != 76) {
    transcript.style.fontSize = currentSize + 10 + 'px';
  }
}

function toggleHeader() {
  var header = document.querySelector("header");
  header.classList.toggle('translate');
  var button = document.querySelector("#header-toggle-button");

  if (button.innerText == "Hide Header") {
    button.innerText = "Show Header";
  } else {
    button.innerText = "Hide Header";
  }
}

function exportToggle() {
  navigator.clipboard.writeText(document.querySelector('.transcript-export').textContent);
}

function nameToggle() {
  var about = document.querySelector('.about-box');
  var exporttext = document.querySelector(".export-box");
  var name = document.querySelector(".name-box");

  if (name.classList.contains('hidden')) {
    exporttext.classList.add('hidden');
    name.classList.remove('hidden');
    document.querySelector("#exit-popup").focus();
  } else {
    name.classList.add('hidden');
  }
}

function closePopup() {
  var name = document.querySelector(".name-box");

  if (!name.classList.contains('hidden')) {
    name.classList.add('hidden');
  }
}
},{}],"node_modules/zenscroll/zenscroll.js":[function(require,module,exports) {
var define;
/**
 * Zenscroll 4.0.2
 * https://github.com/zengabor/zenscroll/
 *
 * Copyright 2015–2018 Gabor Lenard
 *
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <http://unlicense.org>
 * 
 */

/*jshint devel:true, asi:true */

/*global define, module */


(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory())
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory()
	} else {
		(function install() {
			// To make sure Zenscroll can be referenced from the header, before `body` is available
			if (document && document.body) {
				root.zenscroll = factory()
			} else {
				// retry 9ms later
				setTimeout(install, 9)
			}
		})()
	}
}(this, function () {
	"use strict"


	// Detect if the browser already supports native smooth scrolling (e.g., Firefox 36+ and Chrome 49+) and it is enabled:
	var isNativeSmoothScrollEnabledOn = function (elem) {
		return elem && "getComputedStyle" in window &&
			window.getComputedStyle(elem)["scroll-behavior"] === "smooth"
	}


	// Exit if it’s not a browser environment:
	if (typeof window === "undefined" || !("document" in window)) {
		return {}
	}


	var makeScroller = function (container, defaultDuration, edgeOffset) {

		// Use defaults if not provided
		defaultDuration = defaultDuration || 999 //ms
		if (!edgeOffset && edgeOffset !== 0) {
			// When scrolling, this amount of distance is kept from the edges of the container:
			edgeOffset = 9 //px
		}

		// Handling the life-cycle of the scroller
		var scrollTimeoutId
		var setScrollTimeoutId = function (newValue) {
			scrollTimeoutId = newValue
		}

		/**
		 * Stop the current smooth scroll operation immediately
		 */
		var stopScroll = function () {
			clearTimeout(scrollTimeoutId)
			setScrollTimeoutId(0)
		}

		var getTopWithEdgeOffset = function (elem) {
			return Math.max(0, container.getTopOf(elem) - edgeOffset)
		}

		/**
		 * Scrolls to a specific vertical position in the document.
		 *
		 * @param {targetY} The vertical position within the document.
		 * @param {duration} Optionally the duration of the scroll operation.
		 *        If not provided the default duration is used.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToY = function (targetY, duration, onDone) {
			stopScroll()
			if (duration === 0 || (duration && duration < 0) || isNativeSmoothScrollEnabledOn(container.body)) {
				container.toY(targetY)
				if (onDone) {
					onDone()
				}
			} else {
				var startY = container.getY()
				var distance = Math.max(0, targetY) - startY
				var startTime = new Date().getTime()
				duration = duration || Math.min(Math.abs(distance), defaultDuration);
				(function loopScroll() {
					setScrollTimeoutId(setTimeout(function () {
						// Calculate percentage:
						var p = Math.min(1, (new Date().getTime() - startTime) / duration)
						// Calculate the absolute vertical position:
						var y = Math.max(0, Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)))
						container.toY(y)
						if (p < 1 && (container.getHeight() + y) < container.body.scrollHeight) {
							loopScroll()
						} else {
							setTimeout(stopScroll, 99) // with cooldown time
							if (onDone) {
								onDone()
							}
						}
					}, 9))
				})()
			}
		}

		/**
		 * Scrolls to the top of a specific element.
		 *
		 * @param {elem} The element to scroll to.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToElem = function (elem, duration, onDone) {
			scrollToY(getTopWithEdgeOffset(elem), duration, onDone)
		}

		/**
		 * Scrolls an element into view if necessary.
		 *
		 * @param {elem} The element.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollIntoView = function (elem, duration, onDone) {
			var elemHeight = elem.getBoundingClientRect().height
			var elemBottom = container.getTopOf(elem) + elemHeight
			var containerHeight = container.getHeight()
			var y = container.getY()
			var containerBottom = y + containerHeight
			if (getTopWithEdgeOffset(elem) < y || (elemHeight + edgeOffset) > containerHeight) {
				// Element is clipped at top or is higher than screen.
				scrollToElem(elem, duration, onDone)
			} else if ((elemBottom + edgeOffset) > containerBottom) {
				// Element is clipped at the bottom.
				scrollToY(elemBottom - containerHeight + edgeOffset, duration, onDone)
			} else if (onDone) {
				onDone()
			}
		}

		/**
		 * Scrolls to the center of an element.
		 *
		 * @param {elem} The element.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {offset} Optionally the offset of the top of the element from the center of the screen.
		 *        A value of 0 is ignored.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToCenterOf = function (elem, duration, offset, onDone) {
			scrollToY(Math.max(0, container.getTopOf(elem) - container.getHeight()/2 + (offset || elem.getBoundingClientRect().height/2)), duration, onDone)
		}

		/**
		 * Changes default settings for this scroller.
		 *
		 * @param {newDefaultDuration} Optionally a new value for default duration, used for each scroll method by default.
		 *        Ignored if null or undefined.
		 * @param {newEdgeOffset} Optionally a new value for the edge offset, used by each scroll method by default. Ignored if null or undefined.
		 * @returns An object with the current values.
		 */
		var setup = function (newDefaultDuration, newEdgeOffset) {
			if (newDefaultDuration === 0 || newDefaultDuration) {
				defaultDuration = newDefaultDuration
			}
			if (newEdgeOffset === 0 || newEdgeOffset) {
				edgeOffset = newEdgeOffset
			}
			return {
				defaultDuration: defaultDuration,
				edgeOffset: edgeOffset
			}
		}

		return {
			setup: setup,
			to: scrollToElem,
			toY: scrollToY,
			intoView: scrollIntoView,
			center: scrollToCenterOf,
			stop: stopScroll,
			moving: function () { return !!scrollTimeoutId },
			getY: container.getY,
			getTopOf: container.getTopOf
		}

	}


	var docElem = document.documentElement
	var getDocY = function () { return window.scrollY || docElem.scrollTop }

	// Create a scroller for the document:
	var zenscroll = makeScroller({
		body: document.scrollingElement || document.body,
		toY: function (y) { window.scrollTo(0, y) },
		getY: getDocY,
		getHeight: function () { return window.innerHeight || docElem.clientHeight },
		getTopOf: function (elem) { return elem.getBoundingClientRect().top + getDocY() - docElem.offsetTop }
	})


	/**
	 * Creates a scroller from the provided container element (e.g., a DIV)
	 *
	 * @param {scrollContainer} The vertical position within the document.
	 * @param {defaultDuration} Optionally a value for default duration, used for each scroll method by default.
	 *        Ignored if 0 or null or undefined.
	 * @param {edgeOffset} Optionally a value for the edge offset, used by each scroll method by default. 
	 *        Ignored if null or undefined.
	 * @returns A scroller object, similar to `zenscroll` but controlling the provided element.
	 */
	zenscroll.createScroller = function (scrollContainer, defaultDuration, edgeOffset) {
		return makeScroller({
			body: scrollContainer,
			toY: function (y) { scrollContainer.scrollTop = y },
			getY: function () { return scrollContainer.scrollTop },
			getHeight: function () { return Math.min(scrollContainer.clientHeight, window.innerHeight || docElem.clientHeight) },
			getTopOf: function (elem) { return elem.offsetTop }
		}, defaultDuration, edgeOffset)
	}


	// Automatic link-smoothing on achors
	// Exclude IE8- or when native is enabled or Zenscroll auto- is disabled
	if ("addEventListener" in window && !window.noZensmooth && !isNativeSmoothScrollEnabledOn(document.body)) {

		var isHistorySupported = "history" in window && "pushState" in history
		var isScrollRestorationSupported = isHistorySupported && "scrollRestoration" in history

		// On first load & refresh make sure the browser restores the position first
		if (isScrollRestorationSupported) {
			history.scrollRestoration = "auto"
		}

		window.addEventListener("load", function () {

			if (isScrollRestorationSupported) {
				// Set it to manual
				setTimeout(function () { history.scrollRestoration = "manual" }, 9)
				window.addEventListener("popstate", function (event) {
					if (event.state && "zenscrollY" in event.state) {
						zenscroll.toY(event.state.zenscrollY)
					}
				}, false)
			}

			// Add edge offset on first load if necessary
			// This may not work on IE (or older computer?) as it requires more timeout, around 100 ms
			if (window.location.hash) {
				setTimeout(function () {
					// Adjustment is only needed if there is an edge offset:
					var edgeOffset = zenscroll.setup().edgeOffset
					if (edgeOffset) {
						var targetElem = document.getElementById(window.location.href.split("#")[1])
						if (targetElem) {
							var targetY = Math.max(0, zenscroll.getTopOf(targetElem) - edgeOffset)
							var diff = zenscroll.getY() - targetY
							// Only do the adjustment if the browser is very close to the element:
							if (0 <= diff && diff < 9 ) {
								window.scrollTo(0, targetY)
							}
						}
					}
				}, 9)
			}

		}, false)

		// Handling clicks on anchors
		var RE_noZensmooth = new RegExp("(^|\\s)noZensmooth(\\s|$)")
		window.addEventListener("click", function (event) {
			var anchor = event.target
			while (anchor && anchor.tagName !== "A") {
				anchor = anchor.parentNode
			}
			// Let the browser handle the click if it wasn't with the primary button, or with some modifier keys:
			if (!anchor || event.which !== 1 || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
				return
			}
			// Save the current scrolling position so it can be used for scroll restoration:
			if (isScrollRestorationSupported) {
				var historyState = history.state && typeof history.state === "object" ? history.state : {}
				historyState.zenscrollY = zenscroll.getY()
				try {
					history.replaceState(historyState, "")
				} catch (e) {
					// Avoid the Chrome Security exception on file protocol, e.g., file://index.html
				}
			}
			// Find the referenced ID:
			var href = anchor.getAttribute("href") || ""
			if (href.indexOf("#") === 0 && !RE_noZensmooth.test(anchor.className)) {
				var targetY = 0
				var targetElem = document.getElementById(href.substring(1))
				if (href !== "#") {
					if (!targetElem) {
						// Let the browser handle the click if the target ID is not found.
						return
					}
					targetY = zenscroll.getTopOf(targetElem)
				}
				event.preventDefault()
				// By default trigger the browser's `hashchange` event...
				var onDone = function () { window.location = href }
				// ...unless there is an edge offset specified
				var edgeOffset = zenscroll.setup().edgeOffset
				if (edgeOffset) {
					targetY = Math.max(0, targetY - edgeOffset)
					if (isHistorySupported) {
						onDone = function () { history.pushState({}, "", href) }
					}
				}
				zenscroll.toY(targetY, null, onDone)
			}
		}, false)

	}


	return zenscroll


}));

},{}],"javascripts/export.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getExport;

function getExport(flt) {
  if (flt.listening) {
    // important, cause things go crazy if we're still adding to the transcript after export.
    flt.toggle();
  }

  var wrapper = document.querySelector(".export-box");
  var text = JSON.parse(exportCurrentTranscript(flt)); // TODO - this display in a textarea is not so great, it blocks the transcript itself,
  // a genuine modal would be nicer.

  var textArea = document.createElement("textarea");
  textArea.textContent = Object.values(text).join("\r\n");
  textArea.setAttribute("class", "transcript-export");
  var textbox = document.querySelector(".transcript-export");

  if (wrapper.contains(textbox)) {
    wrapper.removeChild(textbox);
    wrapper.appendChild(textArea);
    flt.transcript.appendChild(wrapper);
  } else {
    wrapper.appendChild(textArea);
    flt.transcript.appendChild(wrapper);
  }
} // ----------------------------------------------------------------------------


function exportCurrentTranscript(flt) {
  var transcriptExportAsJSON = {};
  var lines = Array.from(flt.transcript.querySelectorAll("div"));
  lines.forEach(function (line) {
    var lineContent = Array.from(line.querySelectorAll("span")).map(function (line) {
      return line.textContent;
    }).join(" "); // TODO This part is definitely funky and not doing the ideal thing.
    // the part the gets the MS is not correct.
    // We probably need to keep a reference to the very first word in the transcript
    // subtract that time from every subsequent word... so the first word is zero,
    // and everything after that is the correct MS. The absolute timestamp doesn't really matter
    // and in an exported transcript should _definitely_ be ignored. Probably in the DB it should stay.

    var msSinceStart = Number(line.id.substr(4)) - Number(flt.transcriptStartTime);
    console.log({
      msSinceStart: msSinceStart
    });
    transcriptExportAsJSON[msSinceStart] = lineContent;
  });
  return JSON.stringify(transcriptExportAsJSON);
} // ----------------------------------------------------------------------------
// TODO: fix this function, or just redo it using the date-fns library or something. It has never 100% worked


function getSubTime(timeInMs) {
  var hours = Math.floor(timeInMs / (1000 * 60 * 60));
  var hh = hours > 9 ? hours : "0" + hours;
  var minutes = Math.floor((timeInMs - hours * 60 * 60 * 1000) / (1000 * 60));
  var mm = minutes > 9 ? minutes : "0" + minutes;
  debugger;
  var seconds = Math.floor((timeInMs - (hours * 60 * 60 * 1000 - minutes * 60 * 1000)) / 1000);
  var ss = seconds > 9 ? seconds : "0" + seconds;
  var milliseconds = Math.floor(timeInMs - (hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000));
  var ms = milliseconds > 9 ? milliseconds.toString().substring(0, 2) : "0" + milliseconds;
  return hh + ":" + mm + ":" + ss + "." + ms;
} // ----------------------------------------------------------------------------
// TODO: double check the output format against standard subrip format https://en.wikipedia.org/wiki/SubRip#SubRip_text_file_format


function convertToSubFormat(transcriptAsJson) {
  var subText = "";
  var previousEndTime = "00:00:00.00";

  for (var line in transcriptAsJson) {
    subText += "\n" + previousEndTime;
    subText += line;
  }

  return subText;
} // TODO: find a way to offer exported transcript as plain text or a download as a .srt file,
// this might be a hand reference since we are chrome-only anyway: https://twitter.com/sulco/status/1313798240043753473
},{}],"javascripts/listen.js":[function(require,module,exports) {
"use strict";

var _common = require("./common");

var _zenscroll = _interopRequireDefault(require("zenscroll"));

var _export = _interopRequireDefault(require("./export"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: these globals could all quite happily live in an object called "liveTranscript" or something, to avoid getting in the global namespace.
// TODO: likewise, all these global functions can live in that object too.
// TODO: this whole script can move to its own file.
// TODO: we can establish stadards for the kind of JS permitted in the project. _This_ page requires chrome and could use most ES6+ features that are implemented in Chrome, but the observer page is targeted to any possible display that can run enough JS for firebase.
// TODO: Transcripts should be really simple to use and broadcast. But right now there is just read/write access to the DB for anyody who wants it. I would like to have no login whatsoever and still have the person who started a listening session ALWAYS remain in charge of it, so it couldn't be over written. There are probably many ways to do it. Right now if I am recording a named transcript, and somebody else names their transcript the same name as mine, we are both then feeding into the same exact DB location. That's dumb. But there are cases where you WOULD want to resume an existing named transcript at right now you just type in the name and pick up where you left off. Really curious to see how we can make this "just work" by maybe caching something in a cookie or local storage or whatever.
// TODO: I haven't dug into Zenscroll enough to know how it handles being called repeatedly, but sometimes I see jankyness and we may need to look at how to only call Zenscroll if we are not already scrolling. My naive version of that didn't work as expected.
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
}; // ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

if (document.getElementById("transcriptIDForm")) {
  document.getElementById("transcriptIDForm").addEventListener("submit", function (event) {
    event.preventDefault();
    flt.saveTranscriptID();
  });
} // ----------------------------------------------------------------------------


flt.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
flt.recognition.lang = document.getElementById("select-language").value;
flt.recognition.interimResults = true;
flt.recognition.maxAlternatives = 1;
flt.interim = document.querySelector("#interim"); //TODO: refactor this onresult function for clarity. Especially, just extract it and give it a name so that it's just recognition.onresult = manageInterimResults or something... most of the blocks in this function could be given their own name.

flt.recognition.onresult = function (event) {
  if (!flt.currentLineID) {
    flt.currentLineID = Date.now(); // this is what we will really use to handle "replay" timing I think. - Mark

    flt.line = document.createElement("div");
    flt.line.id = "line" + flt.currentLineID;
    flt.line.className = "transcript-line";
    flt.transcript.appendChild(flt.line);
  }

  var resultText = event.results[0][0].transcript;
  var resultWords = resultText.split(" ");
  var minLengthNeeded = 10 + flt.wordsPushedToTranscript;

  if (resultWords.length > minLengthNeeded) {
    var wordsToPush = [];

    for (var i = flt.wordsPushedToTranscript; i < flt.wordsPushedToTranscript + 5; i++) {
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
    flt.interim.textContent = resultText.substring(flt.charLengthOfPushes + flt.wordsPushedToTranscript / 5);
    flt.lastResultCache = resultText.substring(flt.charLengthOfPushes + flt.wordsPushedToTranscript / 5);
  } else {
    flt.interim.textContent = resultText;
    flt.lastResultCache = resultText;
  }

  _zenscroll.default.toY(document.body.scrollHeight, 1500);
}; // ----------------------------------------------------------------------------
// TODO: name, extract, and refactor the on-end function for clarity. Maybe I should comment some of the weirder stuff here to explain its purpose better.


flt.recognition.onend = function (event) {
  if (flt.lastResultCache != "") {
    var words = flt.lastResultCache.split(" ");
    var numWords = words.length;

    if (!flt.line) {
      flt.line = document.createElement("div");
    }

    var snippetIdRoot = Date.now();

    for (var i = 0; i < words.length; i++) {
      var snippetID = "snippet" + snippetIdRoot + "-" + (i + 1);
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
      flt.database.ref("transcripts/" + flt.transcriptID + "/" + snippetIdRoot).set(flt.recognition.lang + "|" + words.join("|"), flt.completion);
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
    _zenscroll.default.toY(document.body.scrollHeight, 2000);

    flt.recognition.start();
  }
}; // ----------------------------------------------------------------------------
// TODO: Give a more descriptive name than toggle, since we have this toggle for using the mic, and another for using the light/dark themes.


flt.toggle = function () {
  console.log({
    flt: flt
  });
  console.log("toggling");

  if (!flt.haveListenedOnce) {
    flt.haveListenedOnce = true;
    flt.transcriptStartTime = Date.now();
  }

  flt.listening = !flt.listening;
  document.querySelector('.startListen').setAttribute("style", flt.listening ? "display:none" : "display:flex");
  document.querySelector(".stopListen").setAttribute("style", flt.listening ? "display:flex" : "display:none");

  if (!flt.listening) {
    flt.recognition.stop();
    flt.interim.textContent = "";
  } else {
    flt.recognition.start();
  }
}; // ----------------------------------------------------------------------------


flt.pushWordsToTranscript = function (arrayOfWords) {
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
    flt.database.ref("transcripts/" + flt.transcriptID + "/" + snippetIdRoot).set(arrayOfWords.join("|"), flt.completion);
  }
}; // ----------------------------------------------------------------------------
// TODO I think I can make this a little clearer.


flt.saveTranscriptID = function () {
  firebase.initializeApp(_common.config);
  flt.database = firebase.database();
  flt.transcriptID = document.getElementById("newTranscriptID").value;
  var observeLink = flt.observeLinkRoot + "?" + flt.transcriptID;
  document.getElementById("name-transcript").innerHTML = "Transcript name: <strong>" + flt.transcriptID + '</strong>';
  document.getElementById("transcriptIDForm").innerHTML = 'Link for others to watch: <a href="' + observeLink + '" target="_blank">' + observeLink + "</a>";
}; // ----------------------------------------------------------------------------


flt.addEditingListener = function (editedID, newElement) {
  var textChanged = false;
  var blurListenerAdded = false;
  var element = newElement; //document.getElementById(editedID);

  element.addEventListener("click", selectWord);
  element.addEventListener("focus", selectWord); // TODO: name and extract this function that runs on keydown

  element.addEventListener("keydown", function (e) {
    // esc and enter should confirm the edited word
    if (e.keyCode == 27) {
      element.blur();
      window.getSelection().removeAllRanges();
    } else if (e.keyCode == 13) {
      element.blur();
      e.preventDefault();
      window.getSelection().removeAllRanges();
    }

    if (!textChanged && e.keyCode == 9 || !textChanged && e.shiftKey && e.keyCode == 9) {// do nothing - there must be a better way to express this!
      // TODO: rewrite this conditional to be more clear. Maybe using something more obvious than the keycodes would be a good start?
    } else if (!blurListenerAdded && flt.transcriptID !== "") {
      textChanged = true;
      blurListenerAdded = true;
      addBlurListener();
    }
  });

  function addBlurListener() {
    element.addEventListener("blur", function (e) {
      var newText = element.textContent;
      var editedTimestamp = editedID.substr(7, 13);
      var editedIndex = editedID.split("-")[1];
      flt.database.ref("transcripts/" + flt.transcriptID + "/" + editedTimestamp).once("value").then(function (snapshot) {
        var lineAsArray = snapshot.val().split("|");
        lineAsArray[editedIndex] = newText;
        var updatedLine = lineAsArray.join("|");
        flt.database.ref("transcripts/" + flt.transcriptID + "/" + editedTimestamp).set(updatedLine, flt.completion);
        flt.database.ref("transcripts/" + flt.transcriptID + "/just-updated").set(editedTimestamp, flt.completion);
      });
    });
  } // TODO: This came from a stackoverflow answer and seems to work just fine, but I'm open to any other/better ways of selecting a word when it is clicked on so that the user can replace it just by typing.


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
}; // ----------------------------------------------------------------------------
// TODO: rename this. It's just the callback that runs when firebase is done saving what we put in there. Maybe call it firebaseCompletion or something is better?


flt.completion = function (error) {
  console.log("completed");

  if (error) {
    console.log("Data could not be saved." + error);
  } else {
    console.log("Data saved successfully.");
  }
}; // ----------------------------------------------------------------------------
// init will add all our listeners and do any other set up that we need.


function init() {
  document.querySelector("#theme-toggle").addEventListener("click", _common.toggleDarkTheme);
  document.querySelector("#font-minus").addEventListener("click", _common.fontMinus);
  document.querySelector("#font-plus").addEventListener("click", _common.fontPlus);
  document.querySelector("#header-toggle-button").addEventListener("click", _common.toggleHeader);
  document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
      (0, _common.closePopup)();
    }
  });
  document.querySelector("#export-button").addEventListener("click", _common.exportToggle);
  document.querySelector("#exit-popup").addEventListener("click", _common.closePopup);
  document.querySelector("#name-button").addEventListener("click", _common.nameToggle);
  document.addEventListener("click", function (e) {
    console.log(e.target.tagName);

    if (e.target.tagName == "HTML" || e.target.tagName == "MAIN") {
      (0, _common.closePopup)();
    }
  });
  document.querySelector("#select-language").addEventListener("change", function (event) {
    flt.recognition.lang = event.target.value;
  });
}

Array.from(document.querySelectorAll(".listen-toggle")).forEach(function (element) {
  element.addEventListener("click", flt.toggle);
});
document.querySelector("#export-button").addEventListener("click", function () {
  (0, _export.default)(flt);
});
init();
},{"./common":"javascripts/common.js","zenscroll":"node_modules/zenscroll/zenscroll.js","./export":"javascripts/export.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56946" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","javascripts/listen.js"], null)
//# sourceMappingURL=/listen.6de55b8d.js.map