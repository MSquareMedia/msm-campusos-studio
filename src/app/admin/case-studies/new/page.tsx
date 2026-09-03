import type { Metadata } from "next";
import { CaseStudyForm } from "../CaseStudyForm";

export const metadata: Metadata = {
  title: "New case study, admin",
  robots: { index: false, follow: false },
};

export default function NewCaseStudyPage() {
  return (
    <div className="container-page">
      <h1 className="font-display pt-8 text-2xl font-bold">New case study</h1>
      <CaseStudyForm />
    </div>
  );
}
