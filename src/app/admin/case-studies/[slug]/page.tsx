import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecordBySlug } from "@/lib/case-studies-content";
import { CaseStudyForm } from "../CaseStudyForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit case study, admin",
  robots: { index: false, follow: false },
};

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await getRecordBySlug(slug);
  if (!record) notFound();

  return (
    <div className="container-page">
      <h1 className="font-display pt-8 text-2xl font-bold">Edit &ldquo;{record.title}&rdquo;</h1>
      <CaseStudyForm record={record} />
    </div>
  );
}
