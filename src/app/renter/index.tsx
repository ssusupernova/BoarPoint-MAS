import { Redirect } from "expo-router";
import { usePreviewSession } from "@/features/access/preview-session";
import { Requirements } from "@/features/renter/screens";
export default function RenterHome() {
  const { user } = usePreviewSession();
  if (!user || user.role !== "renter") return <Redirect href="/auth/login" />;
  return <Requirements />;
}
