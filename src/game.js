// The conductor: render pipeline, scene switching, story progression, badges.
import * as THREE from 'three';
import { loadSave, save, resetSave, loadGame1Save } from './save.js';
import { CHAPTERS, BADGES } from './content.js';
import { CHAPTER_SCRIPTS } from './systems/chapters.js';
import { HyperspaceScene } from './hyperspace/hyperspace.js';
import { makeStarfield, makePlanet, makeGate, makeNebulaCloud } from './world/builders.js';
import { makeBlackHole } from './blackhole/blackhole.js';
import { runKillerStarSlice } from './systems/sliceScene.js';
import { Pipeline } from './fx/post.js';
import * as ui from './ui/ui.js';
import { pickMath } from './edu/engine.js';
import { openParentZone } from './ui/parent.js';
import { sfx } from './audio.js';
import { collectSagaPiece } from './saga.js';

// jump-calculation skill per destination chapter (index 1-6; chapter 0 needs no jump)
const JUMP_SKILLS = [null, 'addition', 'patterns', 'multiplication', 'subtraction', 'wordprob', 'comparison'];

class TitleBackdrop {
  constructor(game) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 2000);
    this.camera.position.set(0, 2, 26);
    this.scene.add(makeStarfield(game.lowDetail ? 500 : 1400));
    this.scene.add(new THREE.HemisphereLight(0x8899ff, 0x110a22, 2.2));
    const sun = new THREE.DirectionalLight(0xfff2dd, 3.2);
    sun.position.set(30, 20, 10);
    this.scene.add(sun);

    // the sequel's poster shot: Sgr A* looming, the gate glinting, worlds drifting
    this.hole = makeBlackHole(34);
    this.hole.position.set(14, 6, -60);
    this.scene.add(this.hole);

    this.gate = makeGate(4);
    this.gate.position.set(-16, -3, -34);
    this.gate.rotation.y = 0.7;
    this.gate.userData.glyphs.forEach((g) => (g.material.emissiveIntensity = 2));
    this.gate.userData.film.material.opacity = 0.25;
    this.scene.add(this.gate);

    const cloud = makeNebulaCloud(0x6a4a9e, 10, 50);
    cloud.position.set(0, 8, -80);
    this.scene.add(cloud);

    this.planets = [];
    const layout = [['planet9', 2.6, -7, 6, -44], ['trappist', 1.8, 20, -6, -38], ['cancri', 1.4, 6, -8, -30]];
    for (const [key, r, x, y, z] of layout) {
      const p = makePlanet(key, r);
      p.position.set(x, y, z);
      this.scene.add(p);
      this.planets.push(p);
    }
  }
  update(dt, t) {
    for (const p of this.planets) p.rotation.y += dt * 0.12;
    this.gate.rotation.z = t * 0.1;
    this.hole.userData.update(dt, t);
    this.hole.userData.face(this.camera);
    this.camera.position.x = Math.sin(t * 0.08) * 4;
    this.camera.lookAt(0, 0, -30);
  }
  dispose() {}
}

export class Game {
  constructor() {
    this.pipeline = new Pipeline(document.getElementById('scene'));
    this.activeScene = null;
    this.clock = new THREE.Clock();

    addEventListener('resize', () => {
      this.pipeline.resize();
      if (this.activeScene?.camera) {
        this.activeScene.camera.aspect = innerWidth / innerHeight;
        this.activeScene.camera.updateProjectionMatrix();
      }
    });

    const loop = () => {
      requestAnimationFrame(loop);
      const dt = Math.min(this.clock.getDelta(), 0.1);
      const t = this.clock.elapsedTime;
      if (this.activeScene) {
        this.activeScene.update?.(dt, t);
        this.pipeline.render(dt);
      }
    };
    loop();
  }

  /** Compatibility with the proven scene code from game 1. */
  get renderer() { return this.pipeline.renderer; }
  get lowDetail() { return this.pipeline.quality === 'low'; }

  setScene(sceneObj) {
    this.activeScene = sceneObj;
    if (sceneObj?.camera) {
      sceneObj.camera.aspect = innerWidth / innerHeight;
      sceneObj.camera.updateProjectionMatrix();
      this.pipeline.attach(sceneObj.scene, sceneObj.camera);
      // scene-appropriate bloom: hyperspace and the title burn brighter
      if (sceneObj instanceof HyperspaceScene) this.pipeline.setBloom(0.85, 0.55, 0.8);
      else if (sceneObj instanceof TitleBackdrop) this.pipeline.setBloom(1.0, 0.65, 0.75);
      else this.pipeline.setBloom(0.8, 0.55, 0.85);
    }
  }

  openParentZone() {
    openParentZone(this, () => location.reload());
  }

  checkBadges() {
    const s = loadSave();
    for (const badge of BADGES) {
      const earned = badge.test(s);
      if (earned && !s.badges.includes(badge.id)) {
        s.badges.push(badge.id);
        save();
        const prize = s.parent.prizes.find((p) => p.milestone === badge.id);
        ui.rewardBurst(badge.icon, `Badge earned: ${badge.name}!`,
          prize ? `Show a grown-up — this badge is worth a real prize: "${prize.reward}" 🎁` : 'You\'re becoming a legend of the spaceways!');
      }
      if (badge.id === 'finish' && earned) collectSagaPiece('game2');
    }
  }

  /** If the screen is still black from a scene change, fade back in over the starry backdrop. */
  async toBackdrop() {
    if (!this.backdrop) this.backdrop = new TitleBackdrop(this);
    this.setScene(this.backdrop);
    if (ui.isFaded()) await ui.fade(false);
  }

  /** Jump calculations (math gate) + ride the light-river to a destination. */
  async jump(chapterIdx, destName) {
    if (ui.isFaded()) await this.toBackdrop();
    await ui.dialogue([
      { who: 'luma', text: `Gate locked on ${destName}! The light-river is humming...` },
      { who: 'bolt', text: 'But a jump needs JUMP CALCULATIONS — true numbers to open the way. Ready, Cadet?' }
    ]);
    const skill = JUMP_SKILLS[Math.min(chapterIdx, 6)] || 'addition';
    for (let i = 0; i < 2; i++) {
      await ui.askQuestion(pickMath(skill), {
        contextLabel: `JUMP CALCULATION ${i + 1} OF 2`,
        icon: '🌀',
        gauge: { current: i, total: 2, icon: '🌀' }
      });
    }
    await ui.dialogue([
      { who: 'bolt', text: 'Gate is OPEN! Steer with the joystick, hold LIGHTSPEED to zoom, catch ⭐ photons, and dodge those purple gravity ripples!' }
    ]);

    await ui.fade(true);
    const ride = new HyperspaceScene(this, destName);
    this.setScene(ride);
    await ui.fade(false);
    await ride.run();      // resolves faded-to-black after arrival
    ride.dispose();
    ui.countJump();
  }

  async start() {
    const s = loadSave();
    ui.buildHUD(this);

    // PHASE-A vertical slice: boot straight to the Pinwheel showpiece to benchmark it.
    if (new URLSearchParams(location.search).has('slice')) {
      await runKillerStarSlice(this);
      return;
    }

    this.checkBadges();   // backfills saga progress for already-finished saves
    await this.toBackdrop();

    // same github.io origin: greet the hero of game 1 by name
    const g1 = loadGame1Save();
    let greeting = null;
    if (g1?.name && !s.name) {
      greeting = g1.chapter >= 7
        ? `🏅 Welcome back, Cadet ${g1.name} — Hero of Luma!`
        : `👋 Good to see you again, Cadet ${g1.name}!`;
    }

    const choice = await ui.titleScreen(!!s.name, greeting);
    if (choice === 'new') {
      resetSave();
      return this.start();
    }

    if (!s.name) {
      const name = await ui.nameEntry(g1?.name || '');
      s.name = name;
      if (g1?.chapter >= 7 && g1?.name?.toLowerCase() === name.toLowerCase()) {
        s.game1Hero = true;   // unlocks the Hero of Luma badge
      }
      save();
      this.checkBadges();
    }

    if (!s.seenIntro) {
      s.seenIntro = true;
      save();
      await ui.dialogue([
        { who: 'bolt', text: `Cadet ${s.name}, reporting for duty again! Bolt here — now with a brand-new FACT-CHECKER chip. Beep!` },
        { who: 'bolt', text: 'It\'s been a year since we brought Luma home. But three nights ago, every radio on Earth caught the same whisper from deep space...' },
        { who: 'signal', text: 'beep... beep-beep... beeeeep...' },
        { who: 'bolt', text: 'It repeats. It\'s getting fainter. And here\'s the strange part: it\'s coming from the direction of... PLANET NINE. Buckle up, Cadet. We\'re going back.' }
      ]);
    }

    // story loop
    while (loadSave().chapter < CHAPTERS.length) {
      const i = loadSave().chapter;
      const ch = CHAPTERS[i];
      if (ui.isFaded()) await this.toBackdrop();
      try {
        await ui.chapterCard(i + 1, ch.name, ch.sub);
        if (i === 0) {
          await ui.fade(true);      // the long rocket ride out — montage style
        } else {
          await this.jump(i, ch.name);
        }
        await CHAPTER_SCRIPTS[i](this);
        const st = loadSave();
        st.chapter = i + 1;
        save();
        this.checkBadges();
      } catch (e) {
        if (e instanceof ui.DemotionSignal) { await this.goBackAChapter(i); continue; }
        throw e;
      }
    }

    // story complete: free-play replay menu
    await this.freePlay();
  }

  /** Three cumulative wrong answers: bounce the player back one chapter to practice, then work forward again. */
  async goBackAChapter(fromIndex) {
    const target = Math.max(0, fromIndex - 1);
    const st = loadSave();
    st.chapter = target;
    save();
    // tear down any half-built chapter scene so we return cleanly to the backdrop
    if (this.activeScene && this.activeScene !== this.backdrop && this.activeScene.dispose) {
      try { this.activeScene.dispose(); } catch { /* best effort */ }
    }
    ui.setObjective('');
    if (!ui.isFaded()) await ui.fade(true);
    await this.toBackdrop();
    await ui.dialogue([
      { who: 'bolt', text: `Oops meter's full, Cadet — totally okay! Let's loop back to ${CHAPTERS[target].name} and warm up those brain-thrusters. 🚀` }
    ]);
  }

  async freePlay() {
    for (;;) {
      await this.toBackdrop();
      const pick = await this.replayMenu();
      try {
        await ui.chapterCard(pick + 1, CHAPTERS[pick].name, CHAPTERS[pick].sub);
        if (pick === 0) await ui.fade(true);
        else await this.jump(pick, CHAPTERS[pick].name);
        await CHAPTER_SCRIPTS[pick](this);
      } catch (e) {
        if (!(e instanceof ui.DemotionSignal)) throw e;   // in free-play, just bow back out to the menu
      }
    }
  }

  replayMenu() {
    return new Promise((resolve) => {
      const screen = document.createElement('div');
      screen.className = 'screen dim';
      const title = document.createElement('div');
      title.className = 'title-sub';
      title.textContent = '🌟 Mission complete! Ride any light-river again:';
      screen.appendChild(title);
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:80vw;';
      CHAPTERS.forEach((ch, i) => {
        const b = document.createElement('button');
        b.className = 'dlg-btn primary';
        b.textContent = `${i + 1}. ${ch.name}`;
        b.onclick = () => { sfx.tap(); screen.remove(); resolve(i); };
        wrap.appendChild(b);
      });
      screen.appendChild(wrap);
      document.getElementById('ui').appendChild(screen);
    });
  }
}
