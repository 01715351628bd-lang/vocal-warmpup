export interface ChallengeDayDef {
  day: number;
  titleBn: string;
  titleEn: string;
  focusBn: string;
  focusEn: string;
  tipBn: string;
  tipEn: string;
  steps: [string, number][];
}

export const CHALLENGE_7_DAYS: ChallengeDayDef[] = [
  {
    day: 1,
    titleBn: 'দিন ১: গলার টান মুক্তি ও শ্বাসের ভিত্তি',
    titleEn: 'Day 1: Throat Release & Breath Foundation',
    focusBn: 'ঘাড়-কাঁধ শিথিল করে ডায়াফ্রাম শ্বাস ও বেসলাইন রেকর্ডিং',
    focusEn: 'Release neck/jaw tension, establish diaphragmatic breath & Day 1 baseline',
    tipBn: 'শুরুতে স্টুডিওতে একটি "Day 1" ভয়েস নমুনা রেকর্ড করে রাখুন—৭ম দিনে পার্থক্য বুঝতে পারবেন।',
    tipEn: 'Record a short "Day 1" sample in Studio first so you can compare your voice transformation on Day 7.',
    steps: [
      ['neck', 2],
      ['yawn', 2],
      ['breath', 2],
      ['box', 2],
    ],
  },
  {
    day: 2,
    titleBn: 'দিন ২: গভীর হামিং ও ভোকাল উষ্ণতা',
    titleEn: 'Day 2: Deep Humming & Resonance Warmth',
    focusBn: 'চাপহীন স্ট্র-ফোনেশন, ওম ও ভ্রামরীতে কণ্ঠ মসৃণ ও ভরাট করা',
    focusEn: 'Warm vocal folds effortlessly with straw phonation, humming, OM & Bhramari',
    tipBn: 'ঠোঁট ও নাকের সামনে হালকা কাঁপুনি অনুভব করুন—গলায় কোনো চাপ দেবেন না।',
    tipEn: 'Feel gentle buzzing around your lips and nose without pushing from the throat.',
    steps: [
      ['hum', 2],
      ['straw', 3],
      ['om', 2],
      ['bhram', 2],
    ],
  },
  {
    day: 3,
    titleBn: 'দিন ৩: শ্বাস নিয়ন্ত্রণ ও ঠোঁট-জিভের সচলতা',
    titleEn: 'Day 3: Breath Control & Lip/Tongue Agility',
    focusBn: 'হিস শ্বাস, স্টাকাটো এবং লিপ ও জিভ ট্রিল দিয়ে দম বাড়ানো',
    focusEn: 'Build steady airflow support and relax articulators using trills & staccato',
    tipBn: 'লিপ ট্রিলের সময় কাঁধ স্থির রেখে পেটের সাপোর্ট ব্যবহার করুন।',
    tipEn: 'Keep shoulders steady and power trills gently from your diaphragm.',
    steps: [
      ['hiss', 2],
      ['stac', 2],
      ['lip', 2],
      ['tongue', 2],
    ],
  },
  {
    day: 4,
    titleBn: 'দিন ৪: পিচ গভীরতা, গ্লাইড ও স্থিরতা',
    titleEn: 'Day 4: Pitch Depth, Glide & Tone Stability',
    focusBn: 'সা-সাধনা, মন্দ্র সপ্তক ও মীড় দিয়ে স্থির ও গভীর স্বর তৈরি',
    focusEn: 'Stabilize pitch, deepen your comfortable lower register, and smooth transitions',
    tipBn: 'মন্দ্র সপ্তকে গলা চেপে নামবেন না—স্বর যতটা আরামে নামে ততটুকুই অনুশীলন করুন।',
    tipEn: 'Never squeeze downward in Mandra—stay relaxed in your natural lower resonance.',
    steps: [
      ['sa', 3],
      ['mandra', 3],
      ['siren', 3],
      ['meend', 3],
    ],
  },
  {
    day: 5,
    titleBn: 'দিন ৫: স্পষ্ট উচ্চারণ ও ধ্বনি স্বচ্ছতা',
    titleEn: 'Day 5: Crisp Articulation & Clarity',
    focusBn: 'চোয়াল মুক্তি, স্বরবর্ণ আকার ও পা-তা-কা গতিতে জড়তা কাটানো',
    focusEn: 'Sharpen consonants, shape open vowels, and eliminate mumbling',
    tipBn: 'গতির চেয়ে প্রতিটি ব্যঞ্জন ও স্বরবর্ণ পরিষ্কার উচ্চারণের দিকে মনোযোগ দিন।',
    tipEn: 'Prioritize crisp pronunciation over speed during Pa-ta-ka and consonant bursts.',
    steps: [
      ['jawrel', 2],
      ['artic', 2],
      ['vowel', 3],
      ['pataka', 2],
      ['consonantburst', 2],
    ],
  },
  {
    day: 6,
    titleBn: 'দিন ৬: সামনের অনুরণন ও ভয়েস প্রজেকশন',
    titleEn: 'Day 6: Forward Resonance & Projection Power',
    focusBn: 'চিৎকার ছাড়া কণ্ঠে গভীরতা, উজ্জ্বলতা ও দূরের প্রজেকশন আনা',
    focusEn: 'Project a rich, commanding tone across a room without straining',
    tipBn: '‘ঙ্-আ’ গ্লাইড থেকে তৈরি সামনের অনুরণন ধরে রেখে স্বাভাবিকভাবে কথা বলুন।',
    tipEn: 'Carry the forward ring from your NG-glide directly into natural spoken projection.',
    steps: [
      ['ngglide', 2],
      ['reso', 3],
      ['resonancevowel', 3],
      ['proj', 4],
    ],
  },
  {
    day: 7,
    titleBn: 'দিন ৭: পূর্ণ কণ্ঠ রূপান্তর ও ফাইনাল চেক',
    titleEn: 'Day 7: Full Voice Transformation & Final Check',
    focusBn: 'ত্রি-ধ্বনি ওম, সরগম, গতি-ভাব ও আবৃত্তির মাধ্যমে চূড়ান্ত ফিটনেস',
    focusEn: 'Integrate tone, pitch agility, expression, and record your Day 7 comparison',
    tipBn: 'শেষ করার পর স্টুডিওতে Day 1 ও Day 7 রেকর্ডিং A/B তুলনা করে শুনুন!',
    tipEn: 'Finish by recording a Day 7 take in Studio and playing A vs B against Day 1!',
    steps: [
      ['aum3', 3],
      ['sargam', 3],
      ['dyn', 3],
      ['recite', 4],
      ['cool', 2],
    ],
  },
];
