import { Redirect, router, type Href } from "expo-router";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  Brand,
  Button,
  Heading,
  Notice,
  Screen,
  TextAction,
  s,
} from "@/components/access/ui";
import { usePreviewSession } from "@/features/access/preview-session";
import { useNotificationPermission } from "@/features/access/use-notifications";
import { colors } from "@/constants/colors";

export default function NotificationScreen() {
  const { user } = usePreviewSession();
  const permission = useNotificationPermission();
  if (!user) return <Redirect href="/auth/login" />;
  return (
    <Screen>
      <Brand />
      <View
        style={{
          alignSelf: "center",
          backgroundColor: "#EDE1D9",
          padding: 28,
          borderRadius: 80,
          marginTop: 16,
        }}
      >
        <Feather name="bell" size={72} color={colors.terracotta} />
      </View>
      <Heading
        title="Stay updated"
        subtitle="Get notified when negotiations progress and booking outcomes are ready."
        centered
      />
      <View style={s.card}>
        <Feather name="repeat" size={28} color={colors.evergreen} />
        <Text style={s.cardTitle}>Negotiation updates</Text>
        <Text style={s.body}>Know when your agents reach an outcome.</Text>
      </View>
      <View style={s.card}>
        <Feather name="calendar" size={28} color={colors.evergreen} />
        <Text style={s.cardTitle}>Booking outcomes</Text>
        <Text style={s.body}>See whether your booking is confirmed.</Text>
      </View>
      <Notice>You can still check every result inside the app.</Notice>
      {!!permission.error && <Notice error>{permission.error}</Notice>}
      <Button
        title={
          permission.busy ? "Requesting permission…" : "Enable notifications"
        }
        disabled={permission.busy}
        onPress={async () => {
          if (await permission.request())
            router.replace(
              (user.role === "renter" ? "/renter" : "/account") as Href,
            );
        }}
      />
      <TextAction
        title="Not now"
        onPress={() =>
          router.replace(
            (user.role === "renter" ? "/renter" : "/account") as Href,
          )
        }
      />
      <Text style={[s.body, s.center]}>
        You can change this in device settings.
      </Text>
    </Screen>
  );
}
