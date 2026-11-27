import type { BgSoundKind, ExLevel, Exercise, PoetryWord, RoutineDef, TwisterItem } from '../types/studio';

export const CATS: Record<string, [string, string]> = {
  breath: ['শ্বাস', 'Breathing'],
  om: ['ওম', 'OM chanting'],
  hum: ['হামিং', 'Humming'],
  lip: ['লিপ ট্রিল', 'Lip trills'],
  tongue: ['জিভ ট্রিল', 'Tongue trills'],
  clarity: ['উচ্চারণ', 'Voice clarity'],
  pitch: ['পিচ', 'Pitch control'],
  reso: ['অনুরণন', 'Resonance'],
  proj: ['প্রজেকশন', 'Projection'],
  cool: ['কুল ডাউন', 'Cool down'],
  relax: ['শিথিলতা', 'Relaxation'],
  artic: ['আর্টিকুলেশন', 'Articulation'],
  dyn: ['ভাব ও গতি', 'Expression'],
  tw: ['টাং টুইস্টার', 'Twisters'],
  chant: ['সাধনা ও চ্যান্ট', 'Sadhana & chants'],
};

export const CAT_HUES: Record<string, number> = {
  breath: 195,
  om: 265,
  hum: 45,
  lip: 340,
  tongue: 15,
  clarity: 155,
  pitch: 220,
  reso: 285,
  proj: 25,
  cool: 170,
  relax: 130,
  artic: 80,
  dyn: 5,
  tw: 310,
  chant: 38,
};

export const CAT_EMOJI: Record<string, string> = {
  breath: '🌬️',
  om: '🔔',
  hum: '🐝',
  lip: '👄',
  tongue: '👅',
  clarity: '🗣️',
  pitch: '🎼',
  reso: '🔊',
  proj: '📢',
  cool: '🍃',
  relax: '🧘',
  artic: '👅',
  dyn: '🎚️',
  tw: '🗣️',
  chant: '🪷',
};

export const catColor = (catKey: string): string =>
  `hsl(${CAT_HUES[catKey] ?? 250} var(--sat) var(--lig))`;

type RawEx = [
  string,
  string,
  string,
  string,
  ExLevel,
  number,
  BgSoundKind,
  [string, string],
  [string[], string[]],
  ('bn' | 'en')?
];

const CORE_RAW: RawEx[] = [
  ['breath', 'breath', 'ডায়াফ্রাম শ্বাস', 'Diaphragmatic breathing', 'B', 2, 'breath', ['শ্বাস গভীর ও শান্ত করা', 'Calm, deep breathing'], [['আরাম করে বসুন, কাঁধ শিথিল রাখুন।', 'নাক দিয়ে ধীরে শ্বাস নিন, পেট ফুলতে দিন।', 'মুখ দিয়ে ধীরে ছাড়ুন, পেট নামতে দিন।'], ['Sit comfortably, relax your shoulders.', 'Breathe in slowly through the nose; let the belly expand.', 'Breathe out slowly through the mouth; let the belly fall.']]],
  ['om', 'om', 'মৃদু ওম জপ', 'Gentle OM chanting', 'B', 2, 'om', ['আরামদায়ক দীর্ঘ স্বর', 'Comfortable sustained tone'], [['স্বাভাবিক শ্বাস নিন।', 'নিচু, আরামদায়ক স্বরে ‘ওম’ বলুন, বুকে কম্পন অনুভব করুন।', 'শ্বাস ফুরালে থামুন, বিশ্রাম নিয়ে আবার করুন।'], ['Take a normal breath.', 'Say a low, comfortable ‘OM’ and feel the chest vibrate.', 'Stop when the breath ends, rest, and repeat.']]],
  ['hum', 'hum', 'বন্ধ মুখে হামিং', 'Closed-mouth humming', 'B', 2, 'ambient', ['আরামদায়ক পিচে গুনগুন', 'Easy humming'], [['ঠোঁট হালকা বন্ধ, দাঁত আলগা রাখুন।', 'আরামদায়ক সুরে ‘ম্‌ম্‌ম্‌’ গুনগুন করুন।', 'ঠোঁট ও নাকের চারপাশে কম্পন অনুভব করুন, মাঝে বিশ্রাম নিন।'], ['Lips lightly closed, teeth apart.', 'Hum ‘mmm’ on an easy pitch.', 'Feel buzzing around lips and nose; rest between rounds.']]],
  ['lip', 'lip', 'লিপ ট্রিল', 'Lip trills', 'B', 2, 'ambient', ['ঠোঁট ও চোয়াল শিথিল করা', 'Relax lips and jaw'], [['ঠোঁট শিথিল রেখে বাতাস ছাড়ুন যাতে ঠোঁট কাঁপে।', 'চোয়াল নরম রাখুন।', '৫–৮ সেকেন্ড করে ছোট ছোট বার করুন।'], ['Blow air through loose lips so they flutter.', 'Keep the jaw soft.', 'Do short rounds of 5–8 seconds.']]],
  ['tongue', 'tongue', 'জিভ ট্রিল', 'Tongue trills', 'I', 2, 'ambient', ['জিভের নমনীয়তা', 'Tongue flexibility'], [['জিভের ডগা দাঁতের পেছনে হালকা রাখুন।', 'বাতাস ছেড়ে ‘র‌্‌র‌্‌র‌্’ কাঁপান।', 'ছোট বার করুন, না পারলে লিপ ট্রিল করুন।'], ['Rest the tongue tip lightly behind the teeth.', 'Blow air and roll ‘rrr’.', 'Keep rounds short; use lip trills if it is hard.']]],
  ['clarity', 'clarity', 'স্পষ্ট উচ্চারণ', 'Pronunciation practice', 'I', 3, 'off', ['স্পষ্ট বাংলা ও ইংরেজি', 'Clear Bengali and English'], [['ধীরে বলুন: ক খ গ ঘ, অ আ ই ঈ উ ঊ।', 'বলুন: ‘কাল কলকাতায় কলা কিনব।’', 'English: ‘Red leather, yellow leather.’ ধীরে ও স্পষ্ট বলুন।'], ['Slowly say: ka kha ga gha, o a i ii u uu.', 'Say: ‘Kal Kolkatay kola kinbo.’', 'Say: ‘Red leather, yellow leather.’ Slow and clear.']]],
  ['pitch', 'pitch', 'পিচ নিয়ন্ত্রণ', 'Pitch control', 'I', 3, 'drone', ['পিচ সচেতনতা', 'Pitch awareness'], [['আরামদায়ক স্বরে ‘আ’ বলুন।', 'ধীরে একটু উঁচুতে যান, জোর করবেন না।', 'ধীরে নিচে নামুন, শুরুর স্বরে ফিরুন।'], ['Sing a comfortable ‘ah’.', 'Glide slightly higher; never strain.', 'Glide slowly down and return to your start note.']]],
  ['reso', 'reso', 'অনুরণন', 'Resonance training', 'I', 3, 'om', ['সামনের অনুরণন', 'Forward resonance'], [['‘ম্‌ম্‌ম্‌’ করে মুখের সামনে কম্পন অনুভব করুন।', '‘ম্‌ম্‌ম্‌-আ’ বলে স্বর খুলুন।', 'স্বাভাবিক ভলিউমে কয়েকটি শব্দ বলুন।'], ['Hum ‘mmm’ and feel buzz at the front of the face.', 'Open into ‘mmm-ah’.', 'Say a few words at normal volume.']]],
  ['proj', 'proj', 'ভয়েস প্রজেকশন', 'Voice projection', 'A', 4, 'ambient', ['স্বাভাবিকভাবে স্পষ্ট ও জোরালো কথা', 'Clear, natural volume'], [['সোজা দাঁড়ান, শ্বাস নিন।', 'একটি বাক্য পরিষ্কারভাবে ঘরের ওপাশে পৌঁছে দিন — চিৎকার নয়।', 'ছোট উপস্থাপনা অনুশীলন করুন।'], ['Stand tall and breathe in.', 'Send one sentence across the room — no shouting.', 'Practice a short presentation.']]],
  ['cool', 'cool', 'কুল ডাউন', 'Cool down', 'B', 1, 'nature', ['স্বর শিথিল করা', 'Relax the voice'], [['ধীরে শ্বাস নিন ও ছাড়ুন।', 'চাইলে খুব হালকা হামিং করুন।', 'এখন কিছুক্ষণ কণ্ঠকে বিশ্রাম দিন, জল পান করুন।'], ['Breathe in and out slowly.', 'Hum very lightly if you like.', 'Rest your voice now; sip some water.']]],
  ['yawn', 'relax', 'হাই-সাইজ (গলা খোলা)', 'Yawn-sigh', 'B', 2, 'nature', ['গলা ও চোয়াল শিথিল ও খোলা', 'Open, relaxed throat and jaw'], [['আরাম করে সোজা হয়ে বসুন বা দাঁড়ান।', 'হাই তোলার মতো মুখ খুলুন; গলার ভেতরটা খোলা অনুভব করুন।', 'উপর থেকে নিচে নামিয়ে স্বরসহ ‘আ-হ্‌’ বলে দীর্ঘশ্বাস ছাড়ুন।'], ['Sit or stand tall and relaxed.', 'Open as if yawning; feel the throat space widen.', 'Sigh down on a voiced ‘ah-h’, gliding from high to low.']]],
  ['neck', 'relax', 'ঘাড় ও কাঁধ শিথিল', 'Neck & shoulder release', 'B', 2, 'nature', ['টান কমানো, গলা মুক্ত রাখা', 'Release tension around the voice'], [['কাঁধ কানের দিকে তুলে ধীরে নামিয়ে দিন।', 'ঘাড় ধীরে ডানে-বাঁয়ে কাত করুন; জোর করবেন না।', 'চোয়াল নরম রাখুন, জিভ মুখের নিচে আলগা ছেড়ে দিন।'], ['Lift shoulders toward ears, then let them drop.', 'Tilt the neck gently side to side; never force it.', 'Keep the jaw soft and the tongue loose in the mouth.']]],
  ['straw', 'hum', 'স্ট্র ফোনেশন (গুনগুন)', 'Straw phonation', 'B', 3, 'ambient', ['কণ্ঠনালীকে আরামে কাজ করানো', 'Gentle, efficient vocal-fold warm-up'], [['ঠোঁট ছোট গোল করুন (স্ট্র থাকলে তা দিয়ে)।', '‘উ’ স্বরে আরামদায়ক পিচে গুনগুন করুন, বাতাস সমান রাখুন।', 'ধীরে পিচ একটু উঠিয়ে-নামিয়ে আবার শুরুর স্বরে ফিরুন।'], ['Make a small round opening with the lips (or use a straw).', 'Hum an easy ‘oo’ with steady airflow.', 'Glide the pitch slightly up and down, then return to the start.']]],
  ['box', 'breath', 'বক্স ব্রিদিং (৪-৪-৪-৪)', 'Box breathing', 'B', 3, 'breath', ['শ্বাসের ছন্দ ও প্রশান্তি', 'Steady rhythm and calm'], [['৪ গুনে নাক দিয়ে ধীরে শ্বাস নিন।', '৪ গুনে আরামে থামুন — অস্বস্তি হলে এই ধাপ বাদ দিন।', '৪ গুনে মুখ দিয়ে ধীরে ছাড়ুন, তারপর ৪ গুনে বিরতি দিন।'], ['Inhale through the nose for a count of 4.', 'Hold comfortably for 4 — skip the hold if it feels uneasy.', 'Exhale slowly for 4, then rest for 4.']]],
  ['hiss', 'breath', 'হিস শ্বাস নিয়ন্ত্রণ', 'Hiss breath control', 'I', 2, 'breath', ['সমান ধারায় শ্বাস ছাড়া', 'Even, controlled exhale'], [['৪ গুনে নাক দিয়ে শ্বাস নিন, কাঁধ স্থির রাখুন।', 'দাঁতের ফাঁক দিয়ে ‘স্‌স্‌স্‌’ করে সমান ধারায় ছাড়ুন।', '১০ সেকেন্ড থেকে শুরু করে ধীরে সময় বাড়ান; জোর করবেন না।'], ['Inhale through the nose for 4; keep shoulders still.', 'Release a steady ‘sss’ through the teeth.', 'Start with 10 seconds and extend gradually; never strain.']]],
  ['stac', 'breath', 'স্টাকাটো ‘হা-হা’', 'Staccato ‘ha’', 'I', 2, 'ambient', ['শ্বাসের সাপোর্ট ও নিয়ন্ত্রণ', 'Breath support and control'], [['এক হাত পেটে রাখুন, আরামে শ্বাস নিন।', 'ছোট ছোট ‘হা-হা-হা’ বলুন; প্রতিবার পেট হালকা ভেতরে যাবে।', 'এক শ্বাসে ৫টি করুন, বিশ্রাম নিয়ে আবার করুন।'], ['Place a hand on the belly and breathe in easily.', 'Say short ‘ha-ha-ha’; the belly pulses in each time.', 'Do 5 per breath, rest, and repeat.']]],
  ['siren', 'pitch', 'সাইরেন গ্লাইড', 'Siren glide', 'I', 3, 'drone', ['স্বরের সীমা আরামে বাড়ানো', 'Smooth range extension'], [['আরামদায়ক নিচু স্বরে ‘উ’ বা ‘ইউ’ শুরু করুন।', 'সাইরেনের মতো ধীরে উঁচুতে উঠুন; যেখানে কষ্ট হয় তার আগেই থামুন।', 'একইভাবে মসৃণভাবে নিচে নেমে আসুন।'], ['Start an easy low ‘oo’.', 'Glide up like a siren and stop before any strain.', 'Glide smoothly back down.']]],
  ['vowel', 'clarity', 'স্বরবর্ণের আকার', 'Vowel shaping', 'B', 3, 'off', ['স্পষ্ট ও খোলা স্বরধ্বনি', 'Clear, open vowels'], [['আয়নার সামনে বসুন; ধীরে বলুন: অ, আ, ই, ঈ।', 'এবার বলুন: উ, ঊ, এ, ঐ, ও, ঔ — প্রতিটিতে ঠোঁট ও চোয়ালের আকার লক্ষ করুন।', 'একই ক্রমে আবার বলুন, এবার একটু দ্রুত কিন্তু স্পষ্ট।'], ['Sit before a mirror; slowly say: a, aa, i, ii.', 'Now u, uu, e, ai, o, au — watch lip and jaw shapes.', 'Repeat in order, a little faster but still clear.']]],
  ['artic', 'artic', 'ঠোঁট-জিভ-চোয়ালের ব্যায়াম', 'Articulator warm-up', 'B', 2, 'off', ['উচ্চারণ অঙ্গের নমনীয়তা', 'Flexible lips, tongue and jaw'], [['জিভ মুখের ভেতর ঘুরিয়ে গালের ভেতর দিকে হালকা ঠেলুন।', 'ঠোঁট একবার গোল (উ), একবার হাসি (ই) — ধীরে বদলান।', 'চোয়ালের দুই পাশ আঙুল দিয়ে হালকা ম্যাসাজ করুন।'], ['Circle the tongue inside the mouth, pressing gently on the cheeks.', 'Alternate lips round (‘oo’) and smiling (‘ee’), slowly.', 'Massage both sides of the jaw lightly.']]],
  ['pataka', 'artic', 'পা-তা-কা গতি', 'Pa-ta-ka speed drill', 'I', 2, 'off', ['দ্রুত ও স্পষ্ট উচ্চারণ', 'Fast, crisp articulation'], [['ধীরে বলুন: পা-তা-কা, পা-তা-কা — প্রতিটি অক্ষর স্পষ্ট।', 'একই ছন্দে বলুন: বা-দা-গা, বা-দা-গা।', 'ধীরে গতি বাড়ান; অস্পষ্ট হলে আবার ধীরে শুরু করুন।'], ['Say slowly: pa-ta-ka, pa-ta-ka, each syllable crisp.', 'Same rhythm: ba-da-ga, ba-da-ga.', 'Speed up gradually; if it blurs, slow down again.']]],
  ['pause', 'dyn', 'বিরতি ও গতি নিয়ন্ত্রণ', 'Pause & pace', 'A', 3, 'off', ['শ্রোতার জন্য সঠিক ছন্দ', 'Speaking rhythm for the listener'], [['পছন্দের যেকোনো একটি অনুচ্ছেদ হাতে নিন।', 'কমায় ১ গুনে, বাক্যের শেষে ২ গুনে থেমে ধীরে পড়ুন।', 'এবার স্বাভাবিক গতিতে পড়ুন; বিরতিগুলো ধরে রাখুন।'], ['Pick any short paragraph.', 'Read slowly: pause 1 beat at commas, 2 beats at full stops.', 'Read at normal pace, keeping the pauses.']]],
  ['dyn', 'dyn', 'জোর ও কোমলতা', 'Volume dynamics', 'A', 3, 'ambient', ['স্বরের উঠানামা নিয়ন্ত্রণ', 'Control of loud and soft'], [['একটি বাক্য বেছে নিন, যেমন: ‘আজ আমি স্পষ্ট করে বলব।’', 'প্রথমে নরম স্বরে, তারপর স্বাভাবিক, তারপর জোরালো — চিৎকার নয়।', 'আবার কোমল স্বরে ফিরে আসুন।'], ['Choose a sentence, e.g. ‘Today I will speak clearly.’', 'Say it softly, then normally, then strongly — never shouting.', 'Return to a soft voice.']]],
  ['recite', 'dyn', 'আবৃত্তির ভাব ও স্বরভঙ্গি', 'Expressive recitation', 'A', 4, 'ambient', ['ভাব অনুযায়ী স্বর ব্যবহার', 'Voice shaped by meaning'], [['নিজের পছন্দের একটি কবিতার দু-তিনটি লাইন বেছে নিন।', 'শ্বাস নেওয়ার জায়গা আগে চিহ্নিত করুন, গুরুত্বপূর্ণ শব্দে জোর দিন।', 'ভাব অনুযায়ী স্বর উঁচু-নিচু করে আবৃত্তি করুন।'], ['Pick two or three lines of a poem you love.', 'Mark the breath points and the key words first.', 'Recite, shaping pitch and tone to the meaning.']]],
  ['bhram', 'chant', 'ভ্রামরী গুঞ্জন', 'Bhramari humming', 'B', 2, 'tanpura', ['মৌমাছির মতো গুঞ্জনে অনুরণন', 'Bee-like humming resonance'], [['আরাম করে বসুন, চোখ বন্ধ করুন, নাক দিয়ে ধীরে শ্বাস নিন।', 'ঠোঁট বন্ধ রেখে মৌমাছির মতো একটানা ‘ম্‌ম্‌ম্‌’ গুঞ্জন করুন।', 'মাথা ও মুখের ভেতরের কম্পন অনুভব করুন; শ্বাস ফুরালে বিশ্রাম নিন।'], ['Sit comfortably, close your eyes, breathe in slowly through the nose.', 'With lips closed, hum a steady bee-like ‘mmm’.', 'Feel the buzz in the head and face; rest when the breath ends.']]],
  ['ujj', 'chant', 'উজ্জায়ী শ্বাস (মৃদু)', 'Gentle ujjayi breath', 'I', 2, 'breath', ['সমুদ্রের ঢেউয়ের মতো নিয়ন্ত্রিত শ্বাস', 'Smooth, ocean-like breath'], [['সোজা হয়ে বসুন; গলার পেছনে হালকা সংকোচন করে শ্বাস নিন, যেন আয়নায় বাষ্প ফেলছেন।', 'একই মৃদু ‘সোঁ’ আওয়াজে ধীরে ছাড়ুন; জোর করবেন না।', '৫-৬ বার করে করুন; মাথা ঘুরলে থামুন ও স্বাভাবিক শ্বাস নিন।'], ['Sit tall; breathe in with a slight narrowing at the back of the throat, as if fogging a mirror.', 'Exhale with the same soft ‘ocean’ sound; never force it.', 'Do 5–6 rounds; stop and breathe normally if dizzy.']]],
  ['soham', 'chant', 'সোহম শ্বাস-ধ্বনি', 'So-ham breath sound', 'B', 2, 'tanpura', ['শ্বাসের সঙ্গে ধ্বনির সমন্বয়', 'Syncing sound with breath'], [['আরামে বসে নাক দিয়ে শ্বাস নিতে নিতে মনে মনে ‘সো’ বলুন।', 'শ্বাস ছাড়তে ছাড়তে মৃদু স্বরে ‘হ-ম্‌ম্‌ম্‌’ বলুন।', 'ছন্দ ধীর ও সমান রাখুন; কোনো তাড়া নেই।'], ['Sit easily; as you inhale, think ‘so’.', 'As you exhale, softly voice ‘ha-mmm’.', 'Keep the rhythm slow and even; no hurry.']]],
  ['aum3', 'chant', 'তিন ধ্বনির ওম (অ-উ-ম)', 'A-U-M chant', 'B', 3, 'om', ['স্বরের তিন অবস্থানে অনুরণন', 'Resonance across three positions'], [['গভীর শ্বাস নিন, আরামদায়ক নিচু স্বর বেছে নিন।', '‘অ’ — মুখ খুলে বুকে কম্পন; ‘উ’ — ঠোঁট গোল, গলায় কম্পন; ‘ম্‌ম্‌ম্‌’ — ঠোঁট বন্ধ, মাথায় কম্পন।', 'তিনটি ধ্বনি একটানা জুড়ে বলুন; শেষে নীরবতা অনুভব করুন, তারপর আবার।'], ['Take a deep breath and pick an easy low pitch.', '‘A’ — open mouth, chest buzz; ‘U’ — rounded lips, throat buzz; ‘M’ — lips closed, head buzz.', 'Join the three sounds in one stream; feel the silence after, then repeat.']]],
  ['bija', 'chant', 'অনুরণন-ধ্বনি: লং-বং-রং-যং-হং', 'Resonance sounds: lam-vam-ram-yam-ham', 'I', 3, 'drone', ['শরীরের বিভিন্ন স্থানে কম্পন ও নাসিক্য ধ্বনি', 'Nasal tones and felt vibration'], [['নিচু স্বরে ধীরে ‘লং’ বলুন; শেষের ‘ং’ নাকে অনুরণিত হতে দিন।', 'একইভাবে বলুন: ‘বং’, ‘রং’, ‘যং’, ‘হং’ — প্রতিটির মাঝে একটি শ্বাস।', 'শেষে ‘ওম’ বলে থামুন; গলা বা বুকে টান লাগলে স্বর নরম করুন।'], ['Say a low ‘lam’; let the final ‘ng’ buzz in the nose.', 'Continue: ‘vam’, ‘ram’, ‘yam’, ‘ham’ — one breath between each.', 'Finish with ‘om’ and rest; soften the voice if the throat tightens.']]],
  ['sa', 'chant', 'একস্বর ‘সা’ সাধনা', 'Steady Sa (single tone)', 'B', 3, 'tanpura', ['একটি স্বর স্থির ও সুরেলা ধরে রাখা', 'Hold one tone steady and in tune'], [['তানপুরার ‘সা’ শুনে নিন; একই স্বরে আরামে ‘আ’ বলুন।', 'স্বর যেন না কাঁপে বা নিচে নামে — সমান ও নরম ধরে রাখুন।', 'শ্বাস ফুরালে থামুন, আবার ‘সা’ শুনে শুরু করুন; ৬-৮ সেকেন্ড করে।'], ['Listen to the tanpura Sa; sing a soft ‘ah’ on the same pitch.', 'Keep it level, not wobbling or sagging.', 'Stop when breath ends and restart; 6–8 seconds each.']]],
  ['sargam', 'chant', 'সরগম সাধনা (সা-রে-গা-মা)', 'Sargam scale practice', 'B', 3, 'tanpura', ['সাত স্বরের শুদ্ধ ধ্বনি', 'Clean singing of the seven notes'], [['‘সা’ ধরে শুরু করুন।', 'ধীরে আরোহণ করুন: সা রে গা মা পা ধা নি র্সা — প্রতিটি স্বর স্থির।', 'অবরোহণ করুন: র্সা নি ধা পা মা গা রে সা — তাড়াহুড়ো না করে।'], ['Begin on Sa.', 'Ascend slowly: Sa Re Ga Ma Pa Dha Ni Sa, each note steady.', 'Descend: Sa Ni Dha Pa Ma Ga Re Sa, unhurried.']]],
  ['alank', 'chant', 'অলঙ্কার সাধনা', 'Alankar patterns', 'I', 3, 'tanpura', ['স্বর-সজ্জার নমনীয়তা ও নির্ভুলতা', 'Agility and accuracy in note patterns'], [['ধীরে গেয়ে যান: সা-রে-গা, রে-গা-মা, গা-মা-পা, মা-পা-ধা।', 'এবার উল্টো: ধা-পা-মা, পা-মা-গা, মা-গা-রে, গা-রে-সা।', 'ধীরে শুরু করে ধীরে লয় বাড়ান; ভুল হলে আবার ধীরে।'], ['Sing slowly: Sa-Re-Ga, Re-Ga-Ma, Ga-Ma-Pa, Ma-Pa-Dha.', 'Now reverse: Dha-Pa-Ma, Pa-Ma-Ga, Ma-Ga-Re, Ga-Re-Sa.', 'Start slow and raise the tempo gradually; slow down after any slip.']]],
  ['meend', 'chant', 'মীড় (স্বর-গড়ানো)', 'Meend (glides)', 'I', 3, 'tanpura', ['স্বরের মধ্যে মসৃণ সংযোগ', 'Smooth connections between notes'], [['‘সা’ থেকে ধীরে ‘পা’-তে গড়িয়ে যান, মাঝের স্বরগুলো ছুঁয়ে।', '‘পা’ থেকে ধীরে ‘সা’-তে ফিরুন — একটানা, না ভেঙে।', 'শ্বাস বাঁচিয়ে ছোট ছোট মীড় দিয়ে অভ্যাস করুন; জোর করবেন না।'], ['Glide slowly from Sa up to Pa, touching the notes between.', 'Glide back from Pa to Sa — continuous, no breaks.', 'Practice short glides conserving breath; never push.']]],
  ['mandra', 'chant', 'মন্দ্র সপ্তক (নিচু স্বর)', 'Low register (mandra)', 'I', 3, 'drone', ['নিচু স্বরের গভীরতা ও আরাম', 'Depth and ease in the low voice'], [['আরামদায়ক মাঝের স্বর থেকে শুরু করুন।', 'ধীরে ‘আ’ বা ‘ওম’-এ এক-দুই স্বর নিচে নামুন, গলা চেপে নয়।', 'যেখানে স্বর ঘড়ঘড় বা ভাঙে তার আগেই থামুন।'], ['Start from a comfortable middle pitch.', 'Glide one or two steps lower on ‘ah’ or ‘om’, without squeezing.', 'Stop before the voice crackles or breaks.']]],
  ['nad', 'chant', 'নাদ-সাধনা (কম্পন শোনা)', 'Nada listening hum', 'B', 2, 'tanpura', ['নিজের স্বরের কম্পন মনোযোগে শোনা', 'Attentive listening to your own tone'], [['চোখ বন্ধ করে আরামে বসুন, কান আলতো আঙুলে ঢাকুন।', 'নরম স্বরে ‘ম্‌ম্‌ম্‌’ করুন, কম্পন ভেতরে কোথায় তা শুনুন।', 'স্বর সামান্য বদলে দেখুন কোথায় কম্পন সবচেয়ে বেশি।'], ['Close your eyes, sit easily, lightly cover the ears.', 'Hum a soft ‘mmm’ and notice where the vibration sits.', 'Vary the pitch slightly to find the strongest resonance.']]],
  ['simha', 'chant', 'সিংহ-মুখভঙ্গি ও ‘হা’', 'Lion’s face & ‘haa’', 'B', 1, 'nature', ['মুখ-জিভ-গলার আড়ষ্টতা কাটানো', 'Release facial and tongue tension'], [['নাক দিয়ে শ্বাস নিন।', 'মুখ বড় করে খুলুন, জিভ নিচে বের করে ‘হা-আ’ বলে সশব্দে ছাড়ুন — আরামে, চিৎকার নয়।', 'মুখ নরম করে বিশ্রাম নিন; ২-৩ বার করুন।'], ['Inhale through the nose.', 'Open the mouth wide, stick the tongue out and exhale a ‘haa’ — easy, not a shout.', 'Soften the face and rest; repeat 2–3 times.']]],
  ['vargo', 'chant', 'বর্গীয় ধ্বনি চ্যান্ট', 'Consonant-group chant', 'B', 3, 'off', ['উচ্চারণ স্থান অনুযায়ী ব্যঞ্জন স্পষ্ট করা', 'Clear consonants by place of articulation'], [['কণ্ঠ্য ধ্বনি ধীরে বলুন: ক খ গ ঘ ঙ।', 'তালব্য ও মূর্ধন্য: চ ছ জ ঝ ঞ — ট ঠ ড ঢ ণ।', 'দন্ত্য ও ওষ্ঠ্য: ত থ দ ধ ন — প ফ ব ভ ম। প্রতিটি পরিষ্কার ও সমান ছন্দে।'], ['Say the velar sounds slowly: ka kha ga gha nga.', 'Palatal and retroflex: cha chha ja jha nya — ta tha da dha na.', 'Dental and labial: ta tha da dha na — pa pha ba bha ma. Each crisp, even rhythm.']]],
  ['mmng', 'chant', 'ম-ন-ঙ নাসিক্য অনুরণন', 'M-N-NG nasal chant', 'I', 2, 'ambient', ['নাক ও মুখের অনুরণন সমন্বয়', 'Balanced nasal and oral resonance'], [['‘ম্‌ম্‌ম্‌’ — ঠোঁট বন্ধ, ঠোঁটে কম্পন।', '‘ন্‌ন্‌ন্‌’ — জিভের ডগা দাঁতের পেছনে; তারপর ‘ঙ্‌ঙ্‌ঙ্‌’ — জিভের পেছন তালুর কাছে।', 'একটানা বলুন: ম্‌ম্‌ম্‌-ন্‌ন্‌ন্‌-ঙ্‌ঙ্‌ঙ্‌-আ, এক শ্বাসে।'], ['‘mmm’ — lips closed, buzz at the lips.', '‘nnn’ — tongue tip behind teeth; then ‘ngng’ — back of the tongue near the palate.', 'Chain them in one breath: mmm-nnn-ngng-ah.']]],
  ['swarm', 'chant', 'স্বরমালিকা (এক স্বরে)', 'Vowel chain on one note', 'B', 2, 'tanpura', ['স্বরধ্বনির সমান ও স্পষ্ট প্রবাহ', 'Even, clear vowel flow'], [['একটি আরামদায়ক স্বর বেছে নিন।', 'একই স্বরে একটানা বলুন: অ—আ—ই—উ—এ—ও।', 'প্রতিটি স্বরে ঠোঁট ও চোয়ালের আকার বদলান, কিন্তু স্বর যেন না কাঁপে।'], ['Choose one comfortable pitch.', 'On that pitch, chant: a—aa—i—u—e—o in one stream.', 'Change lip and jaw shape per vowel while the pitch stays level.']]],
  ['tara', 'chant', 'হালকা উঁচু স্বর (তার সপ্তক)', 'Light high register', 'I', 2, 'tanpura', ['উঁচু স্বরে হালকা ও আরামদায়ক গাওয়া', 'Light, easy singing in the upper range'], [['‘সা’ থেকে শুরু করে ধীরে ‘পা’ পর্যন্ত গড়িয়ে যান।', '‘ইউ’ বা ‘উ’ স্বরে খুব হালকা, চিৎকার ছাড়া উঁচুতে যান।', 'গলা চেপে গেলে বা ব্যথা হলে সঙ্গে সঙ্গে নিচে নেমে আসুন।'], ['Start on Sa and glide gently up toward Pa.', 'Use a light ‘oo’ or ‘ee’ — no shouting — in the upper range.', 'If the throat tightens or hurts, come down at once.']]],
];

const EXTRA_RAW: RawEx[] = [
  ['jawrel', 'artic', 'চোয়াল মুক্তি ও নরম উচ্চারণ', 'Jaw release & soft articulation', 'B', 2, 'off', ['চোয়ালের অপ্রয়োজনীয় টান কমানো', 'Release jaw tension'], [['ঠোঁট বন্ধ না করে চোয়াল আলগা রাখুন।', 'মুখ সামান্য খুলে ‘আ—এ—ও’ ধীরে বলুন।', 'চোয়াল শক্ত হলে থামুন, হালকা বিশ্রাম নিন।'], ['Keep the jaw loose, not clenched.', 'Open slightly and say ‘ah–eh–oh’ slowly.', 'Pause if the jaw tightens.']]],
  ['ngglide', 'reso', 'ঙ্ থেকে স্বরে গ্লাইড', 'NG-to-vowel glide', 'I', 2, 'ambient', ['সামনের অনুরণন ও স্বর সংযোগ', 'Forward resonance and smooth vowel release'], [['‘ঙ্‌ঙ্‌ঙ্’ করে নরম গুঞ্জন করুন।', 'গুঞ্জন না ভেঙে ‘আ’ স্বরে খুলুন।', '৫ বার করুন; গলা চেপে ধরবেন না।'], ['Hum a gentle ‘ng’ sound.', 'Open into ‘ah’ without breaking the sound.', 'Repeat five times without squeezing.']]],
  ['stresstap', 'dyn', 'শব্দের জোর ও ছন্দ', 'Word stress & rhythm', 'I', 3, 'off', ['বাক্যের অর্থ অনুযায়ী শব্দে জোর', 'Emphasize meaning-bearing words'], [['একটি বাক্য নিন: ‘আমি আজ নতুনভাবে শিখব।’', 'প্রতিবার আলাদা শব্দে হালকা জোর দিন।', 'অর্থ কীভাবে বদলায় তা শুনে দেখুন।'], ['Choose: ‘I will learn something new today.’', 'Emphasize a different word each time.', 'Notice how the meaning shifts.']]],
  ['consonantburst', 'artic', 'ব্যঞ্জনধ্বনির স্পষ্ট বিস্ফোরণ', 'Crisp consonant release', 'I', 2, 'off', ['ব্যঞ্জনধ্বনি পরিষ্কার করা', 'Crisp consonant articulation'], [['বলুন: পা-বা, তা-দা, কা-গা।', 'প্রতিটি ধ্বনির শুরু ও শেষ স্পষ্ট করুন।', 'ধীরে শুরু করে স্বচ্ছতা বজায় রেখে গতি বাড়ান।'], ['Say: pa-ba, ta-da, ka-ga.', 'Make each consonant onset clear.', 'Increase speed only while clarity remains.']]],
  ['breathphrase', 'breath', 'বাক্যাংশভিত্তিক শ্বাস পরিকল্পনা', 'Phrase breathing', 'I', 3, 'breath', ['আবৃত্তির আগে শ্বাসের জায়গা নির্ধারণ', 'Plan breath points for recitation'], [['একটি কবিতার ২ লাইন নিন।', 'যেখানে ভাব সম্পূর্ণ হয় সেখানে / চিহ্ন দিন।', 'প্রতিটি চিহ্নের আগে স্বাভাবিক শ্বাস নিয়ে পড়ুন।'], ['Choose two lines of a poem.', 'Mark / where a thought naturally completes.', 'Take an easy breath at each mark.']]],
  ['resonancevowel', 'reso', 'স্বরবর্ণে অনুরণন স্থানান্তর', 'Vowel resonance shaping', 'I', 3, 'ambient', ['স্বরবর্ণের স্বচ্ছতা ও অনুরণন', 'Clear vowel resonance'], [['একই আরামদায়ক স্বরে ‘মা-মে-মি-মো-মু’ বলুন।', 'প্রতিটি স্বরে মুখের আকার বদলান, গলা শিথিল রাখুন।', 'একই অনুশীলন নরম ও স্বাভাবিক ভলিউমে করুন।'], ['On one easy pitch say ‘ma-me-mi-mo-mu’.', 'Change mouth shape while keeping the throat relaxed.', 'Repeat softly at a natural volume.']]],
  ['recitedynamics', 'dyn', 'কবিতার আবেগ ও স্বর-ঢেউ', 'Poetry dynamics & phrasing', 'A', 4, 'ambient', ['কবিতার ভাব অনুযায়ী স্বর নিয়ন্ত্রণ', 'Shape tone to poetic emotion'], [['কবিতার আবেগের শব্দগুলো চিহ্নিত করুন।', 'বর্ণনায় কোমল, আহ্বানে দৃঢ় স্বর ব্যবহার করুন।', 'শেষ শব্দটি টেনে নয়, অর্থপূর্ণ বিরতিতে শেষ করুন।'], ['Mark the emotionally important words.', 'Use a gentle tone for description and a firm tone for a call.', 'End with a meaningful pause, not an artificial drawl.']]],
  ['micdistance', 'proj', 'মাইক্রোফোন দূরত্ব ও পপ নিয়ন্ত্রণ', 'Microphone distance & plosive control', 'B', 2, 'off', ['রেকর্ডিংয়ে পরিষ্কার ও ভারসাম্যপূর্ণ শব্দ', 'Balanced, clean recording'], [['মাইক্রোফোন মুখ থেকে প্রায় ১৫–২০ সেমি দূরে রাখুন।', 'সরাসরি মাইকে না বলে সামান্য পাশ দিয়ে বলুন।', '‘প’, ‘ব’ ধ্বনিতে বাতাসের ধাক্কা কমছে কি না শুনুন।'], ['Keep the mic about 15–20 cm from your mouth.', 'Speak slightly across it, not straight into it.', 'Listen for reduced bursts on P and B sounds.']]],
];

export const TW: TwisterItem[] = [
  { id: 'b1', l: 'bn', v: 1, f: 'ক', x: 'কচি কলার কাঁদি কাল কাকা কিনল।' },
  { id: 'b2', l: 'bn', v: 1, f: 'ব', x: 'বড় বাবু বাজারে বড় বড় বেগুন বেচে।' },
  { id: 'b3', l: 'bn', v: 1, f: 'প', x: 'পাখি পাকা পেঁপে পেয়ে পালিয়ে পড়ল।' },
  { id: 'b4', l: 'bn', v: 1, f: 'ছ', x: 'ছোট ছেলে ছাতা ছেড়ে ছুটে চলে।' },
  { id: 'b5', l: 'bn', v: 2, f: 'ত', x: 'তিনতলায় তিতির তিনটে তেঁতুল তুলল।' },
  { id: 'b6', l: 'bn', v: 2, f: 'র', x: 'রাম রহিমকে রাতে রুটি রেঁধে রাখতে বলল।' },
  { id: 'b7', l: 'bn', v: 2, f: 'গ', x: 'গোপাল গাছের গোড়ায় গোল গোল গুটি গুনে গেল।' },
  { id: 'b8', l: 'bn', v: 2, f: 'শ / স', x: 'শ্যামা শিউলি শুকিয়ে সাদা শাড়িতে সাজাল।' },
  { id: 'b9', l: 'bn', v: 3, f: 'ধ', x: 'ধীরে ধীরে ধান ধুয়ে ধনী ধামায় ধরল।' },
  { id: 'b10', l: 'bn', v: 3, f: 'চ', x: 'চাঁদনি চাতালে চোর চুপচাপ চারটে চাল চুরি করল।' },
  { id: 'b11', l: 'bn', v: 3, f: 'ঢ', x: 'ঢাকের ঢ্যাম কুড়কুড় ঢোলের ঢম ঢম।' },
  { id: 'b12', l: 'bn', v: 3, f: 'স্ব', x: 'স্বপ্নে স্বর্ণ স্বামী স্বচ্ছ স্বরে স্বাগত জানাল।' },
  { id: 'e1', l: 'en', v: 1, f: 'r / l', x: 'Red lorry, yellow lorry.' },
  { id: 'e2', l: 'en', v: 1, f: 'b / t', x: 'Toy boat, toy boat, toy boat.' },
  { id: 'e3', l: 'en', v: 1, f: 'thr', x: 'Three free throws.' },
  { id: 'e4', l: 'en', v: 1, f: 'b', x: 'Rubber baby buggy bumpers.' },
  { id: 'e5', l: 'en', v: 2, f: 's / sh', x: 'She sells seashells by the seashore.' },
  { id: 'e6', l: 'en', v: 2, f: 'p', x: 'Peter Piper picked a peck of pickled peppers.' },
  { id: 'e7', l: 'en', v: 2, f: 's', x: 'Six slippery snails slid slowly seaward.' },
  { id: 'e8', l: 'en', v: 2, f: 'w / ch', x: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?' },
  { id: 'e9', l: 'en', v: 3, f: 'f / fr', x: 'Fresh fried fish, fish fresh fried, fried fish fresh, fish fried fresh.' },
  { id: 'e10', l: 'en', v: 3, f: 'th', x: "I thought a thought, but the thought I thought wasn't the thought I thought I thought." },
  { id: 'e11', l: 'en', v: 3, f: 'b / tt', x: "Betty Botter bought some butter, but she said the butter's bitter." },
  { id: 'e12', l: 'en', v: 3, f: 'u / n / y', x: 'Unique New York, unique New York, you know you need unique New York.' },
  { id: 'c1', l: 'bn', v: 3, g: 1, f: 'ক্ষ', x: 'ক্ষুদ্র ক্ষত্রিয় ক্ষীণ কণ্ঠে ক্ষমা চাইল।' },
  { id: 'c2', l: 'bn', v: 3, g: 1, f: 'জ্ঞ / জ্য', x: 'বিজ্ঞ বৈজ্ঞানিক জ্ঞানের জ্যোতিতে বিজ্ঞাপন জ্বালালেন।' },
  { id: 'c3', l: 'bn', v: 3, g: 1, f: 'স্ব / স্র / স্ন / স্ত', x: 'স্বচ্ছ স্রোতে স্নিগ্ধ স্নান সেরে স্ত্রী স্তব্ধ হলেন।' },
  { id: 'c4', l: 'bn', v: 3, g: 1, f: 'শ্র', x: 'শ্রদ্ধেয় শ্রীমান শ্রমিক শ্রেণির শ্রান্তি দূর করলেন।' },
  { id: 'c5', l: 'bn', v: 3, g: 1, f: 'ব্র / হ্ম', x: 'ব্রাহ্মণ ব্রজেন্দ্র ব্রত ভেঙে ব্রহ্মপুত্রে ব্যস্ত হলেন।' },
  { id: 'c6', l: 'bn', v: 3, g: 1, f: 'দ্ব / দ্য', x: 'বিদ্বান বিদ্যার্থী বিদ্যুতের দ্বন্দ্বে দ্বিধায় পড়ল।' },
  { id: 'c7', l: 'bn', v: 3, g: 1, f: 'ন্ত্র / স্ক / শ্ল', x: 'সন্ত্রস্ত সন্ন্যাসী সন্ধ্যায় সংস্কৃত শ্লোক সংগ্রহ করলেন।' },
  { id: 'c8', l: 'bn', v: 3, g: 1, f: 'ঞ্চ / ক্ষ', x: 'চঞ্চল পক্ষী চঞ্চু দিয়ে পক্ব পেঁপে ঠুকরে খেল।' },
  { id: 'c9', l: 'bn', v: 3, g: 1, f: 'ত্ন / ত্ত্ব', x: 'যত্ন করে রত্নাকর রত্নরাশি তত্ত্বে মিলাল।' },
  { id: 'c10', l: 'bn', v: 3, g: 1, f: 'র্ভ / র্ম / র্ঝ / র্জ', x: 'নির্ভীক নির্মল নির্ঝরিণী নির্জন নদীতে বইল।' },
  { id: 'c11', l: 'bn', v: 3, g: 1, f: 'প্র / ত্য', x: 'প্রত্যেক প্রাণী প্রত্যাশায় প্রশস্ত প্রান্তরে প্রস্থান করল।' },
  { id: 'c12', l: 'bn', v: 3, g: 1, f: 'ধ্ব / স্ত / স্তূ', x: 'ধ্বংসস্তূপে ধ্বনি-প্রতিধ্বনি তুলে স্তব্ধ স্তম্ভ কাঁপল।' },
  { id: 'c13', l: 'bn', v: 3, g: 1, f: 'ষ্ণ / ষ্ঠ / ষ্ট', x: 'কৃষ্ণপক্ষে কনিষ্ঠ কৃষক কষ্টে ইষ্টনাম জপল।' },
  { id: 'c14', l: 'bn', v: 3, g: 1, f: 'দ্ধ / দ্ব / দ্য', x: 'উদ্ধত উদ্বেগে উদ্যমী বুদ্ধিমান বৃদ্ধ ঝুঁকি নিলেন।' },
];

const bnTwisterLines = TW.filter((w) => w.l === 'bn' && !w.g).map((w) => w.x);
const conjLines = TW.filter((w) => w.g).map((w) => w.x);
const enTwisterLines = TW.filter((w) => w.l === 'en').map((w) => w.x);

const TW_SESSION_RAW: RawEx[] = [
  ['twb', 'tw', 'বাংলা টাং টুইস্টার', 'Bengali tongue twisters', 'I', 3, 'off', ['ধীরে শুরু করে ধীরে গতি বাড়ান', 'Start slow, build speed gently'], [bnTwisterLines.slice(0, 8), bnTwisterLines.slice(0, 8)], 'bn'],
  ['twc', 'tw', 'যুক্তাক্ষরের কঠিন লাইন', 'Bengali conjunct drill', 'A', 4, 'off', ['ক্ষ, জ্ঞ, স্ত্র, শ্র, দ্ব — স্পষ্ট ও ধীরে', 'Hard conjuncts — clear and slow'], [conjLines, conjLines], 'bn'],
  ['twe', 'tw', 'ইংরেজি টাং টুইস্টার', 'English tongue twisters', 'I', 3, 'off', ['Clarity first, then speed', 'স্পষ্টতা আগে, গতি পরে'], [enTwisterLines.slice(0, 6), enTwisterLines.slice(0, 6)], 'en'],
];

const toExercise = (a: RawEx): Exercise => ({
  id: a[0],
  c: a[1],
  bn: a[2],
  en: a[3],
  l: a[4],
  d: a[5],
  a: a[6],
  ob: a[7],
  st: a[8],
  lg: a[9],
});

// All 50 vocal exercises preserved intact (39 core + 3 twister sessions + 8 extra)
export const EXERCISES: Exercise[] = [
  ...CORE_RAW.map(toExercise),
  ...TW_SESSION_RAW.map(toExercise),
  ...EXTRA_RAW.map(toExercise),
];

export const EX_MAP: Record<string, Exercise> = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
export const VALID_EX_IDS = new Set<string>(EXERCISES.map((e) => e.id));

export const ROUTINES: Record<string, RoutineDef> = {
  beg: { n: ['শুরুর ১০ মিনিট', 'Beginner 10 min'], i: [['breath', 2], ['om', 2], ['hum', 2], ['lip', 2], ['clarity', 1], ['cool', 1]] },
  std: { n: ['স্ট্যান্ডার্ড ২০ মিনিট', 'Standard 20 min'], i: [['breath', 3], ['om', 3], ['hum', 3], ['lip', 3], ['pitch', 3], ['clarity', 3], ['cool', 2]] },
  rec: { n: ['আবৃত্তি ও বক্তৃতা প্রস্তুতি ১৫ মিনিট', 'Recitation & speech prep 15 min'], i: [['breath', 2], ['hum', 2], ['lip', 2], ['tongue', 3], ['clarity', 3], ['proj', 2], ['cool', 1]] },
  adv: { n: ['অ্যাডভান্সড ৩০ মিনিট', 'Advanced 30 min'], i: [['breath', 4], ['om', 4], ['hum', 4], ['lip', 4], ['pitch', 5], ['proj', 5], ['cool', 4]] },
  conj: { n: ['যুক্তাক্ষর ও টাং টুইস্টার ১২ মিনিট', 'Conjuncts & twisters 12 min'], i: [['yawn', 1], ['hiss', 2], ['artic', 2], ['pataka', 2], ['twc', 3], ['twb', 2]] },
  tech: { n: ['কণ্ঠ-কৌশল সম্পূর্ণ ২৫ মিনিট', 'Full technique 25 min'], i: [['neck', 2], ['box', 3], ['straw', 3], ['siren', 3], ['vowel', 2], ['pataka', 2], ['twc', 3], ['twb', 2], ['dyn', 3], ['cool', 2]] },
  morning: { n: ['ভোরের সাধনা ১০ মিনিট', 'Morning sadhana 10 min'], i: [['ujj', 2], ['bhram', 2], ['aum3', 2], ['sa', 2], ['cool', 2]] },
  sadhana: { n: ['কণ্ঠ-সাধনা ও চ্যান্টিং ২০ মিনিট', 'Sadhana & chanting 20 min'], i: [['box', 2], ['bhram', 2], ['nad', 2], ['aum3', 3], ['soham', 2], ['sa', 3], ['sargam', 3], ['alank', 3]] },
};

export const QUOTES: [string, string][] = [
  ['ধীরে শুরু করুন, কণ্ঠ ধন্যবাদ দেবে।', 'Start gently; your voice will thank you.'],
  ['প্রতিদিন অল্প অনুশীলনই সেরা।', 'A little every day beats a lot once.'],
  ['স্বস্তিই আসল লক্ষ্য, জোর নয়।', 'Comfort is the goal, not force.'],
];

export const LEVEL_LABELS: Record<ExLevel, [string, string]> = {
  B: ['শুরুর', 'Beginner'],
  I: ['মধ্যম', 'Intermediate'],
  A: ['উন্নত', 'Advanced'],
};

export const SA_KEYS: [string, number][] = [
  ['C', 130.81],
  ['C♯', 138.59],
  ['D', 146.83],
  ['D♯', 155.56],
  ['E', 164.81],
  ['F', 174.61],
  ['F♯', 185],
  ['G', 196],
  ['G♯', 207.65],
  ['A', 220],
  ['A♯', 233.08],
  ['B', 246.94],
];

export const POETRY_WORDS: PoetryWord[] = [
  { w: 'নির্ঝরিণী', s: ['নির্', 'ঝ', 'রি', 'ণী'], p: 'নির্-ঝ-রি-ণী', h: 'নির্ + ঝরিণী', tip: '‘র্ঝ’ যুক্তধ্বনিতে জিভে চাপ নয়; ধীরে বলুন।' },
  { w: 'স্রোতস্বিনী', s: ['স্রোত', 'স্বি', 'নী'], p: 'স্রোত-স্বি-নী', h: 'স্রোত + স্বি + নী', tip: '‘স্রোত’ ও ‘স্বি’ আলাদা করে, পরে জুড়ে বলুন।' },
  { w: 'প্রত্যুষে', s: ['প্র', 'ত্যু', 'ষে'], p: 'প্র-ত্যু-ষে', h: 'প্র + ত্যু + ষে', tip: '‘ত্যু’ অংশটি স্পষ্ট করুন; ‘প্রতিউষে’ বলবেন না।' },
  { w: 'মর্মরধ্বনি', s: ['মর্', 'মর', 'ধ্ব-নি'], p: 'মর্-মর-ধ্ব-নি', h: 'মর্মর + ধ্বনি', tip: '‘ধ্ব’ যুক্তধ্বনি ভেঙে অনুশীলন করুন।' },
  { w: 'অভ্যুদয়', s: ['অভ্', 'যু', 'দয়'], p: 'অভ্-যু-দয়', h: 'অভি + উদয় → অভ্যুদয়', tip: '‘ভ্যু’ অংশে স্বর স্বাভাবিক রাখুন।' },
  { w: 'ঐশ্বর্য', s: ['ঐশ্', 'বর্', 'য'], p: 'ঐশ্-বর্-য', h: 'ঐ + শ্বর্য', tip: '‘শ্বর্য’ অংশটি ধীরে বলুন; শেষের য-ধ্বনি স্পষ্ট।' },
  { w: 'নৈঃশব্দ্য', s: ['নৈঃ', 'শব্', 'দ্য'], p: 'নৈঃ-শব্-দ্য', h: 'নিঃ + শব্দ + য', tip: '‘শব্দ্য’ অংশে দ্-য সংযোগ পরিষ্কার করুন।' },
  { w: 'উচ্ছ্বাস', s: ['উচ্', 'ছ্বাস'], p: 'উচ্-ছ্বাস', h: 'উৎ + শ্বাস', tip: 'দ্বিত্ব ‘চ্ছ’ স্পষ্ট; অতিরিক্ত বাতাস ছাড়বেন না।' },
  { w: 'দুর্বার', s: ['দুর্', 'বার'], p: 'দুর্-বার', h: 'দুর্ + বার', tip: '‘র্বা’ অংশে রেফের সংযোগ বজায় রাখুন।' },
  { w: 'শ্রান্তিহরণ', s: ['শ্রান্', 'তি', 'হ-রণ'], p: 'শ্রান্-তি-হ-রণ', h: 'শ্রান্তি + হরণ', tip: '‘শ্র’ যুক্তাক্ষর দিয়ে শুরু করুন, ‘সরান্তি’ নয়।' },
  { w: 'ব্রহ্মাণ্ড', s: ['ব্রহ্', 'মাণ্ড'], p: 'ব্রহ্-মাণ্ড', h: 'ব্রহ্ম + অণ্ড', tip: '‘ব্রহ্ম’ অংশটি ধীরে বলুন; অনুনাসিকতা শুনুন।' },
  { w: 'ক্ষীণতনু', s: ['ক্ষীণ', 'ত-নু'], p: 'ক্ষীণ-ত-নু', h: 'ক্ষীণ + তনু', tip: '‘ক্ষ’ ধ্বনি স্পষ্ট করুন; ‘খ’ বলে সরল করবেন না।' },
  { w: 'চিরন্তন', s: ['চি', 'রন্', 'তন'], p: 'চি-রন্-তন', h: 'চির + অন্তন', tip: 'মাঝের ন্-ত সংযোগে বিরতি দেবেন না।' },
  { w: 'প্রতিধ্বনি', s: ['প্র-তি', 'ধ্ব-নি'], p: 'প্র-তি-ধ্ব-নি', h: 'প্রতি + ধ্বনি', tip: '‘ধ্ব’ একসঙ্গে বলুন, পরে ‘নি’ যোগ করুন।' },
  { w: 'গোধূলিলগ্ন', s: ['গো', 'ধূ-লি', 'লগ্-ন'], p: 'গো-ধূ-লি-লগ্-ন', h: 'গোধূলি + লগ্ন', tip: '‘গ্ন’ যুক্তাক্ষরটি শেষে পরিষ্কার করুন।' },
  { w: 'অন্তঃসলিলা', s: ['অন্', 'তঃ', 'স-লি-লা'], p: 'অন্-তঃ-স-লি-লা', h: 'অন্তঃ + সলিলা', tip: 'বিসর্গের পরের ‘স’ আলাদা শুনিয়ে বলুন।' },
  { w: 'স্নিগ্ধতা', s: ['স্নিগ্', 'ধ-তা'], p: 'স্নিগ্-ধ-তা', h: 'স্নিগ্ধ + তা', tip: '‘স্নি’ ও ‘গ্ধ’ ধীরে জুড়ুন।' },
  { w: 'দুর্নিবার', s: ['দুর্', 'নি', 'বার'], p: 'দুর্-নি-বার', h: 'দুর্ + নিবার', tip: '‘র্নি’ সংযোগে রেফ স্পষ্ট রাখুন।' },
  { w: 'অকুণ্ঠিত', s: ['অ-কুন্', 'ঠি', 'ত'], p: 'অ-কুন্-ঠি-ত', h: 'অ + কুণ্ঠিত', tip: '‘ণ্ঠি’ অংশে মূর্ধন্য ণ্ঠ উচ্চারণে মনোযোগ দিন।' },
  { w: 'নির্মেঘ', s: ['নির্', 'মেঘ'], p: 'নির্-মেঘ', h: 'নির্ + মেঘ', tip: 'রেফের পর ‘মে’ স্পষ্ট বলুন।' },
];

export const POETRY_SAMPLE_LINE = 'নির্ঝরিণীর স্রোতস্বিনী ধ্বনি / গোধূলিলগ্নে জাগায় চিরন্তন স্মৃতি।';
