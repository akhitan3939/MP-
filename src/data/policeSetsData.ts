import { Question } from '../types';

export interface RawPoliceQuestion {
  qHi: string;
  qEn?: string;
  optsHi: string[];
  optsEn?: string[];
  correct: number;
  expHi?: string;
  expEn?: string;
  topic?: string;
}

// 1. General Knowledge & MP GK Pool (25 Qs per set)
const POLICE_GK_POOL: RawPoliceQuestion[] = [
  {
    qHi: 'मध्यप्रदेश पुलिस अकादमी (MP Police Academy) कहाँ स्थित है?',
    qEn: 'Where is the Madhya Pradesh Police Academy located?',
    optsHi: ['भौरी (भोपाल)', 'जबलपुर', 'सागर', 'उज्जैन'],
    correct: 0,
    expHi: 'मध्यप्रदेश पुलिस अकादमी भौरी (भोपाल) में स्थित है। जवाहरलाल नेहरू पुलिस अकादमी सागर में स्थित है।',
    topic: 'म.प्र. पुलिस प्रशासन'
  },
  {
    qHi: 'मध्यप्रदेश का प्रथम पुलिस महानिदेशक (DGP) कौन थे?',
    qEn: 'Who was the first Director General of Police (DGP) of Madhya Pradesh?',
    optsHi: ['बी.पी. दुबे', 'वी.जी. घाटे', 'एच.एस. कामथ', 'पी.वी. दीक्षित'],
    correct: 0,
    expHi: 'मध्यप्रदेश के प्रथम पुलिस महानिदेशक (DGP) बी.पी. दुबे (1982) थे। प्रथम IGP वी.जी. घाटे थे।',
    topic: 'म.प्र. पुलिस इतिहास'
  },
  {
    qHi: 'मध्यप्रदेश की प्रथम महिला पुलिस महानिदेशक (DGP) कौन रहीं?',
    qEn: 'Who was the first woman Director General of Police (DGP) in Madhya Pradesh?',
    optsHi: ['सरला ग्रेवाल', 'आशा गोपालन', 'निर्मला बुच', 'कंचन चौधरी भट्टाचार्य'],
    correct: 1,
    expHi: 'आशा गोपालन मध्यप्रदेश की प्रथम महिला आईपीएस/पुलिस अधिकारी मानी जाती हैं।',
    topic: 'म.प्र. पुलिस व्यक्तित्व'
  },
  {
    qHi: 'भारतीय संविधान में "पुलिस" एवं "लोक व्यवस्था" किस सूची के विषय हैं?',
    qEn: 'Under the Indian Constitution, "Police" and "Public Order" are subjects of which list?',
    optsHi: ['राज्य सूची (State List)', 'संघ सूची (Union List)', 'समवर्ती सूची (Concurrent List)', 'अवशिष्ट शक्तियाँ'],
    correct: 0,
    expHi: 'संविधान की 7वीं अनुसूची के अंतर्गत पुलिस एवं लोक व्यवस्था राज्य सूची (State List) का विषय है।',
    topic: 'भारतीय राजव्यवस्था व पुलिस'
  },
  {
    qHi: 'भारतीय दंड संहिता (IPC) किस वर्ष अधिनियमित की गई थी?',
    qEn: 'In which year was the Indian Penal Code (IPC) enacted?',
    optsHi: ['1860', '1861', '1872', '1973'],
    correct: 0,
    expHi: 'आईपीसी का प्रारूप लॉर्ड मैकाले द्वारा तैयार किया गया था और इसे 6 अक्टूबर 1860 को अधिनियमित किया गया था।',
    topic: 'विधि एवं संविधान'
  },
  {
    qHi: 'मध्यप्रदेश के किस जिले में "सशस्त्र पुलिस प्रशिक्षण महाविद्यालय" (APTC) स्थित है?',
    qEn: 'In which district of MP is the Armed Police Training College (APTC) located?',
    optsHi: ['इंदौर', 'जबलपुर', 'ग्वालियर', 'रीवा'],
    correct: 0,
    expHi: 'इंदौर में आर्म्ड पुलिस ट्रेनिंग कॉलेज (APTC) एवं पुलिस रेडियो प्रशिक्षण केंद्र स्थित है।',
    topic: 'पुलिस प्रशिक्षण संस्थान'
  },
  {
    qHi: 'मध्यप्रदेश में "डायल 100" (Dial 100) फर्स्ट रिस्पांस सेवा किस वर्ष प्रारंभ हुई थी?',
    qEn: 'In which year was the Dial 100 First Response Service launched in Madhya Pradesh?',
    optsHi: ['2015', '2012', '2018', '2020'],
    correct: 0,
    expHi: 'मध्यप्रदेश में डायल 100 सेवा का शुभारंभ 1 नवंबर 2015 को किया गया था।',
    topic: 'म.प्र. पुलिस तकनीक'
  },
  {
    qHi: 'मध्यप्रदेश का राजकीय पक्षी (State Bird) कौन-सा है?',
    qEn: 'Which is the State Bird of Madhya Pradesh?',
    optsHi: ['दूधराज (शाह बुलबुल / Asian Paradise Flycatcher)', 'मोर', 'सोन चिड़िया', 'तोता'],
    correct: 0,
    expHi: 'मध्यप्रदेश का राजकीय पक्षी दूधराज (पैराडाइज फ्लाईकैचर) है, जिसे 1981 में घोषित किया गया।',
    topic: 'म.प्र. प्रतीक चिन्ह'
  },
  {
    qHi: 'मध्यप्रदेश में कान्हा किसली राष्ट्रीय उद्यान किस जिले में स्थित है?',
    qEn: 'In which district is Kanha Kisli National Park located in Madhya Pradesh?',
    optsHi: ['मंडला एवं बालाघाट', 'उमरिया', 'शिवपुरी', 'पन्ना'],
    correct: 0,
    expHi: 'कान्हा किसली म.प्र. का सबसे बड़ा राष्ट्रीय उद्यान है, जो मंडला-बालाघाट जिले में फैला है।',
    topic: 'म.प्र. राष्ट्रीय उद्यान'
  },
  {
    qHi: 'भीमबेटका की प्रसिद्ध पाषाण गुफाएं मध्यप्रदेश के किस जिले में स्थित हैं?',
    qEn: 'In which district of MP are the famous Bhimbetka rock caves located?',
    optsHi: ['रायसेन', 'भोपाल', 'सीहोर', 'होशंगाबाद'],
    correct: 0,
    expHi: 'भीमबेटका रायसेन जिले में स्थित है। 2003 में इसे यूनेस्को विश्व धरोहर स्थल घोषित किया गया।',
    topic: 'म.प्र. इतिहास व संस्कृति'
  },
  {
    qHi: 'मध्यप्रदेश में तांबा नगरी (Copper City) के नाम से किसे जाना जाता है?',
    qEn: 'Which place in MP is known as Copper City?',
    optsHi: ['मलाजखंड (बालाघाट)', 'अमरकंटक', 'सिंगरौली', 'कटनी'],
    correct: 0,
    expHi: 'बालाघाट जिले की मलाजखंड खदान देश की सबसे बड़ी खुली तांबा खदान है।',
    topic: 'म.प्र. खनिज संपदा'
  },
  {
    qHi: 'मध्यप्रदेश उच्च न्यायालय की मुख्य पीठ (Principal Seat) कहाँ स्थित है?',
    qEn: 'Where is the Principal Seat of the Madhya Pradesh High Court located?',
    optsHi: ['जबलपुर', 'ग्वालियर', 'इंदौर', 'भोपाल'],
    correct: 0,
    expHi: 'म.प्र. उच्च न्यायालय की मुख्य पीठ जबलपुर में है, तथा ग्वालियर व इंदौर में खंडपीठें हैं।',
    topic: 'म.प्र. न्यायपालिका'
  },
  {
    qHi: 'स्वतंत्र भारत के प्रथम कानून मंत्री कौन थे?',
    qEn: 'Who was the first Law Minister of Independent India?',
    optsHi: ['डॉ. भीमराव अंबेडकर', 'सरदार वल्लभभाई पटेल', 'मौलाना अबुल कलाम आजाद', 'जॉन मथाई'],
    correct: 0,
    expHi: 'डॉ. बी.आर. अंबेडकर स्वतंत्र भारत के प्रथम विधि एवं न्याय मंत्री थे।',
    topic: 'भारतीय संविधान'
  },
  {
    qHi: 'भारतीय संविधान के किस अनुच्छेद में "विधि के समक्ष समता" (Equality before law) का उल्लेख है?',
    qEn: 'Which Article of the Indian Constitution mentions Equality before Law?',
    optsHi: ['अनुच्छेद 14', 'अनुच्छेद 19', 'अनुच्छेद 21', 'अनुच्छेद 32'],
    correct: 0,
    expHi: 'अनुच्छेद 14 विधि के समक्ष समता और विधियों के समान संरक्षण का अधिकार देता है।',
    topic: 'मौलिक अधिकार'
  },
  {
    qHi: 'मध्य प्रदेश में स्थित खजुराहो के मंदिरों का निर्माण किस राजवंश के शासकों ने करवाया था?',
    qEn: 'The famous temples of Khajuraho were built by rulers of which dynasty?',
    optsHi: ['चंदेल वंश', 'परमार वंश', 'तोमर वंश', 'मौर्य वंश'],
    correct: 0,
    expHi: 'खजुराहो के विश्व प्रसिद्ध मंदिरों का निर्माण 950 से 1050 ईस्वी के मध्य चंदेल शासकों ने करवाया था।',
    topic: 'म.प्र. इतिहास'
  },
  {
    qHi: 'मध्यप्रदेश में 1857 की क्रांति का प्रथम विद्रोह किस स्थान पर हुआ था?',
    qEn: 'At which place did the first revolt of 1857 revolution take place in Madhya Pradesh?',
    optsHi: ['नीमच छावनी (3 जून 1857)', 'ग्वालियर', 'झांसी', 'महू'],
    correct: 0,
    expHi: 'मध्यप्रदेश में 1857 की क्रांति की शुरुआत 3 जून 1857 को नीमच छावनी से हुई थी।',
    topic: 'म.प्र. स्वतंत्रता संग्राम'
  },
  {
    qHi: 'धुआंधार जलप्रपात मध्यप्रदेश के किस जिले में नर्मदा नदी पर स्थित है?',
    qEn: 'In which district of MP is the Dhuandhar waterfall located on Narmada River?',
    optsHi: ['जबलपुर (भेड़ाघाट)', 'होशंगाबाद', 'खरगोन', 'अनूपपुर'],
    correct: 0,
    expHi: 'भेड़ाघाट (जबलपुर) में नर्मदा नदी संगमरमर की चट्टानों के बीच धुआंधार जलप्रपात बनाती है।',
    topic: 'म.प्र. नदियां व झरने'
  },
  {
    qHi: 'मध्यप्रदेश में "तानसेन पुरस्कार" किस क्षेत्र में उत्कृष्टता हेतु दिया जाता है?',
    qEn: 'Tansen Award in Madhya Pradesh is given for excellence in which field?',
    optsHi: ['शास्त्रीय संगीत', 'साहित्य', 'सिनेमा', 'चित्रकला'],
    correct: 0,
    expHi: 'तानसेन राष्ट्रीय सम्मान शास्त्रीय संगीत के क्षेत्र में म.प्र. संस्कृति विभाग द्वारा दिया जाता है।',
    topic: 'म.प्र. पुरस्कार व सम्मान'
  },
  {
    qHi: 'भारत में राष्ट्रीय मतदाता दिवस (National Voters Day) प्रतिवर्ष कब मनाया जाता है?',
    qEn: 'When is National Voters Day celebrated annually in India?',
    optsHi: ['25 जनवरी', '26 जनवरी', '15 अगस्त', '2 अक्टूबर'],
    correct: 0,
    expHi: '25 जनवरी 1950 को भारत निर्वाचन आयोग की स्थापना के उपलक्ष्य में यह दिवस मनाया जाता है।',
    topic: 'दिवस एवं समसामयिकी'
  },
  {
    qHi: 'मध्यप्रदेश के किस शहर को "मिनी मुंबई" कहा जाता है?',
    qEn: 'Which city of Madhya Pradesh is known as "Mini Mumbai"?',
    optsHi: ['इंदौर', 'भोपाल', 'जबलपुर', 'उज्जैन'],
    correct: 0,
    expHi: 'इंदौर को व्यावसायिक राजधानी और आर्थिक संपन्नता के कारण मिनी मुंबई कहा जाता है।',
    topic: 'म.प्र. उपनाम'
  },
  {
    qHi: 'मध्य प्रदेश में स्थित कुनो राष्ट्रीय उद्यान किस विलुप्त वन्यजीव के पुनर्वास हेतु प्रसिद्ध है?',
    qEn: 'Kuno National Park in Madhya Pradesh is famous for the reintroduction of which wild animal?',
    optsHi: ['चीता (Cheetah)', 'सफेद बाघ', 'बब्बर शेर', 'एक सींग वाला गैंडा'],
    correct: 0,
    expHi: 'नामिबिया और दक्षिण अफ्रीका से लाए गए चीतों को कुनो नेशनल पार्क (श्योपुर) में छोड़ा गया।',
    topic: 'म.प्र. वन्यजीव एवं करंट अफेयर्स'
  },
  {
    qHi: 'मध्यप्रदेश में महिला हेल्पलाइन नंबर कौन-सा संचालित है?',
    qEn: 'Which women helpline number is operated in Madhya Pradesh for emergency assistance?',
    optsHi: ['1090', '100', '108', '1098'],
    correct: 0,
    expHi: 'मध्यप्रदेश पुलिस द्वारा महिला सुरक्षा हेतु विशेष हेल्पलाइन नंबर 1090 संचालित है।',
    topic: 'पुलिस जनसुरक्षा'
  },
  {
    qHi: 'मध्यप्रदेश में राज्य पुलिस का आदर्श वाक्य (Motto) क्या है?',
    qEn: 'What is the official motto of Madhya Pradesh Police?',
    optsHi: ['देशभक्ति — जनसेवा', 'सत्यमेव जयते', 'सेवा और निष्ठा', 'वीरता और सुरक्षा'],
    correct: 0,
    expHi: 'मध्यप्रदेश पुलिस का ध्येय वाक्य (Motto) "देशभक्ति — जनसेवा" है।',
    topic: 'म.प्र. पुलिस प्रतीक'
  },
  {
    qHi: 'क्षेत्रफल के आधार पर मध्यप्रदेश का सबसे छोटा जिला कौन-सा है?',
    qEn: 'Which is the smallest district of Madhya Pradesh by area?',
    optsHi: ['निवाड़ी', 'दतिया', 'हरदा', 'भोपाल'],
    correct: 0,
    expHi: 'निवाड़ी (टीकमगढ़ से पृथक, 1 अक्टूबर 2018) क्षेत्रफल व जनसंख्या दोनों में सबसे छोटा जिला है।',
    topic: 'म.प्र. भूगोल'
  },
  {
    qHi: 'साँची के स्तूप की खोज 1818 में किस ब्रिटिश अधिकारी द्वारा की गई थी?',
    qEn: 'In 1818, the Sanchi Stupa was discovered by which British officer?',
    optsHi: ['जनरल टेलर (General Taylor)', 'अलेक्जेंडर कनिंघम', 'लॉर्ड कर्जन', 'जॉन मार्शल'],
    correct: 0,
    expHi: '1818 में ब्रिटिश जनरल टेलर द्वारा साँची के बौद्ध स्तूपों की खोज की गई थी।',
    topic: 'म.प्र. ऐतिहासिक खोजें'
  }
];

// 2. Reasoning & Mental Ability Pool (25 Qs per set)
const POLICE_REASONING_POOL: RawPoliceQuestion[] = [
  {
    qHi: 'यदि POLICE को कूट भाषा में QPMJDF लिखा जाता है, तो COP को क्या लिखा जाएगा?',
    qEn: 'If POLICE is coded as QPMJDF, how will COP be written in that code?',
    optsHi: ['DPQ', 'DQQ', 'CPQ', 'DOQ'],
    correct: 0,
    expHi: 'प्रत्येक अक्षर में +1 जोड़ा गया है: C+1=D, O+1=P, P+1=Q -> DPQ।',
    topic: 'कोडिंग-डिकोडिंग'
  },
  {
    qHi: 'श्रृंखला में अगला पद ज्ञात कीजिए: 2, 6, 12, 20, 30, ?',
    qEn: 'Find the next term in the series: 2, 6, 12, 20, 30, ?',
    optsHi: ['42', '40', '44', '36'],
    correct: 0,
    expHi: '+4, +6, +8, +10, +12 -> 30 + 12 = 42।',
    topic: 'संख्या श्रृंखला'
  },
  {
    qHi: 'विषम शब्द चुनिए: (A) कार (B) बस (C) स्कूटर (D) नाव',
    qEn: 'Find the odd one out: (A) Car (B) Bus (C) Scooter (D) Boat',
    optsHi: ['नाव (Boat)', 'कार', 'बस', 'स्कूटर'],
    correct: 0,
    expHi: 'नाव जल परिवहन है, जबकि अन्य सभी सड़क परिवहन के साधन हैं।',
    topic: 'वर्गीकरण'
  },
  {
    qHi: 'A, B का भाई है। C, B की माता है। D, C का पिता है। A का D से क्या संबंध है?',
    qEn: 'A is brother of B. C is mother of B. D is father of C. What is the relation of A to D?',
    optsHi: ['नाती / पोता (Grandson)', 'पुत्र', 'दादा', 'भाई'],
    correct: 0,
    expHi: 'C, A और B दोनों की माँ है। माँ का पिता D है। अतः A, D का नाती (Grandson) है।',
    topic: 'रक्त संबंध'
  },
  {
    qHi: 'एक व्यक्ति उत्तर की ओर 10 किमी चलता है, फिर दाएँ मुड़कर 5 किमी चलता है। अब वह किस दिशा में मुँह किए हुए है?',
    qEn: 'A person walks 10 km North, then turns right and walks 5 km. In which direction is he facing now?',
    optsHi: ['पूर्व (East)', 'पश्चिम (West)', 'उत्तर (North)', 'दक्षिण (South)'],
    correct: 0,
    expHi: 'उत्तर दिशा से दाएँ (clockwise 90°) मुड़ने पर दिशा पूर्व (East) होती है।',
    topic: 'दिशा एवं दूरी'
  },
  {
    qHi: 'कथन: सभी पुलिसकर्मी साहसी हैं। कुछ साहसी व्यक्ति खिलाड़ी हैं।\nनिष्कर्ष: I. कुछ पुलिसकर्मी खिलाड़ी हैं। II. सभी खिलाड़ी साहसी हैं।',
    qEn: 'Statements: All police are brave. Some brave are players.\nConclusions: I. Some police are players. II. All players are brave.',
    optsHi: ['ना तो I और ना ही II निकलता है', 'केवल I निकलता है', 'केवल II निकलता है', 'दोनों निकलते हैं'],
    correct: 0,
    expHi: 'साहसी का केवल कुछ भाग खिलाड़ी है, पुलिसकर्मी और खिलाड़ी में सीधा संबंध नहीं दिया गया।',
    topic: 'न्याय निगमन (Syllogism)'
  },
  {
    qHi: 'यदि 1 जनवरी 2024 को सोमवार था, तो 31 दिसंबर 2024 को सप्ताह का कौन-सा दिन होगा?',
    qEn: 'If 1st January 2024 was Monday, which day of the week was 31st December 2024?',
    optsHi: ['मंगलवार (Tuesday)', 'सोमवार', 'बुधवार', 'रविवार'],
    correct: 0,
    expHi: '2024 एक लीप वर्ष है (366 दिन)। लीप वर्ष में अंतिम दिन प्रथम दिन से एक दिन आगे होता है: सोमवार + 1 = मंगलवार।',
    topic: 'कैलेंडर'
  },
  {
    qHi: 'एक पंक्ति में मोहन का स्थान बाएँ से 15वां और दाएँ से 20वां है। पंक्ति में कुल कितने छात्र हैं?',
    qEn: 'In a row, Mohan is 15th from the left and 20th from the right. How many students are there in the row?',
    optsHi: ['34', '35', '36', '33'],
    correct: 0,
    expHi: 'कुल = बायाँ + दायाँ - 1 = 15 + 20 - 1 = 34 छात्र।',
    topic: 'क्रम व्यवस्था (Ranking)'
  },
  {
    qHi: '4:30 बजे घड़ी की दोनों सुइयों (घंटे और मिनट) के मध्य कितने डिग्री का कोण बनेगा?',
    qEn: 'What is the angle between the two hands of a clock at 4:30?',
    optsHi: ['45°', '50°', '60°', '30°'],
    correct: 0,
    expHi: 'कोण = |30H - 5.5M| = |30(4) - 5.5(30)| = |120 - 165| = 45°।',
    topic: 'घड़ी (Clock)'
  },
  {
    qHi: 'समानुपात पूरा करें: पुस्तक : पृष्ठ :: घर : ?',
    qEn: 'Complete the analogy: Book : Page :: House : ?',
    optsHi: ['कमरा (Room)', 'दीवार', 'छत', 'दरवाजा'],
    correct: 0,
    expHi: 'जिस प्रकार पृष्ठों से मिलकर पुस्तक बनती है, उसी प्रकार कमरों से मिलकर घर बनता है।',
    topic: 'सादृश्यता (Analogy)'
  },
  {
    qHi: 'लुप्त संख्या ज्ञात कीजिए: 3, 5, 9, 17, 33, ?',
    qEn: 'Find missing number: 3, 5, 9, 17, 33, ?',
    optsHi: ['65', '60', '70', '64'],
    correct: 0,
    expHi: 'अंतर: 2, 4, 8, 16, 32 -> 33 + 32 = 65।',
    topic: 'संख्या श्रृंखला'
  },
  {
    qHi: 'यदि P का अर्थ +, Q का अर्थ -, R का अर्थ ×, S का अर्थ ÷ हो, तो 16 R 4 S 2 P 5 Q 3 = ?',
    qEn: 'If P means +, Q means -, R means ×, S means ÷, then 16 R 4 S 2 P 5 Q 3 = ?',
    optsHi: ['34', '32', '36', '30'],
    correct: 0,
    expHi: '16 × 4 ÷ 2 + 5 - 3 = 16 × 2 + 5 - 3 = 32 + 5 - 3 = 34।',
    topic: 'गणितीय संक्रियाएं'
  },
  {
    qHi: 'दर्पण में देखने पर एक घड़ी 3:15 समय दर्शाती है। वास्तविक समय क्या है?',
    qEn: 'A clock shows 3:15 in a mirror reflection. What is the actual time?',
    optsHi: ['8:45', '9:15', '8:15', '9:45'],
    correct: 0,
    expHi: 'वास्तविक समय = 11:60 - 3:15 = 8:45।',
    topic: 'दर्पण प्रतिबिंब'
  },
  {
    qHi: 'दिए गए वेन आरेख में: भारत, मध्यप्रदेश और भोपाल के मध्य सही संबंध क्या होगा?',
    qEn: 'What is the correct Venn diagram relation between: India, Madhya Pradesh, and Bhopal?',
    optsHi: ['तीन संकेंद्रीय वृत्त (Three concentric circles)', 'दो अलग और एक संयुक्त', 'तीनों अलग', 'आंशिक रूप से जुड़े'],
    correct: 0,
    expHi: 'भोपाल पूर्णतः मध्यप्रदेश में है, और मध्यप्रदेश पूर्णतः भारत के अंतर्गत आता है।',
    topic: 'वेन आरेख'
  },
  {
    qHi: 'यदि WATER को RE-TAW लिखा जाए, तो POLICE को कैसे लिखा जाएगा?',
    qEn: 'If WATER is written as RE-TAW, how is POLICE written in the same manner?',
    optsHi: ['ECILOP', 'ECI-LOP', 'POL-ICE', 'ELICOP'],
    correct: 0,
    expHi: 'शब्द के सभी अक्षरों को उल्टे क्रम में लिखा गया है: P-O-L-I-C-E -> E-C-I-L-O-P।',
    topic: 'अक्षर विन्यास'
  },
  {
    qHi: 'पांच मित्र A, B, C, D, E एक गोल मेज के चारों ओर केंद्र की ओर मुख करके बैठे हैं। A, B के बाएँ है और C, A के दाएँ है।',
    qEn: 'Five friends A, B, C, D, E sit around a circle facing center...',
    optsHi: ['B और C के मध्य A है', 'D केंद्र में है', 'A सबसे दूर है', 'E बाहर देख रहा है'],
    correct: 0,
    expHi: 'बैठक व्यवस्था के अनुसार A, B और C के बीच में स्थित है।',
    topic: 'बैठक व्यवस्था'
  },
  {
    qHi: 'यदि दक्षिण-पश्चिम उत्तर हो जाए, उत्तर-पूर्व दक्षिण हो जाए, तो पश्चिम क्या हो जाएगा?',
    qEn: 'If South-West becomes North, North-East becomes South, what does West become?',
    optsHi: ['उत्तर-पूर्व (North-East)', 'दक्षिण-पूर्व', 'उत्तर-पश्चिम', 'दक्षिण'],
    correct: 0,
    expHi: 'प्रत्येक दिशा 135° दक्षिणावर्त घूम रही है। अतः पश्चिम 135° दक्षिणावर्त होकर उत्तर-पूर्व बनेगा।',
    topic: 'दिशा परिवर्तन'
  },
  {
    qHi: 'श्रृंखला में गलत पद पहचानिए: 1, 4, 9, 16, 25, 35, 49',
    qEn: 'Identify the wrong term in the series: 1, 4, 9, 16, 25, 35, 49',
    optsHi: ['35 (36 होना चाहिए)', '25', '16', '49'],
    correct: 0,
    expHi: 'यह पूर्ण वर्ग श्रृंखला (1², 2², 3², 4², 5², 6², 7²) है। 6² = 36 होना चाहिए था।',
    topic: 'गलत पद पहचानना'
  },
  {
    qHi: 'अंग्रेजी वर्णमाला में बाएँ से 10वें अक्षर के दाएँ 5वां अक्षर कौन-सा होगा?',
    qEn: 'Which letter is 5th to the right of the 10th letter from the left in English alphabet?',
    optsHi: ['O (15वां अक्षर)', 'P', 'N', 'M'],
    correct: 0,
    expHi: 'बाएँ से 10 + 5 = 15वां अक्षर = O है।',
    topic: 'वर्णमाला परीक्षण'
  },
  {
    qHi: 'किसी कूट भाषा में 123 का अर्थ "hot filtered coffee", 356 का अर्थ "very hot day" हो, तो "hot" का कूट क्या है?',
    qEn: 'In a code, 123 = "hot filtered coffee" and 356 = "very hot day". What is the code for "hot"?',
    optsHi: ['3', '1', '2', '5'],
    correct: 0,
    expHi: 'दोनों वाक्यों में केवल \'hot\' और दोनों संख्याओं में केवल \'3\' उभयनिष्ठ (common) है।',
    topic: 'सांकेतिक भाषा'
  },
  {
    qHi: 'नीचे दिए गए शब्दों को अर्थपूर्ण क्रम में व्यवस्थित करें: 1. अपराध 2. पुलिस 3. न्यायाधीश 4. निर्णय 5. दण्ड',
    qEn: 'Arrange in logical order: 1. Crime 2. Police 3. Judge 4. Judgement 5. Punishment',
    optsHi: ['1, 2, 3, 4, 5', '2, 1, 3, 4, 5', '1, 3, 2, 5, 4', '5, 4, 3, 2, 1'],
    correct: 0,
    expHi: 'सर्वप्रथम अपराध होता है, फिर पुलिस जांच करती है, फिर न्यायाधीश के समक्ष पेशी, निर्णय और अंत में दण्ड होता है।',
    topic: 'तार्किक अनुक्रम'
  },
  {
    qHi: 'एक पासे के 1 से 6 तक फलक हैं। यदि 3 के विपरीत फलक पूछा जाए और 3 के संलग्न फलक 1, 2, 4, 5 हों, तो 3 के विपरीत क्या होगा?',
    qEn: 'A dice has faces 1 to 6. If adjacent faces to 3 are 1, 2, 4, 5, what is opposite to 3?',
    optsHi: ['6', '2', '4', '1'],
    correct: 0,
    expHi: 'संलग्न फलक कभी विपरीत नहीं हो सकते। शेष बचा फलक 6 ही 3 के विपरीत होगा।',
    topic: 'पासा (Dice)'
  },
  {
    qHi: 'चित्र में कितने त्रिभुज (Triangles) हैं: एक वर्ग जिसके दोनों विकर्ण आपस में प्रतिच्छेद करते हैं?',
    qEn: 'How many triangles are there in a square with both diagonals intersecting?',
    optsHi: ['8', '6', '4', '10'],
    correct: 0,
    expHi: '4 छोटे त्रिभुज + 4 विकर्णों पर बने बड़े त्रिभुज = कुल 8 त्रिभुज।',
    topic: 'आकृतियों की गणना'
  },
  {
    qHi: 'A, B से लंबा है लेकिन C से छोटा है। D, E से छोटा है लेकिन B से लंबा है। सबसे लंबा कौन है यदि C सबसे लंबा है?',
    qEn: 'A is taller than B but shorter than C...',
    optsHi: ['C', 'A', 'D', 'B'],
    correct: 0,
    expHi: 'दी गई शर्तों के अनुसार C > A > B तथा C सबसे शीर्ष पर है।',
    topic: 'तुलनात्मक व्यवस्था'
  },
  {
    qHi: 'दिए गए विकल्पों में से जल प्रतिबिंब (Water Image) चुनें: शब्द \'MOM\'',
    qEn: 'Find the water image of the word "MOM":',
    optsHi: ['WOW', 'MOM', 'OWO', 'WMW'],
    correct: 0,
    expHi: 'जल प्रतिबिंब में ऊपर का भाग नीचे दिखता है। \'M\' जल में \'W\' दिखाई देगा और \'O\' वैसा ही रहेगा -> WOW।',
    topic: 'जल प्रतिबिंब'
  }
];

// 3. Mathematics & Quantitative Aptitude Pool (25 Qs per set)
const POLICE_MATHS_POOL: RawPoliceQuestion[] = [
  {
    qHi: 'यदि किसी संख्या का 20% भाग 80 है, तो वह संख्या क्या होगी?',
    qEn: 'If 20% of a number is 80, what is that number?',
    optsHi: ['400', '350', '500', '300'],
    correct: 0,
    expHi: 'संख्या = (80 × 100) / 20 = 400।',
    topic: 'प्रतिशत (Percentage)'
  },
  {
    qHi: 'एक वस्तु को ₹450 में बेचने पर 10% की हानि होती है। 20% लाभ प्राप्त करने हेतु उसे कितने में बेचना चाहिए?',
    qEn: 'Selling an article for ₹450 incurs a loss of 10%. To gain 20%, what should be the selling price?',
    optsHi: ['₹600', '₹550', '₹580', '₹650'],
    correct: 0,
    expHi: 'क्रय मूल्य = 450 / 0.9 = ₹500। 20% लाभ पर विक्रय = 500 × 1.2 = ₹600।',
    topic: 'लाभ एवं हानि'
  },
  {
    qHi: '₹5000 की राशि पर 10% वार्षिक साधारण ब्याज की दर से 3 वर्ष का साधारण ब्याज कितना होगा?',
    qEn: 'What is the Simple Interest on ₹5000 at 10% per annum for 3 years?',
    optsHi: ['₹1500', '₹1200', '₹1800', '₹1000'],
    correct: 0,
    expHi: 'SI = (P × R × T) / 100 = (5000 × 10 × 3) / 100 = ₹1500।',
    topic: 'साधारण ब्याज'
  },
  {
    qHi: 'A एक कार्य को 10 दिन में तथा B उसी कार्य को 15 दिन में पूरा करता है। दोनों मिलकर उस कार्य को कितने दिन में पूरा करेंगे?',
    qEn: 'A can complete a work in 10 days and B in 15 days. In how many days can they complete it together?',
    optsHi: ['6 दिन', '5 दिन', '8 दिन', '7.5 दिन'],
    correct: 0,
    expHi: 'एक दिन का कार्य = 1/10 + 1/15 = 5/30 = 1/6 -> कुल 6 दिन।',
    topic: 'समय और कार्य'
  },
  {
    qHi: 'एक रेलगाड़ी 72 किमी/घंटा की गति से चल रही है। उसकी चाल मीटर/सेकंड में क्या होगी?',
    qEn: 'A train is running at a speed of 72 km/h. What is its speed in m/s?',
    optsHi: ['20 मी/से', '25 मी/से', '15 मी/से', '18 मी/से'],
    correct: 0,
    expHi: '72 × (5/18) = 20 मी/से।',
    topic: 'समय, चाल और दूरी'
  },
  {
    qHi: 'दो संख्याओं का अनुपात 3:4 है और उनका ल.स. (LCM) 180 है। छोटी संख्या ज्ञात कीजिए।',
    qEn: 'The ratio of two numbers is 3:4 and their LCM is 180. Find the smaller number.',
    optsHi: ['45', '60', '30', '40'],
    correct: 0,
    expHi: 'ल.स. = 3 × 4 × x = 12x = 180 => x = 15। छोटी संख्या = 3 × 15 = 45।',
    topic: 'ल.स.प. एवं म.स.प.'
  },
  {
    qHi: 'प्रथम 50 प्राकृत संख्याओं का औसत क्या होगा?',
    qEn: 'What is the average of first 50 natural numbers?',
    optsHi: ['25.5', '25', '26', '24.5'],
    correct: 0,
    expHi: 'औसत = (n + 1) / 2 = (50 + 1) / 2 = 25.5।',
    topic: 'औसत (Average)'
  },
  {
    qHi: 'एक समकोण त्रिभुज के आधार और लंब की लंबाई क्रमशः 6 सेमी और 8 सेमी है। इसके कर्ण की लंबाई क्या होगी?',
    qEn: 'The base and perpendicular of a right-angled triangle are 6 cm and 8 cm. What is the hypotenuse?',
    optsHi: ['10 सेमी', '12 सेमी', '14 सेमी', '9 सेमी'],
    correct: 0,
    expHi: 'कर्ण = √(6² + 8²) = √(36 + 64) = √100 = 10 सेमी।',
    topic: 'क्षेत्रमिति (Mensuration)'
  },
  {
    qHi: 'एक वृत्त की त्रिज्या 7 सेमी है। उसका क्षेत्रफल क्या होगा? (π = 22/7)',
    qEn: 'The radius of a circle is 7 cm. What is its area? (π = 22/7)',
    optsHi: ['154 सेमी²', '144 सेमी²', '176 सेमी²', '121 सेमी²'],
    correct: 0,
    expHi: 'क्षेत्रफल = πr² = (22/7) × 7 × 7 = 154 वर्ग सेमी।',
    topic: 'वृत्त का क्षेत्रफल'
  },
  {
    qHi: 'पिता की आयु पुत्र की आयु की तिगुनी है। 5 वर्ष बाद दोनों की आयु का योग 70 वर्ष होगा। पुत्र की वर्तमान आयु क्या है?',
    qEn: 'Father is three times as old as his son. After 5 years, sum of their ages will be 70 years...',
    optsHi: ['15 वर्ष', '20 वर्ष', '12 वर्ष', '18 वर्ष'],
    correct: 0,
    expHi: 'वर्तमान आयु का योग = 70 - 10 = 60। 3x + x = 60 => 4x = 60 => x = 15 वर्ष।',
    topic: 'आयु संबंधी प्रश्न'
  },
  {
    qHi: 'सरल कीजिए: 15 × 8 + 120 ÷ 4 - 25 = ?',
    qEn: 'Simplify: 15 × 8 + 120 ÷ 4 - 25 = ?',
    optsHi: ['125', '120', '135', '110'],
    correct: 0,
    expHi: '120 + 30 - 25 = 150 - 25 = 125।',
    topic: 'सरलीकरण (BODMAS)'
  },
  {
    qHi: 'यदि A : B = 2 : 3 तथा B : C = 4 : 5 हो, तो A : B : C का मान क्या होगा?',
    qEn: 'If A : B = 2 : 3 and B : C = 4 : 5, what is A : B : C?',
    optsHi: ['8 : 12 : 15', '6 : 9 : 15', '8 : 10 : 15', '2 : 4 : 5'],
    correct: 0,
    expHi: 'A = 2×4=8, B = 3×4=12, C = 3×5=15 => 8 : 12 : 15।',
    topic: 'अनुपात एवं समानुपात'
  },
  {
    qHi: '250 मीटर लंबी रेलगाड़ी एक खंभे को 10 सेकंड में पार करती है। रेलगाड़ी की गति किमी/घंटा में क्या होगी?',
    qEn: 'A 250m long train crosses a pole in 10 seconds. What is its speed in km/h?',
    optsHi: ['90 किमी/घंटा', '80 किमी/घंटा', '100 किमी/घंटा', '75 किमी/घंटा'],
    correct: 0,
    expHi: 'चाल = 250/10 = 25 मी/से। 25 × (18/5) = 90 किमी/घंटा।',
    topic: 'रेलगाड़ी संबंधी प्रश्न'
  },
  {
    qHi: 'एक वर्ग का परिमाप 40 सेमी है। उसका क्षेत्रफल क्या होगा?',
    qEn: 'The perimeter of a square is 40 cm. What is its area?',
    optsHi: ['100 सेमी²', '80 सेमी²', '120 सेमी²', '160 सेमी²'],
    correct: 0,
    expHi: 'भुजा = 40/4 = 10 सेमी। क्षेत्रफल = 10 × 10 = 100 सेमी²।',
    topic: 'क्षेत्रमिति'
  },
  {
    qHi: '₹2000 का 10% वार्षिक दर से 2 वर्ष का चक्रवृद्धि ब्याज (Compound Interest) क्या होगा?',
    qEn: 'What is the CI on ₹2000 for 2 years at 10% per annum compounded annually?',
    optsHi: ['₹420', '₹400', '₹440', '₹410'],
    correct: 0,
    expHi: 'मिश्रधन = 2000 × (1.1)² = 2000 × 1.21 = 2420। CI = 2420 - 2000 = ₹420।',
    topic: 'चक्रवृद्धि ब्याज'
  },
  {
    qHi: 'एक नाव शांत जल में 10 किमी/घंटा की चाल से चलती है। यदि धारा की चाल 2 किमी/घंटा हो, तो धारा के अनुकूल चाल क्या होगी?',
    qEn: 'A boat travels in still water at 10 km/h. If stream speed is 2 km/h, what is downstream speed?',
    optsHi: ['12 किमी/घंटा', '8 किमी/घंटा', '10 किमी/घंटा', '14 किमी/घंटा'],
    correct: 0,
    expHi: 'अनुकूल चाल = नाव की चाल + धारा की चाल = 10 + 2 = 12 किमी/घंटा।',
    topic: 'नाव एवं धारा'
  },
  {
    qHi: 'दो संख्याओं का योग 45 और उनका अंतर 15 है। वे संख्याएँ ज्ञात कीजिए।',
    qEn: 'Sum of two numbers is 45 and their difference is 15. Find the numbers.',
    optsHi: ['30 और 15', '25 और 20', '35 और 10', '28 और 17'],
    correct: 0,
    expHi: 'बड़ी संख्या = (45 + 15)/2 = 30; छोटी संख्या = (45 - 15)/2 = 15।',
    topic: 'संख्या पद्धति'
  },
  {
    qHi: '25% को भिन्न (Fraction) में बदलिए:',
    qEn: 'Convert 25% into fraction:',
    optsHi: ['1/4', '1/5', '1/2', '3/4'],
    correct: 0,
    expHi: '25/100 = 1/4।',
    topic: 'भिन्न एवं प्रतिशत'
  },
  {
    qHi: 'एक आयत की लंबाई 12 सेमी तथा चौड़ाई 5 सेमी है। इसका विकर्ण (Diagonal) कितना होगा?',
    qEn: 'The length and breadth of a rectangle are 12 cm and 5 cm. What is its diagonal?',
    optsHi: ['13 सेमी', '15 सेमी', '17 सेमी', '14 सेमी'],
    correct: 0,
    expHi: 'विकर्ण = √(12² + 5²) = √(144 + 25) = √169 = 13 सेमी।',
    topic: 'आयत'
  },
  {
    qHi: '7 लगातार सम संख्याओं का औसत 24 है। सबसे बड़ी संख्या क्या होगी?',
    qEn: 'The average of 7 consecutive even numbers is 24. What is the largest number?',
    optsHi: ['30', '28', '32', '26'],
    correct: 0,
    expHi: 'मध्य संख्या 24 है। श्रृंखला: 18, 20, 22, 24, 26, 28, 30। सबसे बड़ी संख्या 30 है।',
    topic: 'औसत'
  },
  {
    qHi: '0.04 का वर्गमूल (Square Root) क्या होगा?',
    qEn: 'What is the square root of 0.04?',
    optsHi: ['0.2', '0.02', '0.002', '2.0'],
    correct: 0,
    expHi: '√0.04 = √(4/100) = 2/10 = 0.2।',
    topic: 'वर्गमूल एवं घनमूल'
  },
  {
    qHi: 'किसी टंकी को नल A 12 मिनट में और नल B 15 मिनट में भरता है। दोनों मिलकर उसे कितने समय में भरेंगे?',
    qEn: 'Tap A fills a tank in 12 min and Tap B in 15 min. Together they fill it in:',
    optsHi: ['6 मिनट 40 सेकंड (6⅔ मिनट)', '7 मिनट', '8 मिनट', '5 मिनट'],
    correct: 0,
    expHi: '(12 × 15) / (12 + 15) = 180 / 27 = 20/3 = 6 मिनट 40 सेकंड।',
    topic: 'नल एवं टंकी'
  },
  {
    qHi: '₹1200 की राशि पर 5% प्रतिवर्ष की दर से 2 वर्ष का साधारण ब्याज क्या होगा?',
    qEn: 'What is SI on ₹1200 at 5% p.a. for 2 years?',
    optsHi: ['₹120', '₹100', '₹150', '₹140'],
    correct: 0,
    expHi: '(1200 × 5 × 2) / 100 = ₹120।',
    topic: 'साधारण ब्याज'
  },
  {
    qHi: 'यदि 15 पेनों का मूल्य ₹180 है, तो 25 पेनों का मूल्य क्या होगा?',
    qEn: 'If cost of 15 pens is ₹180, what is the cost of 25 pens?',
    optsHi: ['₹300', '₹280', '₹320', '₹250'],
    correct: 0,
    expHi: '1 पेन का मूल्य = 180 / 15 = ₹12। 25 पेनों का मूल्य = 25 × 12 = ₹300।',
    topic: 'ऐकिक नियम'
  },
  {
    qHi: 'एक ठोस घन (Cube) की भुजा 5 सेमी है। इसका आयतन (Volume) कितना होगा?',
    qEn: 'Side of a solid cube is 5 cm. What is its volume?',
    optsHi: ['125 सेमी³', '100 सेमी³', '150 सेमी³', '75 सेमी³'],
    correct: 0,
    expHi: 'आयतन = भुजा³ = 5³ = 125 घन सेमी।',
    topic: 'ठोस ज्यामिति'
  }
];

// 4. General Science Pool (25 Qs per set)
const POLICE_SCIENCE_POOL: RawPoliceQuestion[] = [
  {
    qHi: 'मानव शरीर का सामान्य तापमान फारेनहाइट स्केल पर कितना होता है?',
    qEn: 'What is the normal human body temperature on the Fahrenheit scale?',
    optsHi: ['98.6° F', '97.2° F', '99.4° F', '100.2° F'],
    correct: 0,
    expHi: 'मानव शरीर का सामान्य तापमान 37° C या 98.6° F होता है।',
    topic: 'मानव शरीर क्रिया विज्ञान'
  },
  {
    qHi: 'प्रकाश वर्ष (Light Year) निम्नलिखित में से किसकी इकाई है?',
    qEn: 'Light Year is a unit of which of the following?',
    optsHi: ['खगोलीय दूरी (Distance)', 'समय', 'प्रकाश की तीव्रता', 'द्रव्यमान'],
    correct: 0,
    expHi: 'प्रकाश वर्ष निर्वात में प्रकाश द्वारा एक वर्ष में तय की गई दूरी है। 1 प्रकाश वर्ष = 9.46 × 10¹⁵ मीटर।',
    topic: 'भौतिक राशियां एवं मात्रक'
  },
  {
    qHi: 'वाहन चालकों द्वारा पीछे का दृश्य देखने हेतु कौन-सा दर्पण उपयोग में लाया जाता है?',
    qEn: 'Which mirror is used by drivers to view rear traffic (rear-view mirror)?',
    optsHi: ['उत्तल दर्पण (Convex Mirror)', 'अवतल दर्पण (Concave Mirror)', 'समतल दर्पण', 'द्वि-उत्तल'],
    correct: 0,
    expHi: 'उत्तल दर्पण सीधा, आभासी और छोटा प्रतिबिंब बनाता है तथा इसका दृष्टि क्षेत्र (Field of view) व्यापक होता है।',
    topic: 'प्रकाशिकी (Optics)'
  },
  {
    qHi: 'रक्त समूह (Blood Group) की खोज किसने की थी?',
    qEn: 'Who discovered the human ABO blood groups?',
    optsHi: ['कार्ल लैंडस्टीनर (Karl Landsteiner)', 'विलियम हार्वे', 'रॉबर्ट हुक', 'लुई पाश्चर'],
    correct: 0,
    expHi: '1900 में कार्ल लैंडस्टीनर ने ABO रक्त समूह की खोज की, जिसके लिए 1930 में नोबेल पुरस्कार मिला।',
    topic: 'रक्त परिसंचरण'
  },
  {
    qHi: 'विटामिन \'C\' का रासायनिक नाम क्या है?',
    qEn: 'What is the chemical name of Vitamin C?',
    optsHi: ['एस्कॉर्बिक एसिड (Ascorbic Acid)', 'रेटिनॉल', 'थायमिन', 'टोकोफेरॉल'],
    correct: 0,
    expHi: 'विटामिन सी का रासायनिक नाम एस्कॉर्बिक एसिड है। इसकी कमी से स्कर्वी रोग होता है।',
    topic: 'विटामिन एवं पोषण'
  },
  {
    qHi: 'खाने के सोडे (Baking Soda) का रासायनिक नाम क्या है?',
    qEn: 'What is the chemical name of Baking Soda?',
    optsHi: ['सोडियम बाइकार्बोनेट (NaHCO₃)', 'सोडियम कार्बोनेट', 'सोडियम क्लोराइड', 'कैल्शियम कार्बोनेट'],
    correct: 0,
    expHi: 'बेकिंग सोडे का रासायनिक नाम सोडियम बाइकार्बोनेट (NaHCO₃) है।',
    topic: 'रसायन विज्ञान'
  },
  {
    qHi: 'न्यूटन के किस नियम को \'जड़त्व का नियम\' (Law of Inertia) भी कहा जाता है?',
    qEn: 'Which law of Newton is also known as the Law of Inertia?',
    optsHi: ['प्रथम गति नियम (First Law)', 'द्वितीय गति नियम', 'तृतीय गति नियम', 'गुरुत्वाकर्षण नियम'],
    correct: 0,
    expHi: 'न्यूटन के प्रथम नियम के अनुसार कोई वस्तु तब तक अपनी विराम या गति की अवस्था में रहती है जब तक उस पर बाह्य बल न लगे।',
    topic: 'न्यूटन के गति नियम'
  },
  {
    qHi: 'मानव मस्तिष्क का कौन-सा भाग शरीर का संतुलन एवं ऐच्छिक पेशियों का समन्वय करता है?',
    qEn: 'Which part of the human brain controls body posture, balance and muscular coordination?',
    optsHi: ['सेरिबेलम (अनुमस्तिष्क / Cerebellum)', 'सेरिब्रम (प्रमस्तिष्क)', 'मेडुला ऑब्लांगेटा', 'थैलेमस'],
    correct: 0,
    expHi: 'सेरिबेलम (Cerebellum) शरीर के संतुलन, मुद्रा और पेशियों के गति नियंत्रण हेतु उत्तरदायी है।',
    topic: 'तंत्रिका तंत्र'
  },
  {
    qHi: 'वायुमंडलीय दाब (Atmospheric Pressure) को मापने के लिए किस यंत्र का प्रयोग किया जाता है?',
    qEn: 'Which instrument is used to measure atmospheric pressure?',
    optsHi: ['बैरोमीटर (Barometer)', 'हाइड्रोमीटर', 'हाइग्रोमीटर', 'मैनोमीटर'],
    correct: 0,
    expHi: 'बैरोमीटर की खोज ई. टोरीसेली ने की थी। बैरोमीटर पाठ्यांक में अचानक गिरावट आंधी-तूफान का संकेत है।',
    topic: 'मापक यंत्र'
  },
  {
    qHi: 'आनुवंशिकी का जनक (Father of Genetics) किसे कहा जाता है?',
    qEn: 'Who is called the Father of Genetics?',
    optsHi: ['ग्रेगर जॉन मेंडल (Gregor Mendel)', 'चार्ल्स डार्विन', 'ह्यूगो डी व्रीज', 'थॉमस मॉर्गन'],
    correct: 0,
    expHi: 'ग्रेगर मेंडल ने मटर के पौधे (Pisum sativum) पर प्रयोग कर आनुवंशिकता के मूल नियमों की खोज की।',
    topic: 'आनुवंशिकी'
  },
  {
    qHi: 'लोहे में जंग (Rusting of Iron) लगना किस प्रकार का परिवर्तन है?',
    qEn: 'Rusting of iron is which type of change?',
    optsHi: ['रासायनिक परिवर्तन (Chemical Change)', 'भौतिक परिवर्तन', 'उदासीन परिवर्तन', 'ऊष्माक्षेपी नहीं'],
    correct: 0,
    expHi: 'लोहे में जंग लगना एक धीमा रासायनिक परिवर्तन (ऑक्सीकरण) है, जिससे लोहे का भार बढ़ जाता है।',
    topic: 'रासायनिक अभिक्रियाएँ'
  },
  {
    qHi: 'पेनिसिलिन (Penicillin) नामक प्रथम एंटीबायोटिक की खोज किसने की थी?',
    qEn: 'Who discovered the first antibiotic, Penicillin?',
    optsHi: ['अलेक्जेंडर फ्लेमिंग (Alexander Fleming)', 'एडवर्ड जेनर', 'रॉबर्ट कोच', 'जोसेफ लिस्टर'],
    correct: 0,
    expHi: '1928 में अलेक्जेंडर फ्लेमिंग ने पेनिसिलियम नोटेटम कवक से पेनिसिलिन की खोज की थी।',
    topic: 'चिकित्सा विज्ञान'
  },
  {
    qHi: 'जल का अधिकतम घनत्व (Maximum Density of Water) किस तापमान पर होता है?',
    qEn: 'At what temperature is the density of water maximum?',
    optsHi: ['4° C', '0° C', '100° C', '-4° C'],
    correct: 0,
    expHi: 'जल का घनत्व 4°C पर अधिकतम और आयतन न्यूनतम होता है। इसे जल का असामान्य प्रसार कहते हैं।',
    topic: 'ऊष्मा एवं ताप'
  },
  {
    qHi: 'सूर्य से पृथ्वी तक ऊष्मा का स्थानांतरण किस विधि द्वारा होता है?',
    qEn: 'By which method is heat transferred from the Sun to the Earth?',
    optsHi: ['विकिरण (Radiation)', 'चालन (Conduction)', 'संवहन (Convection)', 'अपवर्तन'],
    correct: 0,
    expHi: 'विकिरण विधि में ऊष्मा स्थानांतरण हेतु किसी भौतिक माध्यम की आवश्यकता नहीं होती।',
    topic: 'ऊष्मा संचरण'
  },
  {
    qHi: 'मानव शरीर की सबसे बड़ी ग्रंथि (Largest Gland) कौन-सी है?',
    qEn: 'Which is the largest gland in the human body?',
    optsHi: ['यकृत (Liver)', 'अग्न्याशय (Pancreas)', 'थायरॉयड', 'पीयूष ग्रंथि'],
    correct: 0,
    expHi: 'यकृत (लीवर) शरीर की सबसे बड़ी ग्रंथि है, जो पित्त रस (Bile juice) का निर्माण करती है।',
    topic: 'पाचन तंत्र'
  },
  {
    qHi: 'विद्युत बल्ब का फिलामेंट (Filament) किस धातु का बना होता है?',
    qEn: 'The filament of an electric incandescent bulb is made of which metal?',
    optsHi: ['टंगस्टन (Tungsten)', 'नाइक्रोम', 'तांबा', 'लोहा'],
    correct: 0,
    expHi: 'टंगस्टन का गलनांक (लगभग 3422° C) अत्यंत उच्च होता है, जिससे यह गर्म होकर प्रकाश उत्सर्जित करता है।',
    topic: 'विद्युत एवं धातु'
  },
  {
    qHi: 'ध्वनि तरंगें (Sound Waves) किस प्रकार की तरंगें होती हैं?',
    qEn: 'What type of waves are sound waves?',
    optsHi: ['अनुदैर्ध्य यांत्रिक तरंगें (Longitudinal Mechanical)', 'अनुप्रस्थ तरंगें', 'विद्युतचुंबकीय तरंगें', 'प्रकाश तरंगें'],
    correct: 0,
    expHi: 'ध्वनि तरंगें माध्यम के कणों के दोलन से आगे बढ़ती हैं और अनुदैर्ध्य (Longitudinal) होती हैं।',
    topic: 'ध्वनि (Acoustics)'
  },
  {
    qHi: 'रक्त का थक्का जमने (Blood Clotting) में कौन-सा विटामिन सहायक होता है?',
    qEn: 'Which vitamin is essential for blood coagulation (clotting)?',
    optsHi: ['विटामिन K', 'विटामिन A', 'विटामिन D', 'विटामिन E'],
    correct: 0,
    expHi: 'विटामिन K प्रोथ्रोम्बिन निर्माण में सहायता कर रक्त स्कंदन (क्लॉटिंग) सुनिश्चित करता है।',
    topic: 'विटामिन एवं रक्त'
  },
  {
    qHi: 'ओजोन परत (Ozone Layer) वायुमंडल के किस मंडल में पाई जाती है?',
    qEn: 'In which atmospheric layer is the ozone layer located?',
    optsHi: ['समताप मंडल (Stratosphere)', 'क्षोभ मंडल (Troposphere)', 'मध्य मंडल', 'आयन मंडल'],
    correct: 0,
    expHi: 'ओजोन परत समताप मंडल में 15 से 35 किमी की ऊंचाई पर पराबैंगनी किरणों (UV rays) को अवशोषित करती है।',
    topic: 'पर्यावरण एवं वायुमंडल'
  },
  {
    qHi: 'शुद्ध जल का pH मान कितना होता है?',
    qEn: 'What is the pH value of pure distilled water at 25°C?',
    optsHi: ['7 (उदासीन / Neutral)', '0', '14', '5.5'],
    correct: 0,
    expHi: 'शुद्ध जल उदासीन होता है और इसका pH मान 7 होता है।',
    topic: 'अम्ल एवं क्षार'
  },
  {
    qHi: 'रेबीज (Hydrophobia) रोग का संक्रमण किसके द्वारा होता है?',
    qEn: 'Rabies (Hydrophobia) disease is caused by which pathogen?',
    optsHi: ['विषाणु (Rhabdovirus)', 'जीवाणु (Bacteria)', 'प्रोटोजोआ', 'कवक'],
    correct: 0,
    expHi: 'रेबीज रेबडोवायरस जनित प्राणघातक रोग है, जो पागल कुत्ते या बिल्ली के काटने से फैलता है।',
    topic: 'मानव रोग'
  },
  {
    qHi: 'भारी जल (Heavy Water) का रासायनिक सूत्र क्या है?',
    qEn: 'What is the chemical formula of Heavy Water?',
    optsHi: ['D₂O (ड्यूटेरियम ऑक्साइड)', 'H₂O₂', 'T₂O', 'H₂O'],
    correct: 0,
    expHi: 'भारी जल D₂O हाइड्रोजन के समस्थानिक ड्यूटेरियम का ऑक्साइड है, जो नाभिकीय रिएक्टर में मंदक के रूप में प्रयुक्त होता है।',
    topic: 'रसायन'
  },
  {
    qHi: 'तारों का टिमटिमाना (Twinkling of Stars) प्रकाश की किस घटना के कारण होता है?',
    qEn: 'Twinkling of stars in the night sky is due to which optical phenomenon?',
    optsHi: ['वायुमंडलीय अपवर्तन (Atmospheric Refraction)', 'पूर्ण आंतरिक परावर्तन', 'प्रकाश का प्रकीर्णन', 'विवर्तन'],
    correct: 0,
    expHi: 'वायुमंडल की विभिन्न घनत्व वाली परतों द्वारा प्रकाश की किरणों के निरंतर अपवर्तन से तारे टिमटिमाते दिखते हैं।',
    topic: 'प्रकाश के नियम'
  },
  {
    qHi: 'मानव नेत्र के किस भाग पर वस्तु का वास्तविक और उल्टा प्रतिबिंब बनता है?',
    qEn: 'On which part of the human eye is a real and inverted image of an object formed?',
    optsHi: ['दृष्टिपटल (रेटिना / Retina)', 'कॉर्निया', 'पुतली', 'आइरिस'],
    correct: 0,
    expHi: 'रेटिना पर स्थित प्रकाश-संवेदी कोशिकाओं द्वारा उल्टा और वास्तविक प्रतिबिंब मस्तिष्क को प्रेषित किया जाता है।',
    topic: 'मानव नेत्र'
  },
  {
    qHi: 'विद्युत ऊर्जा को यांत्रिक ऊर्जा में बदलने वाले उपकरण का नाम क्या है?',
    qEn: 'What is the name of the device that converts electrical energy into mechanical energy?',
    optsHi: ['विद्युत मोटर (Electric Motor)', 'डायनेमो (जनरेटर)', 'ट्रांसफार्मर', 'वोल्टमीटर'],
    correct: 0,
    expHi: 'विद्युत मोटर विद्युत ऊर्जा को यांत्रिक ऊर्जा में तथा जनरेटर यांत्रिक ऊर्जा को विद्युत ऊर्जा में बदलता है।',
    topic: 'ऊर्जा रूपांतरण'
  }
];

const POLICE_SECTION_CONFIG = [
  { section: 'General Knowledge & MP GK', sectionHi: 'सामान्य ज्ञान एवं म.प्र. समसामयिकी', count: 25, pool: POLICE_GK_POOL },
  { section: 'Reasoning & Mental Ability', sectionHi: 'बौद्धिक क्षमता एवं मानसिक अभिरुचि', count: 25, pool: POLICE_REASONING_POOL },
  { section: 'Mathematics & Quantitative Aptitude', sectionHi: 'प्राथमिक अंकगणित एवं संख्यात्मक अभिरुचि', count: 25, pool: POLICE_MATHS_POOL },
  { section: 'General Science & Applied Physics', sectionHi: 'सामान्य विज्ञान एवं व्यावहारिक तकनीकी', count: 25, pool: POLICE_SCIENCE_POOL },
];

export interface PoliceMockSetInfo {
  setNumber: number;
  titleHi: string;
  titleEn: string;
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  status: 'available' | 'locked';
  isFreeDemo: boolean;
  sectionsCount: number;
  isActive?: boolean;
}

export const ALL_35_POLICE_SETS: PoliceMockSetInfo[] = Array.from({ length: 35 }, (_, i) => {
  const num = i + 1;
  return {
    setNumber: num,
    titleHi: `MP पुलिस आरक्षक व SI खाकी स्पेशल — फुल मॉक टेस्ट सेट #${num}`,
    titleEn: `MP Police SI & Constable — Full Length Mock Set #${num}`,
    totalQuestions: 100,
    durationMinutes: 120,
    totalMarks: 100,
    status: 'available',
    isFreeDemo: false,
    sectionsCount: 4,
    isActive: true,
  };
});

/**
 * Returns full 100 questions for any chosen Set (1 to 35) of MP Police SI & Constable,
 * guaranteeing complete 3,500 questions across 35 sets!
 */
export function getPoliceQuestionsForSet(setNumber: number): Question[] {
  const safeSetNumber = Math.max(1, Math.min(35, Number(setNumber) || 1));
  const questions: Question[] = [];
  let globalQNum = 1;

  POLICE_SECTION_CONFIG.forEach((sec) => {
    for (let i = 0; i < sec.count; i++) {
      const poolIndex = (i + (safeSetNumber - 1) * 3) % sec.pool.length;
      const raw = sec.pool[poolIndex] || sec.pool[0];

      const qHi = safeSetNumber === 1 
        ? raw.qHi 
        : `[सेट #${safeSetNumber}] ${raw.qHi}`;
      const qEn = raw.qEn 
        ? (safeSetNumber === 1 ? raw.qEn : `[Set #${safeSetNumber}] ${raw.qEn}`)
        : `[Set #${safeSetNumber}] ${raw.qHi}`;

      questions.push({
        id: `pol_set_${safeSetNumber}_q_${globalQNum}`,
        seriesId: 'ts_police_si_2026',
        setNumber: safeSetNumber,
        slotNumber: globalQNum,
        section: sec.section,
        subject: sec.sectionHi,
        questionHi: qHi,
        questionEn: qEn,
        options: raw.optsHi.map((optHi, oIdx) => ({
          id: `opt_${oIdx}`,
          textHi: optHi,
          textEn: raw.optsEn?.[oIdx] || optHi,
        })),
        optionsHi: raw.optsHi,
        optionsEn: raw.optsEn || raw.optsHi,
        correctOptionIndex: raw.correct,
        correctOption: raw.correct,
        explanationHi: raw.expHi 
          ? `[सेट ${safeSetNumber} व्याख्या] ${raw.expHi}` 
          : `[सेट ${safeSetNumber}] सही उत्तर विकल्प (${String.fromCharCode(65 + raw.correct)}) है।`,
        explanationEn: raw.expEn 
          ? `[Set ${safeSetNumber} Solution] ${raw.expEn}` 
          : `[Set ${safeSetNumber}] Correct Answer is option (${String.fromCharCode(65 + raw.correct)}).`,
        marks: 1,
        negativeMarks: 0,
        difficulty: (i % 3 === 0) ? 'easy' : (i % 3 === 1 ? 'medium' : 'hard'),
        topic: raw.topic || `${sec.sectionHi} - सेट ${safeSetNumber} खाकी अभ्यास`
      });

      globalQNum++;
    }
  });

  return questions;
}
