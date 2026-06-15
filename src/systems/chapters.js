// The seven chapters of Mission: Starlight 2. Each is an async storybook
// script: build the diorama, talk, explore, sneak in the learning, light
// the beacon. Dialogue lines can carry stamp:'real'|'magic' — Bolt's
// fact-checker chip marks what's REAL SCIENCE vs STORY MAGIC.
import * as THREE from 'three';
import { WorldScene } from './worldScene.js';
import { collectParts, flareShields, lanternChain, diamondDig, echoBlinks, lensSpot, slingshotRescue, beaconPickup, animate } from './minigames.js';
import { makeBolt, makeAlien, makeLuma, makeLyra, makeRock, makeCrystal, makeGate, makeLighthouse, makePlanet, makeTextSprite, makeGlowSprite } from '../world/builders.js';
import { makeBlackHole } from '../blackhole/blackhole.js';
import * as ui from '../ui/ui.js';
import { pickMath, pickScience, pickReading } from '../edu/engine.js';
import { loadSave, save } from '../save.js';
import { sfx } from '../audio.js';

/* ---------- shared bits ---------- */

async function askScience(topic, opts = {}) {
  return ui.askQuestion(pickScience(topic), { contextLabel: opts.label || "BOLT'S DATABANK CHECK", icon: opts.icon || '🔭', gauge: opts.gauge });
}

async function askMath(skill, opts = {}) {
  return ui.askQuestion(pickMath(skill), { contextLabel: opts.label || 'SHIP COMPUTER', icon: opts.icon || '🧮', gauge: opts.gauge });
}

async function askReadingSet(chapterTag, howMany, opts = {}) {
  const set = pickReading(chapterTag);
  const qs = set.questions.slice(0, howMany);
  for (const q of qs) {
    await ui.askQuestion(q, { contextLabel: opts.label || 'READ CAREFULLY', icon: '📖' });
  }
}

function scatterRocks(scene, n, color, spread = 20) {
  for (let i = 0; i < n; i++) {
    const r = makeRock(0.4 + Math.random() * 1.1, color);
    const a = Math.random() * Math.PI * 2;
    const d = 8 + Math.random() * spread;
    scene.place(r, Math.cos(a) * d, Math.sin(a) * d * 0.7 - 2);
  }
}

async function openScene(game, key) {
  const scene = new WorldScene(game, key);
  game.setScene(scene);
  await ui.fade(false);
  return scene;
}

async function closeScene(game, scene) {
  await ui.fade(true);
  scene.dispose();
}

/* ============================================================
   CHAPTER 1 — RETURN TO PLANET NINE
============================================================ */
export async function chapterPlanetNine(game) {
  const scene = await openScene(game, 'planet9');
  scatterRocks(scene, 10, 0x3a2a5e);

  const bolt = scene.place(makeBolt(), -3, 2, { id: 'bolt', ry: 0.6 });

  await ui.dialogue([
    { who: 'bolt', text: 'Cadet! We made it back to Planet Nine — the quietest, darkest corner of the whole solar system.' },
    { who: 'bolt', text: 'And there it is again... beep... beep... beep... The strange signal! It\'s coming from THROUGH the planet somehow. Come here, my scanner is going wild!' }
  ]);

  await scene.waitInteract('bolt');
  await ui.dialogue([
    { who: 'signal', text: 'beep... beep-beep... beeeeep... (it repeats, again and again, like someone calling from very far away)' },
    { who: 'bolt', text: 'It\'s not FROM Planet Nine. The planet is passing it along — like a relay tower! Something behind it, in deep space, is calling.', stamp: 'magic' }
  ]);
  await ui.giveClue('c1');

  // the dormant gate, hidden in a crater
  const gate = makeGate(5);
  gate.position.y = 5.5;
  gate.rotation.y = 0.4;
  scene.place(gate, -9, -7, { id: 'gate' });
  const gateGlow = makeGlowSprite(0x5ce8ff, 4);
  gateGlow.position.set(-9, 5.5, -7);
  scene.scene.add(gateGlow);

  await ui.dialogue([
    { who: 'bolt', text: 'Wait. WAIT. My lights just caught something in that crater. Something HUGE. Cadet... that is not a rock. Go look!' }
  ]);

  await scene.waitInteract('gate');
  await ui.dialogue([
    { who: 'bolt', text: 'A giant ring of ancient metal! It\'s covered in glowing writing. My translator chip can read it — but YOU should read it with me. This is a once-in-forever discovery!' }
  ]);
  await askReadingSet('planet9', 4, { label: 'READ THE GLYPHS ON THE GATE' });
  await ui.giveClue('c2');
  await ui.giveCard('gate');

  await ui.dialogue([
    { who: 'bolt', text: 'A STAR GATE! Built by the Lightwrights, whoever they were. It opens light-rivers between the stars!' },
    { who: 'bolt', text: 'Important fact-check, Cadet: in REAL science, nothing travels faster than light, and nobody has found a gate like this. This part is story magic — our secret adventure!', stamp: 'magic' },
    { who: 'bolt', text: 'But the glyphs said: feed it starlight, and speak TRUE THINGS about the universe. True things... like the answers to my databank questions!' }
  ]);

  await ui.dialogue([
    { who: 'gate', text: '...POWER... LOW... SPEAK... TRUE... THINGS...' }
  ]);
  await askMath('multiplication', { label: 'CHARGE THE GATE: TRUE NUMBERS', icon: '🌀', gauge: { current: 0, total: 3, icon: '🌀' } });
  await askMath('multiplication', { label: 'CHARGE THE GATE: TRUE NUMBERS', icon: '🌀', gauge: { current: 1, total: 3, icon: '🌀' } });
  await askScience('lightspeed', { label: 'CHARGE THE GATE: TRUE SCIENCE', icon: '🌀', gauge: { current: 2, total: 3, icon: '🌀' } });

  // the gate wakes: glyphs light one by one, the film shimmers on
  sfx.shard();
  const glyphs = gate.userData.glyphs;
  for (let i = 0; i < glyphs.length; i++) {
    glyphs[i].material.emissiveIntensity = 3;
    sfx.tap();
    await animate(140, () => {});
  }
  await animate(900, (k) => { gate.userData.film.material.opacity = k * 0.35; });
  sfx.fanfare();

  // Luma arrives, all grown up (a bit)
  const luma = makeLuma(1.1);
  scene.place(luma, 2, -2);
  await animate(800, (k) => { luma.position.y = k * 2.5; });
  await ui.dialogue([
    { who: 'luma', text: 'CADET! BOLT! I flew all the way from the Orion Nebula — I heard the signal too! All the young stars can hear it.' },
    { who: 'luma', text: 'It\'s a star\'s voice. An OLD star. The elders say her name with starlight: Nana Lyra. She left our nursery ages ago to map the galaxy... and never came home.' },
    { who: 'player', text: 'Then we\'ll find her. Mysteries are still our favorite!' },
    { who: 'luma', text: 'I hoped you\'d say that! I\'ll ride in your ship\'s heart-cradle and light the way. Let\'s follow the signal down the light-river!' }
  ]);
  await ui.giveCard('luma');
  await ui.giveCard('bolt');

  await ui.dialogue([
    { who: 'bolt', text: 'The gate\'s map says the signal hops between star systems — like lighthouses passing a message! First stop: the closest star to home. Proxima Centauri — 4 light-years away!', stamp: 'real' },
    { who: 'bolt', text: 'In a rocket, that trip would take thousands of years. In a light-river? We\'ll be there by snack time. Buckle up, Cadet!' }
  ]);
  await ui.giveBeacon('Planet Nine — the Gate');

  await closeScene(game, scene);
}

/* ============================================================
   CHAPTER 2 — PROXIMA CENTAURI B
============================================================ */
export async function chapterProxima(game) {
  const scene = await openScene(game, 'proxima');
  scatterRocks(scene, 12, 0x5a2a28);

  // the little red sun, big in the sky
  const redSun = makePlanet('reddwarf', 7);
  redSun.position.set(-16, 16, -55);
  scene.scene.add(redSun);

  const ember = scene.place(makeAlien('ember'), -4, -2, { id: 'ember', ry: 0.8 });

  await ui.dialogue([
    { who: 'bolt', text: 'Proxima Centauri b! The closest planet outside our solar system — and look at that little red sun. It\'s a RED DWARF, smaller and cooler than ours.', stamp: 'real' },
    { who: 'luma', text: 'The signal is louder here! And... is that a little flame person waving at us?' }
  ]);

  await scene.waitInteract('ember');
  await ui.dialogue([
    { who: 'ember', text: 'Visitors! From the YELLOW-sun place?! Oh, you picked a spicy day to come. Our little red sun is in a flaring mood.' },
    { who: 'ember', text: 'I\'m Ember, the storm-watcher. I found a page of my watch-log for you — read it FAST, the freckles are already growing!' }
  ]);
  await askReadingSet('proxima', 3, { label: "READ THE STORM-WATCHER'S LOG" });

  await ui.dialogue([
    { who: 'ember', text: 'You read well! Now help me protect the village. Shield power runs on quick math — charge it up!' }
  ]);
  await askMath('comparison', { label: 'SHIELD POWER CHECK', icon: '🛡', gauge: { current: 0, total: 2, icon: '🛡' } });
  await askMath('addition', { label: 'SHIELD POWER CHECK', icon: '🛡', gauge: { current: 1, total: 2, icon: '🛡' } });

  await ui.dialogue([
    { who: 'ember', text: 'Shields charged! Now watch the sun with me. When the freckles grow and the wind hums — SHIELDS UP! Ready?' }
  ]);
  await flareShields(3);

  await ui.dialogue([
    { who: 'ember', text: 'THREE flares, zero singed eyebrows! You\'re a natural storm-watcher.' },
    { who: 'bolt', text: 'Fun fact, Cadet: red dwarf flares are real — Proxima\'s flares can outburst our own Sun\'s! Planets here get quite the light show.', stamp: 'real' },
    { who: 'ember', text: 'Your signal? I hear it too, between the flares. It repeats every SEVEN blinks. Seven... like a code passed by seven of something. It comes from the lantern worlds. TRAPPIST-1!' }
  ]);
  await ui.giveClue('c3');
  await askScience('proxima');
  await ui.giveCard('ember');

  await ui.dialogue([
    { who: 'luma', text: 'A beacon for the chain! Ember, keep watching your storms — we\'ll follow the sevens!' }
  ]);
  await beaconPickup(scene);
  await ui.giveBeacon('Proxima Centauri b');

  await closeScene(game, scene);
}

/* ============================================================
   CHAPTER 3 — TRAPPIST-1
============================================================ */
export async function chapterTrappist(game) {
  const scene = await openScene(game, 'trappist');
  scatterRocks(scene, 8, 0x2a4252);

  // six sister planets hanging huge in the sky
  for (let i = 0; i < 6; i++) {
    const p = makePlanet('trappist', 1.6 + Math.random() * 1.2);
    p.position.set(-22 + i * 9, 18 + Math.sin(i * 2) * 4, -60 - i * 6);
    scene.scene.add(p);
  }

  const keeper = scene.place(makeAlien('keeper'), -4, -2, { id: 'keeper', ry: 0.8 });

  await ui.dialogue([
    { who: 'bolt', text: 'The TRAPPIST-1 system! SEVEN Earth-sized planets around one tiny star — that\'s real, Cadet, astronomers found them in 2017!', stamp: 'real' },
    { who: 'luma', text: 'Look UP! The other planets are so close they look like moons! It\'s like standing inside a mobile!' }
  ]);

  await scene.waitInteract('keeper');
  await ui.dialogue([
    { who: 'keeper', text: 'Welcome, light-river riders! You arrived JUST in time — tonight is the Festival of Seven!' },
    { who: 'keeper', text: 'Here\'s your invitation. Read it carefully — the lantern chain has rules!' }
  ]);
  await askReadingSet('trappist', 3, { label: 'READ THE FESTIVAL INVITATION' });

  await ui.dialogue([
    { who: 'keeper', text: 'But oh no — our practice run scrambled the order! The lanterns drift in a pattern, you see. Help me warm up with pattern-math first.' }
  ]);
  await askMath('patterns', { label: "THE KEEPER'S PATTERN WARM-UP", icon: '🏮', gauge: { current: 0, total: 1, icon: '🏮' } });

  // the seven lantern worlds, as glowing minis to tap in order
  const letters = ['b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ids = letters.map((L) => 'tp-' + L);
  letters.forEach((L, i) => {
    const mini = new THREE.Group();
    const ball = makePlanet('trappist', 0.9);
    ball.position.y = 1.6;
    mini.add(ball);
    const lamp = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.3, 0),
      new THREE.MeshStandardMaterial({ color: 0x4a5568, emissive: 0x222838, emissiveIntensity: 0.4 })
    );
    lamp.position.y = 3;
    mini.add(lamp);
    mini.userData.lamp = lamp;
    const tag = makeTextSprite(L.toUpperCase(), { size: 90, color: '#ffd95c' });
    tag.position.y = 4.2;
    mini.add(tag);
    const a = Math.PI * 0.12 + (i / 6) * Math.PI * 0.76;
    scene.place(mini, Math.cos(a) * 10.5, -Math.sin(a) * 7 - 1, { id: ids[i] });
  });

  await ui.dialogue([
    { who: 'keeper', text: 'Now — pass the festival light down the chain! Tap the worlds in orbit order: b, c, d, e, f, g, h. If one misses its turn, the chain goes dark!' }
  ]);
  await lanternChain(scene, ids);

  await ui.dialogue([
    { who: 'keeper', text: 'THE CHAIN IS LIT! All seven worlds are cheering — can you hear the lanterns chime?' },
    { who: 'keeper', text: 'And now you see our secret: your mystery signal travels the SAME way. Light passed along, world to world, lighthouse to lighthouse — all the way from the galaxy\'s heart.' }
  ]);
  await ui.giveClue('c4');
  await askScience('trappist');
  await ui.giveCard('septet');

  await beaconPickup(scene);
  await ui.giveBeacon('TRAPPIST-1');

  await closeScene(game, scene);
}

/* ============================================================
   CHAPTER 4 — 55 CANCRI E, THE DIAMOND PLANET
============================================================ */
export async function chapterCancri(game) {
  const scene = await openScene(game, 'cancri');

  // lava glow vents
  for (let i = 0; i < 7; i++) {
    const vent = makeGlowSprite(0xff6a1a, 3 + Math.random() * 3);
    const a = Math.random() * Math.PI * 2;
    const d = 10 + Math.random() * 14;
    vent.position.set(Math.cos(a) * d, 0.4, Math.sin(a) * d * 0.7 - 2);
    scene.scene.add(vent);
  }

  const smelt = scene.place(makeAlien('smelt'), -4, -2, { id: 'smelt', ry: 0.8 });

  await ui.dialogue([
    { who: 'bolt', text: 'Careful, Cadet — 55 Cancri e! A year here lasts 18 HOURS, and the day side is an ocean of lava. We parked on the cooler night side. Mostly.', stamp: 'real' },
    { who: 'luma', text: 'The ground is sparkling... and something stocky and shiny is stomping over!' }
  ]);

  await scene.waitInteract('smelt');
  await ui.dialogue([
    { who: 'smelt', text: 'New helpers! HA! Smelt\'s the name. You\'re just in time — the deep crystals started HUMMING yesterday. Never heard anything like it.' },
    { who: 'smelt', text: 'But first — safety briefing! Every miner reads the rules. Twice, if the heat\'s gotten to them.' }
  ]);
  await askReadingSet('cancri', 3, { label: "READ THE MINER'S RULES" });

  await ui.dialogue([
    { who: 'smelt', text: 'Rule three, remember? Count everything twice! Prove your counting circuits work — multiply me some crystal crates!' }
  ]);
  await askMath('multiplication', { label: 'CRYSTAL CRATE MATH', icon: '⛏️', gauge: { current: 0, total: 2, icon: '⛏️' } });
  await askMath('wordprob', { label: 'CRYSTAL CRATE MATH', icon: '⛏️', gauge: { current: 1, total: 2, icon: '⛏️' } });

  // mounds: 6 spots, 3 real diamonds
  const moundIds = [];
  const diamondAt = new Set();
  while (diamondAt.size < 3) diamondAt.add(Math.floor(Math.random() * 6));
  for (let i = 0; i < 6; i++) {
    const mound = new THREE.Group();
    const rock = makeRock(1.1, 0x3a2018);
    mound.add(rock);
    mound.userData.isDiamond = diamondAt.has(i);
    const a = Math.PI * 0.15 + (i / 5) * Math.PI * 0.7;
    const id = 'mound-' + i;
    moundIds.push(id);
    scene.place(mound, Math.cos(a) * 9.5, -Math.sin(a) * 6.5 - 1, { id });
  }

  await ui.dialogue([
    { who: 'smelt', text: 'The humming comes from REAL diamonds — deep, dark, and cool. Glitter crystals just POP. Dig till you find THREE humming diamonds!' }
  ]);
  await diamondDig(scene, moundIds, 3);

  await ui.dialogue([
    { who: 'smelt', text: 'Three true diamonds! And listen... they\'re all humming the SAME hum. That\'s no ordinary song.' },
    { who: 'smelt', text: 'Crystals only hum like that for an old star\'s voice. Someone ANCIENT is singing through your signal, friends.' },
    { who: 'luma', text: 'Nana Lyra... it has to be her. We\'re getting closer!' }
  ]);
  await ui.giveClue('c5');
  await askScience('cancri');
  await ui.giveCard('smelt');

  await beaconPickup(scene);
  await ui.giveBeacon('the Diamond Planet');

  await closeScene(game, scene);
}

/* ============================================================
   CHAPTER 5 — THE PULSAR LIGHTHOUSE
============================================================ */
export async function chapterPulsar(game) {
  const scene = await openScene(game, 'pulsar');

  const lighthouse = makeLighthouse(7);
  scene.place(lighthouse, -8, -8);

  const tick = scene.place(makeAlien('tick'), -4, -2, { id: 'tick', ry: 0.8 });

  await ui.dialogue([
    { who: 'bolt', text: 'A station orbiting a PULSAR — a spinning star-heart that blinks like a lighthouse. Pulsars are real, Cadet, and they\'re the best clocks in the universe!', stamp: 'real' },
    { who: 'luma', text: 'The whole station hums with the blinking... it\'s beautiful. And there\'s the keeper!' }
  ]);

  await scene.waitInteract('tick');
  await ui.dialogue([
    { who: 'tick', text: 'Tick-tock! Travelers from the gate-road! I am Tick, keeper of Lighthouse Seven. I have been WAITING for someone to come about the message.' },
    { who: 'tick', text: 'A letter — I wrote it all down. Read it. Then you will understand why I light the lamp extra bright these nights.' }
  ]);
  await askReadingSet('pulsar', 4, { label: "READ THE KEEPER'S LETTER" });
  await ui.giveClue('c6');

  await ui.dialogue([
    { who: 'tick', text: '"Caught in the giant\'s spiral. Slowing." The giant at the center of the galaxy, friends. The Great Anchor. The supermassive black hole.' },
    { who: 'bolt', text: 'Sagittarius A*! It\'s REAL — a black hole as heavy as 4 million Suns sits at the center of our galaxy. Scientists even photographed its glowing ring in 2022!', stamp: 'real' },
    { who: 'tick', text: 'To relay your reply up the chain, my lighthouse must be tuned PERFECTLY. First: numbers. A keeper\'s timing is all place-value and take-aways.' }
  ]);
  await askMath('counting', { label: 'TUNE THE LIGHTHOUSE', icon: '🗼', gauge: { current: 0, total: 2, icon: '🗼' } });
  await askMath('subtraction', { label: 'TUNE THE LIGHTHOUSE', icon: '🗼', gauge: { current: 1, total: 2, icon: '🗼' } });

  await ui.dialogue([
    { who: 'tick', text: 'Now the real test — a keeper must COUNT THE BLINKS exactly. Watch my lamp, count, then drum the echo back!' }
  ]);
  await echoBlinks(scene, lighthouse, [3, 5, 7]);

  await ui.dialogue([
    { who: 'tick', text: 'PERFECT echoes! You have lighthouse-keeper hearts, all three of you.' },
    { who: 'tick', text: 'Message away: "WE ARE COMING, NANA LYRA." Now fly, friends. The last river runs to the heart of the galaxy — 26,000 light-years from your little Sun.' }
  ]);
  await askScience('pulsar');
  await ui.giveCard('tick');

  await beaconPickup(scene);
  await ui.giveBeacon('the Pulsar Lighthouse');

  await closeScene(game, scene);
}

/* ============================================================
   CHAPTER 6 — SAGITTARIUS A*
============================================================ */
export async function chapterBlackhole(game) {
  const scene = await openScene(game, 'blackhole');

  // the supermassive black hole, vast in the sky
  const hole = makeBlackHole(44);
  hole.position.set(0, 15, -52);
  scene.scene.add(hole);

  await ui.dialogue([
    { who: 'bolt', text: 'Cadet... we\'re here. The center of the Milky Way. And THAT... that is Sagittarius A*.' },
    { who: 'bolt', text: 'See the glowing ring? That\'s superheated gas swirling around the dark shadow. The real Event Horizon Telescope photographed exactly this in 2022!', stamp: 'real' },
    { who: 'luma', text: 'It\'s not scary like I thought. It\'s... almost beautiful. Like a campfire for the whole galaxy.' },
    { who: 'bolt', text: 'And remember: black holes don\'t chase anyone. Stay outside the event horizon and gravity treats you like any star. We\'re standing on an ancient Lightwright platform, perfectly safe.', stamp: 'real' }
  ]);

  await ui.dialogue([
    { who: 'bolt', text: 'Now — somewhere in that bright swirl of orbiting stars is Nana Lyra. My telescope can find her the lighthouse-keeper way: gravity BENDS light. Watch for a star that smears into an arc!' }
  ]);
  await lensSpot(1);
  await lensSpot(2);
  await lensSpot(3);

  await ui.dialogue([
    { who: 'bolt', text: 'THERE SHE IS. Locked on! She\'s circling close — too close — and every loop drops her a little lower.' },
    { who: 'signal', text: '...you came... little nursery-light, you CAME... let me show you my story before we fly...' }
  ]);
  await askReadingSet('blackhole', 4, { label: "NANA LYRA'S STORY" });
  await ui.giveCard('sgra');

  // Lyra appears, circling the hole
  const lyra = makeLyra(1.8);
  scene.scene.add(lyra);

  await ui.dialogue([
    { who: 'lyra', text: 'A push at just the right moment, little ones. That is all I need. Your ship\'s tow-beam, my speed, and gravity itself — we can do this TOGETHER.' },
    { who: 'bolt', text: 'A gravity slingshot! Real spaceships do this all the time — swing close, borrow speed, fling away faster! But the timing must be PERFECT.', stamp: 'real' },
    { who: 'bolt', text: 'Power up the tow-beam with me first. Big numbers for a big rescue!' }
  ]);
  await askMath('subtraction', { label: 'TOW-BEAM POWER', icon: '🚀', gauge: { current: 0, total: 2, icon: '🚀' } });
  await askMath('comparison', { label: 'TOW-BEAM POWER', icon: '🚀', gauge: { current: 1, total: 2, icon: '🚀' } });

  await ui.dialogue([
    { who: 'luma', text: 'Nana Lyra glows GREEN when she crosses the boost window. That\'s your moment — BOOST!' }
  ]);
  await slingshotRescue(scene, lyra, hole.position);

  await ui.dialogue([
    { who: 'lyra', text: 'HA-HAAA! Free! Oh, I\'d forgotten how the open dark FEELS! Thank you, thank you, brave little lights!' },
    { who: 'lyra', text: 'And do not be cross with the Great Anchor. It never chased me — I flew too close on my own. Gravity is not a monster. It is just very, very strong.' },
    { who: 'luma', text: 'That\'s what we learned about Planet Nine too, Nana! Gravity isn\'t mean...' },
    { who: 'lyra', text: '...it\'s just strong. Ha! Spoken like a true star of Orion. Now — take an old star home?' },
    { who: 'player', text: 'Setting course for the Orion Nebula. ALL the lighthouses are going to hear about this!' }
  ]);
  await ui.giveClue('c7');
  await askScience('blackhole');
  await ui.giveCard('lyra');

  await beaconPickup(scene);
  await ui.giveBeacon('Sagittarius A*');

  await closeScene(game, scene);
}

/* ============================================================
   CHAPTER 7 — FINALE: THE LONG WAY HOME
============================================================ */
export async function chapterFinale(game) {
  const scene = await openScene(game, 'finale');

  const lyra = makeLyra(1.6);
  scene.place(lyra, -3, -3);
  lyra.position.y = 2.5;
  const luma = makeLuma(1.1);
  scene.place(luma, 3, -3);
  luma.position.y = 2.5;
  const bolt = scene.place(makeBolt(), 0, 2, { ry: Math.PI });

  // baby stars peeking out of the nebula
  for (let i = 0; i < 7; i++) {
    const baby = makeLuma(0.4 + Math.random() * 0.3);
    const a = (i / 7) * Math.PI * 2;
    scene.place(baby, Math.cos(a) * 13, Math.sin(a) * 8 - 3);
    baby.position.y = 1.5 + Math.random() * 2;
  }

  await ui.dialogue([
    { who: 'luma', text: 'HOME! The Orion Nebula! And look — the whole nursery came out to see!' },
    { who: 'lyra', text: 'Six hundred years I mapped this galaxy, and no sight ever beat this one. Hello, little ones! Yes, yes, I have STORIES.' },
    { who: 'bolt', text: 'Before the stories — Bolt has mail! A postcard I wrote along the way. Cadet, read it with me?' }
  ]);
  await askReadingSet('finale', 3, { label: 'READ THE POSTCARD HOME' });

  await ui.dialogue([
    { who: 'lyra', text: 'One last thing, Cadet. The lighthouse chain that carried my voice — it must never go dark again. Will you light the relay, beacon by beacon, all the way back to your little Sun?' },
    { who: 'bolt', text: 'Seven beacons, seven true things! Light them up, Cadet!' }
  ]);

  // light the relay: 7 mixed review questions, each lights a beacon star
  const reviewPlan = ['multiplication', 'addition', 'patterns', 'science:blackhole', 'science:pulsar', 'comparison', 'wordprob'];
  for (let i = 0; i < reviewPlan.length; i++) {
    const spec = reviewPlan[i];
    const gauge = { current: i, total: reviewPlan.length, icon: '🗼' };
    if (spec.startsWith('science:')) {
      await askScience(spec.split(':')[1], { label: `LIGHT BEACON ${i + 1} OF 7`, icon: '🗼', gauge });
    } else {
      await askMath(spec, { label: `LIGHT BEACON ${i + 1} OF 7`, icon: '🗼', gauge });
    }
    sfx.shard();
    lyra.userData.core.material.emissiveIntensity = 2.2 + ((i + 1) / 7) * 4;
    luma.userData.core.material.emissiveIntensity = 2.8 + ((i + 1) / 7) * 4;
    ui.toast(`🗼 Beacon ${i + 1} of 7 shines across the galaxy!`, true);
  }

  await ui.giveBeacon('home — the Orion Nebula');

  const s = loadSave();
  await ui.dialogue([
    { who: 'lyra', text: 'The chain is LIT! From the heart of the galaxy to a quiet little Sun on a spiral arm... every lighthouse is singing your name, Cadet.' },
    { who: 'luma', text: `${s.name || 'Cadet'}... you found my shards when I was lost, and now you\'ve brought Nana home. You really are made of starlight. The brightest kind.` },
    { who: 'bolt', text: 'Final fact-check of the mission: every atom in you really was made inside a star. Stamp it, Cadet: REAL SCIENCE.', stamp: 'real' },
    { who: 'lyra', text: 'Come back any time, river-rider. The gate knows your name now. And galaxies are FULL of mysteries...' }
  ]);

  s.chapter = 7;
  save();
  game.checkBadges();

  await ui.rewardBurst('🌟', 'MISSION COMPLETE!', `Cadet ${s.name || ''} rode the light-rivers, rescued Nana Lyra from the supermassive black hole, and lit the lighthouse chain across the galaxy!`);

  await closeScene(game, scene);
}

export const CHAPTER_SCRIPTS = [
  chapterPlanetNine,
  chapterProxima,
  chapterTrappist,
  chapterCancri,
  chapterPulsar,
  chapterBlackhole,
  chapterFinale
];
