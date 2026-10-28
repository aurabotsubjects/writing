/* Writing Focus — rewrites the Writing Process wording in focus-term1..4-data.js
   so each stage has ONE clear question and plain lesson points students can follow.
   Run from the Writing Warmup folder:  node tools/clarify-process.js
   Safe to re-run (it rebuilds the process block from the current file each time). */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");

/* ---------- the four stages: same core every term ---------- */
const CORE = [
  { n:1, key:"FILL", colour:"#2ec4b6", icon:"🪣",
    question:"What will I write about?",
    big:"Gather your ideas",
    point:"Collect lots of ideas, then choose the best one. We are not writing the piece yet.",
    steps:["I notice, remember and wonder.","I jot ideas, words and pictures in my jotter.","I choose my best idea and say why."],
    notYet:"Writing the whole piece. Right now we just collect.",
    moveOn:"I have chosen ONE idea and I can tell someone about it.",
    action:"Cup your two hands together, like you're holding water.",
    actionShort:"Cupped hands" },
  { n:2, key:"FIND", colour:"#3b82f6", icon:"🎯",
    question:"Who am I writing for?",
    big:"Find your reader, then draft",
    point:"Decide who will read it and what you want them to feel or know. Then write your first draft fast — just get it all down.",
    steps:["I decide who my reader is.","I say my piece out loud to a partner first.","I write my first draft fast, for that reader."],
    notYet:"Fixing spelling or making it neat. A messy draft is fine.",
    moveOn:"My whole first draft is on the page, from beginning to end.",
    action:"Make binoculars with your hands and hold them to your eyes — you're looking for your reader.",
    actionShort:"Binocular hands" },
  { n:3, key:"SHAPE", colour:"#f97316", icon:"🔍",
    question:"How can I make it better?",
    big:"Reread and improve",
    point:"Read your draft like an editor. Find what's working and what isn't, then change it to make it stronger.",
    steps:["I reread my draft slowly, like a reader would.","I check it against our success criteria.","I change words, sentences and order to make it stronger."],
    notYet:"Just copying it out neater. Shaping means making real changes.",
    moveOn:"I have made real changes and set two goals.",
    action:"Use both hands to mould an invisible ball of clay.",
    actionShort:"Moulding hands" },
  { n:4, key:"SHARE", colour:"#a855f7", icon:"🎁",
    question:"Is it ready for my reader?",
    big:"Get feedback, fix, publish",
    point:"Get feedback, improve it again, check the small things, then give it to your reader.",
    steps:["I get feedback: two stars and a wish.","I fix it: add, cut, reorder or replace.","I check spelling and punctuation, then publish."],
    notYet:"Stopping after one go. Feedback and fixing can happen more than once.",
    moveOn:"My reader has it in their hands.",
    action:"Hold out both open hands and push them forward, like you're giving a gift.",
    actionShort:"Giving hands" }
];

/* ---------- what each stage looks like in each term's genre ---------- */
const TERM = {
  1: {
    kid:[
      "This term I collect true moments from my own life. I jot them as one-line 'seeds', then I choose the ONE moment that matters most.",
      "This term I decide who will read my story and what I want them to feel. Then I write my first draft quickly.",
      "This term I reread my story like an editor. I hunt for weak verbs, repeated sentence starters and vague words — and make them stronger.",
      "This term I get feedback in the Helping Circle, improve my story, check the small things, and share it from the Author's Chair."],
    looks:[
      ["Jotting moment seeds in my jotter","Telling my story out loud first","Closing my eyes to remember what I saw, heard and felt","Building a word bank","Choosing my moment and saying why"],
      ["Filling in my Audience Card","Telling my story to a partner","Reading model stories and borrowing their tricks","Writing my first draft fast"],
      ["Comparing a model story with our success criteria","Marking my draft: glows and grows","The three-colour check: weak verbs, repeated openers, vague nouns","Setting two goals"],
      ["Helping Circle: two stars and a wish","ADD · CUT · REORDER · REPLACE","A real second draft — not just neater","Final edit, best copy, typing, Author's Chair"]],
    analogy:{ title:"Writing is like cooking a meal", parts:[
      "Gather the ingredients. You can't cook with an empty bench.",
      "Find out who's coming to dinner. You'd cook differently for a toddler than for your nana.",
      "Taste it and adjust it. Too bland? Needs something? Fix it.",
      "Serve it, and watch their face."],
      end:"The meal isn't finished when it's cooked. It's finished when someone eats it." },
    cycle:"After feedback in SHARE, you go back to SHAPE and make it better — then share again. Good writers go round this loop more than once."
  },
  2: {
    kid:[
      "This term I fill up with FACTS. I ask questions, research, and make notes in my own words — and I know where each fact came from.",
      "This term my reader is a Year 3 buddy. I plan the steps in the right order so they can follow, then I draft.",
      "This term I check that it's CLEAR. Would my buddy understand every word? Is any step missing or in the wrong order?",
      "This term I test it on a real person, fix the confusing bits, then give it to my buddy and check they understand."],
    looks:[
      ["Writing wonder questions","Reading real explanations to see how they work","Researching: reading, watching, asking an expert","Notes in key words — not copied sentences","Choosing the ONE question I'll answer"],
      ["Audience Card: what my buddy already knows and might ask","Flow chart: first · next · then · finally","Explaining it out loud before I write","Drafting: what it is, then how it works step by step"],
      ["Comparing a strong and a weak explanation","Clarity check: circle words a Year 3 wouldn't know","Checking no step is missing","Topic sentences, linking words, present tense","Setting two goals"],
      ["Helping Circle with the buddy lens","The 'explain it without your paper' test","ADD · CUT · REORDER · REPLACE","Final edit, best copy, labelled diagram, typing","Reading it to the buddy class"]],
    analogy:{ title:"Explaining is like giving directions", parts:[
      "Know the route yourself first.",
      "Find out who's asking — are they driving or walking?",
      "Check your directions for a missing turn.",
      "Watch whether they actually get there."],
      end:"Directions only work if someone arrives." },
    cycle:"Every time a real reader gets confused, you go back to SHAPE, fix that part, and test it again."
  },
  3: {
    kid:[
      "This term I choose an issue I really care about, and I collect reasons and evidence — including what the other side would say.",
      "This term my reader is the person who could say YES. I plan what will change their mind, then I draft.",
      "This term I read it like someone who disagrees with me. Where would they stop believing me? Is my tone firm but polite?",
      "This term I turn my writing into a speech, practise it, and deliver it to a live audience."],
    looks:[
      ["Issue bank: things that are unfair, wasteful, unsafe or unkind","Reading real persuasive texts and speeches","Opinion vs reason vs evidence","Finding the strongest argument against me","Choosing an issue I can actually do something about"],
      ["Audience Card: who can say yes, what they think now, what worries them","Plan: claim → reasons → evidence → other side → call to action","Practising with a partner who plays the decision-maker","Drafting: hook, claim, PEEL paragraphs"],
      ["Comparing a strong and a weak persuasive text","Evidence check: claims with no proof, exaggeration, name-calling","Persuasive tools on purpose: rule of three, questions, repetition","Tone check: firm, not rude (Proverbs 15:1)","Setting two goals"],
      ["Helping Circle: Were you convinced? Where did you doubt me?","Turning my writing into a speech script","ADD · CUT · REORDER · REPLACE","Cue cards, pace, pauses, eye contact","Giving my speech to an audience"]],
    analogy:{ title:"Persuading is like asking for something you really want", parts:[
      "Work out exactly what you're asking for, and why it matters.",
      "Work out WHO to ask and what they care about.",
      "Practise as if they've already said no — then fix that part.",
      "Look them in the eye and ask, politely."],
      end:"How you ask changes the answer." },
    cycle:"Every time you say your speech out loud and it doesn't sound right, go back to SHAPE. Your ears catch what your eyes miss."
  },
  4: {
    kid:[
      "This term I slow down and really look at small things. I write down exactly what I see, hear and feel.",
      "This term my reader will HEAR my poem. I choose a form and decide where the lines break by reading it aloud.",
      "This term I ask of every word: does this earn its place? In a poem, cutting is the best way to improve.",
      "This term I read my poems aloud, publish them in our class anthology, and reflect on how I've grown as a writer."],
    looks:[
      ["Noticing jotter: three small things a day","Looking at one object for two whole minutes","Collecting pictures in words, not opinions","Reading poems and borrowing their moves","Making fresh comparisons"],
      ["Choosing a form: free verse, list, small-moment or shape poem","Testing line breaks by reading aloud","Drafting three poems, not one","Writing for the ear as well as the eye"],
      ["Studying model poems","The cutting pass: cut a third and see what's left","Testing line breaks aloud","Swapping a tired image for a true one","Two goals per poem"],
      ["Helping Circle: Which picture stayed with you?","Reading aloud: pace, pause, quiet","Best copies and the class anthology","My year-in-review reflection","The end-of-year celebration reading"]],
    analogy:{ title:"Writing a poem is like taking a photograph", parts:[
      "Be there, looking, before you take anything.",
      "Choose the frame: what's in and what's left out.",
      "Crop it until only what matters is left.",
      "Show someone, and watch their face."],
      end:"A photo nobody looks at isn't finished." },
    cycle:"In poetry the loop is tight: read it aloud, hear a word that doesn't belong, cut it, read it again."
  }
};

const CHANT = [
  { call:"Stage one!",   response:"What will I write? — I FILL!" },
  { call:"Stage two!",   response:"Who is it for? — I FIND!" },
  { call:"Stage three!", response:"How can it be better? — I SHAPE!" },
  { call:"Stage four!",  response:"Is it ready? — I SHARE!" }
];

/* old wording → new wording, applied across each whole file (day checks, spotlights, routine) */
const SWAPS = [
  ["WHAT do I want to say — I FILL!", "What will I write? — I FILL!"],
  ["What do I want to say — I FILL!", "What will I write? — I FILL!"],
  ["WHO am I saying it to — I FIND!", "Who is it for? — I FIND!"],
  ["Who am I saying it to — I FIND!", "Who is it for? — I FIND!"],
  ["HOW do I want to say it — I SHAPE!", "How can it be better? — I SHAPE!"],
  ["How do I want to say it — I SHAPE!", "How can it be better? — I SHAPE!"],
  ["Is it ready to give away — I SHARE!", "Is it ready? — I SHARE!"],
  ["What do I want to say?", "What will I write about?"],
  ["Who do I want to say it to?", "Who am I writing for?"],
  ["How do I want to say it?", "How can I make it better?"],
  ["Is it ready to give away?", "Is it ready for my reader?"],
  ["Two cupped hands, like holding water", "Cup your two hands together, like you're holding water"]
];

function load(t){
  const file = path.join(ROOT, `focus-term${t}-data.js`);
  const sandbox = { window:{} };
  new Function("window", fs.readFileSync(file,"utf8"))(sandbox.window);
  return { file, data: sandbox.window.__WF_DATA[t] };
}

for (let t=1; t<=4; t++){
  const { file, data } = load(t);
  const old = data.process, tt = TERM[t];
  const stages = CORE.map((c,i) => Object.assign({}, c, {
    kid: tt.kid[i],
    looksLike: tt.looks[i],
    teacherLang: old.stages[i].teacherLang,
    acs: old.stages[i].acs,
    weeks: old.stages[i].weeks
  }));
  const proc = {
    intro: old.intro,
    mnemonic: "FILL · FIND · SHAPE · SHARE",
    mnemonicNote: "Four stages. Four questions. Four hand actions. One chant.",
    stages,
    chant: CHANT,
    analogy: Object.assign({}, tt.analogy, { teacher: old.analogy.text }),
    cycle: tt.cycle,
    cycleTeacher: old.cycleTeacher || old.cycle,
    memoryMoves: old.memoryMoves,
    schedule: old.schedule,
    check: old.check,
    assessment: old.assessment,
    setup: old.setup,
    routine: old.routine
  };
  let src = fs.readFileSync(file,"utf8");
  const start = src.indexOf("\n  process: {");
  const rub = src.indexOf("\n  rubric: [");
  const end = src.lastIndexOf("\n  },", rub) + 5;
  if (start < 0 || rub < 0 || end <= start) throw new Error("Could not find process block in " + file);
  const json = JSON.stringify(proc, null, 2).replace(/\n/g, "\n  ");
  src = src.slice(0, start) + "\n  process: " + json + "," + src.slice(end);
  let n = 0;
  SWAPS.forEach(([a,b]) => { const parts = src.split(a); n += parts.length - 1; src = parts.join(b); });
  fs.writeFileSync(file, src);
  load(t); // re-parse to prove the file is still valid
  console.log(`Term ${t}: process rewritten, ${n} old phrases updated`);
}
