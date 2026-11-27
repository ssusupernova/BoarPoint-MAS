import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PreviewSessionProvider } from "@/features/access/preview-session";
import { RenterProvider } from "@/features/renter/state";
import { ProviderStore } from "@/features/provider/state";
import { colors } from "@/constants/colors";

export default function RootLayout() {
  return (
    <PreviewSessionProvider>
      <RenterProvider>
        <ProviderStore>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.ivory },
            }}
          />
        </ProviderStore>
      </RenterProvider>
    </PreviewSessionProvider>
  );
}
