# Live Transcript

A small application to use computer speech to text to show translation online and live. This makes sense for scenarios such as hearing impaired or recording something to be more machine readable.

NOTE: This requires the Chrome browser for the transcription to work. It uses a built in feature in Chrome for text to speech.

Chrome's text-to-speech feature only works when the page is running on a server (localhost is fine), and the device has an internet connection.

# Prerequisites

1. node.js
2. git
3. parcel.js bundler
4. Chrome browser

# Getting started

Clone this repo:

```

git clone https://github.com/marktnoonan/transcription.git

```

If you don't have the parcel package bundler, you can install it globally:

```
npm install --global parcel
```

In the root directory of the project on your computer, run the following commands:

```

npm install

parcel index.html

```

The first command will install any dependencies listed in the package.json file, and the second will use parcel open a port on localhost and serve index.html there.

Point your Chrome browser to `localhost:1234`.

This should get you up and running. Please report failures/problems with the build process and we will update this file as needed.

# Todo

- [ ] Make decent landing page..... check in with @Nerajno... Twitter
- [ ] Write a complete of things to do ===> Mark
- [x] Make font-size user-selectable
- [ ] Add Code for Atlanta logo
- [ ] Add People Making Progress acknowledgement
- [ ] Make header retractable
- [ ] ADD MORE TODOS
- [ ] Add options for displaying with line breaks on pauses or in more condensed formats
- [ ] Make text color and background color editable
- [ ] In fact, let's define a settings panel that will grab all these things together
- [ ] Let's discuss usefulness of a SPA framework to handle all this (likely Vue)
- [ ] Let's add user accounts via firebase to store preferred settings as a user
- [ ] Format landing page with CSS
- [ ] Use media queries to make app responsive to mobile and tablet screens

# Git Branches

Currently doing "trunk-based" development, where most work is happening on the master branch, and contributors should run `git fetch` regularly before doing new work. Short-lived branches for particular features or experiments are fine, but typically this has been a small enough project without many contributors working at the same time, so the simpler we can keep it the better.

# Deployment

Triggered manually from the master branch Netlify when we are ready to publish a new update.
