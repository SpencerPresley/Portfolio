import React from "react";
import { Clock, Rocket, CheckCircle, Archive } from "lucide-react";

export const getStatusColor = (status: string) => {
  switch(status) {
    case "in-dev":
      return "text-yellow-400";
    case "ongoing":
      return "text-blue-400";
    case "complete":
      return "text-green-400";
    case "legacy":
      return "text-zinc-400";
    default:
      return "text-zinc-400";
  }
};

export const getStatusText = (status: string) => {
  switch(status) {
    case "in-dev":
      return "Pre-Release Development";
    case "ongoing":
      return "Active Development";
    case "complete":
      return "Complete";
    case "legacy":
      return "Legacy";
    default:
      return status;
  }
};

export const getStatusIcon = (status: string): React.ReactNode => {
  switch(status) {
    case "in-dev":
      return <Clock className="w-4 h-4" />;
    case "ongoing":
      return <Rocket className="w-4 h-4" />;
    case "complete":
      return <CheckCircle className="w-4 h-4" />;
    case "legacy":
      return <Archive className="w-4 h-4" />;
    default:
      return null;
  }
}; 