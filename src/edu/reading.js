// Reading comprehension passages woven into the story — gate glyphs, station
// logs, and lighthouse messages. Written at roughly a 2nd-3rd grade level
// (a notch up from the first adventure).

function rq(concept, prompt, options, answer, explain) {
  return { kind: 'reading', skill: 'reading', concept, prompt, options, answer, explain };
}

export const READING_BANK = [
  {
    id: 'gate-glyphs', chapter: 'planet9', title: 'The Glyphs on the Gate',
    text: 'Traveler, you have found the Star Gate. We are the Lightwrights, and we built the gate rings long, long ago. The gates open rivers of light between the stars. We hid this one beside the ninth planet, where the Sun is only a bright dot in the dark. To wake the gate, feed it starlight and speak a true thing about the universe. Be kind to gravity, and gravity will be kind to you.',
    questions: [
      rq('gate-glyphs-q1', 'Who built the Star Gate?', ['The Lightwrights', 'The Frost Sprites', 'NASA'], 'The Lightwrights', 'The glyphs say: "We are the Lightwrights, and we built the gate rings long, long ago."'),
      rq('gate-glyphs-q2', 'What do the gates open between the stars?', ['Rivers of light', 'Big doors', 'Candy shops'], 'Rivers of light', 'The glyphs say the gates "open rivers of light between the stars."'),
      rq('gate-glyphs-q3', 'Why did they hide the gate beside the ninth planet?', ['The Sun is only a tiny dot there — far and dark', 'It was the prettiest spot', 'They got lost'], 'The Sun is only a tiny dot there — far and dark', 'The glyphs say they hid it "where the Sun is only a bright dot in the dark" — a good hiding place, far from everything!'),
      rq('gate-glyphs-q4', 'What TWO things wake the gate?', ['Starlight and a true thing about the universe', 'A password and a key', 'Shouting and stomping'], 'Starlight and a true thing about the universe', 'The glyphs say: "feed it starlight and speak a true thing about the universe."')
    ]
  },
  {
    id: 'proxima-log', chapter: 'proxima', title: 'The Storm-Watcher\'s Log',
    text: 'Watch log, flare season. I am Ember, storm-watcher of Proxima b. Our little red sun looks calm, but do not be fooled. When it flares, the sky turns white and every antenna must hide. I count the warning signs: first the sun freckles grow, then the wind hums, then — FLASH! Today the freckles are growing fast. Visitors should raise their shields before the third hum.',
    questions: [
      rq('proxima-log-q1', 'What is Ember\'s job?', ['Storm-watcher', 'Ring surfer', 'Gate builder'], 'Storm-watcher', 'The log says: "I am Ember, storm-watcher of Proxima b."'),
      rq('proxima-log-q2', 'What happens FIRST before a flare?', ['The sun freckles grow', 'The sky turns white', 'The antennas hide'], 'The sun freckles grow', 'Ember counts the warning signs in order: "first the sun freckles grow, then the wind hums, then — FLASH!"'),
      rq('proxima-log-q3', 'When should visitors raise their shields?', ['Before the third hum', 'After the flash', 'Never'], 'Before the third hum', 'The last line says: "Visitors should raise their shields before the third hum."')
    ]
  },
  {
    id: 'trappist-invite', chapter: 'trappist', title: 'An Invitation from Seven Worlds',
    text: 'Dear neighbors of the galaxy, you are invited to the Festival of Seven! Our worlds circle a small cool star, lined up like beads on a necklace. From my house on planet e, planet d looks as big as a cookie in the sky. Every 100 days, all seven planets almost line up in a row, and we flash lantern signals from world to world. The chain must pass in order — b to c, c to d, d to e, e to f, f to g, g to h. If one world misses its turn, the whole chain goes dark.',
    questions: [
      rq('trappist-inv-q1', 'How do the seven worlds celebrate together?', ['Flashing lantern signals from world to world', 'Trading cookies', 'Swimming races'], 'Flashing lantern signals from world to world', 'The invitation says: "we flash lantern signals from world to world."'),
      rq('trappist-inv-q2', 'What happens if one world misses its turn?', ['The whole chain goes dark', 'Nothing at all', 'The star turns off'], 'The whole chain goes dark', 'The last line warns: "If one world misses its turn, the whole chain goes dark." Order matters!'),
      rq('trappist-inv-q3', 'Which world comes right after planet d in the chain?', ['Planet e', 'Planet b', 'Planet h'], 'Planet e', 'The order is b, c, d, e, f, g, h — so after d comes e. (The writer lives there!)')
    ]
  },
  {
    id: 'cancri-miner', chapter: 'cancri', title: 'The Lava Miner\'s Warning',
    text: 'SAFETY NOTICE from Smelt, chief miner of the Diamond Planet. New helpers, read carefully! Rule one: never land on the day side. It is hot enough to melt your boots, your ship, and your sandwich. Rule two: the glitter crystals near the lava rivers are NOT diamonds — they pop like popcorn when touched. Real diamond crystals are deep, dark, and cool, and they hum when you hold them. Rule three: always count your crystals twice. The heat makes everyone forgetful.',
    questions: [
      rq('cancri-miner-q1', 'Why should you never land on the day side?', ['It is hot enough to melt your ship', 'It is too crowded', 'The parking costs too much'], 'It is hot enough to melt your ship', 'Rule one says the day side melts "your boots, your ship, and your sandwich."'),
      rq('cancri-miner-q2', 'How can you tell a REAL diamond crystal?', ['It is deep, dark, cool, and hums', 'It pops like popcorn', 'It glows near lava'], 'It is deep, dark, cool, and hums', 'Smelt says real diamonds "are deep, dark, and cool, and they hum when you hold them."'),
      rq('cancri-miner-q3', 'Why must you count your crystals twice?', ['The heat makes everyone forgetful', 'Counting is fun', 'The crystals multiply'], 'The heat makes everyone forgetful', 'Rule three explains: "The heat makes everyone forgetful."')
    ]
  },
  {
    id: 'lighthouse-letter', chapter: 'pulsar', title: 'The Lighthouse Keeper\'s Letter',
    text: 'To whoever follows the light: I am Tick, keeper of Lighthouse Seven. Our lighthouse is a pulsar — a spinning star heart that blinks faster than you can clap. For a thousand years we keepers have passed messages across the galaxy, lighthouse to lighthouse, blink by blink. Last month a message came from the very center of the galaxy. It said only: "CAUGHT IN THE GIANT\'S SPIRAL. SLOWING. PLEASE TELL MY FAMILY." We do not know who sent it. But the blinks were warm, like an old star\'s voice.',
    questions: [
      rq('lighthouse-q1', 'What is Lighthouse Seven really?', ['A pulsar — a spinning star heart', 'A candle on a tower', 'A spaceship'], 'A pulsar — a spinning star heart', 'Tick says: "Our lighthouse is a pulsar — a spinning star heart that blinks faster than you can clap."'),
      rq('lighthouse-q2', 'How do the keepers send messages across the galaxy?', ['Lighthouse to lighthouse, blink by blink', 'By mail rocket', 'By shouting very loudly'], 'Lighthouse to lighthouse, blink by blink', 'The letter says keepers have "passed messages across the galaxy, lighthouse to lighthouse, blink by blink."'),
      rq('lighthouse-q3', 'What did the mystery message say?', ['"Caught in the giant\'s spiral. Slowing. Please tell my family."', '"Having a great time, wish you were here."', '"The lighthouse is broken."'], '"Caught in the giant\'s spiral. Slowing. Please tell my family."', 'The message from the galaxy\'s center said: "CAUGHT IN THE GIANT\'S SPIRAL. SLOWING. PLEASE TELL MY FAMILY."'),
      rq('lighthouse-q4', 'How did the blinks feel to Tick?', ['Warm, like an old star\'s voice', 'Cold and scary', 'Too fast to read'], 'Warm, like an old star\'s voice', 'The last line says: "the blinks were warm, like an old star\'s voice."')
    ]
  },
  {
    id: 'lyra-story', chapter: 'blackhole', title: 'Nana Lyra\'s Story',
    text: 'Long before Luma was born, I left the Orion nursery to map the galaxy. I surfed comet tails. I sang with pulsars. I watched new stars open their eyes. At the center of the galaxy I found the Great Anchor — the giant black hole that all the middle stars dance around. I flew close to watch the dance... too close. Now I circle and circle, a little lower every year. I am not afraid. Gravity is not a monster — it is just very, very strong. But I miss my family. If you can hear this: a push at just the right moment is all I need.',
    questions: [
      rq('lyra-story-q1', 'Why did Nana Lyra leave the nursery long ago?', ['To map the galaxy', 'She was lost', 'To find diamonds'], 'To map the galaxy', 'She says: "I left the Orion nursery to map the galaxy."'),
      rq('lyra-story-q2', 'What is the Great Anchor?', ['The giant black hole at the galaxy\'s center', 'A huge ship anchor', 'The biggest pulsar'], 'The giant black hole at the galaxy\'s center', 'She calls the supermassive black hole "the Great Anchor — the giant black hole that all the middle stars dance around."'),
      rq('lyra-story-q3', 'Is Nana Lyra afraid of the black hole?', ['No — gravity is not a monster, just very strong', 'Yes, terribly', 'She does not say'], 'No — gravity is not a monster, just very strong', 'She says: "I am not afraid. Gravity is not a monster — it is just very, very strong."'),
      rq('lyra-story-q4', 'What does Nana Lyra need to escape?', ['A push at just the right moment', 'A bigger telescope', 'A magic wand'], 'A push at just the right moment', 'Her last words: "a push at just the right moment is all I need." That\'s a gravity slingshot!')
    ]
  },
  {
    id: 'home-postcard', chapter: 'finale', title: 'A Postcard from the Edge of Home',
    text: 'Dear Cadet, by the time you read this, we will be almost home. Nana Lyra is riding beside us in the light-river, glowing brighter every minute. She told us stories the whole way — about the galaxy\'s spiral arms, about the quiet edge where our Sun lives, about how every atom in your body was made inside a star. "You are all starlight," she said, "even the ones who forget." When we pass Planet Nine, wave thank you. Its gravity kept the gate hidden and safe for a million years. — Bolt (and one very proud Luma)',
    questions: [
      rq('postcard-q1', 'Who is riding beside the ship in the light-river?', ['Nana Lyra', 'Planet Nine', 'A comet'], 'Nana Lyra', 'The postcard says: "Nana Lyra is riding beside us in the light-river, glowing brighter every minute."'),
      rq('postcard-q2', 'What did Nana Lyra say everyone is made of?', ['Starlight', 'Moon cheese', 'Stardust sandwiches'], 'Starlight', 'She said: "You are all starlight, even the ones who forget." Every atom in you was made inside a star — that\'s real science!'),
      rq('postcard-q3', 'Why should we thank Planet Nine?', ['Its gravity kept the gate hidden and safe', 'It baked cookies', 'It pushed the ship home'], 'Its gravity kept the gate hidden and safe', 'The postcard says Planet Nine\'s gravity "kept the gate hidden and safe for a million years."')
    ]
  }
];
