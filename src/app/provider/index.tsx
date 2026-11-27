import { Redirect } from "expo-router";
import { usePreviewSession } from "@/features/access/preview-session";
import { ProviderStage } from "@/features/provider/screens";
export default function ProviderIndex() {
  const { user } = usePreviewSession();
  if (!user || user.role !== "provider") return <Redirect href="/auth/login" />;
  return <ProviderStage />;
}
