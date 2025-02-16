import React from "react";
import { Microscope, Briefcase, GraduationCap, Code, Trophy } from "lucide-react";

export const getCategoryColor = (category: string) => {
  switch(category) {
    case "research":
      return "text-purple-400";
    case "internship":
      return "text-orange-400";
    case "school project":
      return "text-emerald-400";
    case "personal project":
      return "text-pink-400";
    case "hackathon":
      return "text-cyan-400";
    default:
      return "text-zinc-400";
  }
};

export const getCategoryText = (category: string) => {
  switch(category) {
    case "research":
      return "Research Project";
    case "internship":
      return "Internship Project";
    case "school project":
      return "School Project";
    case "personal project":
      return "Personal Project";
    case "hackathon":
      return "Hackathon Project";
    default:
      return category;
  }
};

export const getCategoryIcon = (category: string): React.ReactNode => {
  switch(category) {
    case "research":
      return <Microscope className="w-4 h-4" />;
    case "internship":
      return <Briefcase className="w-4 h-4" />;
    case "school project":
      return <GraduationCap className="w-4 h-4" />;
    case "personal project":
      return <Code className="w-4 h-4" />;
    case "hackathon":
      return <Trophy className="w-4 h-4" />;
    default:
      return null;
  }
}; 