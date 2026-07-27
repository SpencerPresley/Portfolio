import type { Metadata } from "next";
import { ResumeView } from "../resume-view";

export const metadata: Metadata = {
  title: "Backend & Platform Resume",
  description:
    "Spencer Presley's experience building reliable backend and platform systems.",
};

export default function BackendPlatformResumePage() {
  return <ResumeView selectedFocus="backend-platform" />;
}
