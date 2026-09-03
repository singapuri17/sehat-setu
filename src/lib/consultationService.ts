import type { PatientCase } from "./patientService";

export interface ConsultationCase extends PatientCase {
  attention: string[];
  history: string;
  medications: string[];
  allergies: string;
  investigations: string[];
  documents: string[];
  timeline: { year: string; event: string }[];
}

export const demoConsultation: ConsultationCase = {
  ...{
    token: "A-102",
    name: "Rahul Patel",
    age: "52",
    gender: "Male",
    complaint: "Abdominal pain",
    status: "Ready",
    submitted: "09:42",
  },
  attention: ["Hemoglobin 10.8 g/dL — below reference range"],
  history: "Patient reports abdominal pain since yesterday. Details are based on the patient interview and are not a diagnosis.",
  medications: ["Metformin 500 mg — listed in uploaded record"],
  allergies: "Not entered",
  investigations: ["Hemoglobin — 10.8 g/dL — below reference range"],
  documents: ["Blood_Report.pdf", "Prescription.jpg"],
  timeline: [
    { year: "2024", event: "Type 2 Diabetes listed in patient record" },
    { year: "2025", event: "Prescription uploaded" },
    { year: "2026", event: "Blood test uploaded" },
    { year: "2026", event: "Current complaint recorded" },
  ],
};