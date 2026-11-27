import { Redirect, useLocalSearchParams } from "expo-router";
import { usePreviewSession } from "@/features/access/preview-session";
import { ProviderStage } from "@/features/provider/screens";
export default function ProviderRoute() {
  const { user } = usePreviewSession();
  const { stage } = useLocalSearchParams<{ stage: string }>();
  if (!user || user.role !== "provider") return <Redirect href="/auth/login" />;
  return <ProviderStage key={stage} stage={stage} />;
}
