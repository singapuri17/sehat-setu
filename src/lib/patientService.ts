export interface PatientCase {
  token: string;
  name: string;
  age: string;
  gender: string;
  complaint: string;
  status: "Ready" | "In review" | "Verified";
  submitted: string;
}

export const demoPatients: PatientCase[] = [
  { token: "A-102", name: "Rahul Patel", age: "52", gender: "Male", complaint: "Abdominal pain", status: "Ready", submitted: "09:42" },
  { token: "A-103", name: "Meena Shah", age: "64", gender: "Female", complaint: "Cough", status: "Ready", submitted: "09:48" },
  { token: "A-104", name: "Arjun Desai", age: "38", gender: "Male", complaint: "Headache", status: "In review", submitted: "10:03" },
];

export async function savePatientCase(patient: PatientCase): Promise<PatientCase> {
  return patient;
}