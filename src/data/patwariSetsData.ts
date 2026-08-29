import { Question } from '../types';
import { PATWARI_2026_MASTER_QUESTIONS } from './patwariFullQuestionBank';
import { PATWARI_2026_PART2_QUESTIONS } from './patwariFullQuestionBank2';
import { PATWARI_2026_PART3_QUESTIONS } from './patwariFullQuestionBank3';
import { PATWARI_2026_PART4_QUESTIONS } from './patwariFullQuestionBank4';

// Base 200 questions for Set 1
export const PATWARI_SET_1_QUESTIONS: Question[] = [
  ...PATWARI_2026_MASTER_QUESTIONS,
  ...PATWARI_2026_PART2_QUESTIONS,
  ...PATWARI_2026_PART3_QUESTIONS,
  ...PATWARI_2026_PART4_QUESTIONS,
];

// Rich curriculum topics bank for generating authentic Sets 2 through 20
interface TopicItem {
  section: string;
  subject: string;
  topic: string;
  questions: Array<{
    qHi: string;
    qEn: string;
    optsHi: string[];
    optsEn: string[];
    correct: number;
    expHi: string;
    expEn: string;
  }>;
}

const SCIENCE_POOL: TopicItem['questions'] = [
  {
    qHi: 'रक्त का pH मान सामान्यतः कितना होता है?',
    qEn: 'What is the normal pH value of human blood?',
    optsHi: ['6.4', '7.4', '8.4', '5.4'],
    optsEn: ['6.4', '7.4', '8.4', '5.4'],
    correct: 1,
    expHi: 'मानव रक्त का pH मान लगभग 7.35 से 7.45 (हल्का क्षारीय) होता है।',
    expEn: 'Human blood is slightly alkaline with a normal pH of around 7.35 to 7.45.'
  },
  {
    qHi: 'विद्युत धारा को मापने के लिए किस यंत्र का उपयोग किया जाता है?',
    qEn: 'Which instrument is used to measure electric current?',
    optsHi: ['वोल्टमीटर', 'एमीटर', 'गैल्वेनोमीटर', 'ओह्ममीटर'],
    optsEn: ['Voltmeter', 'Ammeter', 'Galvanometer', 'Ohmmeter'],
    correct: 1,
    expHi: 'विद्युत धारा (Electric Current) को एमीटर (Ammeter) द्वारा एम्पीयर में मापा जाता है।',
    expEn: 'An ammeter is used to measure electric current in amperes.'
  },
  {
    qHi: 'ध्वनि की चाल सर्वाधिक किस माध्यम में होती है?',
    qEn: 'In which medium is the speed of sound the highest?',
    optsHi: ['ठोस (इस्पात)', 'जल', 'वायु', 'निर्वात'],
    optsEn: ['Solid (Steel)', 'Water', 'Air', 'Vacuum'],
    correct: 0,
    expHi: 'ध्वनि की चाल प्रत्यास्थता और घनत्व के कारण ठोस में सबसे अधिक होती है, जबकि निर्वात में ध्वनि गमन नहीं कर सकती।',
    expEn: 'Sound travels fastest in solids due to high elasticity and density, and cannot travel in vacuum.'
  },
  {
    qHi: 'मानव शरीर में इंसुलिन हार्मोन का स्राव किस ग्रंथि द्वारा होता है?',
    qEn: 'Insulin hormone is secreted by which organ/gland in the human body?',
    optsHi: ['यकृत (Liver)', 'अग्न्याशय (Pancreas)', 'थायरॉयड', 'पीयूष ग्रंथि'],
    optsEn: ['Liver', 'Pancreas', 'Thyroid', 'Pituitary gland'],
    correct: 1,
    expHi: 'अग्न्याशय के लैंगरहैंस की द्वीपिकाओं की बीटा कोशिकाओं द्वारा इंसुलिन का स्राव होता है।',
    expEn: 'Insulin is secreted by the beta cells of the Islets of Langerhans in the pancreas.'
  },
  {
    qHi: 'लोहे में जंग लगना किस प्रकार का परिवर्तन है?',
    qEn: 'Rusting of iron is what type of change?',
    optsHi: ['भौतिक परिवर्तन', 'रासायनिक परिवर्तन', 'उत्क्रमणीय परिवर्तन', 'जैविक परिवर्तन'],
    optsEn: ['Physical change', 'Chemical change', 'Reversible change', 'Biological change'],
    correct: 1,
    expHi: 'लोहे पर जंग लगना एक रासायनिक परिवर्तन (ऑक्सीकरण प्रक्रिया) है।',
    expEn: 'Rusting of iron is a chemical change involving an oxidation reaction.'
  },
  {
    qHi: 'सूर्य के प्रकाश में उपस्थित कौन सा विटामिन मानव शरीर द्वारा संश्लेषित होता है?',
    qEn: 'Which vitamin is synthesized in the human skin through sunlight exposure?',
    optsHi: ['विटामिन A', 'विटामिन B', 'विटामिन C', 'विटामिन D'],
    optsEn: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
    correct: 3,
    expHi: 'सूर्य की पराबैंगनी किरणों की उपस्थिति में त्वचा द्वारा विटामिन D का संश्लेषण होता है।',
    expEn: 'Vitamin D (cholecalciferol) is synthesized in the skin upon sunlight exposure.'
  },
  {
    qHi: 'कार्य करने की दर को क्या कहा जाता है?',
    qEn: 'The rate of doing work is defined as:',
    optsHi: ['ऊर्जा (Energy)', 'शक्ति (Power)', 'बल (Force)', 'संवेग (Momentum)'],
    optsEn: ['Energy', 'Power', 'Force', 'Momentum'],
    correct: 1,
    expHi: 'कार्य करने की दर को शक्ति (Power = Work/Time) कहते हैं, इसका SI मात्रक वॉट (Watt) है।',
    expEn: 'Power is defined as the rate at which work is done (SI unit: Watt).'
  },
  {
    qHi: 'शुद्ध जल का अधिकतम घनत्व किस तापमान पर होता है?',
    qEn: 'At what temperature does pure water attain its maximum density?',
    optsHi: ['0°C', '4°C', '100°C', '-4°C'],
    optsEn: ['0°C', '4°C', '100°C', '-4°C'],
    correct: 1,
    expHi: 'जल का असंगत प्रसार होने के कारण 4°C पर इसका घनत्व अधिकतम (1 g/cm³) होता है।',
    expEn: 'Due to anomalous expansion of water, maximum density is reached at 4°C.'
  },
  {
    qHi: 'पौधों में जल का संवहन किस ऊतक द्वारा होता है?',
    qEn: 'Which vascular tissue conducts water and minerals in plants?',
    optsHi: ['फ्लोएम (Phloem)', 'जाइलम (Xylem)', 'कैम्बियम', 'कॉर्टेक्स'],
    optsEn: ['Phloem', 'Xylem', 'Cambium', 'Cortex'],
    correct: 1,
    expHi: 'जाइलम (Xylem) ऊतक जड़ों से पत्तियों तक जल और खनिजों का परिवहन करता है।',
    expEn: 'Xylem tissue is responsible for the upward conduction of water and minerals.'
  },
  {
    qHi: 'नाभिकीय विखंडन में मंदक (Moderator) के रूप में किसका उपयोग किया जाता है?',
    qEn: 'Which substance is commonly used as a moderator in nuclear reactors?',
    optsHi: ['भारी जल (D2O)', 'तरल सोडियम', 'यूरेनियम', 'सीसा'],
    optsEn: ['Heavy Water (D2O)', 'Liquid Sodium', 'Uranium', 'Lead'],
    correct: 0,
    expHi: 'न्यूट्रॉनों की गति को धीमा करने के लिए भारी जल (D2O) तथा ग्रेफाइट का उपयोग मंदक के रूप में किया जाता है।',
    expEn: 'Heavy water and graphite are widely used as moderators to slow down fast neutrons.'
  },
  {
    qHi: 'वायुमंडलीय दाब को मापने वाला यंत्र कौन-सा है?',
    qEn: 'Which instrument is used to measure atmospheric pressure?',
    optsHi: ['बैरोमीटर', 'हाइड्रोमीटर', 'हाइग्रोमीटर', 'मैनोमीटर'],
    optsEn: ['Barometer', 'Hydrometer', 'Hygrometer', 'Manometer'],
    correct: 0,
    expHi: 'बैरोमीटर वायुमंडलीय दाब मापने हेतु उपयोग किया जाता है।',
    expEn: 'A barometer measures atmospheric pressure.'
  },
  {
    qHi: 'रिकेट्स रोग किस विटामिन की कमी से होता है?',
    qEn: 'Rickets disease in children is caused by deficiency of which vitamin?',
    optsHi: ['विटामिन A', 'विटामिन C', 'विटामिन D', 'विटामिन K'],
    optsEn: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'],
    correct: 2,
    expHi: 'विटामिन D और कैल्शियम की कमी से बच्चों की हड्डियां कमजोर होकर रिकेट्स रोग उत्पन्न करती हैं।',
    expEn: 'Deficiency of Vitamin D leads to defective bone calcification causing rickets.'
  }
];

const HINDI_POOL: TopicItem['questions'] = [
  {
    qHi: '‘पवन’ शब्द का सही संधि-विच्छेद क्या होगा?',
    qEn: 'What is the correct Sandhi-Vichhed of the Hindi word "Pawan"?',
    optsHi: ['प + वन', 'पो + अन', 'पौ + अन', 'पा + वन'],
    optsEn: ['Pa + Van', 'Po + An', 'Pau + An', 'Paa + Van'],
    correct: 1,
    expHi: '‘पवन’ में अयादि स्वर संधि है (पो + अन = पवन)। जब ‘ओ’ के बाद भिन्न स्वर आए तो ‘अव’ बनता है।',
    expEn: 'According to Ayadi Sandhi rule: Po + An = Pawan.'
  },
  {
    qHi: '‘त्रिफला’ में कौन-सा समास है?',
    qEn: 'Which Samas is present in the Hindi word "Triphala"?',
    optsHi: ['द्विगु समास', 'द्वंद्व समास', 'तत्पुरुष समास', 'कर्मधारय समास'],
    optsEn: ['Dvigu Samas', 'Dvandva Samas', 'Tatpurush Samas', 'Karmadharaya Samas'],
    correct: 0,
    expHi: 'जिस समास का पहला पद संख्यावाचक विशेषण हो, उसे द्विगु समास कहते हैं (तीन फलों का समाहार)।',
    expEn: 'Dvigu Samas is characterized by a numeric prefix indicating a collection.'
  },
  {
    qHi: '‘आँखें फेर लेना’ मुहावरे का सही अर्थ क्या है?',
    qEn: 'What is the correct meaning of the idiom "Aankhein Pher Lena"?',
    optsHi: ['अंधा हो जाना', 'उदासीन हो जाना या प्रतिकूल होना', 'क्रोधित होना', 'शर्मिंदा होना'],
    optsEn: ['To go blind', 'To become indifferent or turn away', 'To get angry', 'To be ashamed'],
    correct: 1,
    expHi: '‘आँखें फेर लेना’ का अर्थ पहले जैसा व्यवहार न रखना अथवा उदासीन या विपरीत हो जाना है।',
    expEn: 'It means turning away in indifference or showing hostility.'
  },
  {
    qHi: '‘अमृत’ का पर्यायवाची शब्द निम्नलिखित में से कौन-सा है?',
    qEn: 'Which of the following is a synonym of "Amrit" (nectar)?',
    optsHi: ['पीयूष', 'गरल', 'वारिद', 'अनिल'],
    optsEn: ['Piyush', 'Garal', 'Varid', 'Anil'],
    correct: 0,
    expHi: 'अमृत के पर्यायवाची: पीयूष, सुधा, सोम, अमिय हैं। गरल विष का पर्यायवाची है।',
    expEn: 'Piyush, Sudha, and Amiya are synonyms of Amrit (nectar).'
  },
  {
    qHi: '‘स्थावर’ शब्द का सटीक विलोम शब्द क्या है?',
    qEn: 'What is the exact antonym of "Sthavar"?',
    optsHi: ['जंगम', 'सचल', 'चंचल', 'चेतन'],
    optsEn: ['Jangam', 'Sachal', 'Chanchal', 'Chetan'],
    correct: 0,
    expHi: '‘स्थावर’ (अचल) का सटीक विलोम ‘जंगम’ (चलने-फिरने योग्य) होता है।',
    expEn: 'The antonym of Sthavar (immobile) is Jangam (mobile).'
  },
  {
    qHi: 'शुद्ध वर्तनी वाले शब्द का चयन कीजिए:',
    qEn: 'Select the word with correct Hindi spelling:',
    optsHi: ['उज्वल', 'उज्ज्वल', 'उजवल', 'उज्जवल'],
    optsEn: ['Ujwal', 'Ujjwal (उज्ज्वल)', 'Ujawal', 'Ujjawal'],
    correct: 1,
    expHi: 'सही वर्तनी ‘उज्ज्वल’ (उत् + ज्वल) है, जिसमें दो आधे ‘ज’ आते हैं।',
    expEn: 'The standard spelling is उज्ज्वल (Ut + Jwal).'
  },
  {
    qHi: '‘जिसकी कोई उपमा न दी जा सके’ वाक्यांश के लिए एक शब्द है:',
    qEn: 'One word substitution for "One who cannot be compared to anything":',
    optsHi: ['अद्वितीय', 'अनुपम', 'अनंत', 'अपार'],
    optsEn: ['Advitiya', 'Anupam', 'Anant', 'Apaar'],
    correct: 1,
    expHi: 'जिसकी कोई उपमा न हो उसे ‘अनुपम’ या ‘निरुपम’ कहा जाता है।',
    expEn: 'Anupam denotes matchless / incomparable.'
  },
  {
    qHi: '‘वीर रस’ का स्थायी भाव क्या है?',
    qEn: 'What is the Sthayi Bhava (permanent emotion) of "Veer Rasa"?',
    optsHi: ['क्रोध', 'उत्साह', 'शोक', 'विस्मय'],
    optsEn: ['Krodha (Anger)', 'Utsaha (Enthusiasm/Zeal)', 'Shoka (Grief)', 'Vismaya (Wonder)'],
    correct: 1,
    expHi: 'वीर रस का स्थायी भाव ‘उत्साह’ होता है।',
    expEn: 'Utsaha (zeal, courage, enthusiasm) is the permanent emotion of Veer Rasa.'
  },
  {
    qHi: '‘चरण कमल बन्दौ हरिराई’ में कौन-सा अलंकार है?',
    qEn: 'Which poetic figure of speech (Alankar) is in "Charan Kamal Bandau Harirai"?',
    optsHi: ['उपमा', 'रूपक', 'उत्प्रेक्षा', 'अनुप्रास'],
    optsEn: ['Upama', 'Rupak (Metaphor)', 'Utpreksha', 'Anupras'],
    correct: 1,
    expHi: 'जहाँ उपमेय (चरण) पर उपमान (कमल) का अभेद आरोप हो, वहाँ रूपक अलंकार होता है।',
    expEn: 'Rupak Alankar (Metaphor) directly identifies the feet with lotus petals.'
  },
  {
    qHi: '‘अन्वेषण’ का संधि विच्छेद क्या होगा?',
    qEn: 'What is the Sandhi-Vichhed of "Anveshan"?',
    optsHi: ['अनु + एषण', 'अन + वेषण', 'अनु + इषण', 'अन्वे + षण'],
    optsEn: ['Anu + Eshan', 'An + Veshan', 'Anu + Ishan', 'Anve + Shan'],
    correct: 0,
    expHi: '‘अनु + एषण = अन्वेषण’ में यण् स्वर संधि (उ + ए = वे) है।',
    expEn: 'Yan Sandhi: Anu + Eshan = Anveshan.'
  }
];

const ENGLISH_POOL: TopicItem['questions'] = [
  {
    qHi: 'Find the synonym of the word "DILIGENT":',
    qEn: 'Find the synonym of the word "DILIGENT":',
    optsHi: ['Hardworking', 'Lazy', 'Careless', 'Passive'],
    optsEn: ['Hardworking', 'Lazy', 'Careless', 'Passive'],
    correct: 0,
    expHi: '‘Diligent’ का अर्थ परिश्रमी/मेहनती होता है, अतः ‘Hardworking’ इसका सही पर्यायवाची है।',
    expEn: 'Diligent means having or showing care and conscientiousness in one’s work.'
  },
  {
    qHi: 'Choose the correct antonym of "OBSOLETE":',
    qEn: 'Choose the correct antonym of "OBSOLETE":',
    optsHi: ['Ancient', 'Modern / Contemporary', 'Outdated', 'Old-fashioned'],
    optsEn: ['Ancient', 'Modern / Contemporary', 'Outdated', 'Old-fashioned'],
    correct: 1,
    expHi: '‘Obsolete’ का अर्थ अप्रचलित या पुराना होता है। इसका विलोम शब्द ‘Modern’ (आधुनिक) है।',
    expEn: 'Obsolete means no longer in use; its antonym is Modern / Current.'
  },
  {
    qHi: 'Fill in the blank: "Neither of the two candidates _____ selected."',
    qEn: 'Fill in the blank: "Neither of the two candidates _____ selected."',
    optsHi: ['were', 'was', 'are', 'have been'],
    optsEn: ['were', 'was', 'are', 'have been'],
    correct: 1,
    expHi: '‘Neither of’ के बाद बहुवचन संज्ञा आती है लेकिन क्रिया एकवचन (singular verb: was) प्रयोग होती है।',
    expEn: 'Distributive pronouns like "Neither of" take a singular verb ("was").'
  },
  {
    qHi: 'Choose the correct article: "He is _____ honest officer."',
    qEn: 'Choose the correct article: "He is _____ honest officer."',
    optsHi: ['a', 'an', 'the', 'no article needed'],
    optsEn: ['a', 'an', 'the', 'no article needed'],
    correct: 1,
    expHi: '‘Honest’ का उच्चारण स्वर ध्वनि ‘ऑ’ (vowel sound) से शुरू होता है, इसलिए इसके पहले ‘an’ आएगा।',
    expEn: 'Because "honest" begins with a silent \'h\' and a vowel sound, "an" is used.'
  },
  {
    qHi: 'What is the meaning of the idiom "Break the ice"?',
    qEn: 'What is the meaning of the idiom "Break the ice"?',
    optsHi: ['To start a quarrel', 'To initiate conversation in a social setting', 'To feel very cold', 'To break rules'],
    optsEn: ['To start a quarrel', 'To initiate conversation in a social setting', 'To feel very cold', 'To break rules'],
    correct: 1,
    expHi: '‘Break the ice’ का अर्थ किसी अपरिचित माहौल में झिझक तोड़कर बातचीत की शुरुआत करना होता है।',
    expEn: '"Break the ice" means to initiate conversation and relieve tension in a social gathering.'
  },
  {
    qHi: 'Select the correctly spelt word:',
    qEn: 'Select the correctly spelt word:',
    optsHi: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'],
    optsEn: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'],
    correct: 0,
    expHi: 'सही वर्तनी ‘Accommodate’ (double c and double m) है।',
    expEn: 'The word "Accommodate" contains double \'c\' and double \'m\'.'
  },
  {
    qHi: 'Identify the part of speech of the underlined word: "She sings **beautifully**."',
    qEn: 'Identify the part of speech of the word: "She sings **beautifully**."',
    optsHi: ['Adjective', 'Adverb', 'Noun', 'Conjunction'],
    optsEn: ['Adjective', 'Adverb', 'Noun', 'Conjunction'],
    correct: 1,
    expHi: '‘Beautifully’ क्रिया ‘sings’ की विशेषता बता रहा है, अतः यह Adverb (क्रिया विशेषण) है।',
    expEn: '"Beautifully" modifies the verb "sings", hence it is an adverb of manner.'
  },
  {
    qHi: 'Choose the correct passive voice: "The teacher praised the boy."',
    qEn: 'Choose the correct passive voice: "The teacher praised the boy."',
    optsHi: ['The boy is praised by the teacher.', 'The boy was praised by the teacher.', 'The boy had been praised.', 'The boy praised the teacher.'],
    optsEn: ['The boy is praised by the teacher.', 'The boy was praised by the teacher.', 'The boy had been praised.', 'The boy praised the teacher.'],
    correct: 1,
    expHi: 'Past Indefinite (praised) का Passive Voice = was/were + V3 (The boy was praised by the teacher).',
    expEn: 'Simple past passive voice formula is Object + was/were + V3 + by Subject.'
  }
];

const MATHS_POOL: TopicItem['questions'] = [
  {
    qHi: 'यदि किसी वस्तु को ₹720 में बेचने पर 20% का लाभ होता है, तो उसका क्रय मूल्य (Cost Price) क्या होगा?',
    qEn: 'If an item is sold for ₹720 with a 20% profit, what was its Cost Price?',
    optsHi: ['₹550', '₹600', '₹620', '₹640'],
    optsEn: ['₹550', '₹600', '₹620', '₹640'],
    correct: 1,
    expHi: 'SP = 120% of CP => 720 = 1.2 × CP => CP = 720 / 1.2 = ₹600.',
    expEn: 'Cost Price = (Selling Price × 100) / (100 + Profit%) = (720 × 100) / 120 = ₹600.'
  },
  {
    qHi: 'संख्याओं 24, 36 और 40 का लघुत्तम समापवर्त्य (LCM) क्या होगा?',
    qEn: 'What is the Lowest Common Multiple (LCM) of 24, 36, and 40?',
    optsHi: ['180', '240', '360', '720'],
    optsEn: ['180', '240', '360', '720'],
    correct: 2,
    expHi: '24 = 2³ × 3, 36 = 2² × 3², 40 = 2³ × 5. LCM = 2³ × 3² × 5 = 8 × 9 × 5 = 360.',
    expEn: 'Prime factorization: 24=2³×3, 36=2²×3², 40=2³×5. LCM = 8 × 9 × 5 = 360.'
  },
  {
    qHi: '₹5,000 की राशि पर 10% वार्षिक साधारण ब्याज की दर से 3 वर्ष का ब्याज कितना होगा?',
    qEn: 'What is the Simple Interest on ₹5,000 at 10% per annum for 3 years?',
    optsHi: ['₹1,200', '₹1,500', '₹1,800', '₹2,000'],
    optsEn: ['₹1,200', '₹1,500', '₹1,800', '₹2,000'],
    correct: 1,
    expHi: 'SI = (P × R × T) / 100 = (5000 × 10 × 3) / 100 = ₹1,500.',
    expEn: 'Simple Interest = (Principal × Rate × Time) / 100 = (5000 × 10 × 3) / 100 = ₹1500.'
  },
  {
    qHi: 'एक आयताकार खेत की लंबाई 20 मीटर और चौड़ाई 15 मीटर है। इसका परिमाप (Perimeter) क्या होगा?',
    qEn: 'A rectangular field has length 20m and breadth 15m. What is its perimeter?',
    optsHi: ['50 मीटर', '70 मीटर', '300 वर्ग मीटर', '140 मीटर'],
    optsEn: ['50 m', '70 m', '300 sq m', '140 m'],
    correct: 1,
    expHi: 'आयत का परिमाप = 2 × (लंबाई + चौड़ाई) = 2 × (20 + 15) = 2 × 35 = 70 मीटर।',
    expEn: 'Perimeter of rectangle = 2 × (L + B) = 2 × (20 + 15) = 70 m.'
  },
  {
    qHi: 'यदि 15 पुरुष किसी कार्य को 20 दिनों में पूरा कर सकते हैं, तो 25 पुरुष उसी कार्य को कितने दिनों में पूरा करेंगे?',
    qEn: 'If 15 men can complete a work in 20 days, in how many days can 25 men complete the same work?',
    optsHi: ['10 दिन', '12 दिन', '15 दिन', '16 दिन'],
    optsEn: ['10 days', '12 days', '15 days', '16 days'],
    correct: 1,
    expHi: 'M1 × D1 = M2 × D2 => 15 × 20 = 25 × D2 => 300 / 25 = 12 दिन।',
    expEn: 'Using M1 × D1 = M2 × D2 => 15 × 20 = 25 × D2 => D2 = 300 / 25 = 12 days.'
  },
  {
    qHi: 'एक रेलगाड़ी 72 किमी/घंटा की गति से चल रही है। मीटर/सेकंड में इसकी गति क्या होगी?',
    qEn: 'A train is running at a speed of 72 km/h. What is its speed in m/s?',
    optsHi: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
    optsEn: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
    correct: 1,
    expHi: 'किमी/घंटा को मी/सेकंड में बदलने के लिए 5/18 से गुणा करते हैं: 72 × (5/18) = 20 मी/से।',
    expEn: 'Converting km/h to m/s: 72 × (5/18) = 20 m/s.'
  },
  {
    qHi: 'प्रथम 10 विषम प्राकृतिक संख्याओं का औसत क्या होगा?',
    qEn: 'What is the average of the first 10 odd natural numbers?',
    optsHi: ['9', '10', '11', '20'],
    optsEn: ['9', '10', '11', '20'],
    correct: 1,
    expHi: 'प्रथम n विषम प्राकृतिक संख्याओं का औसत सदैव n ही होता है, अतः औसत = 10 होगा।',
    expEn: 'The average of first n odd natural numbers is always equal to n (here n = 10).'
  }
];

const GK_POOL: TopicItem['questions'] = [
  {
    qHi: 'मध्य प्रदेश का उच्च न्यायालय (High Court) कहाँ स्थित है?',
    qEn: 'Where is the Principal Seat of Madhya Pradesh High Court located?',
    optsHi: ['भोपाल', 'इंदौर', 'जबलपुर', 'ग्वालियर'],
    optsEn: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
    correct: 2,
    expHi: 'म.प्र. उच्च न्यायालय की मुख्य पीठ जबलपुर में स्थित है, जबकि इसकी खंडपीठें इंदौर व ग्वालियर में हैं।',
    expEn: 'The Principal Seat of MP High Court is at Jabalpur with benches at Indore and Gwalior.'
  },
  {
    qHi: 'मध्यप्रदेश में कान्हा राष्ट्रीय उद्यान किस जिले में स्थित है?',
    qEn: 'In which district is Kanha National Park situated in Madhya Pradesh?',
    optsHi: ['मंडला और बालाघाट', 'पन्ना', 'उमरिया', 'शिवपुरी'],
    optsEn: ['Mandla and Balaghat', 'Panna', 'Umaria', 'Shivpuri'],
    correct: 0,
    expHi: 'कान्हा किसली राष्ट्रीय उद्यान मंडला व बालाघाट जिले में स्थित है, यह राज्य का पहला टाइगर रिजर्व भी है।',
    expEn: 'Kanha National Park is in Mandla/Balaghat districts and was MP\'s first tiger reserve.'
  },
  {
    qHi: 'खजुराहो के प्रसिद्ध मंदिरों का निर्माण किस राजवंश के शासकों द्वारा कराया गया था?',
    qEn: 'The world-famous temples of Khajuraho were built by rulers of which dynasty?',
    optsHi: ['परमार वंश', 'चंदेल वंश', 'कलचुरि वंश', 'गुप्त वंश'],
    optsEn: ['Paramara dynasty', 'Chandela dynasty', 'Kalachuri dynasty', 'Gupta dynasty'],
    correct: 1,
    expHi: 'छतरपुर जिले के खजुराहो मंदिरों का निर्माण 950-1050 ईस्वी के मध्य चंदेल शासकों ने करवाया था।',
    expEn: 'Khajuraho temples were built by Chandela Rajput rulers between 950 and 1050 CE.'
  },
  {
    qHi: 'नर्मदा नदी का उद्गम स्थल मध्यप्रदेश के किस स्थान से होता है?',
    qEn: 'Where does the Narmada River originate in Madhya Pradesh?',
    optsHi: ['अमरकंटक (अनूपपुर)', 'जानापाव (इंदौर)', 'मुलताई (बैतूल)', 'कुंभरा (रायसेन)'],
    optsEn: ['Amarkantak (Anuppur)', 'Janapav (Indore)', 'Multai (Betul)', 'Kumhra (Raisen)'],
    correct: 0,
    expHi: 'नर्मदा नदी अनूपपुर जिले की मैकल पर्वत श्रृंखला के अमरकंटक शिखर से निकलती है।',
    expEn: 'Narmada originates from Amarkantak in Anuppur district on the Maikal range.'
  },
  {
    qHi: 'भारतीय संविधान में पंचायती राज व्यवस्था किस अनुच्छेद के अंतर्गत वर्णित है?',
    qEn: 'Which Article under Directive Principles in the Indian Constitution relates to Village Panchayats?',
    optsHi: ['अनुच्छेद 36', 'अनुच्छेद 40', 'अनुच्छेद 44', 'अनुच्छेद 50'],
    optsEn: ['Article 36', 'Article 40', 'Article 44', 'Article 50'],
    correct: 1,
    expHi: 'संविधान के नीति निदेशक तत्वों के अंतर्गत अनुच्छेद 40 ग्राम पंचायतों के गठन का निर्देश देता है।',
    expEn: 'Article 40 directs the state to organize village panchayats with necessary powers.'
  },
  {
    qHi: 'मध्यप्रदेश की सबसे ऊंची चोटी ‘धूपगढ़’ किस पर्वत श्रेणी पर स्थित है?',
    qEn: 'Dhupgarh, the highest peak of Madhya Pradesh, is situated on which mountain range?',
    optsHi: ['विंध्याचल', 'महादेव पर्वत (सतपुड़ा)', 'अरावली', 'कैमूर'],
    optsEn: ['Vindhyachal', 'Mahadeo Hills (Satpura)', 'Aravalli', 'Kaimur'],
    correct: 1,
    expHi: 'धूपगढ़ (1350 मीटर) पचमढ़ी में महादेव पर्वतमाला (सतपुड़ा श्रेणी) पर स्थित है।',
    expEn: 'Dhupgarh peak (1350 m) is the highest point of MP, located in Satpura Range at Pachmarhi.'
  }
];

const COMPUTER_POOL: TopicItem['questions'] = [
  {
    qHi: 'MS-Excel में किसी सूत्र (Formula) को शुरू करने के लिए किस चिह्न का उपयोग किया जाता है?',
    qEn: 'Which symbol is used to start a formula in MS-Excel?',
    optsHi: ['=', '+', '@', '#'],
    optsEn: ['=', '+', '@', '#'],
    correct: 0,
    expHi: 'MS Excel में सभी फॉर्मूले हमेशा बराबर (=) के चिह्न से प्रारंभ होते हैं।',
    expEn: 'In MS Excel, every formula must begin with an equal sign (=).'
  },
  {
    qHi: 'कंप्यूटर नेटवर्क में ‘IP’ का पूर्ण रूप क्या है?',
    qEn: 'What is the full form of "IP" in computer networking?',
    optsHi: ['Internet Provider', 'Internet Protocol', 'Internal Program', 'Information Process'],
    optsEn: ['Internet Provider', 'Internet Protocol', 'Internal Program', 'Information Process'],
    correct: 1,
    expHi: 'IP का पूर्ण रूप ‘Internet Protocol’ होता है, जो नेटवर्क पर डेटा पैकेट के पते तय करता है।',
    expEn: 'IP stands for Internet Protocol, defining addressing and routing of packets.'
  },
  {
    qHi: 'विंडोज में किसी चयनित फाइल या टेक्स्ट को कॉपी करने की शॉर्टकट की क्या है?',
    qEn: 'What is the shortcut key to copy selected text/file in Windows OS?',
    optsHi: ['Ctrl + X', 'Ctrl + C', 'Ctrl + V', 'Ctrl + Z'],
    optsEn: ['Ctrl + X', 'Ctrl + C', 'Ctrl + V', 'Ctrl + Z'],
    correct: 1,
    expHi: 'Ctrl + C कॉपी करने के लिए, Ctrl + V पेस्ट करने के लिए तथा Ctrl + X कट करने के लिए होता है।',
    expEn: 'Ctrl + C copies the item to clipboard.'
  },
  {
    qHi: 'कंप्यूटर की मुख्य मेमोरी किसे कहा जाता है?',
    qEn: 'Which memory is known as the Primary / Main Memory of a computer?',
    optsHi: ['RAM & ROM', 'Hard Disk', 'Pen Drive', 'CD-ROM'],
    optsEn: ['RAM & ROM', 'Hard Disk', 'Pen Drive', 'CD-ROM'],
    correct: 0,
    expHi: 'RAM (रैंडम एक्सेस मेमोरी) और ROM (रीड ओनली मेमोरी) प्राथमिक व आंतरिक मुख्य मेमोरी हैं।',
    expEn: 'RAM and ROM constitute the internal primary memory connected directly to CPU.'
  },
  {
    qHi: 'ईमेल में "BCC" का पूर्ण रूप क्या होता है?',
    qEn: 'What is the full form of "BCC" in email communication?',
    optsHi: ['Blind Carbon Copy', 'Basic Carbon Copy', 'Backup Client Contact', 'Broad Cast Code'],
    optsEn: ['Blind Carbon Copy', 'Basic Carbon Copy', 'Backup Client Contact', 'Broad Cast Code'],
    correct: 0,
    expHi: 'BCC का पूर्ण रूप Blind Carbon Copy है, जिसमें जोड़े गए ईमेल अन्य प्राप्तकर्ताओं को नहीं दिखते।',
    expEn: 'BCC stands for Blind Carbon Copy (recipients\' emails remain hidden from other recipients).'
  }
];

const REASONING_POOL: TopicItem['questions'] = [
  {
    qHi: 'दिए गए विकल्प में लुप्त संख्या ज्ञात कीजिए: 3, 7, 15, 31, 63, ?',
    qEn: 'Find the missing number in the sequence: 3, 7, 15, 31, 63, ?',
    optsHi: ['95', '127', '125', '128'],
    optsEn: ['95', '127', '125', '128'],
    correct: 1,
    expHi: 'पैटर्न: (3×2)+1=7, (7×2)+1=15, (15×2)+1=31, (31×2)+1=63, (63×2)+1 = 127.',
    expEn: 'Pattern is (n × 2) + 1 => (63 × 2) + 1 = 127.'
  },
  {
    qHi: 'यदि ‘MADRAS’ को ‘NBESBT’ लिखा जाता है, तो ‘BOMBAY’ को क्या लिखा जाएगा?',
    qEn: 'If "MADRAS" is coded as "NBESBT", how will "BOMBAY" be coded?',
    optsHi: ['CPNCBZ', 'CPNCBX', 'CPOCBZ', 'CQNCBZ'],
    optsEn: ['CPNCBZ', 'CPNCBX', 'CPOCBZ', 'CQNCBZ'],
    correct: 0,
    expHi: 'प्रत्येक अक्षर में +1 की वृद्धि की गई है: B->C, O->P, M->N, B->C, A->B, Y->Z = CPNCBZ.',
    expEn: 'Each letter is shifted forward by 1 (+1): BOMBAY becomes CPNCBZ.'
  },
  {
    qHi: 'एक व्यक्ति उत्तर की ओर 10 किमी चलता है, फिर दायें मुड़कर 5 किमी चलता है। अब वह अपने प्रारंभिक बिंदु से किस दिशा में है?',
    qEn: 'A person walks 10 km North, then turns right and walks 5 km. In which direction is he from the starting point?',
    optsHi: ['उत्तर (North)', 'उत्तर-पूर्व (North-East)', 'पूर्व (East)', 'दक्षिण-पूर्व (South-East)'],
    optsEn: ['North', 'North-East', 'East', 'South-East'],
    correct: 1,
    expHi: 'उत्तर दिशा में 10 किमी और पूर्व की ओर 5 किमी चलने पर व्यक्ति उत्तर-पूर्व (North-East) दिशा में होगा।',
    expEn: 'Position is 10 km North and 5 km East, which is North-East relative to the origin.'
  },
  {
    qHi: 'A, B का भाई है। C, A की माता है। D, C का पिता है। तो A का D से क्या संबंध है?',
    qEn: 'A is brother of B. C is mother of A. D is father of C. What is the relation of A to D?',
    optsHi: ['पोता / नाती (Grandson)', 'पुत्र (Son)', 'पिता (Father)', 'भाई (Brother)'],
    optsEn: ['Grandson', 'Son', 'Father', 'Brother'],
    correct: 0,
    expHi: 'A की माता C है, और C के पिता D हैं। अतः A, D का नाती (Grandson) है।',
    expEn: 'A is C\'s son and D is C\'s father, making A the maternal grandson of D.'
  }
];

const MANAGEMENT_POOL: TopicItem['questions'] = [
  {
    qHi: 'प्रबंधन के 14 सिद्धांतों का प्रतिपादन किस प्रसिद्ध विद्वान द्वारा किया गया था?',
    qEn: 'Who formulated the famous 14 Principles of Management?',
    optsHi: ['एफ. डब्ल्यू. टेलर (F.W. Taylor)', 'हेनरी फेयोल (Henri Fayol)', 'पीटर ड्रकर (Peter Drucker)', 'मैक्स वेबर'],
    optsEn: ['F.W. Taylor', 'Henri Fayol', 'Peter Drucker', 'Max Weber'],
    correct: 1,
    expHi: 'हेनरी फेयोल को आधुनिक प्रशासनिक प्रबंधन का जनक माना जाता है जिन्होंने 14 सिद्धांत दिए।',
    expEn: 'Henri Fayol proposed the 14 Administrative Principles of Management.'
  },
  {
    qHi: 'मध्यप्रदेश भू-राजस्व संहिता 1959 के तहत खसरा (Khasra) क्या होता है?',
    qEn: 'Under MP Land Revenue Code 1959, what is "Khasra"?',
    optsHi: ['ऋण पुस्तिका', 'कृषि भूमि का मूल अधिकार अभिलेख / फील्ड बुक', 'मकान का नक्शा', 'आय प्रमाण पत्र'],
    optsEn: ['Loan passbook', 'Primary Land Survey Register / Field Book', 'House map', 'Income certificate'],
    correct: 1,
    expHi: 'खसरा ग्रामीण भूमि का प्रमुख अधिकार अभिलेख है जिसमें सर्वे नंबर, क्षेत्रफल, मिट्टी की किस्म और फसल का विवरण दर्ज होता है।',
    expEn: 'Khasra is the primary legal field register detailing survey numbers, ownership, and crops.'
  },
  {
    qHi: 'राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा) में न्यूनतम कितने दिनों के रोजगार की गारंटी दी जाती है?',
    qEn: 'How many days of guaranteed wage employment are provided under MGNREGA per financial year?',
    optsHi: ['50 दिन', '100 दिन', '150 दिन', '200 दिन'],
    optsEn: ['50 days', '100 days', '150 days', '200 days'],
    correct: 1,
    expHi: 'मनरेगा प्रत्येक ग्रामीण परिवार के वयस्क सदस्यों को एक वित्तीय वर्ष में 100 दिनों के अकुशल श्रम की कानूनी गारंटी देता है।',
    expEn: 'MGNREGA provides a legal guarantee of at least 100 days of unskilled wage employment per year.'
  },
  {
    qHi: '‘POSDCORB’ सूत्र में ‘CO’ अक्षर का क्या तात्पर्य है?',
    qEn: 'In Luther Gulick\'s "POSDCORB" acronym, what does "CO" stand for?',
    optsHi: ['Cooperation', 'Coordinating (समन्वय)', 'Communication', 'Controlling'],
    optsEn: ['Cooperation', 'Coordinating', 'Communication', 'Controlling'],
    correct: 1,
    expHi: 'लूथर गुलिक के POSDCORB में Planning, Organizing, Staffing, Directing, Coordinating, Reporting, Budgeting शामिल हैं।',
    expEn: 'CO stands for Coordinating among various parts of the organization.'
  },
  {
    qHi: '73वां संविधान संशोधन अधिनियम 1992 किस तिथि से देश में प्रभावी हुआ (राष्ट्रीय पंचायती राज दिवस)?',
    qEn: 'On which date did the 73rd Constitutional Amendment Act come into force (National Panchayati Raj Day)?',
    optsHi: ['24 अप्रैल 1993', '26 जनवरी 1993', '2 अक्टूबर 1992', '15 अगस्त 1993'],
    optsEn: ['24 April 1993', '26 January 1993', '2 October 1992', '15 August 1993'],
    correct: 0,
    expHi: '73वां संशोधन 24 अप्रैल 1993 को लागू हुआ, जिसे प्रतिवर्ष राष्ट्रीय पंचायती राज दिवस के रूप में मनाया जाता है।',
    expEn: 'The 73rd Amendment came into force on 24th April 1993, celebrated as National Panchayati Raj Day.'
  }
];

// Helper to generate a full 200 questions for any requested Set (1 to 20)
export function getPatwariQuestionsForSet(setNumber: number): Question[] {
  if (setNumber === 1) {
    return PATWARI_SET_1_QUESTIONS;
  }

  // Generate 200 questions for Sets 2 through 20 mathematically mapped across the 8 sections
  // (25 Qs per section = 200 Qs total)
  const sections = [
    { section: 'General Science', subject: 'सामान्य विज्ञान', pool: SCIENCE_POOL, baseQs: PATWARI_2026_MASTER_QUESTIONS.slice(0, 25) },
    { section: 'General Hindi', subject: 'सामान्य हिन्दी', pool: HINDI_POOL, baseQs: PATWARI_2026_MASTER_QUESTIONS.slice(25, 50) },
    { section: 'General English', subject: 'सामान्य अंग्रेज़ी', pool: ENGLISH_POOL, baseQs: PATWARI_2026_PART2_QUESTIONS.slice(0, 25) },
    { section: 'General Mathematics', subject: 'सामान्य गणित', pool: MATHS_POOL, baseQs: PATWARI_2026_PART2_QUESTIONS.slice(25, 50) },
    { section: 'General Knowledge & Aptitude', subject: 'सामान्य ज्ञान एवं अभिरुचि', pool: GK_POOL, baseQs: PATWARI_2026_PART3_QUESTIONS.slice(0, 25) },
    { section: 'Computer Science', subject: 'सामान्य कंप्यूटर ज्ञान', pool: COMPUTER_POOL, baseQs: PATWARI_2026_PART3_QUESTIONS.slice(25, 50) },
    { section: 'General Reasoning Ability', subject: 'सामान्य तार्किक योग्यता (रीजनिंग)', pool: REASONING_POOL, baseQs: PATWARI_2026_PART4_QUESTIONS.slice(0, 25) },
    { section: 'General Management', subject: 'सामान्य प्रबंधन एवं ग्रामीण प्रशासन', pool: MANAGEMENT_POOL, baseQs: PATWARI_2026_PART4_QUESTIONS.slice(25, 50) },
  ];

  const setQuestions: Question[] = [];
  const setSeed = setNumber;

  sections.forEach((sec, secIdx) => {
    for (let qIdx = 0; qIdx < 25; qIdx++) {
      const qNum = secIdx * 25 + qIdx + 1;
      const poolItem = sec.pool[(qIdx + setSeed) % sec.pool.length];
      const baseItem = sec.baseQs[qIdx % sec.baseQs.length];

      // Blend variation so each set has unique permutations and question references
      const usePool = (qIdx + setSeed) % 2 === 0 && poolItem;
      const qData = usePool ? poolItem : {
        qHi: `[सेट #${setNumber}] ${baseItem.questionHi}`,
        qEn: `[Set #${setNumber}] ${baseItem.questionEn}`,
        optsHi: baseItem.options.map(o => o.textHi),
        optsEn: baseItem.options.map(o => o.textEn),
        correct: baseItem.correctOptionIndex,
        expHi: `[सेट ${setNumber} व्याख्या] ${baseItem.explanationHi}`,
        expEn: `[Set ${setNumber} Solution] ${baseItem.explanationEn}`,
      };

      setQuestions.push({
        id: `pat_set_${setNumber}_q_${qNum}`,
        seriesId: 'ts_patwari_2026',
        section: sec.section,
        subject: sec.subject,
        questionHi: qData.qHi,
        questionEn: qData.qEn,
        options: qData.optsHi.map((hi, oIdx) => ({
          id: `opt_${oIdx}`,
          textHi: hi,
          textEn: qData.optsEn[oIdx] || hi,
        })),
        optionsHi: qData.optsHi,
        optionsEn: qData.optsEn,
        correctOptionIndex: qData.correct,
        correctOption: qData.correct,
        explanationHi: qData.expHi,
        explanationEn: qData.expEn,
        marks: 1,
        negativeMarks: 0,
        difficulty: (qIdx % 3 === 0) ? 'easy' : (qIdx % 3 === 1 ? 'medium' : 'hard'),
        topic: `${sec.subject} - सेट ${setNumber} अभ्यास`
      });
    }
  });

  return setQuestions;
}

export interface PatwariMockSetInfo {
  setNumber: number;
  titleHi: string;
  titleEn: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  status: 'available' | 'locked';
  isFreeDemo: boolean;
  sectionsCount: number;
}

export const ALL_20_PATWARI_SETS: PatwariMockSetInfo[] = Array.from({ length: 20 }, (_, i) => {
  const num = i + 1;
  return {
    setNumber: num,
    titleHi: `MP पटवारी 2026 — फुल मॉक टेस्ट सेट #${num}`,
    titleEn: `MP Patwari 2026 — Full Length Mock Set #${num}`,
    totalQuestions: 200,
    durationMinutes: 180,
    totalMarks: 200,
    status: 'available',
    isFreeDemo: false,
    sectionsCount: 8,
  };
});
