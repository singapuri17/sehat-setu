# MediKiosk — Digital Health & Appointment System

**SIH 2026 · Problem Statement: Digital Health Monitoring and Appointment Support System**

> Long waiting times, difficulty managing appointments, lack of timely reminders and limited access to basic health information.

---

## What MediKiosk does

MediKiosk is a multimodal digital health platform for busy Indian public healthcare facilities. It addresses the SIH problem statement directly:

| Feature | How |
|---|---|
| **Appointment management** | Book, track and update OPD appointments from kiosk or phone |
| **Live queue tracking** | Real-time queue position and estimated wait time on `/portal` |
| **Timely reminders** | SMS + Email reminders sent day-before and on the day (via `/api/notify`) |
| **Follow-up scheduling** | Doctor books follow-up from dashboard; patient gets automatic reminder |
| **Basic health info access** | Pre-consultation history, doctor notes, lab extracts all available on patient portal |
| **AI-assisted intake** | Voice + touch clinical history in English / हिन्दी / ગુજરાતી via Bhashini |
| **Kiosk + Mobile** | Same engine served via hospital kiosk OR patient's own phone (QR scan) |

---

## Routes

| URL | Purpose |
|---|---|
| `/` | Hospital kiosk — full pre-consultation + appointment creation |
| `/mobile` | Patient's phone intake (same clinical engine) |
| `/portal` | **Patient portal** — appointments, queue position, reminders, follow-ups |
| `/api/appointment` | Appointment CRUD (GET / POST / PATCH) |
| `/api/notify` | SMS / Email reminder dispatch (simulated; wire Twilio/MSG91 for prod) |
| `/api/session` | Session management for kiosk↔phone handoff |
| `/api/bhashini` | Bhashini Dhruva ASR proxy (Hindi / Gujarati voice) |
| `/api/bhashini-tts` | Bhashini Dhruva TTS proxy |
| `/api/whisper` | OpenAI Whisper ASR fallback (English) |

---

## Environment variables

```
# Bhashini (ASR + TTS for Hindi / Gujarati)
BHASHINI_USER_ID=your-user-id
BHASHINI_UDYAT_KEY=your-udyat-key
BHASHINI_API_KEY=your-inference-key

# OpenAI Whisper (English ASR fallback)
OPENAI_API_KEY=sk-...
```

---

## Safety

This is a prototype. It does **not** provide medical diagnosis or treatment recommendations. All AI-generated content is clearly labelled as a draft requiring physician verification.

---

## Development

```sh
git clone <this-repository-url>
cd medikiosk-ayush
bun install
bun run dev
```

Open `http://localhost:8080`.

Built with [Lovable](https://lovable.dev) · **Live app**: https://medikiosk-ayush.lovable.app


PROJECT PURPOSE:

MediKiosk is an AI-assisted pre-consultation patient intake system for crowded Indian hospitals. The goal of this prototype is to demonstrate how a patient can use a self-service kiosk to provide medical history through voice/touch interaction, upload previous medical documents, and have the resulting structured patient case delivered to a doctor before consultation.

IMPORTANT:

This is a prototype/demo, NOT a real medical diagnosis system.

Do not provide medical diagnosis or treatment recommendations.

AI-generated information must always be presented as a draft that requires physician verification.

TARGET USERS:

1. Patient using a hospital kiosk

2. Doctor reviewing the patient's pre-consultation case

TECH STACK:

- React

- TypeScript

- Tailwind CSS

- Modern component architecture

- Supabase-ready architecture for database/storage

- Prepare clean service layers so external APIs such as Bhashini and Gemini can be connected later.

- Do NOT hardcode API keys in frontend code.

DESIGN:

Create a professional hospital/healthcare kiosk interface.

Use a clean white/light interface with calm medical styling.

Use large accessible buttons, large typography, clear icons and minimal text.

The patient interface must look like a self-service kiosk rather than a normal SaaS dashboard.

The doctor interface should look like a professional clinical dashboard.

Make the entire application responsive, but prioritize a 16:9 desktop/kiosk screen.

Use subtle animations only where useful.

Do not overuse gradients or decorative elements.

MAIN PATIENT FLOW:

1. WELCOME SCREEN

Display:

"MediKiosk"

"AI-assisted pre-consultation"

Subtitle:

"Complete your medical history before meeting your doctor."

Language buttons:

- English

- हिन्दी

- ગુજરાતી

Button:

"Start"

2. CONSENT SCREEN

Explain in simple language:

"We will collect your health information and previous medical records to prepare your consultation history."

Include:

- Listen button

- Consent checkbox

- Continue button

Add a small note:

"This prototype does not provide medical diagnosis."

3. PATIENT DETAILS

Fields:

- Patient name

- Age

- Gender

- Preferred language

Buttons:

Back

Continue

4. ADAPTIVE MEDICAL HISTORY INTERVIEW

Create an interactive questionnaire.

The interface should show:

- Progress indicator such as "Question 2 of 8"

- Current question

- Large microphone button labelled "Speak"

- Text input fallback

- Multiple-choice answer buttons where appropriate

- Back

- Next

Create predefined adaptive question flows for:

A. Fever

B. Abdominal pain

C. Headache

D. Cough

E. Chest pain

Example:

If chief complaint = abdominal pain:

1. What is your main problem?

2. Where exactly is the pain?

3. When did it start?

4. How severe is the pain?

5. Do you have vomiting?

6. Any change in bowel movement?

If chief complaint = fever:

1. When did the fever start?

2. How high was the fever?

3. Do you have cough?

4. Do you have body pain?

5. Do you have vomiting?

If chest pain is selected, include a visible warning-style UI if the patient reports:

- severe chest pain

- breathlessness

- fainting

- pain spreading to arm/jaw

The warning should say:

"Potential red flag detected. Please alert medical staff."

Do NOT diagnose the patient.

For the prototype, adaptive logic can be implemented using frontend state and predefined question trees. Do not build a complex autonomous medical agent.

VOICE PLACEHOLDER:

Create a microphone interaction that visually changes between:

Idle → Listening → Processing → Result.

For now, provide a mock transcription fallback so the full demo can run even without an external speech API.

Example mock voice answer:

"મને કાલથી પેટમાં દુખાવો છે"

Show:

"Transcription: મને કાલથી પેટમાં દુખાવો છે"

Create a service abstraction called speechService so Bhashini ASR can be connected later without redesigning the UI.

5. DOCUMENT UPLOAD

Screen title:

"Previous Medical Records"

Allow upload of:

- Prescription

- Laboratory report

- Discharge summary

- Other medical document

Accept:

PDF, JPG, PNG

Show uploaded documents as cards.

Example:

✓ Blood_Report.pdf

✓ Prescription.jpg

Include a "Process documents" button.

For the prototype, create a realistic document-processing animation:

Uploading → Extracting text → Identifying medical information → Complete

Create a documentService abstraction so OCR/Gemini Vision can be connected later.

6. EXTRACTED INFORMATION SCREEN

Show extracted information in editable cards.

Example:

Past conditions:

Type 2 Diabetes

Medications:

Metformin 500 mg

Lab results:

Hemoglobin — 10.8 g/dL

Status: Below reference range

Do not invent information that the user did not provide.

For demo mode, clearly mark simulated/demo extracted data.

7. PATIENT REVIEW SCREEN

Show a complete structured case:

Chief Complaint

History of Present Illness

Past Medical History

Medications

Allergies

Family History

Personal History

Review of Systems

Previous Investigations

Allow the patient to review and edit information.

Button:

"Confirm & Send to Doctor"

8. SUBMISSION SUCCESS

Display:

"Your medical history has been prepared."

"Your doctor can now review your information before consultation."

Show:

Patient token number

Estimated status: "Ready for physician review"

Button:

"View Summary"

9. DOCTOR LOGIN

Create a simple demo doctor login.

Use demo credentials visually indicated in development/demo mode.

10. DOCTOR DASHBOARD

Create a professional doctor dashboard.

Sidebar:

Dashboard

Patient Queue

Today's Cases

Settings

Main area:

"Patients Ready for Consultation"

Patient cards should display:

- Token number

- Patient name

- Age

- Chief complaint

- Status

- Time submitted

Example:

A-102 | Rahul Patel | 52 | Abdominal pain | Ready

11. DOCTOR CASE VIEW

When the doctor selects a patient, show:

Patient header:

Name

Age

Gender

Token number

Sections:

ATTENTION

Show abnormal lab values and potential red flags here.

CHIEF COMPLAINT

HISTORY OF PRESENT ILLNESS

PAST MEDICAL HISTORY

MEDICATIONS

ALLERGIES

PREVIOUS INVESTIGATIONS

MEDICAL DOCUMENTS

MEDICAL TIMELINE

AI-GENERATED SUMMARY

Each AI-generated section must display a small label:

"AI-generated draft — physician verification required."

Add source indicators where possible:

🎤 Patient interview

📄 Uploaded document

Allow doctor to edit information.

Buttons:

"Edit"

"Verify & Save"

12. MEDICAL TIMELINE

Create a clean vertical timeline.

Example:

2024 — Diabetes diagnosed

2025 — Prescription uploaded

2026 — Blood test

2026 — Current complaint

13. DEMO DATA

Create realistic demo data for at least 3 patients so the doctor dashboard looks populated.

Use fictional patient names and clearly label demo data.

14. ARCHITECTURE

Organize the code cleanly so these services can later be integrated:

speechService

documentService

aiService

patientService

consultationService

Create placeholder functions/interfaces for:

speechToText()

extractDocument()

structureMedicalInformation()

generateCaseSummary()

savePatientCase()

For now these can return mock data.

15. IMPORTANT SAFETY REQUIREMENTS

Do not provide diagnosis.

Do not recommend medicines.

Do not change medication dosage.

Do not claim that AI information is medically verified.

Clearly show:

"AI-generated draft — physician verification required."

16. PROTOTYPE PRIORITY

Prioritize the following end-to-end flow above everything else:

Patient Welcome

→ Language

→ Consent

→ Patient Details

→ Adaptive Questions

→ Document Upload

→ Extracted Information

→ Patient Review

→ Send to Doctor

→ Doctor Dashboard

→ Doctor Case View

→ Doctor Verification

Do NOT build:

- Real ABHA authentication

- Real ABDM integration

- FHIR integration

- Payment

- Appointment booking

- Full hospital management system

- Complex AI diagnosis

- Advanced drug interaction engine

These are future-phase features.

Make the prototype feel like a realistic deployable product while keeping the implementation simple and reliable.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://medikiosk-ayush.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/34251975-1e7c-4e43-b35e-d7b8be29b323).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
