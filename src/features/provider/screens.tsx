import { type PropsWithChildren } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Button, Heading, Notice, Screen, TextAction, s } from "./ui";
import { Prototype } from "./prototype";
import { ReferenceViewer } from "./reference-viewer";
import { colors } from "@/constants/colors";
import { ProviderTabs } from "./tabs";

const photos = {
  sunny: require("../../../assets/images/room-sunny.png"),
  garden: require("../../../assets/images/room-garden.png"),
  studio: require("../../../assets/images/room-studio.png"),
};
const go = (stage: string, id?: string) =>
  router.push(
    `/provider/${stage}${id ? `?id=${encodeURIComponent(id)}` : ""}` as Href,
  );
export { ProviderTabs } from "./tabs";
function Page({
  title,
  subtitle,
  tab,
  back,
  children,
}: PropsWithChildren<{
  title: string;
  subtitle?: string;
  tab?: string;
  back?: () => void;
}>) {
  return (
    <Screen footer={<ProviderTabs selected={tab} />}>
      <View style={st.header}>
        {back && (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={back}
            style={st.back}
          >
            <Feather name="arrow-left" size={24} color={colors.charcoal} />
          </Pressable>
        )}
        <Feather name="home" size={23} color={colors.terracotta} />
        <Text style={st.brand}>MAS Accommodation</Text>
        <Text style={st.pill}>Provider</Text>
      </View>
      <Heading title={title} subtitle={subtitle} />
      {children}
    </Screen>
  );
}
function Card({
  title,
  children,
  edit,
}: PropsWithChildren<{ title?: string; edit?: () => void }>) {
  return (
    <View style={s.card}>
      {title && (
        <View style={st.row}>
          <Text style={[s.cardTitle, { flex: 1 }]}>{title}</Text>
          {edit && <TextAction title="Edit" onPress={edit} />}
        </View>
      )}
      {children}
    </View>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={st.detail}>
      <Text style={[s.body, { flex: 1 }]}>{label}</Text>
      <Text style={st.value}>{value}</Text>
    </View>
  );
}
export function ProviderStage({ stage = "listings" }: { stage?: string }) {
  const { id } = useLocalSearchParams<{ id?: string; saved?: string }>();

  if (stage === "reference") return <ReferenceViewer />;
  if (
    [
      "listings",
      "add",
      "terms",
      "agent",
      "review",
      "listing",
      "negotiations",
      "bookings",
    ].includes(stage)
  )
    return <Prototype key={stage} stage={stage} />;
  if (stage === "negotiation")
    return (
      <Page
        title="Negotiation progress"
        tab="negotiations"
        back={() => router.back()}
      >
        <Text style={st.pill}>
          {id === "agreed"
            ? "Agreement reached"
            : id === "validating"
              ? "Validating agreement"
              : "Agents negotiating"}
        </Text>
        <Card
          title={
            id === "active"
              ? "Quiet Garden Room"
              : id === "validating"
                ? "City Studio Room"
                : "Sunny Private Room"
          }
        >
          <Row
            label="Monthly rent"
            value={
              id === "active"
                ? "₱4,000"
                : id === "validating"
                  ? "₱4,600"
                  : "₱3,300"
            }
          />
          <Row
            label="Deposit"
            value={
              id === "active"
                ? "₱4,000"
                : id === "validating"
                  ? "₱4,600"
                  : "₱3,300"
            }
          />
          <Row label="Lease" value="6 months" />
          <Row label="Move-in" value="2026-12-01" />
          <Row label="Inclusions" value="Wi-Fi + water" />
        </Card>
        <Card title="Offer history">
          {[
            "Renter Agent · Offer — ₱3,100",
            "Provider Agent · Counter — ₱3,500",
            "Renter Agent · Counter — ₱3,200",
            "Provider Agent · Counter — " +
              (id === "active"
                ? "₱4,000"
                : id === "validating"
                  ? "₱4,600"
                  : "₱3,300"),
          ].map((v) => (
            <Text style={s.body} key={v}>
              • {v}
            </Text>
          ))}
        </Card>
        <Notice>
          {id === "active"
            ? "Your agent is evaluating the latest offer."
            : id === "validating"
              ? "Checking terms and availability before a booking can be recorded."
              : "Agreement reached. A booking is confirmed only after validation and availability checks succeed."}{" "}
          This is a fixed demo record.
        </Notice>
        <Button
          secondary
          title="Back to negotiations"
          onPress={() => router.replace("/provider/negotiations" as Href)}
        />
      </Page>
    );
  if (stage === "booking")
    return (
      <Page title="Booking details" tab="bookings" back={() => router.back()}>
        <Text style={st.pill}>Confirmed · demo</Text>
        <Image source={photos.sunny} style={st.hero} />
        <Card title="Sunny Private Room">
          <Row label="Booking ID" value="BK-001" />
          <Row label="Renter" value="Demo Renter" />
          <Row label="Monthly rent" value="₱3,300" />
          <Row label="Deposit" value="₱3,300" />
          <Row label="Lease duration" value="6 months" />
          <Row label="Move-in date" value="2026-12-01" />
          <Row label="Inclusions" value="Wi-Fi + water" />
        </Card>
        <Card title="Booking checks">
          <Text style={s.body}>✓ Terms validated</Text>
          <Text style={s.body}>✓ Availability checked</Text>
          <Text style={s.body}>✓ Booking recorded (sample)</Text>
        </Card>
        <Notice>
          This sample demonstrates a successful booking. It does not reserve a
          real room.
        </Notice>
        <Button
          secondary
          title="View negotiation history"
          onPress={() => go("negotiation", "agreed")}
        />
      </Page>
    );
  return (
    <Page title="Page not found">
      <Button
        title="Back to listings"
        onPress={() => router.replace("/provider" as Href)}
      />
    </Page>
  );
}
const st = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  brand: { flex: 1, fontSize: 16, fontWeight: "700", color: colors.charcoal },
  back: { minWidth: 36, minHeight: 44, justifyContent: "center" },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: "#EDE1D9",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    color: colors.charcoal,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#DEDEDA",
    paddingVertical: 3,
  },
  value: {
    fontWeight: "600",
    color: colors.charcoal,
    maxWidth: "55%",
    textAlign: "right",
    lineHeight: 20,
  },
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
  },
  chip: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.evergreen,
  },
  chosen: { backgroundColor: colors.evergreen },
  hero: { width: "100%", aspectRatio: 4.3, borderRadius: 9, marginTop: 0 },
  thumb: { width: 78, height: 70, borderRadius: 12 },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FAF7F4",
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  tab: { flex: 1, alignItems: "center", gap: 6, minHeight: 64 },
  tabText: { fontSize: 11, color: colors.charcoal },
  indicator: { height: 3, borderRadius: 3, width: "70%", marginTop: 3 },
});
