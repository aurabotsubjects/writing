# Live Class Quiz — Setup Guide

This turns the Friday quiz into a live, whole-class game: students join **Team Kiwi** or
**Team Tui** on their iPads, race the clock on each question at their own pace, and the
teacher's screen shows a live scoreboard, ending in a top-3 leaderboard and a Kiwi vs Tui
result.

It needs a tiny bit of free, no-code setup first — about 5 minutes, one time only.

## 1. Create a free Firebase project

1. Go to **https://console.firebase.google.com** and sign in with any Google account.
2. Click **Add project**, give it any name (e.g. "writing-warmup-quiz"), and finish the
   wizard (you can turn off Google Analytics — not needed).
3. Once the project opens, click the **`</>`  (Web) icon** on the project overview page to
   register a new web app. Give it any nickname and click **Register app**.
4. Firebase will show you a code snippet containing a `firebaseConfig` object that looks
   like this:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "writing-warmup-quiz.firebaseapp.com",
     projectId: "writing-warmup-quiz",
     storageBucket: "writing-warmup-quiz.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

   Keep this page open — you'll need these values in step 3.

## 2. Turn on the Realtime Database

1. In the left sidebar of the Firebase console, click **Build → Realtime Database**.
2. Click **Create Database**. Choose any region close to you.
3. When asked about security rules, choose **Start in test mode** for now (we'll set the
   real rules in step 4).
4. Once created, copy the **database URL** shown at the top (looks like
   `https://writing-warmup-quiz-default-rtdb.firebaseio.com`) — you'll need it in step 3.

## 3. Paste your config into the app

Open **`firebase-config.js`** in the app folder and replace the placeholder values with
your own, including the `databaseURL` from step 2:

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "writing-warmup-quiz.firebaseapp.com",
  databaseURL: "https://writing-warmup-quiz-default-rtdb.firebaseio.com",
  projectId: "writing-warmup-quiz",
  storageBucket: "writing-warmup-quiz.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

Save the file.

## 4. Set the database security rules

In the Firebase console, go to **Realtime Database → Rules** and replace the rules with:

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

Click **Publish**. This keeps everything else in your database locked, and only allows
reading/writing quiz rooms (no accounts or personal data are involved — just first names,
team choices and scores, and rooms are disposable/short-lived).

## 5. Host the files somewhere reachable by the iPads

The app is a set of static files, so any static web host works. The easiest free option:

- **GitHub Pages**: create a GitHub repo, upload all the files (including `host.html`,
  `student.html`, `quiz-data.js`, `firebase-config.js`, `firebase-bundle.js`,
  `qrcode.min.js`, `live-quiz-theme.css`), then turn on Pages in the repo's Settings.
  You'll get a URL like `https://yourname.github.io/writing-warmup/`.
- Alternatively, any existing web host/school server that can serve static files works too.

The iPads and the teacher's screen just need normal internet access — no app installs, no
accounts.

## 6. Run a quiz on Fridays

1. On the teacher's computer/board, open **`host.html`**, pick the Term and Week, and click
   **Create Room**. A room code and QR code appear.
2. Students open their iPads, scan the QR code (or type the room code into
   **`student.html`**), enter their first name, and tap **Team Kiwi** or **Team Tui**.
3. Once everyone's joined (you'll see them appear live), click **Start Quiz**.
4. Each student answers 16 questions at their own pace — a full-width timer bar counts
   down from 15 seconds per question, and the faster they answer correctly, the more points
   they earn (up to 100, decaying to 0 over 15 seconds). Answering automatically advances
   them to the next question, so faster/slower students naturally move at different speeds.
5. Your screen shows a live, updating Kiwi vs Tui scoreboard the whole time.
6. Whenever you're ready (usually once most students have finished), click **End Quiz &
   Reveal Results**. Every device — yours and the students' — shows the final top-3 student
   podium and the overall Kiwi vs Tui winner.
7. Click **New Quiz** to reset for next Friday.

## Notes

- Everything the app needs (the QR code generator and the Firebase SDK itself) is bundled
  locally in the app files — nothing is pulled from a CDN at runtime. The **only** external
  connection the iPads and teacher screen make is to your own Firebase database
  (`*.firebaseio.com`), which is unavoidable since that's what keeps everyone in sync. If
  your school's wifi filters outbound traffic, that domain is the one to allow.
- Each room code is single-use and short-lived — create a fresh one each Friday.
- If a student's iPad refreshes or drops connection mid-quiz, reopening the same link picks
  up right where they left off (their name/team/progress are remembered on that device).
- This uses Firebase's free "Spark" plan, which comfortably covers a class-sized quiz with
  room to spare.
- The classic 2-team buzzer quiz (no iPads/Firebase needed) is still available from the
  Friday intro screen if you'd rather not use the live version on a given week.
