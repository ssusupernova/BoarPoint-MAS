import React, { useState, type ReactNode } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { Screen } from "./ui";
import { useProvider, validateListing, type Listing } from "./state";
import { ProviderTabs } from "./tabs";

const ink = "#18191D",
  green = "#617267",
  clay = "#B77659",
  line = "#D8DAD5";
const pics = {
  sunny: require("../../../assets/provider-rooms/sunny.jpg"),
  garden: require("../../../assets/provider-rooms/garden.jpg"),
  studio: require("../../../assets/provider-rooms/studio.jpg"),
  detail: require("../../../assets/provider-rooms/detail.jpg"),
  booking: require("../../../assets/provider-rooms/booking.jpg"),
};
type Icon = React.ComponentProps<typeof Feather>["name"];
const icon = (name: Icon, size = 17, color = "#48594F") => (
  <Feather name={name} size={size} color={color} />
);
const currency = (n: string) => "₱" + Number(n).toLocaleString("en-PH");
const date = (v: string) =>
  new Date(v + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const time = (v: string) => {
  const [h, m] = v.split(":").map(Number);
  return (
    (h % 12 || 12) + ":" + String(m).padStart(2, "0") + (h < 12 ? " AM" : " PM")
  );
};
const navigate = (stage: string, id?: string) =>
  router.push(
    ("/provider/" +
      stage +
      (id ? "?id=" + encodeURIComponent(id) : "")) as Href,
  );
function Label({
  children,
  bold = false,
  size = 13,
}: {
  children: ReactNode;
  bold?: boolean;
  size?: number;
}) {
  return (
    <Text
      style={{ color: ink, fontWeight: bold ? "700" : "400", fontSize: size }}
    >
      {children}
    </Text>
  );
}
function Badge({
  children,
  soft = false,
}: {
  children: ReactNode;
  soft?: boolean;
}) {
  return (
    <View style={[ss.badge, { backgroundColor: soft ? "#DBE2D3" : "#E8D8CD" }]}>
      <Label size={12}>{children}</Label>
    </View>
  );
}
function Card({
  children,
  title,
  tint = false,
  edit,
}: {
  children: ReactNode;
  title?: string;
  tint?: boolean;
  edit?: () => void;
}) {
  return (
    <View style={[ss.card, tint && { backgroundColor: "#EFE4DC" }]}>
      {title && (
        <View style={ss.row}>
          <View style={{ flex: 1 }}>
            <Label bold size={17}>
              {title}
            </Label>
          </View>
          {edit && (
            <Pressable onPress={edit} hitSlop={6}>
              <Text style={{ color: clay, textDecorationLine: "underline" }}>
                Edit
              </Text>
            </Pressable>
          )}
        </View>
      )}
      {children}
    </View>
  );
}
function Info({ children, i = "info" }: { children: ReactNode; i?: Icon }) {
  return (
    <View style={ss.info}>
      {icon(i, 17, clay)}
      <View
        style={{
          borderLeftWidth: 1,
          borderColor: "#CABBAF",
          paddingLeft: 10,
          flex: 1,
        }}
      >
        <Label size={12}>{children}</Label>
      </View>
    </View>
  );
}
function Button({
  text,
  press,
  outline = false,
  small = false,
}: {
  text: string;
  press: () => void;
  outline?: boolean;
  small?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={press}
      style={[
        ss.btn,
        {
          backgroundColor: outline ? "transparent" : green,
          minHeight: small ? 26 : 41,
        },
      ]}
    >
      <Text
        style={{
          color: outline ? ink : "white",
          fontSize: small ? 13 : 16,
          fontWeight: "700",
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}
function Row({ i, label, value }: { i: Icon; label: string; value?: string }) {
  return (
    <View style={ss.detail}>
      {icon(i)}
      <View style={{ flex: 1 }}>
        <Label>{label}</Label>
      </View>
      {value && <Label bold>{value}</Label>}
    </View>
  );
}
function Pair({ a, b }: { a: ReactNode; b: ReactNode }) {
  return (
    <View style={ss.row}>
      <View style={{ flex: 1, minWidth: 0 }}>{a}</View>
      <View style={{ flex: 1, minWidth: 0 }}>{b}</View>
    </View>
  );
}
function Photo({
  kind,
  uri,
  ratio = 4,
}: {
  kind: keyof typeof pics;
  uri?: string;
  ratio?: number;
}) {
  return (
    <View
      style={{
        width: "100%",
        aspectRatio: ratio,
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#E4E6E0",
      }}
    >
      <Image
        source={uri ? { uri } : pics[kind]}
        resizeMode="cover"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
function CoverPicker({
  uri,
  onChange,
}: {
  uri?: string;
  onChange: (uri?: string) => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function pick() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });
      if (!result.canceled && result.assets[0]?.uri)
        onChange(result.assets[0].uri);
    } catch {
      setError("Could not open that photo. Try choosing another image.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ gap: 6, marginTop: 6 }}>
      <Label bold>Listing cover photo</Label>
      {uri && <Photo uri={uri} kind="sunny" />}
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={pick}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: green,
          borderRadius: 9,
          padding: 12,
        }}
      >
        {icon("image")}
        <Label>
          {busy
            ? "Opening photos…"
            : uri
              ? "Change photo"
              : "Choose cover photo"}
        </Label>
      </Pressable>
      {uri && (
        <Button
          small
          outline
          text="Remove photo"
          press={() => onChange(undefined)}
        />
      )}
      {!!error && <Info>{error}</Info>}
    </View>
  );
}
function Field({
  label,
  value,
  set,
  choices,
  display,
  multi = false,
  number = false,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  choices?: string[];
  display?: (v: string) => string;
  multi?: boolean;
  number?: boolean;
}) {
  const [open, show] = useState(false);
  const [focused, focus] = useState(false);
  return (
    <View style={{ gap: 3, marginVertical: 2 }}>
      <Label bold size={13}>
        {label}
      </Label>
      {choices ? (
        <>
          <Pressable style={[ss.input, ss.row]} onPress={() => show(true)}>
            <View style={{ flex: 1 }}>
              <Label>{display ? display(value) : value}</Label>
            </View>
            {icon("chevron-down", 14)}
          </Pressable>
          <Modal transparent visible={open} onRequestClose={() => show(false)}>
            <View style={ss.shade}>
              <View style={ss.sheet}>
                <Label bold size={18}>
                  {label}
                </Label>
                <ScrollView>
                  {choices.map((v) => (
                    <Pressable
                      key={v}
                      style={ss.detail}
                      onPress={() => {
                        set(v);
                        show(false);
                      }}
                    >
                      <Label>{display ? display(v) : v}</Label>
                      {value === v && icon("check")}
                    </Pressable>
                  ))}
                </ScrollView>
                <Button text="Close" outline press={() => show(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <TextInput
          accessibilityLabel={label}
          multiline={multi}
          placeholder={label === "Address" ? "Street / barangay" : undefined}
          keyboardType={number ? "numeric" : "default"}
          value={display && !focused && value ? display(value) : value}
          onFocus={() => focus(true)}
          onBlur={() => focus(false)}
          onChangeText={set}
          style={[
            ss.input,
            multi && { minHeight: 54, textAlignVertical: "top" },
          ]}
        />
      )}
    </View>
  );
}
function DateField({
  label,
  value,
  set,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
}) {
  const [open, show] = useState(false);
  const [month, M] = useState(new Date(value + "T12:00:00"));
  const y = month.getFullYear(),
    m = month.getMonth();
  return (
    <View style={{ gap: 3, marginVertical: 2 }}>
      <Label bold size={13}>
        {label}
      </Label>
      <Pressable
        style={[ss.input, ss.row]}
        onPress={() => {
          M(new Date(value + "T12:00:00"));
          show(true);
        }}
      >
        <View style={{ flex: 1 }}>
          <Label>{date(value)}</Label>
        </View>
        {icon("calendar", 13)}
      </Pressable>
      <Modal visible={open} transparent onRequestClose={() => show(false)}>
        <View style={ss.shade}>
          <View style={ss.sheet}>
            <View style={ss.row}>
              <Button text="‹" outline press={() => M(new Date(y, m - 1, 1))} />
              <View style={{ flex: 1, alignItems: "center" }}>
                <Label bold>
                  {month.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </Label>
              </View>
              <Button text="›" outline press={() => M(new Date(y, m + 1, 1))} />
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {Array.from(
                {
                  length:
                    new Date(y, m, 1).getDay() +
                    new Date(y, m + 1, 0).getDate(),
                },
                (_, i) => {
                  const day = i - new Date(y, m, 1).getDay() + 1;
                  return (
                    <Pressable
                      key={i}
                      disabled={day < 1}
                      style={{
                        width: "14.28%",
                        paddingVertical: 12,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        set(
                          [
                            y,
                            String(m + 1).padStart(2, "0"),
                            String(day).padStart(2, "0"),
                          ].join("-"),
                        );
                        show(false);
                      }}
                    >
                      <Label>{day > 0 ? day : ""}</Label>
                    </Pressable>
                  );
                },
              )}
            </View>
            <Button text="Close" outline press={() => show(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
function Weight({
  label,
  value,
  set,
  i,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  i: Icon;
}) {
  const [w, W] = useState(1);
  const [origin, O] = useState(0);
  const adjust = (x: number) =>
    set(Math.max(0, Math.min(100, Math.round(((x / w) * 100) / 5) * 5)));
  return (
    <View style={ss.detail}>
      {icon(i)}
      <View style={{ width: 88 }}>
        <Label size={12}>{label}</Label>
      </View>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: 100, now: value }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(e) =>
          set(
            Math.max(
              0,
              Math.min(
                100,
                value + (e.nativeEvent.actionName === "increment" ? 5 : -5),
              ),
            ),
          )
        }
        onLayout={(e) => W(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(e) => {
          O(e.nativeEvent.pageX - e.nativeEvent.locationX);
          adjust(e.nativeEvent.locationX);
        }}
        onResponderMove={(e) => adjust(e.nativeEvent.pageX - origin)}
        style={{ flex: 1, height: 25, justifyContent: "center" }}
      >
        <View
          pointerEvents="none"
          style={{ height: 5, backgroundColor: line, borderRadius: 5 }}
        >
          <View
            style={{
              width: (value + "%") as `${number}%`,
              height: 5,
              backgroundColor: clay,
            }}
          />
          <View
            style={{
              position: "absolute",
              left: (value + "%") as `${number}%`,
              top: -4,
              marginLeft: -6,
              width: 13,
              height: 13,
              borderRadius: 8,
              backgroundColor: "white",
              borderColor: clay,
              borderWidth: 2,
            }}
          />
        </View>
      </View>
      <Label bold>{value}%</Label>
    </View>
  );
}
const terms = [
  "Monthly rent",
  "Security deposit",
  "Lease duration",
  "Move-in date",
  "Inclusions",
];
const icons: Icon[] = ["database", "shield", "calendar", "calendar", "droplet"];
export function Prototype({ stage }: { stage: string }) {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { listings, draft, update, start, save } = useProvider();
  const [error, E] = useState("");
  const [finished, F] = useState(false);
  const d =
    stage === "listing" ? (listings.find((l) => l.id === id) ?? draft) : draft;
  const title: Record<string, string> = {
    listings: "Your listings",
    add: "Add a listing",
    terms: "Rental terms",
    agent: "Agent settings",
    review: "Review your listing",
    listing: "Listing details",
    negotiations: "Negotiations",
    bookings: "Bookings",
  };
  const subtitle: Record<string, string> = {
    listings: "Manage your rooms and rental terms.",
    add: "Step 1 of 3 · Room information",
    terms: "Step 2 of 3 · Terms & availability",
    agent: "Step 3 of 3 · Private limits",
    review: "Check the details before saving.",
    negotiations: "Your agent handles offers for your rooms.",
    bookings: "Confirmed reservations for your rooms.",
  };
  const field = (
    k: keyof Listing,
    label: string,
    choices?: string[],
    display?: (v: string) => string,
  ) => (
    <Field
      label={label}
      value={String(d[k])}
      set={(v) => update({ [k]: v })}
      choices={choices}
      display={display}
      multi={k === "description"}
      number={display === currency}
    />
  );
  const day = (k: keyof Listing, label: string) => (
    <DateField
      label={label}
      value={String(d[k])}
      set={(v) => update({ [k]: v })}
    />
  );
  const months = Array.from({ length: 36 }, (_, i) => String(i + 1));
  const lease = (v: string) => v + " months";
  const included = d.inclusions.join(" + ") || "None";
  const limits = (
    <>
      <Row i="database" label="Rent floor" value={currency(d.minRent)} />
      <Row i="shield" label="Deposit floor" value={currency(d.minDeposit)} />
      <Row
        i="calendar"
        label="Lease range"
        value={d.minLease + "–" + lease(d.maxLease)}
      />
      <Row
        i="calendar"
        label="Move-in window"
        value={date(d.moveIn).replace(/, .*/, "") + "–" + date(d.moveUntil)}
      />
    </>
  );
  const next = () => {
    const err = validateListing(d, stage);
    E(err);
    if (err) return;
    if (stage === "review") {
      const key = save();
      router.replace(("/provider/listing?id=" + key) as Href);
    } else navigate({ add: "terms", terms: "agent", agent: "review" }[stage]!);
  };
  const wizard = ["add", "terms", "agent", "review"].includes(stage);
  return (
    <Screen
      footer={
        <ProviderTabs
          selected={
            ["bookings", "negotiations"].includes(stage) ? stage : "listings"
          }
        />
      }
    >
      <View style={{ gap: 9 }}>
        <View style={ss.row}>
          {(wizard || stage === "listing") && (
            <Pressable
              hitSlop={8}
              accessibilityLabel="Back"
              onPress={() =>
                router.canGoBack()
                  ? router.back()
                  : router.replace("/provider" as Href)
              }
            >
              {icon("arrow-left", 22)}
            </Pressable>
          )}
          {icon("home", 24)}
          <View style={{ flex: 1, borderLeftWidth: 1, paddingLeft: 8 }}>
            <Label bold>MAS Accommodation</Label>
          </View>
          {!["add", "terms", "negotiations", "listing"].includes(stage) && (
            <Badge>Provider</Badge>
          )}
        </View>
        {stage === "negotiations" && <Badge>Provider</Badge>}
        <View style={ss.row}>
          <View style={{ flex: 1 }}>
            <Label bold size={27}>
              {title[stage]}
            </Label>
          </View>
          {stage === "listing" && <Badge soft>Provider</Badge>}
        </View>
        {subtitle[stage] &&
          (wizard && stage !== "review" ? (
            <Badge>{subtitle[stage]}</Badge>
          ) : (
            <Label>{subtitle[stage]}</Label>
          ))}
        {stage === "listings" && (
          <>
            <Button
              text="＋  Add listing"
              press={() => {
                start();
                update({
                  name: "Sunny Private Room",
                  description:
                    "A bright private room with Wi-Fi and water included.",
                });
                navigate("add");
              }}
            />
            <Badge>{listings.length} rooms</Badge>
            {listings.map((l) => (
              <Card key={l.id}>
                <Photo uri={l.coverUri} kind={l.photo} />
                <Label bold size={16}>
                  {l.name}
                </Label>
                <Label size={12}>
                  {l.area} · {l.type}
                </Label>
                <View style={ss.row}>
                  <View style={{ flex: 1 }}>
                    <Label bold>{currency(l.rent)} / month</Label>
                  </View>
                  <Badge soft>
                    {l.id === "sunny"
                      ? "▦  Booked Dec 1–May 31"
                      : "▦  Available from " +
                        date(l.availableFrom).split(",")[0]}
                  </Badge>
                </View>
                <Button
                  text="View listing"
                  small
                  outline
                  press={() => navigate("listing", l.id)}
                />
              </Card>
            ))}
          </>
        )}
        {stage === "add" && (
          <>
            <Label>Start with the details renters will see.</Label>
            <Card>
              {field("name", "Listing name")}
              <Pair
                a={field("type", "Room type", [
                  "Private room",
                  "Shared room",
                  "Studio",
                ])}
                b={field(
                  "area",
                  "Area",
                  Array.from(new Set([d.area, "Dapitan City", "Dipolog City"])),
                )}
              />
              {field("address", "Address")}
              {field("description", "Description")}
              <CoverPicker
                uri={d.coverUri}
                onChange={(coverUri) => update({ coverUri })}
              />
            </Card>
            <Card title="Inclusions">
              <Label size={12}>Select what’s included in the rent.</Label>
              <View style={ss.row}>
                {["Wi-Fi", "Water", "Electricity"].map((v, i) => {
                  const on = d.inclusions.includes(v);
                  return (
                    <Pressable
                      key={v}
                      style={[
                        ss.choice,
                        { backgroundColor: on ? "#9CA69A" : "white" },
                      ]}
                      onPress={() =>
                        update({
                          inclusions: on
                            ? d.inclusions.filter((x) => x !== v)
                            : [...d.inclusions, v],
                        })
                      }
                    >
                      {icon(
                        (["wifi", "droplet", "zap"] as const)[i],
                        14,
                        on ? "white" : ink,
                      )}
                      <Text style={{ fontSize: 12, color: on ? "white" : ink }}>
                        {v}
                        {on ? " ✓" : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
            <Card title="House rules">
              <Pressable
                style={ss.row}
                onPress={() => update({ noSmoking: !d.noSmoking })}
              >
                {icon(d.noSmoking ? "check-square" : "square")}
                <Label>No smoking indoors</Label>
              </Pressable>
              {field(
                "quiet",
                "Quiet hours start",
                Array.from(
                  { length: 48 },
                  (_, i) =>
                    String(Math.floor(i / 2)).padStart(2, "0") +
                    ":" +
                    (i % 2 ? "30" : "00"),
                ),
                time,
              )}
            </Card>
            <Info>
              Next: availability and rental terms. Private agent settings follow
              in step 3.
            </Info>
          </>
        )}
        {stage === "terms" && (
          <>
            <Card title="Listed terms">
              <Pair
                a={field("rent", "Monthly rent", undefined, currency)}
                b={field("deposit", "Security deposit", undefined, currency)}
              />
              <Pair
                a={field("lease", "Preferred lease", months, lease)}
                b={day("moveIn", "Preferred move-in")}
              />
            </Card>
            <Card title="Availability">
              <Pair
                a={day("availableFrom", "Available from")}
                b={day("availableUntil", "Available until")}
              />
            </Card>
            <Card title="What can be negotiated?">
              {terms.map((v, i) => (
                <View key={v} style={ss.detail}>
                  {icon(icons[i])}
                  <View style={{ flex: 1 }}>
                    <Label>{v}</Label>
                  </View>
                  <Switch
                    accessibilityLabel={v}
                    value={d.negotiable.includes(v)}
                    onValueChange={(on) =>
                      update({
                        negotiable: on
                          ? [...d.negotiable, v]
                          : d.negotiable.filter((x) => x !== v),
                      })
                    }
                  />
                </View>
              ))}
              <Label size={12}>{included} included.</Label>
            </Card>
            <Info>Set your private limits in the next step.</Info>
          </>
        )}
        {stage === "agent" && (
          <>
            <Info i="lock">
              Private to you and authorized agent processing. Not shown to
              renters.
            </Info>
            <Card title="Negotiation boundaries">
              {field("minRent", "Minimum monthly rent", undefined, currency)}
              {field("minDeposit", "Minimum deposit", undefined, currency)}
              <Pair
                a={field("minLease", "Minimum lease", months, lease)}
                b={field("maxLease", "Maximum lease", months, lease)}
              />
              {day("moveUntil", "Move-in window · from " + date(d.moveIn))}
              <Info>The agent stays within these limits.</Info>
            </Card>
            <Card title="Preference priorities">
              <Label size={12}>
                Weights total {d.weights.reduce((a, v) => a + Number(v), 0)}%
              </Label>
              {[
                "Monthly rent",
                "Deposit",
                "Lease duration",
                "Move-in date",
              ].map((v, i) => (
                <Weight
                  key={v}
                  label={v}
                  i={icons[i]}
                  value={Number(d.weights[i])}
                  set={(n) =>
                    update({
                      weights: d.weights.map((w, j) =>
                        j === i ? String(n) : w,
                      ),
                    })
                  }
                />
              ))}
              <Info>
                Other strategy parameters use the configured defaults.
              </Info>
            </Card>
          </>
        )}
        {stage === "review" && (
          <>
            <Card title="Room information" edit={() => navigate("add")}>
              {d.coverUri && <Photo uri={d.coverUri} kind={d.photo} />}
              <Row i="home" label={d.name} value={d.type} />
              <Label>{d.area}</Label>
              <Row i="wifi" label={included + " included"} />
              <Row
                i="slash"
                label={
                  (d.noSmoking ? "No smoking · " : "") +
                  "Quiet hours after " +
                  time(d.quiet)
                }
              />
            </Card>
            <Card title="Public rental terms" edit={() => navigate("terms")}>
              <Row i="database" label="Monthly rent" value={currency(d.rent)} />
              <Row i="shield" label="Deposit" value={currency(d.deposit)} />
              <Row
                i="calendar"
                label="Preferred lease"
                value={lease(d.lease)}
              />
              <Row i="calendar" label="Move-in" value={date(d.moveIn)} />
              <Row
                i="calendar"
                label="Available"
                value={date(d.availableFrom) + "–" + date(d.availableUntil)}
              />
              <Info>{d.negotiable.join(", ") || "No terms"} negotiable.</Info>
            </Card>
            <Card
              tint
              title="Private agent settings"
              edit={() => navigate("agent")}
            >
              {limits}
              <Info>These limits are not part of the public listing.</Info>
            </Card>
            <Info>
              Saving makes this room available for matchmaking in this preview.
            </Info>
          </>
        )}
        {wizard && (
          <>
            {!!error && <Info>{error}</Info>}
            <Button
              text={
                {
                  add: "Continue to rental terms",
                  terms: "Continue to agent settings",
                  agent: "Review listing",
                  review: "Save listing",
                }[stage]!
              }
              press={next}
            />
          </>
        )}
        {stage === "listing" && (
          <>
            <Pair
              a={
                <Photo
                  uri={d.coverUri}
                  kind={d.photo === "sunny" ? "detail" : d.photo}
                  ratio={1.4}
                />
              }
              b={
                <>
                  <Label bold size={18}>
                    {d.name}
                  </Label>
                  <Row i="map-pin" label={d.area + " · " + d.type} />
                  <Badge soft>
                    {d.id === "sunny"
                      ? "Booked Dec 1, 2026–May 31, 2027"
                      : "Available from " + date(d.availableFrom)}
                  </Badge>
                </>
              }
            />
            <Card
              title="Public listing terms"
              edit={() => {
                start(d);
                navigate("add");
              }}
            >
              <Row
                i="database"
                label="Listed rent"
                value={currency(d.rent) + " / month"}
              />
              <Row
                i="shield"
                label="Listed deposit"
                value={currency(d.deposit)}
              />
              <Row
                i="calendar"
                label="Preferred lease"
                value={lease(d.lease)}
              />
              <Row i="droplet" label="Inclusions" value={included} />
            </Card>
            <Info>
              House rules: {d.noSmoking ? "No smoking · " : ""}Quiet hours after{" "}
              {time(d.quiet)}.
            </Info>
            <Card tint title="Private agent limits">
              {limits}
            </Card>
            <Label size={12}>
              Visible only to you and authorized processing.
            </Label>
            <Info>Existing bookings keep their agreed terms.</Info>
            <Button
              text="View negotiations"
              press={() => navigate("negotiations", d.id)}
            />
            <Button
              text="View bookings"
              outline
              press={() => navigate("bookings", d.id)}
            />
          </>
        )}
        {stage === "negotiations" && (
          <>
            <View style={ss.segment}>
              {["Active", "Finished"].map((v, i) => (
                <Pressable
                  key={v}
                  onPress={() => F(!!i)}
                  style={[
                    ss.segmentItem,
                    finished === !!i && { backgroundColor: green },
                  ]}
                >
                  <Text style={{ color: finished === !!i ? "white" : ink }}>
                    {v}
                    {!i
                      ? " (" +
                        ["garden", "studio"].filter((k) => !id || id === k)
                          .length +
                        ")"
                      : ""}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Info i="repeat">
              Monitor progress. Your private limits stay hidden.
            </Info>
            {(finished ? ["sunny"] : ["garden", "studio"])
              .filter((k) => !id || id === k)
              .map((k) => {
                const active = k === "garden",
                  done = k === "sunny",
                  l = listings.find((x) => x.id === k)!;
                return (
                  <Card key={k}>
                    <Pair
                      a={<Photo uri={l.coverUri} kind={l.photo} ratio={2.1} />}
                      b={
                        <>
                          <Label bold size={16}>
                            {l.name}
                          </Label>
                          <Label size={12}>
                            Session N-00{active ? 2 : done ? 1 : 3}
                          </Label>
                          <Badge soft={active || done}>
                            {done
                              ? "Agreement reached"
                              : active
                                ? "Negotiating"
                                : "Validating agreement"}
                          </Badge>
                        </>
                      }
                    />
                    <Row i="users" label="Renter Agent  ↔  Provider Agent" />
                    <Info>
                      {active ? "Latest counteroffer" : "Agreed rent"}{" "}
                      {active ? "₱4,000" : done ? "₱3,300" : "₱4,600"} / month
                    </Info>
                    <Row
                      i="calendar"
                      label={
                        active
                          ? "Deposit ₱4,000 · Lease 6 months"
                          : done
                            ? "Booking confirmed"
                            : "Checking terms and availability"
                      }
                    />
                    <Label size={11}>
                      {active
                        ? "Updated just now"
                        : done
                          ? "Session finished"
                          : "Booking is not confirmed yet.     Updated 1 min ago."}
                    </Label>
                    <Button
                      small
                      outline={!active}
                      text={active ? "View negotiation" : "View progress"}
                      press={() =>
                        navigate(
                          "negotiation",
                          active ? "active" : done ? "agreed" : "validating",
                        )
                      }
                    />
                  </Card>
                );
              })}
            {id &&
              !(finished ? ["sunny"] : ["garden", "studio"]).includes(id) && (
                <Info>
                  No {finished ? "finished" : "active"} negotiations for this
                  room.
                </Info>
              )}
            <Info>You can leave this screen while your agents work.</Info>
          </>
        )}
        {stage === "bookings" && (
          <>
            {!id || id === "sunny" ? (
              <>
                <Badge>1 confirmed booking</Badge>
                <Card>
                  <Photo kind="booking" ratio={2.85} />
                  <Badge soft>Confirmed · O5</Badge>
                  <Label bold size={22}>
                    Sunny Private Room
                  </Label>
                  <Row i="map-pin" label="Dapitan City" />
                  <Row i="calendar" label="Booking BK-001" />
                  <Info i="calendar">
                    Dec 1, 2026 – May 31, 2027{"\n"}6-month stay
                  </Info>
                  <Row i="database" label="Monthly rent" value="₱3,300" />
                  <Row i="shield" label="Security deposit" value="₱3,300" />
                  <Row i="droplet" label="Inclusions" value="Wi-Fi + water" />
                  <Info>Confirmed Nov 15, 2026</Info>
                  <Button
                    text="View booking details"
                    press={() => navigate("booking", "confirmed")}
                  />
                </Card>
              </>
            ) : (
              <Card title="No confirmed bookings yet">
                <Label>
                  Confirmed reservations for this room will appear here.
                </Label>
              </Card>
            )}
            <Info>
              Only confirmed bookings appear here. View unsuccessful runs in
              Negotiations.
            </Info>
          </>
        )}
      </View>
    </Screen>
  );
}
const ss = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  card: { backgroundColor: "white", padding: 10, borderRadius: 12, gap: 5 },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: line,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 9,
    borderRadius: 10,
    backgroundColor: "#EBE0D8",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  btn: {
    borderWidth: 1,
    borderColor: green,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  input: {
    color: ink,
    borderWidth: 1,
    borderColor: "#9BA89C",
    borderRadius: 7,
    minHeight: 30,
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontSize: 14,
    justifyContent: "space-between",
  },
  shade: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#0005",
  },
  sheet: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    maxHeight: "80%",
  },
  choice: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#A7B1A8",
    borderRadius: 18,
    paddingVertical: 6,
  },
  segment: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: green,
    borderRadius: 18,
    overflow: "hidden",
  },
  segmentItem: { flex: 1, alignItems: "center", padding: 6 },
});
