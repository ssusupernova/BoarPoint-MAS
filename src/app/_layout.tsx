import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PreviewSessionProvider } from "@/features/access/preview-session";
import { RenterProvider } from "@/features/renter/state";
import { colors } from "@/constants/colors";

export default function RootLayout() {
  return (
    <PreviewSessionProvider>
      <RenterProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.ivory },
          }}
        />
      </RenterProvider>
    </PreviewSessionProvider>
  );
}
