"use client";

import { useEffect } from "react";
import { logActivity, type ActivityType } from "@/lib/activity";

type Props = {
  type: ActivityType;
  page: string;
  lessonId?: string;
};

export default function ActivityTracker({ type, page, lessonId }: Props) {
  useEffect(() => {
    logActivity(type, { page, lessonId });
  }, [type, page, lessonId]);

  return null;
}
