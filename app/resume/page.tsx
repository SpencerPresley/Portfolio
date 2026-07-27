import type { Metadata } from "next";
import { ResumeView } from "./resume-view";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Spencer Presley's experience building reliable AI, backend, and platform systems.",
};

export default function ResumePage() {
  return <ResumeView selectedFocus="ai-llm" />;
}
