# Live Class Quiz — Setup Guide (No Experience Needed)

Don't worry — you don't need to know any coding for this. It's just a lot of clicking
in the right order, and this guide tells you exactly where to click. It takes about
15–20 minutes the first time. You only ever do this once.

**Before you start:** you'll need a Google account (like a Gmail address) — that's it.

Work through the parts **in order**, top to bottom. Don't skip ahead.

---

## Part 1 — Create your free Firebase project

Firebase is a free Google service. Think of it as a shared notebook on the internet
that the teacher's screen and all the iPads can write in and read from at the same
time — that's how the scores update live.

1. Open a web browser and go to: **https://console.firebase.google.com**
2. Sign in with your Google account if it asks you to.
3. You'll see a page with a button that says **"Create a project"** (or **"Add
   project"**). Click it.
4. It will ask for a project name. Type anything you like, for example:
   `writing-warmup-quiz`
   Then click **Continue**.
5. It will ask about "Google Analytics for this project." **Turn this switch OFF.**
   You don't need it. Click **Create project**.
6. Wait about 30 seconds while it spins up. Click **Continue** when it's done.

You now have a Firebase project. Leave this browser tab open.

---

## Part 2 — Register a "web app" inside your project

This step tells Firebase "I'm going to use this from a website."

1. You should be looking at your project's home page (called the **Project Overview**).
2. Near the top, you'll see a small row of icons — they look like little platform
   logos (Apple, Android, and one that looks like **`</>`**). Click the **`</>`**
   icon. This is the "Web" icon — it's easy to miss, it's small.
3. It will ask for an "App nickname." Type anything, e.g. `quiz-app`.
4. **Leave the "Firebase Hosting" checkbox unticked.** You don't need it for this.
5. Click **Register app**.
6. A box of code will appear on screen that looks something like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSyD-abc123...",
     authDomain: "writing-warmup-quiz.firebaseapp.com",
     projectId: "writing-warmup-quiz",
     storageBucket: "writing-warmup-quiz.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

   **This is your project's secret address book — you'll need it in Part 4.**
   Don't close this yet, but don't worry if you do — you can always get back to it
   (see the box below).

   > 🔎 **Lost this screen?** In the Firebase console, click the ⚙️ **gear icon** (top
   > left, next to "Project Overview") → **Project settings**. Your config is at the
   > bottom of the page, under "Your apps."

7. Click **Continue to console** to finish this step.

---

## Part 3 — Turn on the database

⚠️ **This is the step people get tripped up on most**, because Firebase has **two**
different products that sound similar: "Cloud Firestore" and "**Realtime Database**."
**You want Realtime Database.** Not Firestore. They look alike — double check the name.

1. On the left-hand menu, look for the heading **Build**. Click it to expand it if
   needed.
2. Under **Build**, click **Realtime Database** (again — NOT "Firestore Database").
3. Click the button **Create Database**.
4. It will ask for a location/region. The default is fine — click **Next**.
5. It will ask about security rules — you'll see two options. Choose **"Start in
   test mode."** Click **Enable**.
6. You'll land on a page with a big empty box and a URL near the top that looks like:
   `https://writing-warmup-quiz-default-rtdb.firebaseio.com`
   **Copy this whole URL** — you'll need it in the next part. (Click it and copy the
   text, or select it manually with your mouse.)

---

## Part 4 — Put your Firebase details into the app

Now we tell the quiz app your project's details, so it knows which "notebook" to use.

1. In the folder of files I gave you, find the file called **`firebase-config.js`**.
2. Open it in a **plain text editor** — this matters:
   - ✅ **Windows:** right-click the file → **Open with** → **Notepad**
   - ✅ **Mac:** right-click the file → **Open With** → **TextEdit** (if TextEdit
     shows a formatted page instead of plain code, click **Format → Make Plain
     Text** first)
   - ✅ Or, if you have one, any code editor like **VS Code** or **Sublime Text**
     works great too.
   - ❌ **Do not use Microsoft Word or Google Docs** — they'll silently change quote
     marks and break the file.
3. You'll see this:

   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "PASTE_YOUR_API_KEY_HERE",
     authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
     databaseURL: "https://PASTE_YOUR_PROJECT-default-rtdb.firebaseio.com",
     projectId: "PASTE_YOUR_PROJECT",
     storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
     messagingSenderId: "PASTE_YOUR_SENDER_ID",
     appId: "PASTE_YOUR_APP_ID"
   };
   ```

4. Replace each `"PASTE_YOUR_..."` value with the matching value from **Part 2**'s
   code box, and the `databaseURL` with the URL you copied in **Part 3**, step 6.

   **Keep the quote marks** (`"..."`) exactly where they are — just swap what's
   *inside* the quotes. Keep every comma. When you're done it should look like real
   values, no more "PASTE" anywhere, e.g.:

   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "AIzaSyD-abc123xyz...",
     authDomain: "writing-warmup-quiz.firebaseapp.com",
     databaseURL: "https://writing-warmup-quiz-default-rtdb.firebaseio.com",
     projectId: "writing-warmup-quiz",
     storageBucket: "writing-warmup-quiz.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

5. **Save the file** (keep the name `firebase-config.js` exactly the same — don't
   let it save as `.txt`).

---

## Part 5 — Set who's allowed to read/write the database

By default "test mode" only lasts 30 days, then locks everyone out. Let's set
permanent rules instead — don't worry, this is a copy-paste job.

1. Back in the Firebase console, make sure you're still on the **Realtime Database**
   page (left menu → Build → Realtime Database).
2. Click the tab along the top that says **Rules**.
3. You'll see a box of text/code. **Select all of it and delete it.**
4. Paste this in its exact place:

   ```json
   {
     "rules": {
       "rooms": {
         "$roomCode": {
           ".read": true,
           ".write": true
         }
       }
     }
   }
   ```

5. Click **Publish** (top right of that box).

   *(This only opens up the "rooms" part of your database — nothing else. Since the
   quiz only ever stores first names, team choices, and scores in short-lived rooms,
   this is perfectly fine for classroom use.)*

---

## Part 6 — Put the files online so iPads can reach them

The iPads and your screen need to open these files over the internet — they can't
just be sitting on your computer's desktop. Here's the easiest free way:

### Option A — Netlify Drop (simplest, no account needed)

1. Go to **https://app.netlify.com/drop** in your browser.
2. Find the folder on your computer containing all the quiz app files.
3. **Drag the whole folder** from your file explorer/Finder straight onto that
   webpage.
4. Within a few seconds it will give you a live web address, like
   `https://random-name-123.netlify.app`. That's your quiz app's home!
   - Your teacher page is at: `https://random-name-123.netlify.app/host.html`
   - Bookmark that link.

### Option B — GitHub Pages (a bit more setup, but a permanent link you control)

1. Go to **https://github.com** and create a free account if you don't have one.
2. Click the **+** icon (top right) → **New repository**. Name it anything, e.g.
   `writing-quiz`. Keep it **Public**. Click **Create repository**.
3. On the new repo's page, click **Add file → Upload files**.
4. Drag in *all* the quiz app files (all the `.html`, `.js`, `.css`, `.md` files).
   Click **Commit changes**.
5. Click the repo's **Settings** tab → **Pages** (left sidebar).
6. Under "Branch," choose **main** and click **Save**.
7. Wait a minute, then refresh — it'll show a link like
   `https://yourname.github.io/writing-quiz/`.
   - Your teacher page is at: `https://yourname.github.io/writing-quiz/host.html`

---

## Part 7 — Test it before Friday!

Do this test run at least a day before you need it, so there's time to fix anything.

1. On your computer, open your **host.html** link from Part 6.
2. You should see **"Start a Live Quiz"** with Term/Week dropdowns — not an orange
   "Firebase not configured" warning. If you see that warning, go back to Part 4.
3. Pick Term 1, Week 1, and click **Create Room**. A room code and QR code should
   appear.
4. On your phone or another device, open the **student.html** link (or scan the QR
   code), join with a test name, pick a team.
5. You should see yourself appear in the lobby on the host screen within a couple of
   seconds. If so — **you're all set!** Click **Cancel / New Room** to reset before
   Friday.

---

## Troubleshooting

**I see an orange box saying "Firebase not configured"**
→ `firebase-config.js` still has `"PASTE_YOUR..."` text in it somewhere. Go back to
Part 4 and check every value was replaced.

**Students get "Room not found"**
→ Double-check they typed the code correctly (it's not case-sensitive, but a `0`
zero and letter `O` can look alike — the code generator avoids these on purpose, so
if in doubt, use the QR code instead).

**Nothing updates live / scores don't move**
→ Almost always the **Rules** in Part 5 weren't saved. Go back, check the rules box
still shows the code above, and click **Publish** again.

**I get a "permission_denied" error in a browser console**
→ Same as above — the database Rules (Part 5) either weren't published, or test
mode expired (rules older than 30 days revert to fully locked). Re-publish the rules
in Part 5 and it's fixed for good.

**I want to double check my config values are right**
→ Firebase console → ⚙️ gear icon → Project settings → scroll to "Your apps" — your
config is shown there any time.

---

## Quick reference — files you should have

| File | What it's for |
|---|---|
| `host.html` | Teacher's screen |
| `student.html` | What students open on their iPads |
| `firebase-config.js` | Your project's details (Part 4) |
| `firebase-bundle.js`, `qrcode.min.js`, `live-quiz-theme.css`, `quiz-data.js` | Behind-the-scenes files the app needs — just upload them, never edit them |
| `index.html`, `term1-4-data.js` | Your main lesson app (unrelated to the live quiz) |

You only need to do Parts 1–6 **once**. From then on, every Friday you just open your
`host.html` link and click **Create Room**.
