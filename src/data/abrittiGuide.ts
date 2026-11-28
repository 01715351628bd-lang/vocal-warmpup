export type AbrittiGroup = 'foundation' | 'diction' | 'technique' | 'stage';

export interface AbrittiPoint {
  titleBn: string;
  titleEn: string;
  detailBn: string;
  detailEn: string;
  exampleBn?: string;
  exampleEn?: string;
}

export interface AbrittiWordSample {
  word: string;
  spoken: string;
  noteBn: string;
  noteEn: string;
}

export interface AbrittiMistake {
  wrongBn: string;
  wrongEn: string;
  fixBn: string;
  fixEn: string;
}

export interface AbrittiModule {
  id: string;
  num: number;
  group: AbrittiGroup;
  icon: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  summaryBn: string;
  summaryEn: string;
  deepDiveBn: string;
  deepDiveEn: string;
  points: AbrittiPoint[];
  samples?: AbrittiWordSample[];
  mistakes: AbrittiMistake[];
  practiceBn: string;
  practiceEn: string;
  practiceStepsBn: string[];
  practiceStepsEn: string[];
}

export const ABRITTI_GROUPS: Record<'all' | AbrittiGroup, [string, string]> = {
  all: ['সব অধ্যায় (১৪)', 'All Chapters (14)'],
  foundation: ['পরিচয় ও ইতিহাস', 'Foundations & History'],
  diction: ['ধ্বনি ও প্রমিত উচ্চারণ', 'Phonetics & Diction'],
  technique: ['ব্যায়াম ও নির্মাণ কৌশল', 'Exercises & Crafting'],
  stage: ['প্রস্তুতি ও মঞ্চকৌশল', 'Prep & Stagecraft'],
};

export const ABRITTI_MODULES: AbrittiModule[] = [
  {
    id: 'abritti-porichoy',
    num: 1,
    group: 'foundation',
    icon: '🎭',
    titleBn: 'আবৃত্তি পরিচয়',
    titleEn: 'Introduction to Recitation',
    subtitleBn: 'কবিতার অন্তর্নিহিত ভাব কণ্ঠে জীবন্ত করে তোলার শিল্প',
    subtitleEn: 'The vocal art of bringing poetry and prose alive',
    summaryBn:
      'আবৃত্তি কেবল মুখস্থ কবিতা পাঠ নয়; এটি কবির অনুভূতি, ছন্দ, চিত্রকল্প ও বক্তব্যকে শুদ্ধ উচ্চারণ, সংযত আবেগ ও কণ্ঠশিল্পের মাধ্যমে শ্রোতার হৃদয়ে পৌঁছে দেওয়ার সৃজনশীল পরিবেশনা।',
    summaryEn:
      'Recitation is not mere memorization—it is the performing art of conveying a poet’s emotion, rhythm, imagery, and intent through clear diction and expressive voice.',
    deepDiveBn:
      '‘আবৃত্তি’ শব্দের আক্ষরিক অর্থ কোনো কিছু ঘুরিয়ে-ফিরিয়ে বা পুনরায় পাঠ করা। তবে শিল্পমাধ্যম হিসেবে আবৃত্তি মানে লিখিত কবিতাকে দৃশ্যমান ও শ্রুতিগ্রাহ্য রূপ দেওয়া। কবি যখন কবিতা লেখেন, তখন তা কাগজে নীরব অক্ষরে বন্দী থাকে; আবৃত্তিকার সেই নীরব অক্ষরে শ্বাস, বিরতি, স্বর-রঙ ও হৃদয়ের উষ্ণতা যোগ করে শ্রোতার কল্পনায় জীবন্ত ছবি এঁকে দেন।',
    deepDiveEn:
      'Literally meaning repeated utterance, as an art form Abritti unlocks silent printed verse into living sound, breathing rhythm, tonal nuance, and shared human emotion.',
    points: [
      {
        titleBn: 'সাধারণ পাঠ বনাম আবৃত্তি',
        titleEn: 'Plain Reading vs. Recitation',
        detailBn: 'সাধারণ পাঠে কেবল শব্দের তথ্য জানানো হয়; আবৃত্তিতে শব্দের ধ্বনি-সৌন্দর্য, অর্থের গভীরতা ও ভাবের ওঠানামা ফুটে ওঠে।',
        detailEn: 'Plain reading communicates literal text; recitation reveals musicality, subtext, and emotional contours.',
        exampleBn: 'যেমন: “রাত গভীর” — পাঠে শুধু তথ্য, আর আবৃত্তিতে স্বর নামিয়ে নীরবতা ও রহস্য অনুভব করানো।',
        exampleEn: 'E.g., “The night is deep” spoken softly with a lingering pause lets the listener feel the stillness.',
      },
      {
        titleBn: 'আবৃত্তির চারটি মূল উপাদান',
        titleEn: 'Four Core Elements',
        detailBn: 'শুদ্ধ উচ্চারণ (বুদ্ধি), ভাবানুভূতি (হৃদয়), কণ্ঠস্বরের নমনীয়তা (শরীর) এবং ছন্দ-বিরতির বোধ (শিল্প)—এই চারটি মিলে আবৃত্তি সম্পূর্ণ হয়।',
        detailEn: 'Accurate diction, sincere empathy, vocal flexibility, and rhythmic timing unite to complete a recitation.',
      },
      {
        titleBn: 'অভিনয় ও আবৃত্তির সীমারেখা',
        titleEn: 'Acting vs. Recitation Boundary',
        detailBn: 'আবৃত্তি একক কণ্ঠের শিল্প—এখানে নাটকের মতো অতি-অঙ্গভঙ্গি বা মঞ্চ-দৌড়ঝাঁপ চলে না; দেহ শান্ত রেখে কণ্ঠে ও চোখেই মূল নাটকীয়তা তৈরি করতে হয়।',
        detailEn: 'Unlike stage drama, recitation avoids heavy physical theatrics; subtlety in voice and eyes carries the drama.',
      },
      {
        titleBn: 'কবির অভিপ্রায়ের প্রতি বিশ্বস্ততা',
        titleEn: 'Faithfulness to the Poet',
        detailBn: 'আবৃত্তিকার নিজের কণ্ঠের কারুকার্য দেখাতে গিয়ে কবিতার অর্থ বিকৃত করবেন না; প্রতিটি শব্দ যেন কবির ভাবনাকেই স্পষ্ট করে।',
        detailEn: 'Never let vocal ornamentation distort the poet’s actual message; serve the poem’s true intent.',
      },
    ],
    samples: [
      {
        word: '“কোথা সে তিমির, কোথা সে আলো”',
        spoken: 'জিজ্ঞাসা ও বিস্ময়ের সুরে',
        noteBn: '‘কোথা’ শব্দে হালকা প্রশ্নবোধক ঊর্ধ্ব-স্বর এবং মাঝখানে ১ সেকেন্ড বিরতি',
        noteEn: 'Gentle rising curiosity on “কোথা” with a crisp 1-second pause',
      },
      {
        word: '“জাগো, জাগো বন্দী”',
        spoken: 'দৃঢ় ও আহ্বানমূলক স্বরক্ষেপণ',
        noteBn: 'চিৎকার নয়, বুক-পেটের শ্বাস-সাপোর্টে গম্ভীর উদাত্ত আহ্বান',
        noteEn: 'Grounded chest resonance and breath support rather than shouting',
      },
    ],
    mistakes: [
      {
        wrongBn: 'গানের মতো কৃত্রিম সুর করে বা একই ঢঙে পুরো কবিতা বলা।',
        wrongEn: 'Using a repetitive sing-song melody throughout the poem.',
        fixBn: 'সুর নয়, কথার স্বাভাবিক ভাব ও অর্থ অনুযায়ী স্বরকে ওঠানামা করান।',
        fixEn: 'Speak from natural conversational inflection guided by meaning, not fixed tune.',
      },
      {
        wrongBn: 'অতিরিক্ত হাত নেড়ে ও মাথা ঝাঁকিয়ে কবিতার ভাব বোঝানোর চেষ্টা।',
        wrongEn: 'Overusing hand gestures and head movements to force expression.',
        fixBn: 'কাঁধ ও হাত স্থির রেখে কেবল চোখের দৃষ্টি ও কণ্ঠের ওঠানামায় আবেগ আনুন।',
        fixEn: 'Keep shoulders calm and let eye focus and vocal color do the expressive work.',
      },
    ],
    practiceBn: 'যেকোনো ৪ লাইনের একটি কবিতা প্রথমে সাধারণ সংবাদ-পাঠের মতো বলুন, তারপর অর্থ বুঝে থেমে ও ভাব ফুটিয়ে আবৃত্তি করুন।',
    practiceEn: 'Read a 4-line stanza neutrally like a news anchor first, then recite it with clear pauses and emotion.',
    practiceStepsBn: [
      'প্রথমে নিঃশব্দে ৪ লাইন পড়ে মূল অনুভূতিটি (দুঃখ, বিস্ময় বা আশা) ঠিক করুন।',
      'পেনসিল দিয়ে কোথায় শ্বাস নেবেন এবং কোন শব্দে হালকা জোর দেবেন তা দাগিয়ে নিন।',
      'একবার স্বাভাবিক ভঙ্গিতে, এরপর ভাব ফুটিয়ে স্টুডিওতে রেকর্ড করে পার্থক্য শুনুন।',
    ],
    practiceStepsEn: [
      'Read the 4 lines silently first to identify the dominant emotion.',
      'Mark breath breaks and 2–3 key words for subtle vocal emphasis.',
      'Record a plain reading and an expressive take in Studio to hear the contrast.',
    ],
  },
  {
    id: 'abritti-itihas',
    num: 2,
    group: 'foundation',
    icon: '🏛️',
    titleBn: 'আবৃত্তিচর্চা ও এর ইতিহাস',
    titleEn: 'Recitation Practice & History',
    subtitleBn: 'প্রাচীন মৌখিক ঐতিহ্য থেকে আধুনিক বাংলা মঞ্চ আবৃত্তির যাত্রা',
    subtitleEn: 'From ancient oral tradition to modern Bengali stage recitation',
    summaryBn:
      'মানব সভ্যতার আদিকাল থেকেই শ্রুতি ও স্মৃতির মাধ্যমে কাব্যচর্চা চলে এসেছে। প্রাচীন বেদ-স্তোত্র, গ্রিক র‍্যাপসোডি ও বাংলার পুঁথিপাঠ-পাঁচালি পেরিয়ে উনিশ ও বিশ শতকে বাংলায় আধুনিক মঞ্চ আবৃত্তির স্বতন্ত্র ধারা গড়ে ওঠে।',
    summaryEn:
      'Rooted in ancient oral traditions—Vedic chants, Greek rhapsodes, and Bengali punthi-panchali—modern Bengali recitation evolved as an independent stage art in the 19th–20th centuries.',
    deepDiveBn:
      'ছাপাখানা আবিষ্কারের বহু আগে মানুষ কণ্ঠে কণ্ঠেই কবিতা, মহাকাব্য ও পুরাণ বাঁচিয়ে রাখত। বাংলা সাহিত্যের আদি নিদর্শন চর্যাপদ থেকে শুরু করে মঙ্গলকাব্য, কথকতা ও পুঁথিপাঠ ছিল দলগত বা আসর-ভিত্তিক আবৃত্তির প্রাচীন রূপ। উনিশ শতকের রেনেসাঁ এবং বিশ শতকে বেতার-মঞ্চ-অডিও রেকর্ডের হাত ধরে বাংলা আবৃত্তি স্বতন্ত্র আধুনিক শিল্পরূপ লাভ করে।',
    deepDiveEn:
      'Long before printing presses, epics and verse lived orally. In Bengal, Charyapada chants, Mangalkavya, kathakata storytelling, and punthi recitations gradually matured through 19th-century salons and 20th-century radio into modern solo and ensemble Abritti.',
    points: [
      {
        titleBn: 'আদি শ্রুতি-ঐতিহ্য ও সংস্কৃত ছন্দপাঠ',
        titleEn: 'Vedic & Classical Oral Roots',
        detailBn: 'প্রাচীন ভারতে বেদ ও উপনিষদ ‘শ্রুতি’ হিসেবে গুরু-শিষ্য পরম্পরায় নিখুঁত উচ্চারণ, স্বরাঘাত ও ছন্দ মেনে আবৃত্তি করা হতো।',
        detailEn: 'Ancient texts were transmitted orally through strict phonetic accuracy, accent, and prosody.',
      },
      {
        titleBn: 'মধ্যযুগের পুঁথিপাঠ, পাঁচালি ও কথকতা',
        titleEn: 'Medieval Punthi & Kathakata',
        detailBn: 'বাংলায় আলাওল, ভারতচন্দ্র বা কৃত্তিবাসের কাব্য গ্রামের আসরে সুরেলা পয়ার-ত্রিপদী ছন্দে পাঠ করা হতো—যা শ্রোতাদের মনে কাব্যরস ছড়িয়ে দিত।',
        detailEn: 'Community gatherings heard epics recited in rhythmic payar and tripadi meters with vivid storytelling.',
      },
      {
        titleBn: 'রবীন্দ্রযুগ ও জোড়াসাঁকোর পাঠধারা',
        titleEn: 'Tagore & Santiniketan Style',
        detailBn: 'রবীন্দ্রনাথ ঠাকুরের কণ্ঠে গম্ভীর, পরিমিত ও ছন্দ-সচেতন কাব্যপাঠ অতিরঞ্জিত থিয়েটার-ভঙ্গি বাদ দিয়ে আধুনিক বাংলা আবৃত্তির ভিত্তি গড়ে দেয়।',
        detailEn: 'Tagore’s dignified, rhythm-conscious readings moved Bengali recitation away from melodrama.',
      },
      {
        titleBn: 'বেতার ও আধুনিক বাংলা আবৃত্তির স্বর্ণযুগ',
        titleEn: 'Radio & Modern Stage Pioneers',
        detailBn: 'কলকাতা ও ঢাকা বেতার, শম্ভু মিত্র, কাজী সব্যসাচী, প্রদীপ ঘোষ, গোলাম মুস্তাফা ও পরবর্তীতে আবৃত্তি সংগঠনগুলোর মাধ্যমে একক ও বৃন্দ আবৃত্তি গণমানুষের শিল্পে পরিণত হয়।',
        detailEn: 'Radio broadcasts and master artists turned solo and chorus recitation into a vibrant cultural movement.',
      },
    ],
    samples: [
      {
        word: 'পুঁথিপাঠ ধারা (মধ্যযুগ)',
        spoken: 'টানা সুরেলা পয়ার-লয়',
        noteBn: 'আসরের শ্রোতাদের ধরে রাখতে পয়ারের ছন্দে সুরের ঢেউ',
        noteEn: 'Melodic payar cadence used in traditional courtyard readings',
      },
      {
        word: 'আধুনিক মঞ্চ আবৃত্তি',
        spoken: 'সংযত, ভাবনির্ভর বাচিক ভঙ্গি',
        noteBn: 'শব্দের সূক্ষ্ম অর্থ, বিরতি ও স্বাভাবিক স্বরের ওঠানামা',
        noteEn: 'Natural vocal nuance, measured pauses, and poetic subtext',
      },
    ],
    mistakes: [
      {
        wrongBn: 'আধুনিক কবিতাতেও পুঁথিপাঠ বা যাত্রাপালার মতো অতিনাটকীয় সুর টানা।',
        wrongEn: 'Applying archaic melodramatic chanting to modern free-verse poetry.',
        fixBn: 'কবিতার যুগ ও ধরন বুঝে সেই অনুযায়ী বাচিক ভঙ্গি নির্বাচন করুন।',
        fixEn: 'Match your vocal style to the poem’s era, diction, and tone.',
      },
    ],
    practiceBn: 'প্রাচীন পুঁথিপাঠের সুরেলা ছন্দ আর আধুনিক সংযত কবিতাপাঠ—দুই ভঙ্গিতে একটি স্তবক বলার পার্থক্য অনুভব করুন।',
    practiceEn: 'Compare chanting a couplet in traditional melodic cadence versus restrained modern recitation.',
    practiceStepsBn: [
      'একটি ছন্দোবদ্ধ পয়ার চরণ প্রথমে পুঁথিপাঠের মতো সুর তুলে পড়ুন।',
      'এবার সেই চরণটিই কথ্য স্বাভাবিক সুরে কিন্তু ছন্দের দোলা রেখে আবৃত্তি করুন।',
      'বুঝে নিন কেন আধুনিক মঞ্চে দ্বিতীয় ভঙ্গিটি বেশি হৃদয়গ্রাহী শোনায়।',
    ],
    practiceStepsEn: [
      'Chant a rhymed couplet in an old melodic punthi style first.',
      'Recite the same couplet cleanly in restrained modern stage diction.',
      'Notice how natural intonation keeps the listener closer to the meaning.',
    ],
  },
  {
    id: 'kobita-porichoy',
    num: 3,
    group: 'foundation',
    icon: '📜',
    titleBn: 'কবিতা পরিচয়',
    titleEn: 'Understanding Poetry',
    subtitleBn: 'ছন্দ, মাত্রা, স্তবক, চিত্রকল্প, রস ও কবিতার অন্তর্গত সুর',
    subtitleEn: 'Meter, beat units, stanzas, imagery, rasa, and poetic pulse',
    summaryBn:
      'ভালো আবৃত্তির প্রথম শর্ত কবিতাকে গভীরভাবে চেনা। কবিতার ছন্দ-প্রকৃতি, পঙ্ক্তির গাঁথুনি, অন্ত্যমিল বা গদ্যছন্দ, রূপক-উপমা এবং মূল রস বুঝতে পারলে স্বরের ওঠানামা স্বতঃস্ফূর্ত হয়।',
    summaryEn:
      'Great recitation begins with understanding poetry itself—its meter, line architecture, imagery, metaphors, and underlying emotional arc.',
    deepDiveBn:
      'কবিতা গদ্যের মতো সোজা পথে হাঁটে না; কবিতা কথা বলে ইঙ্গিতে, ধ্বনির ঝংকারে এবং চিত্রকল্পের মাধ্যমে। একটি কবিতা আবৃত্তির আগে তার ভেতরের তিনটি স্তর বুঝতে হয়: (১) বাহ্যিক গঠন (পঙ্ক্তি, স্তবক, মিল বা গদ্যছন্দ), (২) অলংকার ও চিত্রকল্প (কী দেখা বা শোনা যাচ্ছে), এবং (৩) অন্তর্নিহিত ভাব বা রস (কবি কী অনুভব করাতে চেয়েছেন)।',
    deepDiveEn:
      'Poetry speaks through compression, sound texture, and imagery. Before performing any poem, analyze its outer structure, visual metaphors, and core emotional current.',
    points: [
      {
        titleBn: 'পঙ্ক্তি, পর্ব ও স্তবক (Structure)',
        titleEn: 'Lines, Phrases & Stanzas',
        detailBn: 'একটি লাইন অর্থগতভাবে কয়েকটি ছোট পর্বে বিভক্ত থাকে; আর কয়েকটি লাইন মিলে তৈরি হয় একটি স্তবক—যা কবিতার ভাবের এক-একটি অধ্যায়।',
        detailEn: 'Lines divide into natural rhythmic phrases (parbo), while stanzas mark distinct emotional movements.',
      },
      {
        titleBn: 'অন্ত্যমিল, অনুপ্রাস ও ধ্বনি-সৌন্দর্য',
        titleEn: 'Rhyme, Alliteration & Sound',
        detailBn: 'একই ধ্বনির পুনরাবৃত্তি (যেমন অনুপ্রাস) কবিতায় সংগীত তৈরি করে। আবৃত্তিতে মিলের শেষ শব্দগুলো বেশি চেপে বা ঝুলিয়ে দেওয়া যাবে না।',
        detailEn: 'Alliteration and rhyme build subtle music; never hammer end-rhymes mechanically.',
        exampleBn: 'যেমন: “মেঘের ’পরে মেঘ জমেছে” — ‘ম’ ধ্বনির কোমল গাম্ভীর্য বজায় রাখুন।',
        exampleEn: 'Keep repeating soft consonants smooth rather than chopping the rhythm.',
      },
      {
        titleBn: 'চিত্রকল্প ও প্রতীক (Imagery)',
        titleEn: 'Imagery & Symbolism',
        detailBn: 'কবিতায় উল্লিখিত নদী, রোদ, ঝড় বা সন্ধ্যা কেবল শব্দ নয়—মনের চোখে সেই দৃশ্য দেখতে পেলে কণ্ঠের রঙ আপনাআপনি বদলে যায়।',
        detailEn: 'Picturing the poem’s river, sunlight, storm, or twilight naturally colors your tone.',
      },
      {
        titleBn: 'কাব্যের নবরস ও আবৃত্তির মেজাজ',
        titleEn: 'Poetic Moods (Rasa)',
        detailBn: 'শান্ত, করুণ, বীর, শৃঙ্গার বা বিস্ময়—প্রতিটি স্তবকে রস বদলাতে পারে; আবৃত্তিকারকে প্রতিটি বাঁক চিনতে হয়।',
        detailEn: 'Notice how mood shifts between serenity, sorrow, courage, and wonder across stanzas.',
      },
    ],
    samples: [
      {
        word: 'বীর / উদ্দীপনা রস',
        spoken: 'দৃঢ় বুক-কণ্ঠ, স্পষ্ট ব্যঞ্জন',
        noteBn: 'গতি একটু সচল, উচ্চারণে প্রত্যয় ও দৃঢ়তা',
        noteEn: 'Crisp consonants and confident chest-supported tempo',
      },
      {
        word: 'করুণ / বিষাদ রস',
        spoken: 'কোমল স্বর, দীর্ঘ শ্বাস-বিরতি',
        noteBn: 'ধীর লয় ও শব্দের শেষে মৃদু রেশ ছেড়ে দেওয়া',
        noteEn: 'Gentle tone, slower tempo, and reflective pauses',
      },
    ],
    mistakes: [
      {
        wrongBn: 'কবিতার মূল অর্থ না বুঝেই শুধু শব্দগুলো সুন্দর করে বলার চেষ্টা করা।',
        wrongEn: 'Polishing sound alone without understanding the poem’s literal and metaphorical meaning.',
        fixBn: 'কবিতাটি গদ্যে নিজের ভাষায় লিখে অর্থ পরিষ্কার করে তবেই আবৃত্তিতে যান।',
        fixEn: 'Paraphrase every stanza in plain prose first so every word makes complete sense.',
      },
    ],
    practiceBn: 'আপনার প্রিয় একটি কবিতার প্রতিটি স্তবকের মূল ছবি ও আবেগ এক শব্দে খাতায় লিখে আবৃত্তির আগে মনে আনুন।',
    practiceEn: 'Write one mood word beside each stanza of a poem and recall that image before speaking.',
    practiceStepsBn: [
      'কবিতার অপরিচিত সব শব্দের অর্থ অভিধান দেখে পরিষ্কার করে নিন।',
      'প্রতিটি স্তবকের পাশে কোন দৃশ্য কল্পনা করবেন তা ২ শব্দে লিখুন।',
      'চোখ বন্ধ করে দৃশ্যটি ভেবে নিয়ে প্রথম দুই লাইন আবৃত্তি করুন।',
    ],
    practiceStepsEn: [
      'Look up any unfamiliar word in the poem before rehearsing.',
      'Write a 2-word visual cue beside each stanza.',
      'Picture the scene briefly and speak the opening lines from that image.',
    ],
  },
  {
    id: 'dhoni-o-bornomala',
    num: 4,
    group: 'diction',
    icon: '🔤',
    titleBn: 'ধ্বনি ও বর্ণমালা',
    titleEn: 'Phonetics & Bengali Alphabet',
    subtitleBn: 'স্বরধ্বনি, ব্যঞ্জনধ্বনি ও উচ্চারণস্থানের বিজ্ঞানসম্মত ধারণা',
    subtitleEn: 'Vowels, consonants, and places of articulation',
    summaryBn:
      'ধ্বনি ভাষার ক্ষুদ্রতম একক এবং বর্ণ তার লিখিত প্রতীক। বাংলা বর্ণমালার ১১টি স্বরবর্ণ ও ৩৯টি ব্যঞ্জনবর্ণের সঠিক উচ্চারণস্থান—কণ্ঠ, তালু, মূর্ধা, দন্ত ও ওষ্ঠ—চিনতে পারলে প্রতিটি শব্দ স্ফটিকের মতো স্পষ্ট হয়।',
    summaryEn:
      'Sound (dhoni) is the living unit of speech and letters (borno) are its symbols. Knowing whether a consonant is velar, palatal, retroflex, dental, or labial builds crystal clarity.',
    deepDiveBn:
      'মুখে আমরা যা উচ্চারণ করি তা হলো ‘ধ্বনি’, আর কাগজে তার লিখিত চিহ্ন হলো ‘বর্ণ’। বাংলায় বানানের বর্ণ সংখ্যা বেশি হলেও জীবন্ত উচ্চারণে মৌলিক স্বরধ্বনি ৭টি এবং ব্যঞ্জনধ্বনি প্রায় ৩০–৩২টি। বাগযন্ত্রের ঠিক কোন জায়গায় জিভ বা ঠোঁট স্পর্শ করলে কোন ধ্বনি নিখুঁত হয়—এটাই ধ্বনিতত্ত্বের মূল কথা।',
    deepDiveEn:
      'Spoken sounds (dhoni) and written letters (borno) do not always match one-to-one in Bangla. Learning exact tongue and lip contact points across all consonant families transforms clarity.',
    points: [
      {
        titleBn: 'মৌলিক ৭টি স্বরধ্বনি (Vowels)',
        titleEn: '7 Core Oral Vowels',
        detailBn: 'লিখিত ১১টি স্বরবর্ণের মধ্যে বাংলা উচ্চারণে মৌলিক স্বরধ্বনি ৭টি: অ, আ, ই, উ, এ, ও এবং অ্যা। হ্রস্ব ই/উ এবং দীর্ঘ ঈ/ঊ উচ্চারণ-দৈর্ঘ্যে বাংলায় প্রায় এক।',
        detailEn: 'Bangla uses 7 primary vowel qualities: অ, আ, ই, উ, এ, ও, অ্যা; written ঈ/ঊ mostly sound identical in length to ই/উ.',
        exampleBn: '‘ঋ’ উচ্চারিত হয় ‘রি’-এর মতো (ঋতু → রিতু); ‘ঐ’ = ও+ই, ‘ঔ’ = ও+উ যৌগিক স্বর।',
        exampleEn: 'ঋ sounds like ‘ri’ (ঋতু → ritu); ঐ and ঔ are diphthongs (o+i, o+u).',
      },
      {
        titleBn: 'পাঁচটি বর্গীয় উচ্চারণস্থান',
        titleEn: '5 Consonant Articulation Zones',
        detailBn: 'ক-বর্গ (ক খ গ ঘ ঙ) কণ্ঠ থেকে; চ-বর্গ (চ ছ জ ঝ ঞ) তালু থেকে; ট-বর্গ (ট ঠ ড ঢ ণ) মূর্ধা থেকে; ত-বর্গ (ত থ দ ধ ন) দাঁতের গোড়া থেকে এবং প-বর্গ (প ফ ব ভ ম) দুই ঠোঁট থেকে আসে।',
        detailEn: 'Velar (ক-row), palatal (চ-row), retroflex (ট-row), dental (ত-row), and bilabial (প-row) each have exact contact spots.',
      },
      {
        titleBn: 'অন্তঃস্থ ও তাড়নজাত ধ্বনি (য, র, ল, ড়, ঢ়)',
        titleEn: 'Liquids & Retroflex Flaps',
        detailBn: '‘র’ উচ্চারণে জিভের ডগা দাঁতের ওপরে হালকা কাঁপে; কিন্তু ‘ড়’ ও ‘ঢ়’-তে জিভ একটু উল্টে তালুতে এক ঝটকায় বাড়ি খেয়ে নামে।',
        detailEn: 'র vibrates at the alveolar ridge, while ড় and ঢ় curl back briefly and flap downward.',
        exampleBn: '‘পরা’ (পরিধান) বনাম ‘পড়া’ (পাঠ করা) — ড় ও র আলাদা না হলে অর্থ বদলে যায়!',
        exampleEn: 'Confusing পরা (wear) and পড়া (read) changes word meaning.',
      },
      {
        titleBn: 'শ-ষ-স-এর উচ্চারণ নীতি',
        titleEn: 'Three Sibilants: শ, ষ, স',
        detailBn: 'বাংলায় সাধারণত শ, ষ, স তিনটিই ‘শ’-এর মতো (যেমন: শাপ, ষাট, সবুজ → শবুজ্)। তবে ত, থ, ন, র, ল-এর সঙ্গে যুক্ত হলে তা দন্ত্য ‘স’ (s) হয় (যেমন: স্তব্ধ, স্রোত, স্নেহ)।',
        detailEn: 'Single শ/ষ/স usually sound like ‘sh’, shifting to crisp ‘s’ before ত, থ, ন, র, ল (e.g., স্রোত, স্নেহ).',
      },
    ],
    samples: [
      {
        word: 'ক খ গ ঘ — কণ্ঠ্য',
        spoken: 'জিভের গোড়া কোমল তালু ছোঁয়',
        noteBn: 'গলার ভেতর থেকে পরিষ্কার আঘাত, অযথা ভারী করবেন না',
        noteEn: 'Clean back-of-tongue release without throat strain',
      },
      {
        word: 'চ ছ জ ঝ — তালব্য',
        spoken: 'জিভের মাঝখান শক্ত তালুতে',
        noteBn: 'আঞ্চলিক ‘স/য’-এর মতো নয়, স্পষ্ট তালব্য ‘চ/জ’ বলুন',
        noteEn: 'Avoid regional sibilant flattening on চ, ছ, জ, ঝ',
      },
      {
        word: 'ট ঠ ড ঢ — মূর্ধন্য',
        spoken: 'জিভের ডগা উল্টে মূর্ধায়',
        noteBn: 'ট ও ত যেন কখনো একরকম না শোনায়',
        noteEn: 'Keep curled ট-group distinct from flat dental ত-group',
      },
      {
        word: 'ত থ দ ধ — দন্ত্য',
        spoken: 'জিভের ডগা ওপরের দাঁতের পেছনে',
        noteBn: 'ইংরেজি T/D নয়, নরম বাঙালি দন্ত্য স্পর্শ',
        noteEn: 'Touch the back of upper teeth softly, never English T/D',
      },
      {
        word: 'বড় / ঝড় / পাহাড় / আষাঢ়',
        spoken: 'বড়ো / ঝড়্‌ / পাহাড়্‌ / আষাঢ়্‌',
        noteBn: 'ড় এবং মহাপ্রাণ ঢ় ধ্বনিতে তাড়না স্পষ্ট রাখুন',
        noteEn: 'Distinguish flapped ড় and aspirated ঢ় cleanly',
      },
    ],
    mistakes: [
      {
        wrongBn: '‘চ’ ও ‘ছ’-কে ‘স’-এর মতো এবং ‘জ’-কে ইংরেজি ‘Z’-এর মতো উচ্চারণ করা।',
        wrongEn: 'Softening চ/ছ into ‘s’ or pronouncing জ like an English ‘z’.',
        fixBn: 'জিভের মধ্যভাগ শক্ত তালুতে সম্পূর্ণ স্পর্শ করিয়ে ‘চ-ছ-জ-ঝ’ অনুশীলন করুন।',
        fixEn: 'Press the blade of the tongue firmly against the hard palate for palatal stops.',
      },
      {
        wrongBn: '‘সকাল’ বা ‘সমস্ত’ শব্দে ইংরেজি S-এর মতো হিস্‌সিস্‌ করা।',
        wrongEn: 'Using sharp English ‘s’ in standard words like সকাল or সময়.',
        fixBn: 'ত/থ/ন/র/ল যুক্ত না থাকলে প্রমিত বাংলায় ‘শকাল্‌’, ‘শমস্তো’ বলুন।',
        fixEn: 'Use soft Bengali ‘sh’ unless followed by ত, থ, ন, র, or ল.',
      },
    ],
    practiceBn: 'আয়নার সামনে ক-বর্গ থেকে প-বর্গ পর্যন্ত প্রতিটি বর্গ ধীরে ও স্পষ্ট স্পর্শে উচ্চারণ করুন।',
    practiceEn: 'Recite each consonant row from ক to প slowly in front of a mirror, checking contact points.',
    practiceStepsBn: [
      'প্রথমে ৭টি মৌলিক স্বর (অ, আ, ই, উ, এ, ও, অ্যা) মুখের আকৃতি দেখে স্পষ্ট বলুন।',
      'পাঁচটি বর্গের প্রতিটির ৪টি করে বর্ণ (ক-খ-গ-ঘ থেকে প-ফ-ব-ভ) হাত মুখের সামনে রেখে বলুন।',
      'র-ড়-ঢ় (পরা-পড়া-গাঢ়) জোড়াগুলো ৫ বার করে শুনিয়ে বলুন।',
    ],
    practiceStepsEn: [
      'Speak all 7 core vowels checking jaw and lip shapes in a mirror.',
      'Recite all 5 consonant rows slowly while monitoring breath release.',
      'Contrast র, ড়, and ঢ় word pairs five times aloud.',
    ],
  },
  {
    id: 'ottyaboshokio-bishoy',
    num: 5,
    group: 'foundation',
    icon: '🧭',
    titleBn: 'আবৃত্তির অত্যাবশ্যকীয় বিষয়সমূহ',
    titleEn: 'Essential Elements of Recitation',
    subtitleBn: 'স্বরক্ষেপণ, যতি-বিরতি, লয়, ঝোঁক ও আবহ সৃষ্টির পূর্ণ পাঠ',
    subtitleEn: 'Projection, pauses, tempo, stress, and atmosphere',
    summaryBn:
      'একটি কবিতাকে শ্রোতার কাছে আকর্ষণীয় ও অর্থবহ করতে যে মৌলিক উপাদানগুলো অপরিহার্য, সেগুলো হলো—যথাযথ শ্বাসনিয়ন্ত্রণ, যতি বা বিরতির ব্যবহার, লয় (গতি), শব্দের ঝোঁক (প্রশ্বাস-আঘাত) এবং কণ্ঠের স্বরক্ষেপণ।',
    summaryEn:
      'Compelling recitation depends on breath control, purposeful pauses (yati), balanced tempo (loy), strategic word stress, and effortless projection.',
    deepDiveBn:
      'একজন আবৃত্তিকার কণ্ঠ দিয়ে ছবি আঁকেন। সেই ছবির আলো-ছায়া তৈরি হয় ৫টি কৌশলের মাধ্যমে: সঠিক সময়ে থামা (যতি), উপযুক্ত গতি বেছে নেওয়া (লয়), গুরুত্বপূর্ণ শব্দকে আলোকিত করা (ঝোঁক), ঘরের শেষ প্রান্তে স্বর পৌঁছে দেওয়া (স্বরক্ষেপণ) এবং স্তবকে স্তবকে পরিবেশ তৈরি করা (আবহ)।',
    deepDiveEn:
      'Vocal painting relies on light and shadow: timely silence (pauses), fitting speed (tempo), highlighting meaning (stress), carrying cleanly across space (projection), and sustaining atmosphere.',
    points: [
      {
        titleBn: 'যতি বা বিরতি (Pause)',
        titleEn: 'Meaningful Pauses (Yati)',
        detailBn: 'চার ধরনের বিরতি আছে: (১) ছন্দ-বিরতি, (২) অর্থ-বিরতি (কমা/দাঁড়ি), (৩) শ্বাস-বিরতি এবং (৪) ভাব-বিরতি (নীরবতা যেখানে কথার চেয়েও বেশি বলে)।',
        detailEn: 'Four pause types exist: rhythmic, grammatical, breath recovery, and emotional silence.',
        exampleBn: 'একটি গুরুত্বপূর্ণ লাইনের আগে ০.৫–১ সেকেন্ড নীরব থাকলে শ্রোতার মনোযোগ তীব্র হয়।',
        exampleEn: 'A half-second hush right before a pivotal line sharpens audience focus.',
      },
      {
        titleBn: 'লয় ও গতি (Tempo & Rhythm)',
        titleEn: 'Tempo Control (Loy)',
        detailBn: 'বিলম্বিত (ধীর), মধ্য (স্বাভাবিক) ও দ্রুত লয়—কবিতার দৃশ্যপট বদলালে গতিও বদলায়। শোক বা ধ্যানে ধীর লয়, আর সংগ্রাম বা আনন্দে চঞ্চল লয় মানায়।',
        detailEn: 'Shift smoothly across slow (bilambita), medium (madhya), and brisk (druta) tempos as imagery evolves.',
      },
      {
        titleBn: 'ঝোঁক বা স্বরাঘাত (Vocal Stress)',
        titleEn: 'Strategic Word Emphasis',
        detailBn: 'একটি বাক্যের সব শব্দে সমান জোর দিলে বাক্য ফ্ল্যাট হয়ে যায়; আসল ভাববাহী ১টি বা ২টি শব্দে হালকা চাপ বা স্বর-উচ্চতা বাড়িয়ে অর্থকে উজ্জ্বল করুন।',
        detailEn: 'Stressing every word flattens speech; lift only the 1–2 meaning-bearing words per phrase.',
      },
      {
        titleBn: 'স্বরক্ষেপণ ও স্বরের ৩ স্তর (Projection & Pitch)',
        titleEn: 'Projection & Three Vocal Registers',
        detailBn: 'উদারা (নিচু), মুদারা (মাঝারি) ও তারা (উঁচু)—এই তিন স্তরের ভেতর অনায়াসে যাতায়াত করলে আবৃত্তি একঘেয়ে হয় না এবং দূরের শ্রোতাও স্পষ্ট শোনেন।',
        detailEn: 'Move comfortably across low (udara), middle (mudara), and high (tara) registers with belly breath support.',
      },
    ],
    samples: [
      {
        word: 'অর্ধ-বিরতি ( / )',
        spoken: '১ মাত্রা বা হালকা থামা',
        noteBn: 'পর্বের শেষে দম না ফেলেই সামান্য রেশ রেখে পরের অংশে যাওয়া',
        noteEn: 'Brief poetic suspension without dropping vocal energy',
      },
      {
        word: 'পূর্ণ-বিরতি ( // )',
        spoken: '২–৩ মাত্রা বিরতি ও শ্বাস',
        noteBn: 'একটি স্তবক বা সম্পূর্ণ বক্তব্য শেষ করে শান্তভাবে শ্বাস নেওয়া',
        noteEn: 'Complete thought closure with calm diaphragmatic breath reset',
      },
    ],
    mistakes: [
      {
        wrongBn: 'শ্বাস ফুরিয়ে যাওয়া পর্যন্ত টানা বলে শেষ শব্দগুলো গিলে ফেলা।',
        wrongEn: 'Speaking until completely out of air and dropping line endings.',
        fixBn: 'বাক্যের ভেতরের স্বাভাবিক বিরতিতে আগেভাগেই চুপিচুপি পেট ভরে শ্বাস নিন।',
        fixEn: 'Take quiet top-up breaths at natural phrase breaks before running low.',
      },
    ],
    practiceBn: 'একটি ছোট বাক্যে আলাদা আলাদা শব্দে ঝোঁক দিয়ে দেখুন কীভাবে অর্থ বদলে যায়: “আমি কাল বাড়ি যাব”।',
    practiceEn: 'Stress each word separately in one sentence to hear how vocal emphasis shifts meaning.',
    practiceStepsBn: [
      '১ম বার ‘আমি’ শব্দে জোর দিয়ে বলুন (অন্য কেউ নয়, আমি)।',
      '২য় বার ‘কাল’ শব্দে জোর দিন (আজ বা পরশু নয়, কালই)।',
      '৩য় বার ‘বাড়ি’ শব্দে জোর দিন—প্রতিবার অর্থ ও ভঙ্গির বদলটা রেকর্ড করে শুনুন।',
    ],
    practiceStepsEn: [
      'First stress “আমি” (meaning I, not someone else).',
      'Next stress “কাল” (meaning tomorrow specifically).',
      'Then stress “বাড়ি” and listen back to how intent transforms.',
    ],
  },
  {
    id: 'shuddho-promito-uccharon',
    num: 6,
    group: 'diction',
    icon: '✨',
    titleBn: 'শুদ্ধ ও প্রমিত উচ্চারণ',
    titleEn: 'Correct & Standard Pronunciation',
    subtitleBn: 'প্রমিত বাংলা উচ্চারণের প্রধান ব্যাকরণিক ও ধ্বনিতাত্ত্বিক নিয়ম',
    subtitleEn: 'Core phonetic rules of Standard Colloquial Bengali',
    summaryBn:
      'বাংলা বানান ও উচ্চারণ সব সময় এক নয়। অ-এর ও-কার হয়ে যাওয়া, এ-এর অ্যা-উচ্চারণ, য-ফলা, ব-ফলা, ম-ফলা ও হ-যুক্ত যুক্তাক্ষরের প্রমিত নিয়ম জানলে আবৃত্তিতে আঞ্চলিকতা ও জড়তা দূর হয়।',
    summaryEn:
      'Bengali spelling and spoken pronunciation often differ. Learning vowel shifts (অ→ও, এ→অ্যা) and conjunct rules (য-ফলা, ব-ফলা, ম-ফলা) ensures polished standard diction.',
    deepDiveBn:
      'প্রমিত বাংলা উচ্চারণ হলো বাংলা ভাষার সর্বজনগ্রাহ্য মান্য শ্রুতি-রূপ। বাংলা একাডেমি ও প্রখ্যাত বাচিক শিল্পীদের অনুমোদিত এই নিয়মগুলো মুখস্থ করার চেয়ে শব্দের ধ্বনি-প্যাটার্ন বুঝে নিলে খুবই সহজ হয়ে যায়। নিচে সবচেয়ে জরুরি নিয়মগুলো উদাহরণসহ সাজানো হলো।',
    deepDiveEn:
      'Standard Bengali pronunciation follows predictable phonological patterns—vowel harmony, consonant gemination on medials, and silent initials. Mastering these 5 rules solves 80% of daily recitation errors.',
    points: [
      {
        titleBn: '১. আদ্য ‘অ’-এর সংবৃত (ও) রূপ',
        titleEn: '1. Initial অ Rounding to ও',
        detailBn: 'শব্দের শুরুতে ‘অ’ থাকলে এবং তার পরে ই, ঈ, উ, ঊ, ঋ, ক্ষ, জ্ঞ বা য-ফলা থাকলে প্রথম অ ‘ও’-এর মতো উচ্চারিত হয়।',
        detailEn: 'Initial অ rounds to ‘o’ when followed by ই/উ vowels, ঋ, ক্ষ, জ্ঞ, or য-ফলা.',
        exampleBn: 'অতি → ওতি, নদী → নোদি, মধু → মোধু, অক্ষ → ওক্‌খো, সত্য → শোত্‌তো।',
        exampleEn: 'অতি → ওতি, মধু → মোধু, সত্য → শোত্‌তো.',
      },
      {
        titleBn: '২. ‘এ’-কার কখন ‘অ্যা’ হয়',
        titleEn: '2. When এ Sounds Like অ্যা',
        detailBn: 'শব্দের শুরুর এ-কার বা এ-এর পর অ, আ বা অনুনাসিক থাকলে অনেক সময় ‘অ্যা’ হয়; তবে ই বা উ থাকলে তা অবিকৃত ‘এ’ থাকে।',
        detailEn: 'Initial এ often opens to অ্যা before অ/আ, while remaining closed এ before ই/উ.',
        exampleBn: 'কেন → ক্যানো, দেখা → দ্যাখা, একা → অ্যাকা; কিন্তু দেখি → দেখি (অ্যা নয়)।',
        exampleEn: 'দেখা → দ্যাখা, একা → অ্যাকা; yet দেখি stays দেখি.',
      },
      {
        titleBn: '৩. ব-ফলার উচ্চারণ (আদি বনাম মধ্য/অন্ত্য)',
        titleEn: '3. ব-ফলা Rules (Initial vs. Medial)',
        detailBn: 'শব্দের প্রথম বর্ণে ব-ফলা থাকলে তা উচ্চারিত হয় না; কিন্তু মাঝের বা শেষ বর্ণে থাকলে সেই বর্ণটি দুবার (দ্বিত্ব) উচ্চারিত হয়।',
        detailEn: 'Silent at word start; doubles the attached consonant in medial or final position.',
        exampleBn: 'স্বাধীন → শাধিন্‌, জ্বর → জর্‌; কিন্তু বিশ্ব → বিশ্‌শো, অশ্ব → অশ্‌শো, দ্বিত্ব → দিত্‌তো।',
        exampleEn: 'স্বাধীন → শাধিন্‌; বিশ্ব → বিশ্‌শো.',
      },
      {
        titleBn: '৪. ম-ফলা ও য-ফলার নিয়ম',
        titleEn: '4. ম-ফলা & য-ফলা Rules',
        detailBn: 'আদ্য ম-ফলা অনুচ্চারিত থেকে সামান্য অনুনাসিক হয়; মাঝে/শেষে দ্বিত্ব ও অনুনাসিক হয়। য-ফলা আগে থাকলে পূর্ববর্ণ দ্বিত্ব করে।',
        detailEn: 'Initial ম-ফলা softly nasalizes; medial/final doubles + nasalizes. য-ফলা doubles the host consonant medially.',
        exampleBn: 'স্মৃতি → শৃঁতি, পদ্ম → পদ্‌দোঁ, বিদ্যা → বিদ্‌দা, বাক্য → বাক্‌কো।',
        exampleEn: 'স্মৃতি → শৃঁতি, পদ্ম → পদ্‌দোঁ, বাক্য → বাক্‌কো.',
      },
      {
        titleBn: '৫. ‘ক্ষ’ ও ‘জ্ঞ’ ও ‘হসন্ত’ সচেতনতা',
        titleEn: '5. ক্ষ, জ্ঞ & Crisp Word Endings',
        detailBn: '‘ক্ষ’ শুরুতে ‘খ’, মাঝে/শেষে ‘ক্‌খ’; ‘জ্ঞ’ শুরুতে ‘গ্যাঁ’, মাঝে/শেষে ‘গ্‌গ্যাঁ’। আর যেসব শব্দের শেষে ব্যঞ্জন থামে, সেখানে অযথা ও-কার টানবেন না।',
        detailEn: 'ক্ষ sounds like খ initially and ক্‌খ medially; জ্ঞ is গ্যাঁ/গ্‌গ্যাঁ. Keep closed final syllables crisp.',
        exampleBn: 'ক্ষমা → খমা, লক্ষ → লোক্‌খো; জ্ঞান → গ্যাঁন্‌, বিজ্ঞান → বিগ্‌গ্যাঁন্‌।',
        exampleEn: 'ক্ষমা → খমা, লক্ষ → লোক্‌খো; বিজ্ঞান → বিগ্‌গ্যাঁন্‌.',
      },
    ],
    samples: [
      {
        word: 'অভিধান',
        spoken: 'ওভিধান্‌',
        noteBn: 'প্রথম অ → ও, শেষ ন্‌ হসন্ত',
        noteEn: 'Initial অ rounds to ও; crisp ending ন্',
      },
      {
        word: 'স্বদেশ / স্বাধীন',
        spoken: 'শদেশ্‌ / শাধিন্‌',
        noteBn: 'আদি ব-ফলা অনুচ্চারিত ও শ-ধ্বনি',
        noteEn: 'Initial ব-ফলা is silent',
      },
      {
        word: 'পদ্য / সত্য / ঐক্য',
        spoken: 'পোদ্‌দো / শোত্‌তো / ওইক্‌কো',
        noteBn: 'য-ফলায় পূর্ববর্ণ দ্বিত্ব ও অ→ও',
        noteEn: 'য-ফলা doubles preceding consonant',
      },
      {
        word: 'স্মরণ / রশ্মি',
        spoken: 'শঁরোন্‌ / রোশ্‌শিঁ',
        noteBn: 'ম-ফলায় অনুনাসিক স্পর্শ ও মাঝে দ্বিত্ব',
        noteEn: 'ম-ফলা adds nasalization and medial doubling',
      },
      {
        word: 'ব্যক্তি / ব্যথা',
        spoken: 'বেক্তি / ব্যাথা',
        noteBn: 'ই-কার পরে থাকলে ‘বে’, অ/আ থাকলে ‘ব্যা’',
        noteEn: '‘be’ before ই, ‘bya’ before অ/আ',
      },
    ],
    mistakes: [
      {
        wrongBn: '‘স্বাধীনতা’-কে ‘সোয়াধীনতা’ বা ‘বিশ্ব’-কে ‘বিস্বো’ বলা।',
        wrongEn: 'Pronouncing the silent/geminated ‘w/b’ sound in ব-ফলা words.',
        fixBn: 'শুরুতে ব-ফলা বাদ দিন (শাধিনতা) আর মাঝে বর্ণ দ্বিত্ব করুন (বিশ্‌শো)।',
        fixEn: 'Drop initial ব-ফলা completely and double the consonant medially.',
      },
    ],
    practiceBn: 'উপরের প্রতিটি প্রমিত উদাহরণ প্রথমে ধীরে, তারপর স্বাভাবিক বাক্যে স্পষ্টভাবে উচ্চারণ করুন।',
    practiceEn: 'Speak each standard example slowly first, then smoothly inside a complete sentence.',
    practiceStepsBn: [
      'প্রতিটি নমুনা শব্দের পাশের 🔊 বোতামে শুনে প্রমিত ধ্বনিটি কানে তুলে নিন।',
      'নিজে “ওভিধান্‌, শাধিন্‌, শোত্‌তো, রোশ্‌শিঁ, বেক্তি” ৫ বার স্পষ্ট করে বলুন।',
      'এবার একটি বাক্যে জুড়ে বলুন: “স্বাধীন দেশে সত্য ও রশ্মির অভাব নেই।”',
    ],
    practiceStepsEn: [
      'Tap Listen beside each standard example to lock in the vowel/cluster sound.',
      'Repeat each word cleanly five times aloud.',
      'Embed them inside one full Bengali sentence with natural rhythm.',
    ],
  },
  {
    id: 'kabyo-nirman-koushol',
    num: 7,
    group: 'technique',
    icon: '📐',
    titleBn: 'কাব্য নির্মাণ কৌশল',
    titleEn: 'Poetry Construction Techniques',
    subtitleBn: 'বাংলা তিন প্রধান ছন্দ, মাত্রা গণনা, পর্ব ও প্রবহমানতা',
    subtitleEn: 'Three Bengali meters, morae counting, and enjambment',
    summaryBn:
      'বাংলা কবিতার প্রধান তিনটি ছন্দ—অক্ষরবৃত্ত, মাত্রাবৃত্ত ও স্বরবৃত্ত—এবং গদ্যকবিতার গাঁথুনি বুঝতে পারলে আবৃত্তিকার জানেন কোথায় পর্বভঙ্গ হবে আর কোথায় প্রবহমান পঙ্ক্তি থামবে না।',
    summaryEn:
      'Knowing Bengali’s three classical meters—Aksharbritta, Matrabritta, and Swarabritta—plus free verse prevents unnatural line-end stops.',
    deepDiveBn:
      'ছন্দের মূল একক হলো ‘দল’ বা সিলেবল (Syllable)। দল দুই রকম: মুক্তদল (স্বরান্ত, যেমন ‘মা’, ‘ক-বি’) এবং রুদ্ধদল (হসন্ত বা ব্যঞ্জনান্ত, যেমন ‘মন’, ‘হাত’, ‘চাঁদ’)। মুক্তদল আর রুদ্ধদলকে কত মাত্রা ধরা হচ্ছে, তার ওপর ভিত্তি করেই বাংলায় তিনটি প্রধান ছন্দ তৈরি হয়। ছন্দ চিনতে পারলে আবৃত্তিকার অযথা লাইনের শেষে ঝুলে পড়েন না।',
    deepDiveEn:
      'Syllables (dol) come in two shapes: open (mukto-dol, ending in a vowel) and closed (ruddho-dol, ending in a consonant). How many beats (matra) each closed syllable receives defines all three Bengali meters.',
    points: [
      {
        titleBn: 'মুক্তদল বনাম রুদ্ধদল চেনার সহজ উপায়',
        titleEn: 'Open vs. Closed Syllables',
        detailBn: 'যে অংশটি টেনে লম্বা করা যায় তা মুক্তদল (যেমন: আ-কা-শ → আ, কা মুক্ত); আর যেখানে ধ্বনি হঠাৎ আটকে যায় তা রুদ্ধদল (যেমন: শ)।',
        detailEn: 'Open syllables end in a singable vowel; closed syllables stop at a final consonant.',
      },
      {
        titleBn: '১. অক্ষরবৃত্ত (তানপ্রধান, ধীর-গম্ভীর)',
        titleEn: '1. Aksharbritta (Stately & Enjambed)',
        detailBn: 'রুদ্ধদল শব্দের শুরু বা মাঝে ১ মাত্রা, কিন্তু শব্দের শেষে ২ মাত্রা পায়। সাধারণত ৮+৬=১৪ বা ৮+১০=১৮ মাত্রার চালে চলে; পয়ার ও অমিত্রাক্ষর এর অন্তর্ভুক্ত।',
        detailEn: 'Closed syllables count 1 beat initially/medially and 2 beats word-finally; dignified, flowing pace.',
        exampleBn: '“আকাশের / ওপারেতে / কী রহস্য / আছে” — এখানে প্রবহমানতা থাকলে লাইনের শেষে থামবেন না।',
        exampleEn: 'In enjambed lines, carry breath smoothly into the next line when meaning continues.',
      },
      {
        titleBn: '২. মাত্রাবৃত্ত (ধ্বনিপ্রধান ও সুরেলা)',
        titleEn: '2. Matrabritta (Lyrical & Musical)',
        detailBn: 'মুক্তদল ১ মাত্রা এবং সব অবস্থানের রুদ্ধদলই ২ মাত্রা পায়। রবীন্দ্রনাথ ও নজরুলের অজস্র সংগীতময় কবিতা এই ছন্দে লেখা।',
        detailEn: 'Open syllables count 1 beat and every closed syllable counts 2, giving rich musical resonance.',
        exampleBn: '“এইখানে তোর / দাদির কবর / ডালিম-গাছের / তলে” (৬+৬+৬+২ মাত্রা)।',
        exampleEn: 'Notice the balanced, undulating 6-beat wave cadence.',
      },
      {
        titleBn: '৩. স্বরবৃত্ত (শ্বাসাঘাতপ্রধান ও চটপটে)',
        titleEn: '3. Swarabritta (Brisk & Folk Pulse)',
        detailBn: 'মুক্ত ও রুদ্ধ সব দলই ১ মাত্রা করে গোনা হয় এবং ৪ মাত্রার পর্বে প্রথম অক্ষরে তীক্ষ্ণ ঝোঁক পড়ে। ছড়া ও লোকজ কবিতায় এটি প্রাণবন্ত।',
        detailEn: 'Every syllable counts 1 beat in crisp 4-beat measures with strong initial downbeats.',
        exampleBn: '“তালগাছ / এক পায়ে / দাঁড়িয়ে / সব গাছ / ছাড়িয়ে” (৪+৪+৩...)।',
        exampleEn: 'Fast, rhythmic, playful beat structure ideal for rhymes and brisk verse.',
      },
    ],
    samples: [
      {
        word: 'অক্ষরবৃত্ত (গম্ভীর, প্রবহমান)',
        spoken: 'ধীর গতি, টানা অর্থপ্রবাহ',
        noteBn: 'লাইনের শেষে কমা বা দাঁড়ি না থাকলে পরের লাইনে চলে যান',
        noteEn: 'Do not pause at line breaks when syntax flows onward',
      },
      {
        word: 'মাত্রাবৃত্ত (সুরেলা, তরঙ্গময়)',
        spoken: 'রুদ্ধদলে ২ মাত্রার পূর্ণ রেশ',
        noteBn: 'যুক্তবর্ণ ও রুদ্ধদলের ধ্বনি সমান মর্যাদায় উচ্চারণ করুন',
        noteEn: 'Give closed syllables their full 2-beat spaciousness',
      },
      {
        word: 'স্বরবৃত্ত (চটপটে, ৪ মাত্রার পর্ব)',
        spoken: 'পর্বের শুরুতে হালকা শ্বাসাঘাত',
        noteBn: 'ছড়ার তালে হালকা কিন্তু স্পষ্ট দোলা রাখুন',
        noteEn: 'Keep the 4-beat pulse light, springy, and articulate',
      },
    ],
    mistakes: [
      {
        wrongBn: 'প্রবহমান কবিতায় অর্থ শেষ না হতেই প্রতি লাইনের শেষে বাধ্যতামূলকভাবে থেমে যাওয়া।',
        wrongEn: 'Stopping blindly at the end of every printed line even when a sentence continues.',
        fixBn: 'কবিতার যতিচিহ্ন (কমা, সেমিকোলন, দাঁড়ি) ও অর্থের গতিকে প্রাধান্য দিন।',
        fixEn: 'Follow punctuation and grammatical flow across line breaks (enjambment).',
      },
    ],
    practiceBn: 'প্রবহমান দুই লাইনের একটি কবিতা লাইনের শেষে না থেমে সম্পূর্ণ অর্থ শেষ না হওয়া পর্যন্ত একটানে পড়ে দেখুন।',
    practiceEn: 'Read a two-line enjambed couplet without pausing at the line break until the full thought completes.',
    practiceStepsBn: [
      'অক্ষরবৃত্ত ও স্বরবৃত্ত ছন্দের ২টি আলাদা কবিতার লাইন খাতায় লিখুন।',
      'হাতে তালি দিয়ে মুক্তদল ও রুদ্ধদলের মাত্রা অনুভব করুন।',
      'তালি ছাড়াই স্বাভাবিক অর্থবোধক স্বরে আবৃত্তি করে দেখুন।',
    ],
    practiceStepsEn: [
      'Take one Aksharbritta line and one Swarabritta rhyme side by side.',
      'Clap lightly through each phrase (parbo) to feel the pulse.',
      'Drop the clap and speak naturally while keeping the inner pulse intact.',
    ],
  },
  {
    id: 'konthonalir-byayam',
    num: 8,
    group: 'technique',
    icon: '🫁',
    titleBn: 'কণ্ঠনালীর ব্যায়াম',
    titleEn: 'Larynx & Vocal Tract Exercises',
    subtitleBn: 'স্বরতন্ত্রীকে নিরাপদ, নমনীয় ও ক্লান্তিহীন রাখার দৈনন্দিন অনুশীলন',
    subtitleEn: 'Daily warm-ups for healthy, supple, fatigue-free vocal folds',
    summaryBn:
      'মঞ্চে বা স্টুডিওতে টানা আবৃত্তি করতে গেলে কণ্ঠনালী ও ল্যারিংসের উপর চাপ পড়ে। নিয়মিত হালকা হামিং, সাইরেন গ্লাইড, স্ট্র ফোনেশন এবং হাই-সাইজ ব্যায়াম স্বরতন্ত্রীকে উষ্ণ ও সুরক্ষিত রাখে।',
    summaryEn:
      'Extended recitation strains an unwarmed larynx. Gentle humming, siren glides, straw phonation, and yawn-sigh drills keep vocal folds elastic and protected.',
    deepDiveBn:
      'দৌড়ানোর আগে যেমন শরীর গরম (Warm-up) করতে হয়, তেমনি দীর্ঘ আবৃত্তির আগে কণ্ঠনালী ও স্বরতন্ত্রীকে প্রস্তুত করা আবশ্যক। কণ্ঠনালী কখনোই গায়ের জোরে চাপ দিয়ে খোলা যায় না; বরং পেটের শ্বাসের সমর্থন (Breath support), গলার শিথিলতা এবং সামনের মুখ-অনুরণন (Forward resonance) স্বরকে অনায়াস ও গভীর করে তোলে।',
    deepDiveEn:
      'Just as athletes stretch before running, reciters must warm up delicate vocal folds before heavy delivery. Never push from the throat—pair loose pharyngeal space with steady diaphragmatic airflow.',
    points: [
      {
        titleBn: '১. ডায়াফ্রাম শ্বাস ও হিস-নিয়ন্ত্রণ',
        titleEn: '1. Diaphragmatic Breath & Hiss',
        detailBn: 'কাঁধ না তুলে নাক দিয়ে গভীর শ্বাস নিয়ে পেট ফোলান; তারপর দাঁতের ফাঁক দিয়ে ‘স্‌স্‌স্‌’ শব্দে সমান ধারায় ১৫–২০ সেকেন্ড ছাড়ুন।',
        detailEn: 'Inhale deeply expanding the belly (shoulders still), then exhale on a steady ‘sss’ for 15–20 seconds.',
      },
      {
        titleBn: '২. হাই-সাইজ (গলার টান কমানো)',
        titleEn: '2. Yawn-Sigh Release',
        detailBn: 'হাই তোলার মতো গলার পেছনের অংশ প্রশস্ত করে উঁচু থেকে নিচে কোমল স্বরে ‘আ-হ্‌’ বলে শ্বাস ছাড়ুন। এতে গলা ব্যথা ও চেপে থাকা স্বর দূর হয়।',
        detailEn: 'Mimic a soft yawn and glide down on a relaxed ‘ah-h’ sigh to drop laryngeal tension.',
      },
      {
        titleBn: '৩. বন্ধ মুখে হামিং (ম্‌ম্‌ম্‌) ও ভ্রমর গুনগুন',
        titleEn: '3. Forward Humming Massage',
        detailBn: 'দাঁত হালকা ফাঁকা কিন্তু ঠোঁট বন্ধ রেখে আরামদায়ক স্বরে ‘ম্‌ম্‌ম্‌’ করুন; ঠোঁট ও নাকের পাশে শিরশিরে কম্পন অনুভব করুন।',
        detailEn: 'With teeth slightly apart and lips closed, hum ‘mmm’ until you feel gentle buzz around lips and nose.',
      },
      {
        titleBn: '৪. স্ট্র ফোনেশন ও সাইরেন গ্লাইড',
        titleEn: '4. Straw Phonation & Sirens',
        detailBn: 'একটি স্ট্র দিয়ে (অথবা ঠোঁট ছোট গোল করে) ‘উ’ স্বরে ধীরে নিচু থেকে উঁচু ও উঁচু থেকে নিচে স্বর ঘোরান—এটি স্বরতন্ত্রীর চাপ কমিয়ে স্বরের পাল্লা বাড়ায়।',
        detailEn: 'Hum ‘oo’ through rounded lips or a straw while gliding smoothly up and down your comfortable range.',
      },
      {
        titleBn: '৫. ‘ওম’ বা ‘আকার’ রেজোন্যান্স সাধা',
        titleEn: '5. Sustained Vowel Resonance',
        detailBn: 'সকালে ৫ মিনিট আরামদায়ক সা-তে ‘আ-আ-আ’ বা ‘ওম’ সাধলে কণ্ঠ ভরাট, স্থির ও গম্ভীর হয়।',
        detailEn: 'Sustaining steady low-to-mid vowels builds vocal stability, warmth, and breath economy.',
      },
    ],
    samples: [
      {
        word: 'হাই-সাইজ (আ-হ্‌)',
        spoken: 'গলা খোলা, উঁচু থেকে নিচু গ্লাইড',
        noteBn: 'প্রতিবার করার পর কাঁধ ও চোয়াল ঢিলা অনুভব করুন',
        noteEn: 'Feel throat and jaw soften on every downward sigh',
      },
      {
        word: 'হামিং → খোলা স্বর',
        spoken: 'ম্‌ম্‌ম্‌-মা / ম্‌ম্‌ম্‌-মো',
        noteBn: 'হামিংয়ের কম্পন ধরে রেখেই স্বরটি সামনে খুলুন',
        noteEn: 'Carry the forward lip buzz directly into the open vowel',
      },
    ],
    mistakes: [
      {
        wrongBn: 'উঁচু স্বরের কবিতা বলতে গিয়ে গলার রগ টানটান করে চিৎকার করা বা ‘খাঁখাঁ’ গলা পরিষ্কার করা।',
        wrongEn: 'Straining neck muscles on high lines or aggressively clearing the throat.',
        fixBn: 'গলা চুলকালে কাশি বা খাঁখাঁ না করে এক চুমুক জল খান এবং হালকা ‘ম্‌ম্‌ম্‌’ হামিং করুন।',
        fixEn: 'Sip water and hum gently instead of harsh throat clearing; anchor louder lines in belly breath.',
      },
    ],
    practiceBn: 'প্রতিদিন আবৃত্তি শুরুর আগে ২ মিনিট ‘ম্‌ম্‌ম্‌’ হামিং ও ৩টি মৃদু ‘উ’ সাইরেন গ্লাইড করুন।',
    practiceEn: 'Before reciting, spend 2 minutes on gentle humming followed by 3 smooth ‘oo’ siren glides.',
    practiceStepsBn: [
      'সোজা বসে কাঁধ নামিয়ে ৩ বার গভীর ডায়াফ্রাম শ্বাস নিন।',
      '৩০ সেকেন্ড ‘স্‌স্‌স্‌’ শ্বাস, এরপর ১ মিনিট মৃদু ‘ম্‌ম্‌ম্‌’ হামিং করুন।',
      'সবশেষে ৩টি আরামদায়ক সাইরেন গ্লাইড ও ৩টি ‘আ-হ্‌’ হাই-সাইজ করে আবৃত্তি শুরু করুন।',
    ],
    practiceStepsEn: [
      'Sit tall, drop shoulders, and take 3 slow diaphragmatic breaths.',
      'Do 30s steady ‘sss’ exhale followed by 1 minute of easy ‘mmm’ humming.',
      'Finish with 3 smooth pitch sirens and 3 yawn-sighs before speaking.',
    ],
  },
  {
    id: 'uccharon-riti',
    num: 9,
    group: 'diction',
    icon: '🗣️',
    titleBn: 'উচ্চারণ রীতি',
    titleEn: 'Articulation & Pronunciation Rules',
    subtitleBn: 'অল্পপ্রাণ-মহাপ্রাণ, ঘোষ-অঘোষ, অনুনাসিক ও যুক্তধ্বনির স্পষ্ট প্রয়োগ',
    subtitleEn: 'Aspiration, voicing contrasts, nasalization, and smooth clusters',
    summaryBn:
      'বাংলা শব্দের অর্থে সূক্ষ্ম পার্থক্য তৈরি হয় ধ্বনির প্রাণত্ব ও ঘোষত্বের ওপর। যেমন ‘কাল’ আর ‘খাল’, কিংবা ‘পাতা’ আর ‘ফাতা’—সঠিক শ্বাসচাপ ও স্পষ্ট স্পর্শ ছাড়া এই পার্থক্য ঝাপসা হয়ে যায়।',
    summaryEn:
      'Meaning in Bengali hinges on crisp aspiration (অল্পপ্রাণ vs. মহাপ্রাণ) and voicing (ঘোষ vs. অঘোষ). Clear breath release keeps every pair distinct.',
    deepDiveBn:
      'উচ্চারণ রীতি মানে কেবল বানান মুখস্থ নয়—শব্দের ভেতরে ধ্বনির গতিপ্রকৃতি বোঝা। মুখ থেকে বাতাস কতটুকু বের হচ্ছে (অল্পপ্রাণ/মহাপ্রাণ), স্বরতন্ত্রী কাঁপছে কি না (অঘোষ/ঘোষ), নাকের সুর যুক্ত হচ্ছে কি না (অনুনাসিক) এবং দুটি ব্যঞ্জন পাশাপাশি এলে কীভাবে মিলছে (সমীভবন ও যুক্তবর্ণ)—এসব নিয়ম মানলেই উচ্চারণ অভিজাত ও পরিচ্ছন্ন শোনায়।',
    deepDiveEn:
      'Good articulation balances airflow, voicing, nasal resonance, and seamless consonant transitions so words never sound muddy or breathless.',
    points: [
      {
        titleBn: 'অল্পপ্রাণ বনাম মহাপ্রাণ ধ্বনি',
        titleEn: 'Unaspirated vs. Aspirated',
        detailBn: 'বর্গের ১ম ও ৩য় বর্ণ (ক গ, চ জ, ট ড, ত দ, প ব) অল্পপ্রাণ—এতে বাতাস কম বের হয়। ২য় ও ৪র্থ বর্ণ (খ ঘ, ছ ঝ, ঠ ঢ, থ ধ, ফ ভ) মহাপ্রাণ—এতে উষ্ণ বাতাসের স্পষ্ট ধাক্কা বের হয়।',
        detailEn: '1st/3rd row consonants release minimal air; 2nd/4th row consonants carry a distinct puff of breath.',
        exampleBn: '‘ভালো’ বলতে বাতাস বের হবে, ‘বালু’-তে নয়; ‘ফল’ ও ‘পল’, ‘ধান’ ও ‘দান’ আলাদা রাখুন।',
        exampleEn: 'Keep pairs like ফল/পল and ধান/দান clearly distinct.',
      },
      {
        titleBn: 'অঘোষ বনাম ঘোষ ধ্বনি',
        titleEn: 'Voiceless vs. Voiced',
        detailBn: 'ক-খ, চ-ছ, ত-থ, প-ফ বলার সময় স্বরতন্ত্রী শান্ত থাকে (অঘোষ); কিন্তু গ-ঘ, জ-ঝ, দ-ধ, ব-ভ বলার সময় গলায় স্পষ্ট গম্ভীর অনুরণন বাজে (ঘোষ)।',
        detailEn: 'Voiced consonants engage vocal-fold buzz cleanly from the start of the syllable.',
      },
      {
        titleBn: 'চন্দ্রবিন্দু ও অনুনাসিক রীতি',
        titleEn: 'Nasal Vowels & চন্দ্রবিন্দু',
        detailBn: '‘চাঁদ’, ‘বাঁশি’, ‘হাঁস’, ‘কাঁটা’—চন্দ্রবিন্দু বাদ দিলে শব্দ অন্য মানে দাঁড়ায় (‘বাঁশি’ বনাম ‘বাসি’)। মুখ ও নাকের সমান পথে স্বরটি বের করুন।',
        detailEn: 'Neglecting চন্দ্রবিন্দু changes words completely (e.g., বাঁশি flute vs. বাসি stale).',
      },
      {
        titleBn: 'যুক্তব্যঞ্জন ও সন্ধি-সমীভবন রীতি',
        titleEn: 'Consonant Clusters Without Swelling',
        detailBn: '‘স্নান’, ‘স্কুল’, ‘প্রাণ’, ‘শ্রম’, ‘স্তব্ধ’—যুক্তাক্ষরের আগে অযথা ‘ই’ বা মাঝখানে অতিরিক্ত ‘অ’ ঢুকাবেন না।',
        detailEn: 'Keep initial clusters smooth (স্কুল, স্নান, শ্রম) without adding extra ‘i’ or intrusive vowels.',
      },
    ],
    samples: [
      {
        word: 'কল / খল · গা / ঘা',
        spoken: 'অল্পপ্রাণ বনাম মহাপ্রাণ',
        noteBn: 'খ ও ঘ-তে স্পষ্ট শ্বাস-প্রবাহ বজায় রাখুন',
        noteEn: 'Hear the fuller breath burst on খ and ঘ',
      },
      {
        word: 'বাঁশি / বাসি · হাঁস / হাস',
        spoken: 'বাঁশি (অনুনাসিক) বনাম বাসি (নিরনুনাসিক)',
        noteBn: 'চন্দ্রবিন্দুতে নাক-মুখের যুগ্ম অনুরণন ব্যবহার করুন',
        noteEn: 'Subtle nasal coloring distinguishes the pair',
      },
      {
        word: 'জ্ঞান / অজ্ঞাত',
        spoken: 'গ্যাঁন্‌ / অগ্‌গ্যাঁতো',
        noteBn: 'জ্ঞ-এর প্রমিত উচ্চারণ শুরুতে গ্যাঁ, মাঝে গ্‌গ্যাঁ',
        noteEn: 'Standard spoken form uses nasalized গ্যাঁ',
      },
      {
        word: 'উৎসব / উদ্‌যাপন',
        spoken: 'উত্‌শব্‌ / উদ্‌জাপোন্‌',
        noteBn: 'খণ্ড-ত (ৎ) ও হসন্ত দ্‌ থামিয়ে পরের বর্ণ ধরুন',
        noteEn: 'Articulate crisp stops cleanly before the next syllable',
      },
    ],
    mistakes: [
      {
        wrongBn: 'মহাপ্রাণ বর্ণে (ভ, ঘ, ধ, ছ, খ) বাতাস না ছেড়ে অল্পপ্রাণের মতো বলে ফেলা (যেমন ‘ভাই’ → ‘বাই’)।',
        wrongEn: 'Dropping aspiration on খ, ঘ, ছ, থ, ধ, ফ, ভ.',
        fixBn: 'কাগজের একটি পাতলা টুকরো ঠোঁট থেকে ৩ ইঞ্চি দূরে ধরে ‘ফ-থ-খ-ভ’ বলুন—কাগজটি হালকা কাঁপতে হবে।',
        fixEn: 'Hold a strip of paper 3 inches from your lips and ensure it flutters on aspirated stops.',
      },
    ],
    practiceBn: 'হাতের তালু মুখের সামনে রেখে ‘ক-খ, চ-ছ, ত-থ, প-ফ’ জোড়ায় বলুন; কেবল দ্বিতীয় বর্ণে হাতে বাতাসের ধাক্কা লাগা উচিত।',
    practiceEn: 'Hold your palm before your lips and say ক-খ, চ-ছ, ত-থ, প-ফ; feel airflow only on the second consonant.',
    practiceStepsBn: [
      'হাতের তালু মুখ থেকে ২ ইঞ্চি দূরে ধরে ‘প-ফ, ব-ভ, ত-থ, দ-ধ, ক-খ’ ৫ বার বলুন।',
      'এবার “চাঁদের আলোয় বাঁশি বাজে, ঘন মেঘে ভোরের ছায়া” বাক্যটি স্পষ্ট প্রাণত্বে পড়ুন।',
      'রেকর্ড করে শুনে নিন মহাপ্রাণ ও অনুনাসিক ধ্বনি ঠিকমতো শোনা যাচ্ছে কি না।',
    ],
    practiceStepsEn: [
      'Test breath bursts on প-ফ, ব-ভ, ত-থ, ক-খ against your palm five times.',
      'Speak a dense Bengali sentence mixing nasal and aspirated consonants.',
      'Play back your Studio recording to verify clarity.',
    ],
  },
  {
    id: 'shobder-shuddho-uccharon',
    num: 10,
    group: 'diction',
    icon: '💎',
    titleBn: 'কিছু শব্দের শুদ্ধ উচ্চারণ',
    titleEn: 'Correct Pronunciation of Key Words',
    subtitleBn: 'আবৃত্তিতে বহুল ব্যবহৃত কিন্তু প্রায়ই ভুল উচ্চারিত ১৫+ শব্দের প্রমিত রূপ',
    subtitleEn: '15+ high-frequency literary words with their standard spoken forms',
    summaryBn:
      'অনেক সুন্দর কবিতা কেবল কয়েকটি পরিচিত শব্দের ভুল উচ্চারণে তার সৌন্দর্য হারায়। নিচের বহুল ব্যবহৃত শব্দগুলোর লিখিত বানান ও প্রমিত শ্রুতি-রূপ ভালোভাবে রপ্ত করুন এবং প্রতিটি শুনে অনুশীলন করুন।',
    summaryEn:
      'Even a heartfelt recitation stumbles when familiar words are mispronounced. Master these high-frequency literary words and hear their standard spoken form.',
    deepDiveBn:
      'বিশেষ করে হ-ফলা (হ্ম, হ্ন, হ্ব, হ্য), ক্ষ্ম, ত্ম, বিসর্গ এবং তৎসম যৌগিক শব্দের উচ্চারণে বাংলা বানান দেখে সরাসরি পড়লে প্রায়ই ভুল হয়। প্রতিটি শব্দের নিচে ব্র্যাকেটে সহজ শ্রুতি-বানান (Spoken Phonetic Guide) ও কারণ দেওয়া হয়েছে, যাতে দেখে ও শুনে সঙ্গে সঙ্গে আয়ত্ত করা যায়।',
    deepDiveEn:
      'Complex conjuncts like হ্ম, হ্ব, হ্য, ক্ষ্ম, ত্ম, and visarga combinations follow systematic spoken sound reversals and geminations rather than letter-by-letter spelling.',
    points: [
      {
        titleBn: 'হ-যুক্ত যুক্তবর্ণের সূত্র (হ্ম, হ্ন, হ্ব, হ্য)',
        titleEn: 'হ-Conjunct Patterns',
        detailBn: 'হ্ম উচ্চারণে ‘ম্‌হ’ (ব্রাহ্মণ → ব্রাম্‌হোন্‌), হ্ন উচ্চারণে ‘ন্‌হ’ (চিহ্ন → চিন্‌হো), হ্ব উচ্চারণে ‘ওভ/ভ্‌ভ’ (আহ্বান → আওভান্‌), এবং হ্য উচ্চারণে ‘জ্‌ঝ’ (সহ্য → শোজ্‌ঝো) হয়।',
        detailEn: 'হ্ম flips to ম্‌হ, হ্ন flips to ন্‌হ, হ্ব becomes ওভ/ভ্‌ভ, and হ্য shifts to জ্‌ঝ.',
      },
      {
        titleBn: 'ক্ষ্ম ও ত্ম-এর নিয়ম',
        titleEn: 'ক্ষ্ম & ত্ম Patterns',
        detailBn: '‘ক্ষ্ম’ উচ্চারিত হয় ‘ক্‌খোঁ’ (লক্ষ্মী → লোক্‌খিঁ, সূক্ষ্ম → শুক্‌খোঁ); আর ‘ত্ম’ উচ্চারিত হয় ‘ত্‌তোঁ’ (আত্মা → আত্‌তাঁ, মহাত্মা → মহাত্‌তাঁ)।',
        detailEn: 'ক্ষ্ম sounds like ক্‌খোঁ and ত্ম doubles cleanly to ত্‌তোঁ with soft nasalization.',
      },
      {
        titleBn: 'য-ফলা + অ/আ ও ‘ব্যা/বে’ বিভ্রান্তি',
        titleEn: 'য-ফলা Vowel Harmony',
        detailBn: '‘ব্যতীত’, ‘ব্যক্তি’, ‘ব্যতীত’—এগুলোতে পরের ই-কারের প্রভাবে ‘বে’ হয়; কিন্তু ‘ব্যথা’, ‘ব্যবস্থা’, ‘ব্যাকরণ’-এ ‘ব্যা’ উচ্চারিত হয়।',
        detailEn: 'Use ‘বে’ when followed by ই/ঈ (ব্যক্তি → বেক্‌তি) and ‘ব্যা’ before অ/আ (ব্যথা → ব্যাথা).',
      },
    ],
    samples: [
      {
        word: 'আত্মীয়',
        spoken: 'আত্‌তিঁয়ো',
        noteBn: 'ত্ম নয়, দ্বিত্ব ত + সামান্য অনুনাসিকতা',
        noteEn: 'Doubled ত with soft nasal touch',
      },
      {
        word: 'ব্রাহ্মণ',
        spoken: 'ব্রাম্‌হোন্‌',
        noteBn: 'হ্ম → ম্‌হ ধ্বনিক্রমে উচ্চারিত হয়',
        noteEn: 'হ্ম reverses phonetically to ম্‌হ',
      },
      {
        word: 'মধ্যাহ্ন / অপরাহ্ণ',
        spoken: 'মোদ্‌ধান্‌হো / অপরান্‌হো',
        noteBn: 'হ্ন/হ্ণ → ন্‌হো প্রমিত ধ্বনি',
        noteEn: 'হ্ন/হ্ণ sounds as ন্‌হো',
      },
      {
        word: 'আহ্বান',
        spoken: 'আওভান্‌',
        noteBn: 'হ্ব-এ ‘হো-ভ’ বা ‘আওভান্‌’ প্রমিত রূপ',
        noteEn: 'Standard spoken form is আওভান্‌',
      },
      {
        word: 'সহ্য / ঐতিহ্য',
        spoken: 'শোজ্‌ঝো / ওইতিজ্‌ঝো',
        noteBn: 'হ্য → জ্‌ঝো ধ্বনিতে রূপান্তরিত হয়',
        noteEn: 'হ্য becomes জ্‌ঝো in standard speech',
      },
      {
        word: 'লক্ষ্মী / সূক্ষ্ম',
        spoken: 'লোক্‌খিঁ / শুক্‌খোঁ',
        noteBn: 'ক্ষ্ম-এর প্রমিত রূপ ক্‌খঁ',
        noteEn: 'ক্ষ্ম reduces smoothly to ক্‌খঁ',
      },
      {
        word: 'গ্রীষ্ম / উষ্ণ',
        spoken: 'গ্রিশ্‌শোঁ / উশ্‌নো',
        noteBn: 'ষ্ম → শ্‌শোঁ এবং ষ্ণ → শ্‌নো',
        noteEn: 'Clear sibilant gemination & nasal stop',
      },
      {
        word: 'মনঃক্ষুণ্ণ / দুঃস্থ',
        spoken: 'মনোক্‌খুন্‌নো / দুশ্‌থো',
        noteBn: 'বিসর্গের পরের ধ্বনির সঙ্গে মসৃণ সংযোগ',
        noteEn: 'Smooth visarga transition into next cluster',
      },
      {
        word: 'ব্যতীত / ব্যক্তি',
        spoken: 'বেতিতো / বেক্‌তি',
        noteBn: 'এখানে ‘ব্যা’ নয়, ‘বে’ উচ্চারিত হয়',
        noteEn: 'Pronounced বেতিতো and বেক্‌তি',
      },
      {
        word: 'অধ্যয়ন / অভ্যুদয়',
        spoken: 'ওদ্‌ধয়োন্‌ / ওভ্‌ভুদয়্‌',
        noteBn: 'প্রথম অ → ও, মাঝের যুক্তবর্ণ দ্বিত্ব',
        noteEn: 'Initial অ rounds to ও with crisp cluster',
      },
      {
        word: 'যজ্ঞ / কৃতজ্ঞ',
        spoken: 'জোগ্‌গোঁ / কৃতোগ্‌গোঁ',
        noteBn: 'শেষে জ্ঞ থাকলে ‘গ্‌গোঁ’ উচ্চারণ হয়',
        noteEn: 'Word-final জ্ঞ sounds like গ্‌গোঁ',
      },
      {
        word: 'সৌন্দর্য / ঐশ্বর্য',
        spoken: 'শোউন্‌দোরজো / ওইশ্‌শোর্‌জো',
        noteBn: 'য-ফলা-তে হালকা দ্বিত্ব ও র-এর পর জ-স্পর্শ',
        noteEn: 'Clean র-জ glide without dropping syllable weight',
      },
    ],
    mistakes: [
      {
        wrongBn: '‘ঐতিহ্য’-কে ‘ঐতিহ্যো’ বা ‘চিহ্ন’-কে ‘চিনো’ (হ ছাড়া) বলা।',
        wrongEn: 'Misreading ঐতিহ্য literally or dropping হ from চিহ্ন.',
        fixBn: 'হ্য-তে ‘জ্‌ঝ’ (ওইতিজ্‌ঝো) এবং হ্ন-তে ‘ন্‌হ’ (চিন্‌হো) স্পষ্ট শুনিয়ে বলুন।',
        fixEn: 'Use জ্‌ঝ for হ্য and ন্‌হ for হ্ন in standard Bengali delivery.',
      },
    ],
    practiceBn: 'উপরের প্রতিটি শব্দের পাশের 🔊 বোতামে ট্যাপ করে শুনুন এবং নিজে ৩ বার স্পষ্ট করে বলুন।',
    practiceEn: 'Tap Listen beside each word above and repeat it clearly three times.',
    practiceStepsBn: [
      '১২টি শব্দের যেগুলোতে আগে ভুল হতো, সেগুলো আলাদা চিহ্নিত করুন।',
      'প্রতিটি শব্দের পাশের 🔊 বোতাম শুনে প্রমিত শ্রুতি-রূপ ৩ বার অনুকরণ করুন।',
      'সবশেষে এগুলো দিয়ে স্টুডিওতে একটি ৩০ সেকেন্ডের ডিকশন টেস্ট রেকর্ড করুন।',
    ],
    practiceStepsEn: [
      'Pick 4 words from the list above that feel trickiest.',
      'Listen to each word and echo its standard spoken form three times.',
      'Record a quick 30-second diction check in Studio.',
    ],
  },
  {
    id: 'bagjontrer-byayam',
    num: 11,
    group: 'technique',
    icon: '👄',
    titleBn: 'বাগযন্ত্রের ব্যায়াম',
    titleEn: 'Vocal Organs & Articulators Exercises',
    subtitleBn: 'ঠোঁট, জিহ্বা, চোয়াল, কোমল তালু ও শ্বাসপেশির নমনীয়তা',
    subtitleEn: 'Flexibility drills for lips, tongue, jaw, soft palate, and diaphragm',
    summaryBn:
      'মানুষের ফুসফুস, শ্বাসনালী, স্বরতন্ত্রী, জিহ্বা, দাঁত, তালু, ঠোঁট ও নাসিকা গহ্বর মিলেই বাগযন্ত্র। জিহ্বা ও ঠোঁট জড় থাকলে উচ্চারণ অস্পষ্ট হয়; তাই প্রতিদিন বাগযন্ত্রের ব্যায়াম জরুরি।',
    summaryEn:
      'Your articulators—lungs, larynx, tongue, jaw, teeth, palate, lips, and nasal cavity—work as one instrument. Daily mobility drills eliminate mumbling.',
    deepDiveBn:
      'বাগযন্ত্র দুটি ভাগে কাজ করে: ‘সক্রিয় বাগযন্ত্র’ (নড়নক্ষম—যেমন ঠোঁট, জিহ্বা, নিচের চোয়াল, কোমল তালু) এবং ‘নিষ্ক্রিয় বাগযন্ত্র’ (স্থির—যেমন ওপরের দাঁত, শক্ত তালু, মূর্ধা)। যদি ঠোঁট, চোয়াল ও জিভের পেশি শক্ত থাকে, তবে শব্দ মুখের ভেতরেই আটকে যায়। প্রতিদিন ৫ মিনিটের বাগযন্ত্র-ব্যায়াম উচ্চারণকে ঝকঝকে করে।',
    deepDiveEn:
      'Active articulators (lips, tongue, jaw, soft palate) must move nimbly against passive ones (teeth, hard palate). Five minutes of daily mobility removes tension and unlocks effortless clarity.',
    points: [
      {
        titleBn: '১. চোয়াল শিথিলকরণ ও ম্যাসাজ',
        titleEn: '1. Jaw Hinge Release',
        detailBn: 'কানের সামনের চোয়াল-সন্ধিতে আঙুলের ডগা দিয়ে গোল করে ৩০ সেকেন্ড ম্যাসাজ করুন; তারপর ‘বা-বা-বা, মা-মা-মা’ বলে চোয়াল আলগা নামান।',
        detailEn: 'Massage the jaw hinge gently for 30s, then drop the jaw effortlessly on ‘ba-ba-ba, ma-ma-ma’.',
      },
      {
        titleBn: '২. ঠোঁটের ব্যায়াম ও লিপ ট্রিল',
        titleEn: '2. Lip Stretch & Lip Trills',
        detailBn: 'ঠোঁট শক্ত করে শিস দেওয়ার মতো সামনে এনে ‘উ’, এরপর হাসির মতো ছড়িয়ে ‘ই’—এভাবে ১০ বার করুন। তারপর ঢিলা ঠোঁটে বাতাস ছেড়ে ‘ব্র্‌র্‌র্‌’ লিপ ট্রিল করুন।',
        detailEn: 'Alternate tight ‘oo’ pucker and wide ‘ee’ smile 10 times, then blow loose air into lip trills.',
      },
      {
        titleBn: '৩. জিহ্বার সচলতা ও স্পর্শ-ড্রিল',
        titleEn: '3. Tongue Push-ups & Rolls',
        detailBn: 'মুখ বন্ধ রেখে দাঁতের ওপর-নিচ মাড়ির বাইরের দিকে জিভ দিয়ে ৫ বার ডান থেকে বাঁয়ে ঘোরান। তারপর ‘ট-ত-ল-র’ ও জিভ ট্রিল (র্‌র্‌র্‌) করুন।',
        detailEn: 'Sweep tongue clockwise/counter-clockwise around teeth 5 times, then tap rapid ‘ta-da-na-la’.',
      },
      {
        titleBn: '৪. কোমল তালু (Soft Palate) উত্তোলন',
        titleEn: '4. Soft Palate Lift',
        detailBn: 'হালকা হাই তোলার ভঙ্গি বা ‘ঙ-কা-গা’ উচ্চারণ করলে মুখের পেছনের কোমল তালু উঁচু হয়; এতে স্বর নাকিসুর না হয়ে পরিষ্কার ও গম্ভীর হয়।',
        detailEn: 'Gently lift the soft palate via a half-yawn or ‘nga-ka-ga’ to eliminate unwanted nasality.',
      },
    ],
    samples: [
      {
        word: 'ই — উ — ও — আ (মুখ-ব্যায়াম)',
        spoken: 'ঠোঁট ও চোয়ালের পূর্ণ প্রসারণ',
        noteBn: 'প্রতিটি স্বর ২ সেকেন্ড ধরে পরিষ্কার আকৃতি তৈরি করুন',
        noteEn: 'Hold each exaggerated vowel shape cleanly for 2 seconds',
      },
      {
        word: 'প-ত-ট-চ-ক / ব-দ-ড-জ-গ',
        spoken: 'দ্রুত ও স্পষ্ট স্টাকাটো স্পর্শ',
        noteBn: 'ঠোঁট থেকে কণ্ঠ পর্যন্ত ৫টি স্থান পর্যায়ক্রমে সচল রাখুন',
        noteEn: 'Cycle forward-to-back articulation zones crisply',
      },
    ],
    mistakes: [
      {
        wrongBn: 'দাঁত প্রায় চেপে রেখে কথা বলা, যার ফলে স্বর ও ব্যঞ্জন মুখের ভেতরে চাপা পড়ে থাকে।',
        wrongEn: 'Speaking with a clenched jaw, trapping resonance inside the mouth.',
        fixBn: 'অন্তত এক আঙুলের প্রস্থ পরিমাণ মুখ স্বাভাবিক ভঙ্গিতে খুলে স্বরবর্ণ উচ্চারণের অভ্যাস করুন।',
        fixEn: 'Keep roughly one finger-width of natural jaw space on open vowels.',
      },
    ],
    practiceBn: '৩০ সেকেন্ড ‘ই-উ-ও-আ’, এরপর ৩০ সেকেন্ড ‘প-ত-ট-ক’ স্পষ্ট স্পর্শে দ্রুত বলুন ও শেষে ৩টি টাং টুইস্টার চর্চা করুন।',
    practiceEn: 'Spend 30s on crisp ‘ee-oo-oh-ah’ shapes, then 30s on sharp ‘p-t-T-k’ consonant taps.',
    practiceStepsBn: [
      '২০ সেকেন্ড চোয়াল ম্যাসাজ ও মুখ গোল করে ‘ই-উ-ও-আ’ ৫ বার বলুন।',
      '৩০ সেকেন্ড লিপ ট্রিল ও ‘ট-ড-ন-র-ল’ দ্রুত বলুন।',
      'সবশেষে আমাদের টাং টুইস্টার বিভাগ থেকে ২টি বাংলা টুইস্টার দ্রুত ও নির্ভুল বলুন।',
    ],
    practiceStepsEn: [
      'Massage jaw for 20s and cycle through ‘ee-oo-oh-ah’ five times.',
      'Do 30s of lip trills plus rapid ‘ta-da-na-ra-la’ taps.',
      'Finish with 2 Bengali tongue twisters cleanly.',
    ],
  },
  {
    id: 'abritti-nirman-koushol',
    num: 12,
    group: 'technique',
    icon: '🎬',
    titleBn: 'আবৃত্তি নির্মাণ কৌশল',
    titleEn: 'Recitation Crafting & Arrangement',
    subtitleBn: 'একটি কবিতাকে মঞ্চোপযোগী শ্রুতিশিল্পে রূপ দেওয়ার পূর্ণ প্রক্রিয়া',
    subtitleEn: 'Step-by-step architecture of building a performance piece',
    summaryBn:
      'একটি কবিতা হাতে নেওয়ার পর তা মঞ্চে পরিবেশনের আগে বিশ্লেষণ, পাণ্ডুলিপি দাগানো (পজ, ঝোঁক, গতি), স্বর-পরিকল্পনা, চরিত্রায়ন ও চূড়ান্ত মহড়ার মধ্য দিয়ে আবৃত্তি ‘নির্মাণ’ করতে হয়।',
    summaryEn:
      'Building a recitation means dissecting the poem, marking a script for pauses and shifts, mapping emotional peaks, and rehearsing transitions.',
    deepDiveBn:
      'আবৃত্তি মুখস্থ করে বলে দেওয়া কোনো কাকতালীয় ঘটনা নয়—এটি একটি স্থাপত্যের মতো ‘নির্মাণ’ করতে হয়। যেভাবে একজন চলচ্চিত্র পরিচালক শট সাজান, তেমনি আবৃত্তিকার নির্ধারণ করেন কবিতার শুরুটা কীভাবে দর্শককে টানবে, মাঝখানে কোথায় গতি বাড়বে, কোথায় নীরবতা নামবে এবং শেষ লাইনটি কোন রেশ রেখে থামবে।',
    deepDiveEn:
      'Like a director storyboarding a film, a reciter architects an entire emotional journey—opening hook, rising tension, turning points, climax, and lingering stillness at the close.',
    points: [
      {
        titleBn: '১. কবিতা নির্বাচন ও পাঠ-বিশ্লেষণ',
        titleEn: '1. Selection & Text Analysis',
        detailBn: 'নিজের কণ্ঠের মেজাজ, বয়স ও অনুষ্ঠানের উপযোগী কবিতা বেছে নিয়ে তার ঐতিহাসিক প্রেক্ষাপট, শব্দার্থ ও প্রমিত উচ্চারণ যাচাই করুন।',
        detailEn: 'Choose a poem suited to your voice and occasion; research its context and verify every word.',
      },
      {
        titleBn: '২. পাণ্ডুলিপি স্কোরিং (Script Marking)',
        titleEn: '2. Script Scoring & Notation',
        detailBn: 'কাগজে প্রিন্ট বা হাতে লিখে ‘/’ (ছোট বিরতি), ‘//’ (দীর্ঘ বিরতি), আন্ডারলাইন (শব্দের ঝোঁক) এবং পাশে আবেগ/গতির নির্দেশনা (ধীর, দৃঢ়, কোমল) লিখে রাখুন।',
        detailEn: 'Mark / for half pauses, // for full breaths, underlines for emphasis, and margin cues for pace.',
      },
      {
        titleBn: '৩. গ্রাফ বা উত্থান-পতন পরিকল্পনা',
        titleEn: '3. Dynamic Arc & Climax',
        detailBn: 'পুরো কবিতাকে ৩–৪টি পর্যায়ে ভাগ করুন: সূচনা (আকর্ষণ), বিস্তার (দৃশ্যপট), শীর্ষবিন্দু বা ক্লাইম্যাক্স (সর্বোচ্চ আবেগ) ও উপসংহার (রেশ রেখে সমাপ্তি)।',
        detailEn: 'Map opening hook, rising development, emotional climax, and quiet resolution so energy builds naturally.',
      },
      {
        titleBn: '৪. চরিত্রায়ন ও বৃন্দ আবৃত্তি নির্মাণ',
        titleEn: '4. Dialogue Voices & Chorus Craft',
        detailBn: 'কবিতায় কথোপকথন থাকলে দৃষ্টি ও কণ্ঠের সামান্য কোণ বদলে চরিত্র আলাদা করুন; আর বৃন্দ আবৃত্তিতে একক, দ্বৈত ও সমস্বরের সুষম বিন্যাস সাজান।',
        detailEn: 'Differentiate dialogue speakers subtly via vocal tone; in chorus pieces balance solo, duet, and unison lines.',
      },
    ],
    samples: [
      {
        word: 'পাণ্ডুলিপি সংকেত নমুনা:',
        spoken: '“আজও শুনি / সেই পদধ্বনি // দূর-দিগন্তে...”',
        noteBn: 'একক স্ল্যাশ (/) হালকা থামা, ডবল স্ল্যাশ (//) গভীর শ্বাস, ... ভাব-রেশ',
        noteEn: 'Single slash = brief suspension, double slash = breath pause, ellipsis = fade out',
      },
    ],
    mistakes: [
      {
        wrongBn: 'শুরু থেকেই সর্বোচ্চ গলা চড়িয়ে ফেলা, ফলে ক্লাইম্যাক্সে যাওয়ার আর জায়গা না থাকা।',
        wrongEn: 'Starting at maximum volume and intensity, leaving nowhere to grow at the climax.',
        fixBn: 'শুরুটা সংযত ও আমন্ত্রণমূলক রাখুন—স্বর ও আবেগকে ধাপে ধাপে বিকশিত হতে দিন।',
        fixEn: 'Begin grounded and inviting so emotional peaks feel earned and powerful.',
      },
    ],
    practiceBn: '৪-৬ লাইনের একটি কবিতায় ‘/’ বিরতি ও মূল শব্দের নিচে দাগ দিয়ে দুইবার ভিন্ন গতি-তীব্রতায় অনুশীলন করুন।',
    practiceEn: 'Mark breath slashes and underlined keywords on a 6-line excerpt, then rehearse its dynamic arc twice.',
    practiceStepsBn: [
      'প্রিয় একটি ৪–৮ লাইনের স্তবক খাতায় লিখে /, // ও গুরুত্বপূর্ণ শব্দ দাগিয়ে নিন।',
      '১ম স্তবক কোমল ও ধীর, ২য় অংশ দৃঢ় ও উজ্জ্বল স্বরে বলার গ্রাফ সাজান।',
      'স্টুডিওতে রেকর্ড করে শুনে যাচাই করুন ক্লাইম্যাক্স ও বিরতিগুলো যথার্থ হয়েছে কি না।',
    ],
    practiceStepsEn: [
      'Write out a 4–8 line excerpt and annotate slashes and underlined keywords.',
      'Rehearse a gradual build from calm opening to firm climax.',
      'Record and verify whether pauses and transitions sound organic.',
    ],
  },
  {
    id: 'abrittikarer-gunagun',
    num: 13,
    group: 'stage',
    icon: '🌟',
    titleBn: 'আবৃত্তিকারের গুণাগুণ ও প্রস্তুতি',
    titleEn: 'Qualities & Preparation of a Reciter',
    subtitleBn: 'ব্যক্তিত্ব, সাহিত্যবোধ, কণ্ঠের যত্ন, অধ্যয়ন ও মানসিক স্থিরতা',
    subtitleEn: 'Character, literary curiosity, vocal hygiene, study, and poise',
    summaryBn:
      'দক্ষ আবৃত্তিকার কেবল সুন্দর গলার অধিকারী নন; তিনি নিয়মিত সাহিত্য পাঠ করেন, শব্দের অর্থ জানেন, কণ্ঠের যত্ন নেন, পরিমিত পোশাক-ভঙ্গি বজায় রাখেন এবং মঞ্চে স্থির আত্মবিশ্বাস ধরে রাখেন।',
    summaryEn:
      'A true reciter pairs vocal clarity with wide reading, vocabulary curiosity, vocal hygiene, composed body language, and genuine humility.',
    deepDiveBn:
      'কণ্ঠস্বর ঈশ্বরদত্ত হতে পারে, কিন্তু আবৃত্তিকার হয়ে উঠতে হয় সাধনা, অধ্যয়ন ও শৃঙ্খলার মাধ্যমে। যিনি বেশি পড়েন ও শোনেন, তাঁর উচ্চারণ ও ভাবগ্রাহিতা ততই সমৃদ্ধ হয়। পাশাপাশি কণ্ঠের শারীরিক যত্ন এবং মঞ্চে ওঠার আগের মানসিক স্থিরতা একজন শিল্পীকে সাধারণ পাঠকের থেকে আলাদা করে।',
    deepDiveEn:
      'Natural voice is a starting gift, but a memorable reciter is forged by wide reading, active listening, daily vocal care, and grounded mental preparation.',
    points: [
      {
        titleBn: '১. গভীর অধ্যয়ন ও শ্রবণ-অভ্যাস',
        titleEn: '1. Wide Reading & Active Listening',
        detailBn: 'শুধু নিজের পছন্দের কবিতা নয়—গল্প, ইতিহাস, দর্শন ও সমসাময়িক সাহিত্য পড়ুন। অভিধান সব সময় হাতের কাছে রাখুন এবং অগ্রজ শিল্পীদের আবৃত্তি মন দিয়ে শুনুন।',
        detailEn: 'Read fiction, history, and poetry broadly; consult dictionaries and listen closely to master reciters.',
      },
      {
        titleBn: '২. কণ্ঠের স্বাস্থ্যবিধি (Vocal Hygiene)',
        titleEn: '2. Vocal Care & Hydration',
        detailBn: 'দিনে পর্যাপ্ত স্বাভাবিক তাপমাত্রার জল পান করুন। মঞ্চের আগে বরফ-ঠান্ডা পানীয়, অতিরিক্ত ভাজাপোড়া, দুগ্ধজাত ভারী খাবার, ধূমপান ও রাত জাগা এড়িয়ে চলুন।',
        detailEn: 'Hydrate with room-temperature water; avoid icy drinks, heavy dairy, smoking, and sleep loss before stage.',
      },
      {
        titleBn: '৩. দেহভঙ্গি, দৃষ্টি ও পোশাক-সচেতনতা',
        titleEn: '3. Posture, Gaze & Attire',
        detailBn: 'মেরুদণ্ড সোজা রেখে দুই পায়ে সমান ভর দিয়ে দাঁড়ান। এমন মার্জিত পোশাক পরুন যা কবিতার মেজাজের সঙ্গে মানায় এবং দর্শকের মনোযোগ নষ্ট করে না।',
        detailEn: 'Stand balanced on both feet with an open chest; wear dignified attire suited to the occasion.',
      },
      {
        titleBn: '৪. মঞ্চভীতি জয় ও মানসিক প্রস্তুতি',
        titleEn: '4. Overcoming Stage Fright',
        detailBn: 'মঞ্চে ওঠার আগে ৪-৭-৮ শ্বাস-ব্যায়াম করুন, ঠোঁট-জিভ হালকা গরম করে নিন এবং দর্শককে বিচারক না ভেবে আপনার ‘কবিতা শোনার বন্ধু’ মনে করুন।',
        detailEn: 'Use 4-7-8 breathing before stepping up, warm your articulators quietly, and treat listeners as friends.',
      },
    ],
    samples: [
      {
        word: 'মঞ্চ-পূর্ব ৫ মিনিট প্রস্তুতি',
        spoken: 'জল পান → ৪-৭-৮ শ্বাস → মৃদু হামিং → ১ম লাইন স্মরণ',
        noteBn: 'ভিতরে তাড়াহুড়ো না রেখে শান্তভাবে মঞ্চে প্রবেশ করুন',
        noteEn: 'Enter unhurried after hydration, calm breathing, and silent cueing',
      },
    ],
    mistakes: [
      {
        wrongBn: 'অনুষ্ঠানের ঠিক আগে জোরে জোরে চিৎকার করে রিহার্সাল করা বা খুব ঠান্ডা/কফি পান করা।',
        wrongEn: 'Shouting through rehearsals or drinking ice-cold beverages right before stage.',
        fixBn: 'মঞ্চের ১ ঘণ্টা আগে কেবল নীরব মানসিক মহড়া ও মৃদু হামিং করুন; সাধারণ জল পান করুন।',
        fixEn: 'Stick to quiet mental run-throughs, gentle humming, and room-temperature water.',
      },
    ],
    practiceBn: 'পারফরম্যান্সের আগে ১ মিনিট ৪-৭-৮ শ্বাস নিয়ে কাঁধ নামিয়ে মুখের পেশি শিথিল করুন, তারপর প্রথম লাইনটি মনে মনে শুনুন।',
    practiceEn: 'Before performing, take 1 minute of calm breathing, drop your shoulders, and hear your opening line mentally.',
    practiceStepsBn: [
      'স্টুডিও ভিউ-এর ‘শ্বাস’ (4-7-8 Breathing) বাটন চালিয়ে ১ মিনিট শ্বাস শান্ত করুন।',
      'হাত-কাঁধ ঝেড়ে সোজা দাঁড়িয়ে প্রথম ৫ সেকেন্ড দর্শকের দিকে শান্তভাবে তাকানোর অভ্যাস করুন।',
      'তারপরই আপনার প্রথম শব্দ উচ্চারণ করে ১ মিনিটের পরিবেশনা রেকর্ড করুন।',
    ],
    practiceStepsEn: [
      'Run 1 minute of the 4-7-8 Breathing guide in StudioView to steady your pulse.',
      'Stand balanced, pause silently for 3–5 seconds as if facing an audience.',
      'Begin your opening line cleanly and record a full 1-minute take.',
    ],
  },
  {
    id: 'moncho-o-microphone',
    num: 14,
    group: 'stage',
    icon: '🎙️',
    titleBn: 'মঞ্চ পরিকল্পনা ও মাইক্রোফোন ব্যবহার',
    titleEn: 'Stage Planning & Microphone Technique',
    subtitleBn: 'মাইক্রোফোনের দূরত্ব, ৪৫° কোণ, পপ-শব্দ নিয়ন্ত্রণ ও মঞ্চ-সমন্বয়',
    subtitleEn: 'Mic distance, 45° angle, plosive control, lighting & audience eye contact',
    summaryBn:
      'দারুণ প্রস্তুতিও দুর্বল মাইক্রোফোন ব্যবহারে ম্লান হতে পারে। মাইক্রোফোনের সাথে সঠিক দূরত্ব, কণ্ঠের তীব্রতা অনুযায়ী অবস্থান পরিবর্তন এবং মঞ্চে আলো-শব্দ ও দৃষ্টির ভারসাম্য জানা পেশাদার আবৃত্তির অপরিহার্য অংশ।',
    summaryEn:
      'Even great preparation loses impact with poor mic technique. Proper distance, angle, plosive control, lighting awareness, and eye contact deliver studio-grade stage clarity.',
    deepDiveBn:
      'মাইক্রোফোন কণ্ঠের খুঁত যেমন বড় করে শোনায়, তেমনি কণ্ঠের সূক্ষ্ম জাদুও দর্শকের কাছে পৌঁছে দেয়। তাই মাইককে ভয় না পেয়ে বন্ধুর মতো ব্যবহার করতে শিখুন। দূরত্ব, কোণ, পপ-সাউন্ড নিয়ন্ত্রণ এবং মঞ্চের আলোর অবস্থান ঠিক থাকলে আপনার সাধারণ কণ্ঠও হলের প্রতিটি কোণে গভীর ও মখমলের মতো শোনাবে।',
    deepDiveEn:
      'A microphone magnifies both flaws and vocal magic. Mastering off-axis placement, dynamic distance pulling, and light positioning turns your natural voice into warm, room-filling sound.',
    points: [
      {
        titleBn: '১. আদর্শ দূরত্ব: ৪–৬ ইঞ্চি (এক বিঘত)',
        titleEn: '1. Ideal Distance: 4–6 Inches',
        detailBn: 'মুখ থেকে সাধারণত ৪–৬ ইঞ্চি (এক হাতের আঙুল ছড়ানো বিঘতের মতো) দূরে মাইক্রোফোন রাখুন। বেশি কাছে আনলে শব্দ বিকৃত ও ভারী হয়ে যায়, বেশি দূরে নিলে কণ্ঠ হালকা শোনায়।',
        detailEn: 'Maintain 4–6 inches (~one hand-span). Too close causes muddy bass boom; too far loses warmth.',
      },
      {
        titleBn: '২. ৪৫° কোণ ও পপ-সাউন্ড (প-ফ-ব-ট) নিয়ন্ত্রণ',
        titleEn: '2. 45° Off-Axis Angle & Plosives',
        detailBn: 'মাইক্রোফোন একদম সোজা ঠোঁটের সামনে না ধরে সামান্য চিবুকের নিচ থেকে ৪৫° কোণে ধরুন—এতে ‘প, ফ, ব, ভ, ট’ বলার সময় বাতাসের ধাক্কা (Pop/Boom) মাইকে ধাক্কা খাবে না।',
        detailEn: 'Aim the capsule slightly below the mouth at ~45° so harsh ‘p/b/t’ air bursts glide past instead of popping.',
      },
      {
        titleBn: '৩. ডাইনামিক পুল-ব্যাক (উচ্চস্বরে পেছানো)',
        titleEn: '3. Dynamic Distance Pull-Back',
        detailBn: 'কবিতার কোমল বা ফিসফিসে অংশে মাইকের কাছাকাছি (৩–৪ ইঞ্চি) আসুন, আর বিদ্রোহ বা উচ্চস্বরের লাইনে মাথা ১–২ ইঞ্চি পিছিয়ে নিন—তাহলে সাউন্ড ফাটবে না।',
        detailEn: 'Lean slightly closer on intimate whispers, and pull back 1–2 inches on powerful climaxes to avoid clipping.',
      },
      {
        titleBn: '৪. মঞ্চের আলো, সাউন্ড চেক ও দর্শক-দৃষ্টি',
        titleEn: '4. Lighting, Sound Check & Eye Sweep',
        detailBn: 'শুরুতেই মাইকে টোকা না দিয়ে “হ্যালো, এক-দুই” বলে সাউন্ড দেখুন। আলোর বৃত্তের মাঝে স্থির দাঁড়িয়ে দর্শকের বাম, মাঝ ও ডান সারিতে সমান দৃষ্টি রাখুন; শেষে ২ সেকেন্ড নীরব থেকে অভিবাদন নিন।',
        detailEn: 'Never tap the mic head—test with natural speech. Stand inside the stage light, sweep calm eye contact, and pause 2s at the end.',
      },
    ],
    samples: [
      {
        word: '৪–৬ ইঞ্চি দূরত্ব + ৪৫° কোণ',
        spoken: 'স্বচ্ছ, উষ্ণ ও প্রাকৃতিক কণ্ঠ',
        noteBn: 'চিবুকের সমতল থেকে সামান্য ওপরে মুখের দিকে তাক করা',
        noteEn: 'Warm balanced capture with zero harsh air blasts',
      },
      {
        word: 'হাতে মাইক ধরে থাকলে',
        spoken: 'হাত স্থির, বুকের কাছে নয়',
        noteBn: 'কবিতার সঙ্গে মাইক ধরা হাত নাড়াবেন না; প্রয়োজনে অন্য হাত হালকা রাখুন',
        noteEn: 'Keep the mic hand steady; never wave the microphone while gesturing',
      },
    ],
    mistakes: [
      {
        wrongBn: 'মাইক্রোফোনের একদম মাথায় হাত দিয়ে মুঠো করে ধরা বা মাইক চেক করতে গিয়ে জোরে টোকা দেওয়া।',
        wrongEn: 'Cupping the mic grille with your hand or tapping the capsule during sound check.',
        fixBn: 'মাইকের হাতল বা স্ট্যান্ড ধরুন, জাল-অংশ কখনো ঢাকবেন না; আর স্ট্যান্ডের উচ্চতা আগে থেকেই মুখ বরাবর ঠিক করে নিন।',
        fixEn: 'Hold the shaft cleanly below the grille and set stand height before starting.',
      },
    ],
    practiceBn: 'হাত মুখ থেকে এক বিঘত (প্রায় ৫ ইঞ্চি) সামনে ধরে কল্পিত মাইক্রোফোনে “পাহাড়ের পাদদেশে প্রবল ঝড়” বাক্যটি পপ-শব্দ ছাড়াই বলুন।',
    practiceEn: 'Hold your hand 5 inches from your mouth like a mic and speak plosive-heavy lines cleanly without air bursts.',
    practiceStepsBn: [
      'ফোন বা কল্পিত মাইক্রোফোন মুখ থেকে ৫ ইঞ্চি দূরে ও সামান্য নিচে (৪৫° কোণে) ধরুন।',
      'ফিসফিসে স্বরে ও দৃঢ় স্বরে দুটি লাইন বলে দূরত্বের ভারসাম্য (পুল-ব্যাক) অনুশীলন করুন।',
      'স্টুডিওতে রেকর্ড করে শুনে যাচাই করুন ‘প, ব, ভ’ শব্দগুলো পরিষ্কার ও ফাটা-মুক্ত কি না।',
    ],
    practiceStepsEn: [
      'Hold your phone mic ~5 inches away slightly below mouth level at a 45° angle.',
      'Practice leaning slightly closer for soft lines and pulling back slightly on loud peaks.',
      'Record in Studio and inspect playback for clean plosives without distortion.',
    ],
  },
];
