import { Redirect, useLocalSearchParams } from "expo-router";
import { usePreviewSession } from "@/features/access/preview-session";
import { RenterStage } from "@/features/renter/screens";
export default function StageRoute() {
  const { user } = usePreviewSession();
  const { stage } = useLocalSearchParams<{ stage: string }>();
  if (!user || user.role !== "renter") return <Redirect href="/auth/login" />;
  return <RenterStage stage={stage} />;
}
