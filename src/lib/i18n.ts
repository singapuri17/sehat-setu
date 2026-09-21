export type Lang = "en" | "hi" | "gu";

export const languageOptions: Array<{ code: Lang; label: string }> = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
];

type Dict = Record<string, string>;

const hi: Dict = {
  "AI-assisted pre-consultation": "एआई-सहायित पूर्व-परामर्श",
  "Kiosk 04 · North Wing": "कियोस्क 04 · नॉर्थ विंग",
  Doctor: "डॉक्टर",
  "Self-service check-in": "स्वयं चेक-इन",
  "Begin your": "शुरू करें अपना",
  "check-in": "चेक-इन",
  "Answer a few simple questions so your doctor is ready when you are.":
    "कुछ आसान सवालों के जवाब दें, ताकि आपके डॉक्टर पहले से तैयार रहें।",
  "Choose your language": "अपनी भाषा चुनें",
  Start: "शुरू करें",
  "Safe, simple, patient-first · This kiosk does not provide a diagnosis":
    "सुरक्षित, सरल, रोगी-प्रथम · यह कियोस्क कोई निदान नहीं देता",

  "Step 2 · Your privacy": "चरण 2 · आपकी निजता",
  "Can we collect your health details?": "क्या हम आपकी स्वास्थ्य जानकारी ले सकते हैं?",
  "We will use your answers and previous records to prepare your consultation history.":
    "आपके उत्तर और पुराने रिकॉर्ड से हम आपकी परामर्श जानकारी तैयार करेंगे।",
  Listen: "सुनें",
  "Hear this": "यह सुनें",
  "Your choice": "आपकी मर्जी",
  "Your information helps your doctor prepare. A staff member can help you at any time.":
    "आपकी जानकारी डॉक्टर की तैयारी में मदद करती है। कर्मचारी कभी भी आपकी मदद कर सकते हैं।",
  "I agree to continue": "मैं सहमत हूँ, आगे बढ़ें",
  "This prototype does not provide medical diagnosis.": "यह प्रोटोटाइप कोई चिकित्सा निदान नहीं देता।",

  "Step 3 · About you": "चरण 3 · आपके बारे में",
  "Step 4 · About you": "चरण 4 · आपके बारे में",
  "Tell us about yourself": "अपने बारे में बताइए",
  "Use the boxes below. You can ask for help.": "नीचे दिए बॉक्स भरें। आप मदद माँग सकते हैं।",
  "Your name": "आपका नाम",
  "Type your name": "अपना नाम लिखें",
  "Your age": "आपकी उम्र",
  "Example: 52": "उदाहरण: 52",
  "I am": "मैं हूँ",
  Male: "पुरुष",
  Female: "महिला",
  Other: "अन्य",
  "Main problem": "मुख्य समस्या",

  Fever: "बुखार",
  "Abdominal pain": "पेट में दर्द",
  Headache: "सिर दर्द",
  Cough: "खाँसी",
  "Chest pain": "छाती में दर्द",

  "Step 4 · Tell us": "चरण 4 · हमें बताएं",
  "Step 5 · Tell us": "चरण 5 · हमें बताएं",
  "Tap one answer, or speak your answer.": "एक उत्तर चुनें, या बोलकर बताएं।",
  "Next question": "अगला सवाल",
  "Next: records": "आगे: रिपोर्ट",
  Speak: "बोलिए",
  "Listening…": "सुन रहे हैं…",
  "Understanding…": "समझ रहे हैं…",
  "Got it": "मिल गया",
  "Tap the microphone and say your answer": "माइक दबाएँ और अपना उत्तर बोलें",
  Transcription: "लिखा गया",
  "Voice help is optional": "आवाज़ की मदद वैकल्पिक है",
  "Demo voice mode": "डेमो वॉइस मोड",
  "Potential red flag detected.": "संभावित गंभीर संकेत मिला।",
  "Please alert medical staff. This is not a diagnosis.":
    "कृपया चिकित्सा कर्मचारी को बताएं। यह निदान नहीं है।",

  // Voice confirmation
  "Did you mean this?": "क्या आपका यही मतलब था?",
  "This answer will be saved as free text for your doctor.": "यह उत्तर आपके डॉक्टर के लिए टेक्स्ट के रूप में सहेजा जाएगा।",
  "Yes, that's correct": "हाँ, यही सही है",
  "Try again": "फिर से कोशिश करें",
  "Voice answer recorded": "वॉइस उत्तर दर्ज किया गया",
  "Selected": "चुना गया",

  // Allergy questions
  "Do you have any known allergies?": "क्या आपको कोई ज्ञात एलर्जी है?",
  "No known allergies": "कोई ज्ञात एलर्जी नहीं",
  "Medicine allergy": "दवाई से एलर्जी",
  "Food allergy": "खाने से एलर्जी",
  "Dust / Pollen allergy": "धूल / पराग से एलर्जी",
  "Are you allergic to any medicines?": "क्या आपको किसी दवाई से एलर्जी है?",
  "Yes — Penicillin / Antibiotics": "हाँ — पेनिसिलिन / एंटीबायोटिक",
  "Yes — Painkillers (NSAIDs)": "हाँ — दर्दनिवारक (NSAIDs)",
  "Yes — Other medicines": "हाँ — अन्य दवाइयाँ",

  // Medical stream
  "Step 5 · Medical stream": "चरण 5 · चिकित्सा पद्धति",
  "Select Medical Stream": "चिकित्सा पद्धति चुनें",
  "Choose clinical evaluation methodology": "नैदानिक मूल्यांकन पद्धति चुनें",
  "Confirm & Continue": "पक्का करें और जारी रखें",

  "Step 5 · Previous records": "चरण 5 · पुराने रिकॉर्ड",
  "Step 6 · Previous records": "चरण 6 · पुराने रिकॉर्ड",
  "Do you have old medical papers?": "क्या आपके पास पुराने मेडिकल कागज़ हैं?",
  "You can upload a prescription, lab report, or discharge summary.":
    "आप पर्ची, लैब रिपोर्ट या डिस्चार्ज सारांश अपलोड कर सकते हैं।",
  "Tap to add a document": "दस्तावेज़ जोड़ने के लिए दबाएँ",
  "Process documents": "दस्तावेज़ पढ़ें",
  "Processing…": "प्रक्रिया चल रही है…",
  "Uploading → Extracting text → Identifying information":
    "अपलोड → टेक्स्ट निकालना → जानकारी पहचानना",

  "Step 6 · Check the draft": "चरण 6 · मसौदा जाँचें",
  "Step 7 · Check the draft": "चरण 7 · मसौदा जाँचें",
  "We found these details": "हमें ये जानकारी मिली",
  "Please check the information. You can edit it before sending to your doctor.":
    "कृपया जानकारी जाँच लें। डॉक्टर को भेजने से पहले आप इसे बदल सकते हैं।",
  "Demo data · Please check every detail": "डेमो डेटा · हर जानकारी जाँचें",
  "Past conditions": "पुरानी बीमारियाँ",
  "Medicines listed": "दर्ज दवाइयाँ",
  "Lab result": "लैब रिपोर्ट",
  "No details found": "कोई जानकारी नहीं मिली",
  Edit: "बदलें",
  "These are simulated extracted details for this prototype. They are not medical advice.":
    "ये इस प्रोटोटाइप के लिए बनाई गई नमूना जानकारी है। यह चिकित्सा सलाह नहीं है।",
  "Review my case": "मेरा विवरण देखें",

  "Step 7 · Final check": "चरण 7 · अंतिम जाँच",
  "Step 8 · Final check": "चरण 8 · अंतिम जाँच",
  "Is everything correct?": "क्या सब सही है?",
  "Review your information. Your doctor will verify it before care.":
    "अपनी जानकारी देखें। डॉक्टर इलाज से पहले इसे जाँचेंगे।",
  "Chief complaint": "मुख्य शिकायत",
  "Medical stream": "चिकित्सा पद्धति",
  "History of present illness": "वर्तमान बीमारी का विवरण",
  "Past medical history": "पुरानी बीमारी का इतिहास",
  Medications: "दवाइयाँ",
  Allergies: "एलर्जी",
  "Previous investigations": "पुरानी जाँचें",
  "Patient details recorded during interview.": "बातचीत के दौरान दर्ज की गई जानकारी।",
  "Not entered": "दर्ज नहीं",
  "Patient answer": "रोगी का उत्तर",
  "🎤 Patient interview": "🎤 रोगी से बातचीत",
  "📄 Uploaded document": "📄 अपलोड किया दस्तावेज़",
  "Patient review": "रोगी की जाँच",
  "No diagnosis or treatment advice is provided by this prototype.":
    "यह प्रोटोटाइप कोई निदान या इलाज की सलाह नहीं देता।",
  Documents: "दस्तावेज़",
  "None uploaded": "कुछ अपलोड नहीं हुआ",
  "Confirm & send to doctor": "पक्का करें और डॉक्टर को भेजें",

  "Ready for physician review": "डॉक्टर की जाँच के लिए तैयार",
  "Your history is ready.": "आपकी जानकारी तैयार है।",
  "your doctor can now review your information before consultation.":
    "आपके डॉक्टर अब परामर्श से पहले आपकी जानकारी देख सकते हैं।",
  "Your token number": "आपका टोकन नंबर",
  "View summary": "सारांश देखें",
  "Doctor view": "डॉक्टर स्क्रीन",
  "Please wait in the queue": "कृपया कतार में प्रतीक्षा करें",
  "New Patient — Start Fresh": "नया मरीज़ — फिर से शुरू करें",
  "Auto-resets in": "स्वतः रीसेट होगा",

  // Mode select
  "Step 1 · Input mode": "चरण 1 · इनपुट मोड",
  "How would you like to answer?": "आप कैसे जवाब देना चाहते हैं?",
  "Touch mode is selected by default": "टच मोड डिफ़ॉल्ट रूप से चुना गया है",
  "Touch / Display Mode": "टच / डिस्प्ले मोड",
  "Tap buttons and type answers on screen": "स्क्रीन पर बटन दबाएँ और उत्तर टाइप करें",
  "Voice Mode": "वॉइस मोड",
  "Questions are read aloud · Answer by speaking": "सवाल जोर से पढ़े जाएंगे · बोलकर जवाब दें",
  "Works in Chrome / Edge": "Chrome / Edge में काम करता है",
  "Questions will be spoken in your selected language. After each question, the mic opens automatically for your answer. Touch buttons are also available as backup.":
    "सवाल आपकी चुनी भाषा में बोले जाएंगे। हर सवाल के बाद माइक खुद खुलेगा। टच बटन भी उपलब्ध हैं।",
  "Question is being read aloud. Speak your answer.": "सवाल जोर से पढ़ा जा रहा है। अपना जवाब बोलें।",
  "Speak now — or tap an answer above": "अभी बोलें — या ऊपर जवाब दबाएँ",
  "Mic will open automatically after question": "सवाल के बाद माइक खुद खुलेगा",

  // Login screen
  "Step 3 · Identify yourself": "चरण 3 · अपनी पहचान बताएं",
  "How would you like to proceed?": "आप कैसे आगे बढ़ना चाहते हैं?",
  "Login with ABHA ID": "ABHA आईडी से लॉगिन करें",
  "Use your Ayushman Bharat Health Account": "अपना आयुष्मान भारत हेल्थ अकाउंट उपयोग करें",
  "Login with Mobile OTP": "मोबाइल OTP से लॉगिन करें",
  "Enter your phone number to receive OTP": "OTP पाने के लिए अपना फोन नंबर डालें",
  "Continue as Guest": "अतिथि के रूप में जारी रखें",
  "No account needed · Records not saved": "कोई खाता नहीं चाहिए · रिकॉर्ड सहेजा नहीं जाएगा",
  "Step 3 · ABHA Login": "चरण 3 · ABHA लॉगिन",
  "Enter your ABHA ID": "अपनी ABHA आईडी दर्ज करें",
  "Your 14-digit health account number or @abdm address": "आपका 14-अंकीय स्वास्थ्य खाता नंबर या @abdm पता",
  "ABHA ID / Address": "ABHA आईडी / पता",
  "Verify & Continue": "सत्यापित करें और जारी रखें",
  "Step 3 · Mobile Login": "चरण 3 · मोबाइल लॉगिन",
  "Enter your mobile number": "अपना मोबाइल नंबर दर्ज करें",
  "Mobile Number": "मोबाइल नंबर",
  "Send OTP": "OTP भेजें",
  "Step 3 · Guest Mode": "चरण 3 · अतिथि मोड",
  "Continuing without account": "बिना खाते के जारी",

  Back: "पीछे",
  Continue: "आगे बढ़ें",

  // Exit session
  "Exit Session": "सत्र समाप्त करें",
  "Are you sure you want to exit?": "क्या आप वाकई बाहर जाना चाहते हैं?",
  "All your information will be cleared and the kiosk will reset for the next patient.":
    "आपकी सभी जानकारी मिट जाएगी और कियोस्क अगले मरीज़ के लिए रीसेट हो जाएगा।",
  "Yes, exit now": "हाँ, अभी बाहर जाएं",
  "No, go back": "नहीं, वापस जाएं",

  // Voice-fill details
  "Please say your full name.": "कृपया अपना पूरा नाम बोलें।",
  "Please say your age in years.": "कृपया अपनी उम्र साल में बोलें।",
  "Please say Male, Female, or Other.": "कृपया पुरुष, महिला, या अन्य बोलें।",
  "Please say your main problem — Fever, Abdominal pain, Headache, Cough, or Chest pain.":
    "कृपया अपनी मुख्य समस्या बोलें — बुखार, पेट दर्द, सिर दर्द, खाँसी, या छाती दर्द।",
  "Name saved": "नाम सहेजा",
  "Age saved": "उम्र सहेजी",
  "Gender saved": "लिंग सहेजा",
  "Complaint saved": "समस्या सहेजी",
  "Say your name": "अपना नाम बोलें",
  "Say your age": "अपनी उम्र बोलें",
  "Say Male, Female, or Other": "पुरुष, महिला, या अन्य बोलें",
  "Say your main problem": "अपनी मुख्य समस्या बोलें",
  "Tap mic or type below": "माइक दबाएँ या नीचे लिखें",
};

const gu: Dict = {
  "AI-assisted pre-consultation": "એઆઈ-સહાયિત પૂર્વ-પરામર્શ",
  "Kiosk 04 · North Wing": "કિઓસ્ક 04 · નોર્થ વિંગ",
  Doctor: "ડૉક્ટર",
  "Self-service check-in": "સ્વયં ચેક-ઇન",
  "Begin your": "શરૂ કરો તમારું",
  "check-in": "ચેક-ઇન",
  "Answer a few simple questions so your doctor is ready when you are.":
    "થોડા સરળ પ્રશ્નોના જવાબ આપો, જેથી તમારા ડૉક્ટર પહેલેથી તૈયાર હોય.",
  "Choose your language": "તમારી ભાષા પસંદ કરો",
  Start: "શરૂ કરો",
  "Safe, simple, patient-first · This kiosk does not provide a diagnosis":
    "સુરક્ષિત, સરળ, દર્દી-પ્રથમ · આ કિઓસ્ક કોઈ નિદાન આપતું નથી",

  "Step 2 · Your privacy": "પગલું 2 · તમારી ગોપનીયતા",
  "Can we collect your health details?": "શું અમે તમારી આરોગ્ય માહિતી લઈ શકીએ?",
  "We will use your answers and previous records to prepare your consultation history.":
    "તમારા જવાબો અને જૂના રેકોર્ડથી અમે તમારી પરામર્શ માહિતી તૈયાર કરીશું.",
  Listen: "સાંભળો",
  "Hear this": "આ સાંભળો",
  "Your choice": "તમારી પસંદગી",
  "Your information helps your doctor prepare. A staff member can help you at any time.":
    "તમારી માહિતી ડૉક્ટરને તૈયારીમાં મદદ કરે છે. સ્ટાફ ગમે ત્યારે મદદ કરશે.",
  "I agree to continue": "હું સંમત છું, આગળ વધો",
  "This prototype does not provide medical diagnosis.": "આ પ્રોટોટાઇપ કોઈ તબીબી નિદાન આપતું નથી.",

  "Step 3 · About you": "પગલું 3 · તમારા વિશે",
  "Step 4 · About you": "પગલું 4 · તમારા વિશે",
  "Tell us about yourself": "તમારા વિશે જણાવો",
  "Use the boxes below. You can ask for help.": "નીચેના બોક્સ ભરો. તમે મદદ માંગી શકો છો.",
  "Your name": "તમારું નામ",
  "Type your name": "તમારું નામ લખો",
  "Your age": "તમારી ઉંમર",
  "Example: 52": "ઉદાહરણ: 52",
  "I am": "હું છું",
  Male: "પુરુષ",
  Female: "સ્ત્રી",
  Other: "અન્ય",
  "Main problem": "મુખ્ય તકલીફ",

  Fever: "તાવ",
  "Abdominal pain": "પેટમાં દુખાવો",
  Headache: "માથાનો દુખાવો",
  Cough: "ઉધરસ",
  "Chest pain": "છાતીમાં દુખાવો",

  "Step 4 · Tell us": "પગલું 4 · અમને જણાવો",
  "Step 5 · Tell us": "પગલું 5 · અમને જણાવો",
  "Tap one answer, or speak your answer.": "એક જવાબ પસંદ કરો, અથવા બોલીને જણાવો.",
  "Next question": "આગળનો પ્રશ્ન",
  "Next: records": "આગળ: રિપોર્ટ",
  Speak: "બોલો",
  "Listening…": "સાંભળી રહ્યા છીએ…",
  "Understanding…": "સમજી રહ્યા છીએ…",
  "Got it": "મળી ગયું",
  "Tap the microphone and say your answer": "માઇક દબાવો અને તમારો જવાબ બોલો",
  Transcription: "લખાણ",
  "Voice help is optional": "અવાજની મદદ વૈકલ્પિક છે",
  "Demo voice mode": "ડેમો વોઇસ મોડ",
  "Potential red flag detected.": "સંભવિત ગંભીર સંકેત મળ્યો.",
  "Please alert medical staff. This is not a diagnosis.":
    "કૃપા કરીને તબીબી સ્ટાફને જાણ કરો. આ નિદાન નથી.",

  // Voice confirmation
  "Did you mean this?": "શું તમારો આ મતલબ હતો?",
  "This answer will be saved as free text for your doctor.": "આ જવાબ તમારા ડૉક્ટર માટે ટેક્સ્ટ તરીકે સહેજ કરાશે.",
  "Yes, that's correct": "હા, આ સાચું છે",
  "Try again": "ફરી પ્રયાસ કરો",
  "Voice answer recorded": "વૉઇસ જવાબ નોંધાયો",
  "Selected": "પસંદ કરાયું",

  // Allergy questions
  "Do you have any known allergies?": "શું તમને કોઈ જાણીતી એલર્જી છે?",
  "No known allergies": "કોઈ જાણીતી એલર્જી નથી",
  "Medicine allergy": "દવાથી એલર્જી",
  "Food allergy": "ખોરાકથી એલર્જી",
  "Dust / Pollen allergy": "ધૂળ / પરાગથી એલર્જી",
  "Are you allergic to any medicines?": "શું તમને કોઈ દવાથી એલર્જી છે?",
  "Yes — Penicillin / Antibiotics": "હા — પેનિસિલિન / એન્ટિબાયોટિક",
  "Yes — Painkillers (NSAIDs)": "હા — દર્દ-નિવારક (NSAIDs)",
  "Yes — Other medicines": "હા — અન્ય દવાઓ",

  // Medical stream
  "Step 5 · Medical stream": "પગલું 5 · તબીબી પ્રવાહ",
  "Select Medical Stream": "તબીબી પ્રવાહ પસંદ કરો",
  "Choose clinical evaluation methodology": "ક્લિનિકલ મૂલ્યાંકન પદ્ધતિ પસંદ કરો",
  "Confirm & Continue": "પક્કું કરો અને આગળ વધો",

  "Step 5 · Previous records": "પગલું 5 · જૂના રેકોર્ડ",
  "Step 6 · Previous records": "પગલું 6 · જૂના રેકોર્ડ",
  "Do you have old medical papers?": "શું તમારી પાસે જૂના મેડિકલ કાગળ છે?",
  "You can upload a prescription, lab report, or discharge summary.":
    "તમે પ્રિસ્ક્રિપ્શન, લેબ રિપોર્ટ કે ડિસ્ચાર્જ સારાંશ અપલોડ કરી શકો છો.",
  "Tap to add a document": "દસ્તાવેજ ઉમેરવા દબાવો",
  "Process documents": "દસ્તાવેજ વાંચો",
  "Processing…": "પ્રક્રિયા ચાલુ છે…",
  "Uploading → Extracting text → Identifying information":
    "અપલોડ → લખાણ કાઢવું → માહિતી ઓળખવી",

  "Step 6 · Check the draft": "પગલું 6 · ડ્રાફ્ટ તપાસો",
  "Step 7 · Check the draft": "પગલું 7 · ડ્રાફ્ટ તપાસો",
  "We found these details": "અમને આ માહિતી મળી",
  "Please check the information. You can edit it before sending to your doctor.":
    "કૃપા કરીને માહિતી તપાસો. ડૉક્ટરને મોકલતા પહેલાં તમે તેને બદલી શકો છો.",
  "Demo data · Please check every detail": "ડેમો ડેટા · દરેક વિગત તપાસો",
  "Past conditions": "જૂની બીમારીઓ",
  "Medicines listed": "નોંધાયેલી દવાઓ",
  "Lab result": "લેબ રિપોર્ટ",
  "No details found": "કોઈ માહિતી મળી નથી",
  Edit: "બદલો",
  "These are simulated extracted details for this prototype. They are not medical advice.":
    "આ પ્રોટોટાઇપ માટે બનાવેલી નમૂના માહિતી છે. આ તબીબી સલાહ નથી.",
  "Review my case": "મારી વિગત જુઓ",

  "Step 7 · Final check": "પગલું 7 · અંતિમ તપાસ",
  "Step 8 · Final check": "પગલું 8 · અંતિમ તપાસ",
  "Is everything correct?": "શું બધું સાચું છે?",
  "Review your information. Your doctor will verify it before care.":
    "તમારી માહિતી તપાસો. ડૉક્ટર સારવાર પહેલાં તેની ખાતરી કરશે.",
  "Chief complaint": "મુખ્ય ફરિયાદ",
  "Medical stream": "તબીબી પ્રવાહ",
  "History of present illness": "હાલની બીમારીની વિગત",
  "Past medical history": "જૂની બીમારીનો ઇતિહાસ",
  Medications: "દવાઓ",
  Allergies: "એલર્જી",
  "Previous investigations": "જૂની તપાસો",
  "Patient details recorded during interview.": "વાતચીત દરમિયાન નોંધાયેલી માહિતી.",
  "Not entered": "નોંધ્યું નથી",
  "Patient answer": "દર્દીનો જવાબ",
  "🎤 Patient interview": "🎤 દર્દી સાથે વાતચીત",
  "📄 Uploaded document": "📄 અપલોડ કરેલ દસ્તાવેજ",
  "Patient review": "દર્દીની ચકાસણી",
  "No diagnosis or treatment advice is provided by this prototype.":
    "આ પ્રોટોટાઇપ કોઈ નિદાન કે સારવારની સલાહ આપતું નથી.",
  Documents: "દસ્તાવેજો",
  "None uploaded": "કંઈ અપલોડ થયું નથી",
  "Confirm & send to doctor": "ખાતરી કરો અને ડૉક્ટરને મોકલો",

  "Ready for physician review": "ડૉક્ટરની ચકાસણી માટે તૈયાર",
  "Your history is ready.": "તમારી માહિતી તૈયાર છે.",
  "your doctor can now review your information before consultation.":
    "તમારા ડૉક્ટર હવે પરામર્શ પહેલાં તમારી માહિતી જોઈ શકે છે.",
  "Your token number": "તમારો ટોકન નંબર",
  "View summary": "સારાંશ જુઓ",
  "Doctor view": "ડૉક્ટર સ્ક્રીન",
  "New Patient — Start Fresh": "નવો દર્દી — ફરીથી શરૂ કરો",
  "Auto-resets in": "સ્વ-રીસેટ",

  // Mode select
  "Step 1 · Input mode": "પગલું 1 · ઇનપુટ મોડ",
  "How would you like to answer?": "તમે કેવી રીતે જવાબ આપવા માંગો છો?",
  "Touch mode is selected by default": "ટચ મોડ ડિફૉલ્ટ રૂપે પસંદ છે",
  "Touch / Display Mode": "ટચ / ડિસ્પ્લે મોડ",
  "Tap buttons and type answers on screen": "સ્ક્રીન પર બટન દબાવો અને જવાબ ટાઇપ કરો",
  "Voice Mode": "વૉઇસ મોડ",
  "Questions are read aloud · Answer by speaking": "સવાલ મોટેથી વાંચવામાં આવશે · બોલીને જવાબ આપો",
  "Works in Chrome / Edge": "Chrome / Edge માં કામ કરે છે",
  "Questions will be spoken in your selected language. After each question, the mic opens automatically for your answer. Touch buttons are also available as backup.":
    "સવાલ તમારી ભાષામાં બોલવામાં આવશે. દરેક સવાલ પછી માઇક આપોઆપ ખૂલશે. ટચ બટન પણ ઉપલબ્ધ છે.",
  "Question is being read aloud. Speak your answer.": "સવાલ મોટેથી વાંચવામાં આવી રહ્યો છે. તમારો જવાબ બોલો.",
  "Speak now — or tap an answer above": "હવે બોલો — અથવા ઉપર જવાબ દબાવો",
  "Mic will open automatically after question": "સવાલ પછી માઇક આપોઆપ ખૂલશે",

  // Login screen
  "Step 3 · Identify yourself": "પગલું 3 · તમારી ઓળખ આપો",
  "How would you like to proceed?": "તમે કેવી રીતે આગળ વધવા માંગો છો?",
  "Login with ABHA ID": "ABHA ID થી લૉગિન કરો",
  "Use your Ayushman Bharat Health Account": "તમારો આયુષ્માન ભારત હેલ્થ અકાઉન્ટ ઉપયોગ કરો",
  "Login with Mobile OTP": "મોબાઇલ OTP થી લૉગિન કરો",
  "Enter your phone number to receive OTP": "OTP મેળવવા ફોન નંબર દાખલ કરો",
  "Continue as Guest": "અતિથિ તરીકે ચાલુ રાખો",
  "No account needed · Records not saved": "કોઈ ખાતું જરૂરી નથી · રેકોર્ડ સહેજ નહીં",
  "Step 3 · ABHA Login": "પગલું 3 · ABHA લૉગિન",
  "Enter your ABHA ID": "તમારી ABHA ID દાખલ કરો",
  "Your 14-digit health account number or @abdm address": "14 અંકનો સ્વાસ્થ્ય ખાતા નંબર અથવા @abdm સરનામું",
  "ABHA ID / Address": "ABHA ID / સરનામું",
  "Verify & Continue": "ચકાસો અને આગળ વધો",
  "Step 3 · Mobile Login": "પગલું 3 · મોબાઇલ લૉગિન",
  "Enter your mobile number": "તમારો મોબાઇલ નંબર દાખલ કરો",
  "Mobile Number": "મોબાઇલ નંબર",
  "Send OTP": "OTP મોકલો",
  "Step 3 · Guest Mode": "પગલું 3 · અતિથિ મોડ",
  "Continuing without account": "ખાતા વિના ચાલુ",

  Back: "પાછળ",
  Continue: "આગળ વધો",

  // Exit session
  "Exit Session": "સત્ર સમાપ્ત કરો",
  "Are you sure you want to exit?": "શું તમે ખરેખર બહાર જવા માંગો છો?",
  "All your information will be cleared and the kiosk will reset for the next patient.":
    "તમારી બધી માહિતી ભૂંસાઈ જશે અને કિઓસ્ક આગળના દર્દી માટે રીસેટ થશે.",
  "Yes, exit now": "હા, હવે બહાર જાઓ",
  "No, go back": "ના, પાછળ જાઓ",

  // Voice-fill details
  "Please say your full name.": "કૃપા કરીને તમારું પૂરું નામ બોલો.",
  "Please say your age in years.": "કૃપા કરીને તમારી ઉંમર વર્ષોમાં બોલો.",
  "Please say Male, Female, or Other.": "કૃપા કરીને પુરુષ, સ્ત્રી, અથવા અન્ય બોલો.",
  "Please say your main problem — Fever, Abdominal pain, Headache, Cough, or Chest pain.":
    "કૃપા કરીને તમારી મુખ્ય તકલીફ બોલો — તાવ, પેટ દુખાવો, માથાનો દુખાવો, ઉધરસ, અથવા છાતી દુખાવો.",
  "Name saved": "નામ સહેજ થયું",
  "Age saved": "ઉંમર સહેજ થઈ",
  "Gender saved": "જાતિ સહેજ થઈ",
  "Complaint saved": "તકલીફ સહેજ થઈ",
  "Say your name": "તમારું નામ બોલો",
  "Say your age": "તમારી ઉંમર બોલો",
  "Say Male, Female, or Other": "પુરુષ, સ્ત્રી, અથવા અન્ય બોલો",
  "Say your main problem": "તમારી મુખ્ય તકલીફ બોલો",
  "Tap mic or type below": "માઇક દબાવો અથવા નીચે લખો",
};

const questionsHi: Dict = {
  "What is your main problem?": "તમારી મુખ્ય તકલીફ શું છે?",
};

const interviewHi: Dict = {
  "What is your main problem?": "आपकी मुख्य समस्या क्या है?",
  "Where exactly is the pain?": "दर्द कहाँ हो रहा है?",
  "When did it start?": "यह कब शुरू हुआ?",
  "How severe is the pain?": "दर्द कितना तेज़ है?",
  "Do you have vomiting?": "क्या उल्टी हो रही है?",
  "Any change in bowel movement?": "क्या शौच में कोई बदलाव है?",
  "When did the fever start?": "बुखार कब शुरू हुआ?",
  "How high was the fever?": "बुखार कितना तेज़ था?",
  "Do you have cough?": "क्या खाँसी है?",
  "Do you have body pain?": "क्या बदन दर्द है?",
  "When did the headache start?": "सिर दर्द कब शुरू हुआ?",
  "Where is the pain?": "दर्द कहाँ है?",
  "How severe is it?": "यह कितना तेज़ है?",
  "Do you feel dizzy?": "क्या चक्कर आते हैं?",
  "When did the cough start?": "खाँसी कब शुरू हुई?",
  "Is there mucus?": "क्या बलगम आता है?",
  "Do you have fever?": "क्या बुखार है?",
  "Do you feel breathless?": "क्या साँस फूलती है?",
  "How severe is the chest pain?": "छाती का दर्द कितना तेज़ है?",
  "Have you fainted or felt like fainting?": "क्या आप बेहोश हुए या ऐसा लगा?",
  "Does it spread to your arm or jaw?": "क्या दर्द हाथ या जबड़े तक जाता है?",
  "What would you like to tell us?": "आप हमें क्या बताना चाहेंगे?",
  "Pain in my stomach": "पेट में दर्द",
  "Burning feeling": "जलन",
  "Something else": "कुछ और",
  "Upper abdomen": "ऊपरी पेट",
  "Around the navel": "नाभि के पास",
  "Lower abdomen": "निचला पेट",
  "All over": "पूरे में",
  Today: "आज",
  Yesterday: "कल",
  "A few days ago": "कुछ दिन पहले",
  "More than a week ago": "एक हफ्ते से ज़्यादा",
  Mild: "हल्का",
  Moderate: "मध्यम",
  Severe: "तेज़",
  No: "नहीं",
  Yes: "हाँ",
  "No change": "कोई बदलाव नहीं",
  "Loose motion": "दस्त",
  Constipation: "कब्ज़",
  "I do not know": "मुझे नहीं पता",
  High: "बहुत तेज़",
  Front: "आगे",
  Back: "पीछे",
  "One side": "एक तरफ",
  "I am not sure": "मुझे ठीक से पता नहीं",

  // Allergy questions (shared with interview)
  "Do you have any known allergies?": "क्या आपको कोई ज्ञात एलर्जी है?",
  "No known allergies": "कोई ज्ञात एलर्जी नहीं",
  "Medicine allergy": "दवाई से एलर्जी",
  "Food allergy": "खाने से एलर्जी",
  "Dust / Pollen allergy": "धूल / पराग से एलर्जी",
  "Not sure": "पक्का नहीं",
  "Are you allergic to any medicines?": "क्या आपको किसी दवाई से एलर्जी है?",
  "Yes — Penicillin / Antibiotics": "हाँ — पेनिसिलिन / एंटीबायोटिक",
  "Yes — Painkillers (NSAIDs)": "हाँ — दर्दनिवारक (NSAIDs)",
  "Yes — Other medicines": "हाँ — अन्य दवाइयाँ",
};

const interviewGu: Dict = {
  "What is your main problem?": "તમારી મુખ્ય તકલીફ શું છે?",
  "Where exactly is the pain?": "દુખાવો ક્યાં થાય છે?",
  "When did it start?": "આ ક્યારે શરૂ થયું?",
  "How severe is the pain?": "દુખાવો કેટલો તીવ્ર છે?",
  "Do you have vomiting?": "શું ઉલટી થાય છે?",
  "Any change in bowel movement?": "શું શૌચમાં કોઈ ફેરફાર છે?",
  "When did the fever start?": "તાવ ક્યારે શરૂ થયો?",
  "How high was the fever?": "તાવ કેટલો હતો?",
  "Do you have cough?": "શું ઉધરસ છે?",
  "Do you have body pain?": "શું શરીરમાં દુખાવો છે?",
  "When did the headache start?": "માથાનો દુખાવો ક્યારે શરૂ થયો?",
  "Where is the pain?": "દુખાવો ક્યાં છે?",
  "How severe is it?": "તે કેટલો તીવ્ર છે?",
  "Do you feel dizzy?": "શું ચક્કર આવે છે?",
  "When did the cough start?": "ઉધરસ ક્યારે શરૂ થઈ?",
  "Is there mucus?": "શું કફ આવે છે?",
  "Do you have fever?": "શું તાવ છે?",
  "Do you feel breathless?": "શું શ્વાસ ચઢે છે?",
  "How severe is the chest pain?": "છાતીનો દુખાવો કેટલો તીવ્ર છે?",
  "Have you fainted or felt like fainting?": "શું તમે બેભાન થયા કે એવું લાગ્યું?",
  "Does it spread to your arm or jaw?": "શું દુખાવો હાથ કે જડબા સુધી જાય છે?",
  "What would you like to tell us?": "તમે અમને શું જણાવવા માંગો છો?",
  "Pain in my stomach": "પેટમાં દુખાવો",
  "Burning feeling": "બળતરા",
  "Something else": "બીજું કંઈક",
  "Upper abdomen": "ઉપરનું પેટ",
  "Around the navel": "નાભિની આસપાસ",
  "Lower abdomen": "નીચેનું પેટ",
  "All over": "આખા પેટમાં",
  Today: "આજે",
  Yesterday: "ગઈકાલે",
  "A few days ago": "થોડા દિવસ પહેલાં",
  "More than a week ago": "એક અઠવાડિયાથી વધુ",
  Mild: "હળવો",
  Moderate: "મધ્યમ",
  Severe: "તીવ્ર",
  No: "ના",
  Yes: "હા",
  "No change": "કોઈ ફેરફાર નથી",
  "Loose motion": "ઝાડા",
  Constipation: "કબજિયાત",
  "I do not know": "મને ખબર નથી",
  High: "ખૂબ વધારે",
  Front: "આગળ",
  Back: "પાછળ",
  "One side": "એક બાજુ",
  "I am not sure": "મને ચોક્કસ ખબર નથી",

  // Allergy questions (shared with interview)
  "Do you have any known allergies?": "શું તમને કોઈ જાણીતી એલર્જી છે?",
  "No known allergies": "કોઈ જાણીતી એલર્જી નથી",
  "Medicine allergy": "દવાથી એલર્જી",
  "Food allergy": "ખોરાકથી એલર્જી",
  "Dust / Pollen allergy": "ધૂળ / પરાગથી એલર્જી",
  "Not sure": "ચોક્કસ નહીં",
  "Are you allergic to any medicines?": "શું તમને કોઈ દવાથી એલર્જી છે?",
  "Yes — Penicillin / Antibiotics": "હા — પેનિસિલિન / એન્ટિબાયોટિક",
  "Yes — Painkillers (NSAIDs)": "હા — દર્દ-નિવારક (NSAIDs)",
  "Yes — Other medicines": "હા — અન્ય દવાઓ",
};

void questionsHi;

const dictionaries: Record<Lang, Dict> = {
  en: {},
  hi: { ...interviewHi, ...hi },
  gu: { ...interviewGu, ...gu },
};

export function translate(lang: Lang, text: string): string {
  return dictionaries[lang][text] ?? text;
}

export function makeT(lang: Lang) {
  return (text: string) => translate(lang, text);
}

export type T = ReturnType<typeof makeT>;
