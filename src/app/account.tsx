import { useState } from "react";
import { Redirect, router, type Href } from "expo-router";
import { Linking, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  Brand,
  Button,
  Heading,
  Notice,
  Screen,
  s,
} from "@/components/access/ui";
import { usePreviewSession } from "@/features/access/preview-session";
import { useNotificationPermission } from "@/features/access/use-notifications";
import { colors } from "@/constants/colors";
import { useRenter } from "@/features/renter/state";
import { RenterTabs } from "@/features/renter/screens";

import { ProviderTabs } from "@/features/provider/screens";
import { useProvider } from "@/features/provider/state";

export default function AccountScreen() {
  const session = usePreviewSession();
  const renter = useRenter();
  const provider = useProvider();
  const permission = useNotificationPermission();
  const [error, setError] = useState("");
  const [confirmLogout, setConfirmLogout] = useState(false);
  if (!session.user) return <Redirect href="/auth/login" />;
  const { email, role } = session.user;
  return (
    <Screen
      footer={
        role === "renter" ? (
          <RenterTabs selected="account" />
        ) : (
          <ProviderTabs selected="account" />
        )
      }
    >
      <Brand />
      <Heading title="Account" />
      {role === "renter" && (
        <Button
          title="Find matching rooms"
          onPress={() => router.push("/renter" as Href)}
        />
      )}
      <View style={s.card}>
        <Feather name="user" size={36} color={colors.evergreen} />
        <Text style={s.cardTitle}>
          Demo {role === "provider" ? "Provider" : "Renter"}
        </Text>
        <Text style={s.body}>{email}</Text>
        <Text style={s.badge}>{role}</Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>Notifications</Text>
        <Text style={s.label}>
          Notification permission · {permission.status}
        </Text>
        <Text style={s.body}>Negotiation updates and booking outcomes.</Text>
        <Button
          secondary
          title="Open device settings"
          onPress={async () => {
            try {
              await Linking.openSettings();
            } catch {
              setError(
                "Open your phone settings to manage notification permissions.",
              );
            }
          }}
        />
      </View>
      {!!error && <Notice error>{error}</Notice>}
      <Notice>
        {role === "provider"
          ? "Private listing limits are visible only to you and authorized agent processing."
          : "Your preferences and negotiation limits are private to your account and authorized agent processing."}
      </Notice>
      <Notice>
        Frontend preview session. Push delivery and account authentication will
        be connected with the backend.
      </Notice>
      {role === "provider" && <Button secondary title="View original prototype" onPress={() => router.push("/provider/reference" as Href)} />}
      {confirmLogout ? (
        <View style={s.card}>
          <Text style={s.cardTitle}>Log out of this preview?</Text>
          <Button
            title="Log out"
            onPress={() => {
              session.logout();
              renter.reset();
              provider.reset();
              router.replace("/auth/login");
            }}
          />
          <Button
            secondary
            title="Cancel"
            onPress={() => setConfirmLogout(false)}
          />
        </View>
      ) : (
        <Button
          secondary
          title="Log out"
          onPress={() => setConfirmLogout(true)}
        />
      )}
    </Screen>
  );
}
