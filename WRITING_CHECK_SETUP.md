# Friday Writing Check — setup & how it works

## What it is
Every Friday the class splits into two groups and swaps after 12 minutes:
- **Group A** shares in the Helping Circle while **Group B** does a short Writing Check on iPads. Then they swap.
- The check matches that week's rubric: **three short answers** (one or two sentences each) and **one small writing piece** (aim for 80–150 words, 300 at most). Every question has a "Need help?" sentence starter.

## One-time setup (about 10 minutes)
1. Open **checks.html** (Writing Hub → Friday Writing Check → Teacher) in **Chrome or Edge** on your Mac.
2. Choose **"A folder on this computer"** and make a folder such as `Documents/Writing Check Data`. Everything is kept there as ordinary files.
3. Choose a **teacher password**.
4. **Class & logins:** paste in your students' first names. Each student gets a 4-number PIN and a group (A or B). Print the **login cards**.
5. **Check the online drop box once.** It uses the same free Firebase database as the Daily Warm-Up live quiz. In the Firebase console go to **Realtime Database → Rules** and make sure there is a `wcheck` entry next to your existing `rooms` entry, like this:

```json
{
  "rules": {
    "rooms":  { ".read": true, ".write": true },
    "wcheck": { "$code": { ".read": true, ".write": true } }
  }
}
```
(Keep whatever your `rooms` rule already says. Just add the `wcheck` line.)

## Each Friday
1. In the teacher page, pick the term and week, then click **Open the check**. A class code and a QR code appear. Put them on the board.
2. Students on iPads go to **…/test.html** (or scan the QR), type the code, tap their name and enter their PIN.
3. Watch the live list. Answers are saved to your folder **as they arrive**.
4. After both rounds, click **Finish & delete the online copy**.

## Getting Claude to mark it
1. Go to **Claude & results**, then click **PDF for Claude** for that week. In the print window, choose "Save as PDF". (Or use **Text file**.)
2. On claude.ai, attach it and say *"Please do this."* The pack has all the instructions, the rubric, the questions and every answer.
3. Claude gives you a feedback report (a rubric with well done and next steps for each student) and a **results file** (`writing-check-results-T1W3.json`).
4. Click **Add Claude's results**, then choose that file or paste it in. You can print **feedback slips** for students.
5. **Progress** shows class and student graphs, plus a written explanation of each student's progress. Each student report has its own link (it opens on this computer after you log in) and can be printed or saved as a PDF.

## Where everything is kept
- On **your computer only**, in your folder: `class.json` (names and PINs), `checks/` (answers), `results/` (Claude's results), and `wc-key.json` (your password lock, scrambled).
- **Online**, only while a check is open: students' first names, groups, scrambled PIN checks and their answers. Finishing the check deletes all of it.
- **Another computer?** Copy the folder across and choose it there. Or use **My data → Download a full backup**.
