// Story content shared across the sequel: chapter list, mystery clues,
// collectible crew cards, and milestone badges.

export const CHAPTERS = [
  { id: 0, key: 'planet9',  name: 'Return to Planet Nine',  sub: 'The signal in the dark',       world: 'planet9' },
  { id: 1, key: 'proxima',  name: 'Proxima Centauri b',     sub: 'Storms of the little red sun', world: 'proxima' },
  { id: 2, key: 'trappist', name: 'TRAPPIST-1',             sub: 'The festival of seven worlds', world: 'trappist' },
  { id: 3, key: 'cancri',   name: 'The Diamond Planet',     sub: 'Oceans of lava, hearts of diamond', world: 'cancri' },
  { id: 4, key: 'pulsar',   name: 'The Pulsar Lighthouse',  sub: 'Blink by blink across the galaxy', world: 'pulsar' },
  { id: 5, key: 'blackhole', name: 'Sagittarius A*',        sub: 'The Great Anchor',             world: 'blackhole' },
  { id: 6, key: 'finale',   name: 'The Long Way Home',      sub: 'Lighting the way back',        world: 'finale' }
];

export const CLUES = {
  c1: { id: 'c1', icon: '📡', title: 'The Strange Signal', text: 'A repeating signal is reaching our solar system — and it\'s coming THROUGH Planet Nine, like the planet is a relay tower.' },
  c2: { id: 'c2', icon: '🌀', title: 'The Star Gate', text: 'Planet Nine guards an ancient gate built by the Lightwrights. It opens "light-rivers" between the stars. (Bolt stamps this one STORY MAGIC — real scientists haven\'t found faster-than-light travel!)' },
  c3: { id: 'c3', icon: '🔴', title: 'Ember\'s Echo', text: 'Storm-watcher Ember heard the signal too: it repeats every 7 blinks. Seven... like a code passed between seven of something.' },
  c4: { id: 'c4', icon: '🏮', title: 'The Lantern Chain', text: 'The TRAPPIST worlds relay light-signals in order, like a bucket brigade. The mystery signal travels the same way — lighthouse to lighthouse!' },
  c5: { id: 'c5', icon: '💎', title: 'The Warm Voice', text: 'Smelt\'s deep crystals hummed when the signal passed. Only an old star\'s voice makes crystals hum. Someone ANCIENT is calling.' },
  c6: { id: 'c6', icon: '🗼', title: 'The Keeper\'s Message', text: 'Lighthouse Seven decoded it: "CAUGHT IN THE GIANT\'S SPIRAL. SLOWING. PLEASE TELL MY FAMILY." It came from the center of the galaxy — where the supermassive black hole lives.' },
  c7: { id: 'c7', icon: '🌟', title: 'Mystery Solved', text: 'The voice is Nana Lyra — an elder star from Luma\'s own nursery, circling too close to Sagittarius A*. A gravity slingshot at just the right moment swung her free!' }
};

export const CARDS = [
  { id: 'bolt',   face: '🤖', name: 'Bolt',           desc: 'Your loyal robot co-pilot. Now stamps facts REAL or STORY MAGIC.' },
  { id: 'luma',   face: '🌟', name: 'Luma',           desc: 'Not a baby anymore! Your ship\'s glowing navigator-heart.' },
  { id: 'ember',  face: '🔴', name: 'Ember',          desc: 'Storm-watcher of Proxima b. Counts sun freckles before flares.' },
  { id: 'septet', face: '🏮', name: 'The Septet',     desc: 'Seven lantern-keepers of TRAPPIST-1, one per world.' },
  { id: 'smelt',  face: '⛏️', name: 'Smelt',          desc: 'Chief miner of the Diamond Planet. Counts everything twice.' },
  { id: 'tick',   face: '🗼', name: 'Tick',           desc: 'Keeper of Pulsar Lighthouse Seven. Never misses a blink.' },
  { id: 'lyra',   face: '✨', name: 'Nana Lyra',      desc: 'Elder star and galaxy mapper. Sang with pulsars, surfed comet tails.' },
  { id: 'sgra',   face: '⚫', name: 'Sagittarius A*', desc: 'The supermassive black hole at our galaxy\'s heart. 4 million Suns heavy!' },
  { id: 'gate',   face: '🌀', name: 'The Star Gate',  desc: 'An ancient Lightwright ring hiding beside Planet Nine.' }
];

export const BADGES = [
  { id: 'jump3',     icon: '🌀', name: 'River Rider',     test: (s) => s.jumps >= 3 },
  { id: 'beacons4',  icon: '🗼', name: 'Beacon Lighter',  test: (s) => s.beacons >= 4 },
  { id: 'journal10', icon: '📔', name: 'Star Scholar',    test: (s) => (s.factsLearned.length + s.journal.length) >= 10 },
  { id: 'blackhole', icon: '⚫', name: 'Heart of the Galaxy', test: (s) => s.clues.includes('c6') },
  { id: 'finish',    icon: '🌟', name: 'Galaxy Hero',     test: (s) => s.chapter >= 7 },
  { id: 'hero1',     icon: '🏅', name: 'Hero of Luma',    test: (s) => !!s.game1Hero }
];
