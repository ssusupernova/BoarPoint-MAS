import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { peso, rooms, useRenter, type Room } from "./state";

const photos = {
  sunny: require("../../../assets/images/room-sunny.png"),
  garden: require("../../../assets/images/room-garden.png"),
  studio: require("../../../assets/images/room-studio.png"),
};
const green = "#607568";
const dark = "#1F2823";
const muted = "#626567";
const rust = "#B77961";
const go = (stage: string) => router.push(`/renter/${stage}` as Href);
const preview = (stage: string) => router.push(`/renter/${stage}?preview=1` as Href);
function useDemoPreview() { return useLocalSearchParams<{ preview?: string }>().preview === "1"; }
const photo = (room: Room) => photos[room.id as keyof typeof photos] ?? photos.sunny;

function HouseMark({ tint = green }: { tint?: string }) {
  return <View style={styles.houseMark}><Feather name="home" size={25} color={tint} /><View style={styles.houseWindow} /></View>;
}
function Header({ back = true, role = false }: { back?: boolean; role?: boolean }) {
  return <View style={styles.header}>
    {back && <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}><Feather name="arrow-left" size={27} color={dark} /></Pressable>}
    <HouseMark tint={back ? green : rust} /><View style={styles.divider} />
    <Text style={styles.brand} numberOfLines={1}>MAS Accommodation</Text>
    {role && <Text style={styles.role}>Renter</Text>}
  </View>;
}
export function RenterTabs({ selected }: { selected: "home" | "negotiations" | "bookings" | "account" }) {
  const items = [
    ["home", "Find a room", "home-outline", "/renter"],
    ["negotiations", "Negotiations", "handshake-outline", "/renter/history"],
    ["bookings", "Bookings", "calendar-check-outline", "/renter/booking"],
    ["account", "Account", "account-outline", "/account"],
  ] as const;
  return <View style={styles.tabs} accessibilityRole="tablist">
    {items.map(([key, label, icon, route]) => <Pressable key={key} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: selected === key }} onPress={() => router.navigate(route as Href)} style={styles.tab}>
      <MaterialCommunityIcons name={icon} color={selected === key ? rust : "#515955"} size={24} />
      <Text style={[styles.tabText, selected === key && styles.activeText]}>{label}</Text>
      {selected === key && <View style={styles.tabLine} />}
    </Pressable>)}
  </View>;
}
function Page({ children, selected = "home" }: { children: React.ReactNode; selected?: "home" | "negotiations" | "bookings" }) {
  return <SafeAreaView style={styles.page}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
    <RenterTabs selected={selected} />
  </SafeAreaView>;
}
function Title({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return <View style={styles.titleBox}><Text accessibilityRole="header" style={styles.title}>{children}</Text>{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>;
}
function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}
function Pill({ children, greenish = false }: { children: React.ReactNode; greenish?: boolean }) {
  return <View style={[styles.pill, greenish && styles.greenPill]}><Text style={[styles.pillText, greenish && { color: "#19402D" }]}>{children}</Text></View>;
}
function Info({ children, icon = "info" }: { children: React.ReactNode; icon?: "info" | "lock" }) {
  return <View style={styles.info}><Feather name={icon} color={rust} size={23} /><View style={styles.infoDivider} /><Text style={styles.infoText}>{children}</Text></View>;
}
function Action({ title, onPress, outline = false }: { title: string; onPress: () => void; outline?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.action, outline && styles.outline]}><Text style={[styles.actionText, outline && styles.outlineText]}>{title}</Text></Pressable>;
}
function Input({ label, value, onChangeText, suffix, menu, choices, numeric }: { label: string; value: string; onChangeText: (value: string) => void; suffix?: string; menu?: boolean; choices?: string[]; numeric?: boolean }) {
  const [open, setOpen] = useState(false);
  return <View style={styles.inputBlock}><Text style={styles.inputLabel}>{label}</Text><View style={styles.inputOuter}>
    {menu ? <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityLabel={label} style={styles.select}><Text style={styles.inputText}>{value}</Text><Feather name="chevron-down" size={19} color={dark} /></Pressable> :
      <TextInput value={value} onChangeText={onChangeText} keyboardType={numeric ? "numeric" : "default"} style={styles.input} accessibilityLabel={label} />}
    {suffix && <Text style={styles.suffix}>{suffix}</Text>}
  </View>{open && choices?.map(choice => <Pressable key={choice} accessibilityRole="button" accessibilityLabel={choice} onPress={() => { onChangeText(choice); setOpen(false); }} style={styles.option}><Text style={styles.inputText}>{choice}</Text>{value === choice && <Feather name="check" size={17} color={green} />}</Pressable>)}</View>;
}
function Two({ children }: { children: React.ReactNode }) { return <View style={styles.two}>{children}</View>; }
function Chip({ label, icon, active = false, onPress }: { label: string; icon: keyof typeof Feather.glyphMap; active?: boolean; onPress?: () => void }) {
  return <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked: active }} style={[styles.chip, active && styles.selectedChip]}><Feather name={icon} size={17} color={active ? "white" : dark} /><Text style={[styles.chipLabel, active && { color: "white" }]}>{label}</Text>{active && <Feather name="check" size={15} color="white" />}</Pressable>;
}
function Line({ label, value, icon, terracotta = false }: { label: string; value: string; icon?: keyof typeof Feather.glyphMap; terracotta?: boolean }) {
  return <View style={styles.line}>{icon && <Feather name={icon} size={19} color={green} style={{ width: 26 }} />}<Text style={styles.lineLabel}>{label}</Text><Text style={[styles.lineValue, terracotta && { color: rust }]}>{value}</Text></View>;
}
function NegotiableTerm({ label, value, icon }: { label: string; value: string; icon: keyof typeof Feather.glyphMap }) {
  return <View style={styles.termLine}><Feather name={icon} size={18} color={dark} /><Text style={styles.termLabel}>{label}</Text><Text style={styles.termValue}>{value}</Text><Text style={styles.negotiable}>Negotiable</Text></View>;
}
function RoomSummary({ room, booking = false }: { room: Room; booking?: boolean }) {
  return <View style={styles.summary}><Image source={photo(room)} style={styles.summaryPhoto} /><View style={styles.summaryBody}><Text style={styles.summaryName}>{room.name}</Text><Text style={styles.summarySmall}>⌖  {room.area}</Text><Text style={styles.summarySmall}>{booking ? "▢  Booking BK-001" : "▤  Listed rent"}</Text>{!booking && <Pill greenish>{peso(room.rent)} / month</Pill>}</View></View>;
}
function Terms({ rent = 3300, deposit = 3300, includeLease = true, includeMove = true }: { rent?: number; deposit?: number; includeLease?: boolean; includeMove?: boolean }) {
  return <><Line icon="database" label="Monthly rent" value={peso(rent)} /><Line icon="shield" label="Security deposit" value={peso(deposit)} />{includeLease && <Line icon="calendar" label="Lease duration" value="6 months" />}{includeMove && <Line icon="calendar" label="Move-in" value="Dec 1, 2026" />}<Line icon="droplet" label="Inclusions" value="Wi-Fi + water" /></>;
}
function MatchCard({ room, rank, onPress }: { room: Room; rank: number; onPress: () => void }) {
  return <Card style={styles.matchCard}><Image source={photo(room)} style={styles.matchPhoto} /><View style={styles.rank}><Text style={styles.rankText}>#{rank} match</Text></View><View style={styles.matchBody}>
    <View style={styles.matchRow}><Text style={styles.matchName}>{room.name}</Text><Text style={styles.matchRent}>{peso(room.rent)}<Text style={styles.perMonth}> / month</Text></Text></View>
    <Text style={styles.location}>⌖  {room.area}</Text><View style={styles.matchChips}><Chip label={room.type} icon="home" /><Chip label={room.amenities[0] ?? "Room"} icon="wifi" /></View>
    <View style={styles.matchRow}><Text style={styles.available}>▢  Available {room.available}</Text><Pressable accessibilityRole="button" onPress={onPress} style={styles.smallAction}><Text style={styles.smallActionText}>View details →</Text></Pressable></View>
  </View></Card>;
}

export function Requirements() {
  const { requirements: r, update } = useRenter(); const [error, setError] = useState("");
  const toggle = (item: string) => update({ amenities: r.amenities.includes(item) ? r.amenities.filter(x => x !== item) : [...r.amenities, item] });
  return <Page><Header back={false} /><Pill>Step 1 of 2 · Room requirements</Pill><Title subtitle="Tell your agent what matters to you.">Find your next room</Title>
    <Card><Input label="Area" value={r.area} onChangeText={area => update({ area })} menu choices={["Dapitan City", "Dipolog City"]} /><Input label="Room type" value={r.type} onChangeText={type => update({ type })} menu choices={["Private room", "Shared room", "Studio"]} />
      <Two><Input label="Preferred rent" value={r.min} onChangeText={min => update({ min })} numeric suffix="/ month" /><Input label="Maximum rent" value={r.max} onChangeText={max => update({ max })} numeric suffix="/ month" /></Two>
      <Two><Input label="Move-in date" value={r.date} onChangeText={date => update({ date })} /><Input label="Lease duration" value={r.months + " months"} onChangeText={v => update({ months: v.replace(/\D/g, "") })} menu choices={["6 months", "12 months"]} /></Two>
      <View style={styles.rule} /><Text style={styles.sectionTitle}>Inclusions</Text><Text style={styles.muted}>Choose required inclusions.</Text><View style={styles.chips}>{[["Wi-Fi","wifi"],["Water","droplet"],["Electricity","zap"]].map(([label,icon]) => <Chip key={label} label={label} icon={icon as keyof typeof Feather.glyphMap} active={r.amenities.includes(label)} onPress={() => toggle(label)} />)}</View>
    </Card><Info>Next: set deposit limits, priorities and your negotiation deadline.</Info>{!!error && <Text style={styles.error}>{error}</Text>}<Action title="Continue to preferences" onPress={() => { if (!r.area || !r.type || !r.date || Number(r.max) < Number(r.min)) { setError("Check your room requirements."); return; } go("preferences"); }} />
  </Page>;
}
function Preferences() {
  const { requirements: r, update } = useRenter(); const [error, setError] = useState("");
  return <Page><Header /><Title>Your preferences</Title><Pill>Step 2 of 2 · Limits & priorities</Pill><Text style={styles.subtitle}>Set the boundaries for your agent.</Text>
    <Card><Text style={styles.sectionTitle}>Acceptable terms</Text><Input label="Maximum deposit" value={r.depositLimit} onChangeText={depositLimit => update({ depositLimit })} numeric />
      <Two><Input label="Minimum lease" value={r.minLease + " months"} onChangeText={v => update({ minLease: v.replace(/\D/g, "") })} menu choices={["3 months","6 months","12 months"]} /><Input label="Maximum lease" value={r.maxLease + " months"} onChangeText={v => update({ maxLease: v.replace(/\D/g, "") })} menu choices={["6 months","12 months"]} /></Two>
      <Input label="Move-in window" value={r.moveWindow} onChangeText={moveWindow => update({ moveWindow })} menu choices={["Dec 1–7, 2026","Dec 8–14, 2026"]} />
    </Card><Card><Text style={styles.sectionTitle}>What matters most?</Text><Text style={styles.muted}>Priority weights total 100%.</Text>
      {Object.entries(r.priorities).map(([name, weight]) => <View key={name} style={styles.priority}><Text style={styles.priorityLabel}>{name}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${name}`} onPress={() => { const p = { ...r.priorities }; const other = Object.keys(p).find(k => k !== name)!; if (weight >= 5) { p[name] -= 5; p[other] += 5; update({ priorities: p }); } }} style={styles.weightButton}><Text style={styles.weight}>−</Text></Pressable><View style={styles.track}><View style={[styles.trackFill,{ width: `${weight}%` }]} /></View><Text style={styles.weight}>{weight}%</Text><Pressable accessibilityRole="button" accessibilityLabel={`Increase ${name}`} onPress={() => { const p = { ...r.priorities }; const other = Object.keys(p).find(k => k !== name && p[k] >= 5); if (other && weight <= 95) { p[name] += 5; p[other] -= 5; update({ priorities: p }); } }} style={styles.weightButton}><Text style={styles.weight}>+</Text></Pressable></View>)}
    </Card><Card><Text style={styles.sectionTitle}>Negotiation time limit</Text><Input label="" value={r.timeLimit} onChangeText={timeLimit => update({ timeLimit })} menu choices={["5 minutes","10 minutes","15 minutes"]} /><Text style={styles.muted}>Starts when negotiation begins.</Text></Card>
    <Info>Your limits stay private to your agent.</Info>{!!error && <Text style={styles.error}>{error}</Text>}<Action title="Find matching rooms" onPress={() => { if (Number(r.depositLimit) < 0 || Object.values(r.priorities).reduce((a,b) => a+b,0) !== 100) { setError("Check your limits and priority weights."); return; } go("results"); }} />
  </Page>;
}
function Results() {
  const { requirements: r, select } = useRenter(); const eligible = rooms.filter(room => room.rent >= Number(r.min) && room.rent <= Number(r.max) && room.deposit <= Number(r.depositLimit) && room.type === r.type && room.area.toLowerCase().includes(r.area.trim().toLowerCase()) && r.amenities.every(item => room.amenities.includes(item)));
  return <Page><View style={styles.simpleHeader}><Pressable onPress={() => router.back()}><Feather name="arrow-left" size={25} color={dark}/></Pressable><View><Title subtitle="Sample rooms matching your limits">Your matches</Title></View></View>
    <View style={styles.searchSummary}><HouseMark /><View style={{ flex: 1 }}><Text style={styles.searchMain}>{r.area} · {r.type}</Text><Text style={styles.searchSub}>Up to {peso(Number(r.max))} / month</Text></View><Pressable onPress={() => router.navigate("/renter" as Href)}><Text style={styles.edit}>Edit</Text></Pressable></View>
    <Text style={styles.resultsCount}>{eligible.length} eligible rooms</Text>{eligible.map((room, i) => <MatchCard key={room.id} room={room} rank={i+1} onPress={() => { select(room); go("room"); }} />)}
    {eligible.length === 0 && <><Info>No matching rooms. Edit your search to try again.</Info><Action title="Edit search criteria" onPress={() => router.navigate("/renter" as Href)} /></>}
  </Page>;
}
function Details() {
  const { selected } = useRenter();
  return <Page><Header back={false} /><View style={styles.heroWrap}><Image source={photo(selected)} style={styles.hero} /><Pressable style={styles.heroBack} onPress={() => router.back()}><Feather name="arrow-left" size={25} color={dark} /></Pressable></View>
    <Text style={styles.roomTitle}>{selected.name}</Text><View style={styles.matchRow}><Text style={styles.location}>⌖  {selected.area}</Text><Text style={styles.roomPrice}>{peso(selected.rent)}<Text style={styles.perMonth}> / month</Text></Text></View><View style={styles.chips}><Chip label={`Available ${selected.available}`} icon="calendar" /></View>
    <Card><Text style={styles.sectionTitle}>Rental terms</Text><NegotiableTerm icon="database" label="Monthly rent" value={peso(selected.rent)} /><NegotiableTerm icon="shield" label="Security deposit" value={peso(selected.deposit)} /><NegotiableTerm icon="calendar" label="Lease duration" value="6–12 months" /><NegotiableTerm icon="log-in" label="Move-in date" value="From Dec 1" /></Card>
    <Text style={styles.sectionTitleOutside}>Inclusions</Text><View style={styles.chips}>{selected.amenities.map(item => <Chip key={item} label={item} icon={item === "Wi-Fi" ? "wifi" : item === "Water" ? "droplet" : "check"} />)}</View>
    <Text style={styles.sectionTitleOutside}>House rules</Text><Text style={styles.ruleText}>⊘  No smoking indoors</Text><Text style={styles.ruleText}>☾  Quiet hours after 10 PM</Text><Info>Rooms are not held during negotiation.</Info><Action title="Start negotiation" onPress={() => go("review")} />
  </Page>;
}
function Review() {
  const { selected, requirements: r, startNegotiation } = useRenter();
  return <Page><Header /><Title subtitle="Review your room and agent instructions.">Ready to negotiate?</Title><Card><RoomSummary room={selected} /></Card>
    <Card><Text style={styles.sectionTitle}>Your preferences</Text><Line icon="database" label="Preferred rent" value={peso(Number(r.min)) + " / month"} /><Line icon="database" label="Maximum rent" value={peso(Number(r.max)) + " / month"} /><Line icon="shield" label="Maximum deposit" value={peso(Number(r.depositLimit))} /><Line icon="calendar" label="Lease range" value={r.minLease + "–" + r.maxLease + " months"} /><Line icon="calendar" label="Move-in window" value={r.moveWindow} /><Line icon="droplet" label="Required inclusions" value={r.amenities.join(" + ")} /><Line icon="clock" label="Time limit" value={r.timeLimit} /></Card>
    <Info icon="lock">Your private limits are not shared with the provider.</Info><Info>Your agent will exchange offers automatically. The room is not held while negotiating.</Info><Action title="Start negotiation" onPress={() => { startNegotiation(); go("negotiation"); }} /><Pressable onPress={() => router.back()} style={styles.textAction}><Text style={styles.edit}>Go back</Text></Pressable>
  </Page>;
}
const offers = [
  ["Renter Agent · Offer", "₱3,000 rent · ₱3,000 deposit"],
  ["Provider Agent · Counter", "₱3,400 rent · ₱3,400 deposit"],
  ["Renter Agent · Counter", "₱3,200 rent · ₱3,200 deposit"],
  ["Provider Agent · Counter", "₱3,300 rent · ₱3,300 deposit"],
];
function Negotiation() {
  const { selected: currentRoom, negotiation, startValidation } = useRenter();
  const demo = useDemoPreview();
  const selected = demo ? rooms[0] : currentRoom;
  return <Page selected="negotiations"><View style={styles.simpleHeader}><Pressable onPress={() => router.back()}><Feather name="arrow-left" size={25} color={dark}/></Pressable><View style={{ flex: 1 }}><Title subtitle={selected.name + " · " + selected.area}>Negotiation</Title></View><Pill>Session N-001</Pill></View>
    <View style={styles.agentBox}><MaterialCommunityIcons name="handshake-outline" size={39} color={green} /><View style={{ flex: 1 }}><Text style={styles.sectionTitle}>Negotiation preview</Text><Text style={styles.muted}>Sample offers · Backend connection pending</Text></View></View>
    <Progress active={0} /><Card><Text style={styles.sectionTitle}>Latest offer</Text><Pill>Provider Agent · Counteroffer</Pill><Line label="Monthly rent" value="₱3,300" terracotta /><Line label="Deposit" value="₱3,300" terracotta /><Line label="Lease" value="6 months" /><Line label="Move-in" value="Dec 1, 2026" /><Line label="Inclusions" value="Wi-Fi + water" /></Card>
    <Text style={styles.sectionTitleOutside}>Offer history</Text>{offers.map(([name, value], i) => <View key={i} style={styles.offer}><View style={[styles.offerDot,i === 3 && { borderColor: rust }]} /><View style={[styles.offerCard,i === 3 && { backgroundColor: "#F1E8E2" }]}><Text style={styles.offerName}>{name}</Text><Text style={styles.offerValue}>{value}</Text></View></View>)}
    <Text style={styles.processing}>◌  Sample offer history</Text><Info>These offers are illustrative. Your agents will handle real offers when connected to the backend.</Info>{(demo || negotiation === "active") && <Action title="Preview: Agreement reached" onPress={() => { if (demo) preview("agreement"); else { startValidation(); go("agreement"); } }} />}
  </Page>;
}
function Progress({ active }: { active: number }) {
  return <View style={styles.progress}>{["Negotiating","Validating","Outcome"].map((step,i) => <View key={step} style={styles.progressItem}><View style={[styles.progressCircle,i <= active && styles.progressOn]}>{i < active && <Feather name="check" size={15} color="white" />}</View><Text style={[styles.progressText,i === active && { color: "#19402D", fontWeight: "700" }]}>{step}</Text></View>)}</View>;
}
function Agreement() {
  const { selected: currentRoom, confirm } = useRenter();
  const demo = useDemoPreview();
  const selected = demo ? rooms[0] : currentRoom;
  return <Page selected="negotiations"><Header /><Title subtitle={selected.name + " · Session N-001"}>Negotiation progress</Title><View style={styles.centerBadge}><MaterialCommunityIcons name="handshake-outline" size={65} color={green} /></View>
    <Text style={styles.outcomeTitle}>Agreement reached</Text><Text style={styles.outcomeSub}>Your booking is not confirmed yet.</Text><Progress active={1} /><RoomSummary room={selected} booking />
    <Card><Text style={styles.sectionTitle}>Sample agreed terms</Text><Terms /></Card><Card><Text style={styles.sectionTitle}>Final checks · preview</Text><Line icon="circle" label="Terms validation" value="Pending" /><Line icon="loader" label="Current availability" value="Pending" terracotta /><Line icon="circle" label="Save booking" value="Pending" /></Card>
    <Info>Confirmation appears only after all checks pass and the booking is saved.</Info><Text style={styles.centerNote}>Sample validation state · No checks are running.</Text><Action title="Preview: Validation passed" onPress={() => { if (demo) preview("confirmed"); else { confirm(); go("confirmed"); } }} /><Action title="Back to negotiations" outline onPress={() => go("history")} />
  </Page>;
}
function Confirmed() {
  const { selected: currentRoom, booking } = useRenter(); const next = () => go("booking");
  const demo = useDemoPreview();
  const selected = demo ? rooms[0] : currentRoom;
  if (!booking && !demo) return <Booking />;
  return <Page selected="bookings"><View style={styles.simpleHeader}><Pressable onPress={() => router.back()}><Feather name="arrow-left" size={25} color={dark}/></Pressable><Text style={styles.headerTitle}>Booking outcome</Text></View><View style={styles.successCircle}><Feather name="check" size={53} color="white" /></View>
    <Text style={styles.outcomeTitle}>Booking confirmed</Text><Text style={styles.outcomeSub}>Sample outcome · No real reservation was saved.</Text><View style={styles.centerBadge}><Pill>O5 · Preview confirmed</Pill></View>
    <Card><RoomSummary room={selected} booking /><View style={styles.termsBanner}><Text style={styles.sectionTitle}>Sample agreed rental terms</Text></View><Terms /><Info>Preview confirmation · No real booking was saved.</Info></Card>
    <Card><Text style={styles.check}>✓  Terms validated</Text><Text style={styles.check}>✓  Availability checked</Text><Text style={styles.check}>✓  Booking recorded</Text></Card>
    <Action title="View booking details" onPress={demo ? () => preview("booking") : next} /><Action title="View negotiation history" outline onPress={() => go("history")} />
  </Page>;
}
function Booking() {
  const { selected: currentRoom, booking } = useRenter();
  const demo = useDemoPreview();
  const selected = demo ? rooms[0] : currentRoom;
  if (!booking && !demo) return <Page selected="bookings"><Header /><Title subtitle="Confirmed reservations will appear here.">Bookings</Title><Card><Text style={styles.sectionTitle}>Sample confirmed booking</Text><RoomSummary room={rooms[0]} booking /><Pill greenish>O5 · Preview outcome</Pill><Text style={styles.muted}>Explore the prototype outcome without creating a reservation.</Text><Action title="View booking outcome" onPress={() => preview("confirmed")} /><Action title="View booking details" outline onPress={() => preview("booking")} /></Card><Info>Demo content only · No booking has been saved.</Info><Action title="Find a room" outline onPress={() => router.navigate("/renter" as Href)} /></Page>;
  return <Page selected="bookings"><Header /><Title>Booking details</Title><Pill greenish>Confirmed · O5</Pill><RoomSummary room={selected} booking />
    <Card><Text style={styles.sectionTitle}>Your stay</Text><Line icon="calendar" label="Move-in" value="Dec 1, 2026" /><Line icon="calendar" label="Last occupied day" value="May 31, 2027" /><Line icon="calendar" label="Lease duration" value="6 months" /></Card>
    <Card><Text style={styles.sectionTitle}>Final rental terms</Text><Terms includeLease={false} includeMove={false} /></Card><Info><Text style={{ fontWeight: "700" }}>House rules{"\n"}</Text>No smoking indoors{"\n"}Quiet hours after 10 PM</Info>
    <Text style={styles.centerNote}>Preview booking · Sample confirmation</Text><Action title="View negotiation history" outline onPress={() => go("history")} />
  </Page>;
}
function History() {
  const [filter, setFilter] = useState<"Active" | "Finished">("Active");
  const { selected, booking, negotiation } = useRenter();
  return <Page selected="negotiations"><Header role /><Title subtitle="Follow your agent’s offers and outcomes.">Your negotiations</Title><View style={styles.centerBadge}><MaterialCommunityIcons name="home-switch-outline" size={72} color={rust} /></View>
    <View style={styles.segment}>{(["Active","Finished"] as const).map(name => <Pressable key={name} onPress={() => setFilter(name)} style={[styles.segmentOption,filter === name && styles.segmentOn]}><Text style={[styles.segmentText,filter === name && { color: "white" }]}>{name}</Text></Pressable>)}</View>
    {filter === "Active" && negotiation !== "idle" && !booking ? <Card><RoomSummary room={selected} /><Pill>Negotiation in progress · preview</Pill><Action title="View negotiation" onPress={() => go(negotiation === "validating" ? "agreement" : "negotiation")} /></Card> : filter === "Finished" && booking ? <Card><RoomSummary room={selected} booking /><Pill greenish>Booking confirmed · preview</Pill><Line icon="database" label="Agreed rent" value="₱3,300 / month" /><Line icon="calendar" label="Lease" value="6 months" /><Action title="View booking" onPress={() => go("booking")} /></Card> : <Card><Text style={styles.sectionTitle}>No {filter.toLowerCase()} negotiations yet</Text><Text style={styles.muted}>Choose a room from search to begin your own preview flow.</Text><Action title="Find a room" onPress={() => router.navigate("/renter" as Href)} /></Card>}
    <Card><Text style={styles.sectionTitle}>Sample {filter.toLowerCase()} flow</Text><RoomSummary room={rooms[0]} /><Pill>{filter === "Active" ? "R6 · Negotiating" : "R7 · Agreement reached"}</Pill><Text style={styles.muted}>Demo data for exploring the Figma success path.</Text><Action title={filter === "Active" ? "View negotiation preview" : "View agreement preview"} onPress={() => preview(filter === "Active" ? "negotiation" : "agreement")} />{filter === "Finished" && <Action title="View booking outcome preview" outline onPress={() => preview("confirmed")} />}</Card>
  </Page>;
}
const screens: Record<string, () => React.JSX.Element> = { preferences: Preferences, results: Results, room: Details, review: Review, negotiation: Negotiation, agreement: Agreement, confirmed: Confirmed, booking: Booking, history: History };
export function RenterStage({ stage }: { stage?: string }) {
  const Component = stage ? screens[stage] : undefined;
  const { negotiation, booking } = useRenter();
  const demo = useDemoPreview();
  if (!demo && ((stage === "confirmed" && !booking) || ((stage === "agreement" || stage === "negotiation") && negotiation === "idle"))) return <Page><Header /><Title>Nothing to show yet</Title><Info>Start from a room to follow the preview flow.</Info><Action title="Find a room" onPress={() => router.replace("/renter" as Href)} /></Page>;
  return Component ? <Component /> : <Page><Header /><Title>Screen unavailable</Title><Action title="Return to search" onPress={() => router.replace("/renter" as Href)} /></Page>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ivory },
  content: { width: "100%", maxWidth: 500, alignSelf: "center", paddingHorizontal: 15, paddingTop: 10, paddingBottom: 24, gap: 12 },
  header: { flexDirection: "row", alignItems: "center", minHeight: 48, gap: 9, marginBottom: 7 },
  back: { width: 33, justifyContent: "center" },
  houseMark: { width: 27, height: 29, alignItems: "center", justifyContent: "center" },
  houseWindow: { width: 7, height: 7, backgroundColor: rust, position: "absolute", top: 13 },
  divider: { width: 1, height: 26, backgroundColor: dark },
  brand: { fontSize: 16, fontWeight: "700", color: "#15191A", flexShrink: 1 },
  role: { marginLeft: "auto", backgroundColor: "#EFE2DA", color: "#17402F", borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10, fontSize: 13 },
  titleBox: { gap: 3, marginTop: 2 },
  title: { color: "#15191B", fontSize: 28, fontWeight: "800", letterSpacing: -0.7 },
  subtitle: { color: muted, fontSize: 15, lineHeight: 21 },
  card: { borderRadius: 18, backgroundColor: "white", padding: 15, gap: 6 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#171C1A", marginBottom: 4 },
  sectionTitleOutside: { fontSize: 19, fontWeight: "800", color: dark, marginTop: 6 },
  muted: { color: muted, fontSize: 14 },
  pill: { backgroundColor: "#E9D9CF", borderRadius: 22, alignSelf: "flex-start", paddingHorizontal: 13, paddingVertical: 5 },
  pillText: { fontSize: 13, color: "#292924" },
  greenPill: { backgroundColor: "#DDE5DB" },
  info: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 15, backgroundColor: "#EDDED5", padding: 12, marginTop: 5 },
  infoDivider: { width: 1, backgroundColor: "#A6A8A1", alignSelf: "stretch" },
  infoText: { flex: 1, color: "#252825", fontSize: 13, lineHeight: 19 },
  action: { backgroundColor: green, minHeight: 45, borderRadius: 17, alignItems: "center", justifyContent: "center", marginTop: 6, paddingHorizontal: 10 },
  actionText: { fontSize: 16, fontWeight: "800", color: "white", textAlign: "center" },
  outline: { borderWidth: 1, borderColor: green, backgroundColor: "transparent" },
  outlineText: { color: "#153D29" },
  inputBlock: { flex: 1, gap: 5, marginBottom: 7 },
  inputLabel: { fontWeight: "700", color: dark, fontSize: 14 },
  inputOuter: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderColor: green, borderWidth: 1, borderRadius: 10, minHeight: 39 },
  input: { color: dark, fontSize: 16, paddingHorizontal: 12, paddingVertical: 7, flex: 1 },
  inputText: { color: dark, fontSize: 16, flexShrink: 1 },
  option: { minHeight: 44, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#D4D8D1" },
  select: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, minHeight: 39 },
  suffix: { fontSize: 12, paddingRight: 8, color: muted },
  two: { flexDirection: "row", gap: 13 },
  rule: { backgroundColor: "#BFC9C1", height: 1, marginVertical: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 8 },
  chip: { borderColor: "#A5B1A8", borderWidth: 1, borderRadius: 20, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, gap: 7, backgroundColor: "#F2F0EC" },
  selectedChip: { backgroundColor: green },
  chipLabel: { fontSize: 12, color: dark },
  error: { color: "#A34235", fontSize: 13 },
  line: { flexDirection: "row", alignItems: "center", minHeight: 33, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#BFC9C1", gap: 6 },
  lineLabel: { color: dark, fontSize: 13, flex: 1 },
  lineValue: { color: dark, fontSize: 13, fontWeight: "700", textAlign: "right", flexShrink: 1 },
  termLine: { flexDirection: "row", alignItems: "center", minHeight: 37, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#BFC9C1", gap: 6 },
  termLabel: { flex: 1, color: dark, fontSize: 12 },
  termValue: { fontSize: 12, fontWeight: "700", color: dark },
  negotiable: { fontSize: 10, color: rust, backgroundColor: "#F0E6E0", paddingHorizontal: 6, paddingVertical: 4, borderRadius: 12 },
  summary: { flexDirection: "row", gap: 10, alignItems: "center", marginVertical: 4 },
  summaryPhoto: { width: "45%", height: 112, borderRadius: 12 },
  summaryBody: { flex: 1, gap: 7 },
  summaryName: { color: "#171A1D", fontSize: 18, fontWeight: "800" },
  summarySmall: { color: dark, fontSize: 13 },
  tabs: { flexDirection: "row", backgroundColor: "#FAF9F7", borderTopWidth: 1, borderTopColor: "#EEECE9", paddingHorizontal: 8, paddingTop: 7 },
  tab: { flex: 1, alignItems: "center", minHeight: 52, gap: 1 },
  tabText: { color: "#454742", fontSize: 11.5 },
  activeText: { color: rust, fontWeight: "700" },
  tabLine: { width: "72%", height: 3, borderRadius: 4, backgroundColor: rust, position: "absolute", bottom: 0 },
  priority: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 32 },
  priorityLabel: { width: 105, fontSize: 13, fontWeight: "700", color: dark },
  track: { height: 6, borderRadius: 8, backgroundColor: "#CED4CD", flex: 1, justifyContent: "center" },
  trackFill: { height: 6, backgroundColor: rust, borderRadius: 8 },
  weightButton: { minWidth: 28, minHeight: 36, alignItems: "center", justifyContent: "center" },
  weight: { minWidth: 36, textAlign: "right", color: dark, fontSize: 13 },
  simpleHeader: { flexDirection: "row", gap: 14, alignItems: "center", minHeight: 52 },
  headerTitle: { fontSize: 21, fontWeight: "800", color: dark },
  searchSummary: { backgroundColor: "#E6D5C9", borderRadius: 18, padding: 15, flexDirection: "row", alignItems: "center", gap: 11 },
  searchMain: { color: dark, fontSize: 15, fontWeight: "700" },
  searchSub: { color: dark, fontSize: 14 },
  edit: { color: rust, fontSize: 15, fontWeight: "700" },
  resultsCount: { fontWeight: "800", fontSize: 17, color: dark, marginTop: 4 },
  matchCard: { padding: 3, overflow: "hidden", marginBottom: 2, gap: 0 },
  matchPhoto: { width: "100%", height: 123, borderRadius: 15 },
  rank: { alignSelf: "flex-start", marginLeft: 13, marginTop: -19, paddingVertical: 3, paddingHorizontal: 12, backgroundColor: rust, borderRadius: 18, borderWidth: 1, borderColor: "white" },
  rankText: { color: "white", fontSize: 13, fontWeight: "700" },
  matchBody: { paddingHorizontal: 12, paddingBottom: 9, gap: 5 },
  matchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 },
  matchName: { fontSize: 17, color: dark, fontWeight: "800", flex: 1 },
  matchRent: { fontSize: 16, fontWeight: "800", color: dark },
  perMonth: { fontSize: 13, fontWeight: "400" },
  location: { color: "#606962", fontSize: 14 },
  matchChips: { flexDirection: "row", gap: 5 },
  available: { color: dark, fontSize: 12 },
  smallAction: { backgroundColor: green, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 12 },
  smallActionText: { color: "white", fontWeight: "700", fontSize: 12 },
  heroWrap: { position: "relative" },
  hero: { height: 158, width: "100%", borderRadius: 19 },
  heroBack: { position: "absolute", left: 10, top: 10, width: 39, height: 39, backgroundColor: "#FFFFFFE8", borderRadius: 22, justifyContent: "center", alignItems: "center" },
  roomTitle: { color: dark, fontWeight: "800", fontSize: 25 },
  roomPrice: { fontWeight: "800", fontSize: 18, color: dark },
  ruleText: { color: dark, fontSize: 14, marginTop: 3 },
  textAction: { padding: 12, alignItems: "center" },
  agentBox: { borderWidth: 1, borderColor: green, backgroundColor: "#DEE3DB", padding: 15, borderRadius: 18, flexDirection: "row", alignItems: "center", gap: 15 },
  progress: { flexDirection: "row", justifyContent: "space-around", marginVertical: 13 },
  progressItem: { alignItems: "center", flex: 1, gap: 5 },
  progressCircle: { width: 23, height: 23, borderWidth: 1, borderColor: "#B5BDB5", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  progressOn: { backgroundColor: green, borderColor: green },
  progressText: { color: muted, fontSize: 12 },
  offer: { flexDirection: "row", alignItems: "center", gap: 11, marginTop: 5 },
  offerDot: { width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: green },
  offerCard: { borderWidth: 1, borderColor: "#AEB6AF", borderRadius: 10, padding: 9, flex: 1 },
  offerName: { color: dark, fontWeight: "700", fontSize: 14 },
  offerValue: { color: dark, fontSize: 13 },
  processing: { color: dark, fontSize: 14, marginVertical: 10 },
  centerBadge: { alignItems: "center", justifyContent: "center", marginVertical: 6 },
  outcomeTitle: { fontSize: 26, fontWeight: "800", color: "#15191D", textAlign: "center" },
  outcomeSub: { fontSize: 14, textAlign: "center", color: muted },
  centerNote: { fontSize: 13, color: muted, textAlign: "center", marginVertical: 6 },
  successCircle: { width: 68, height: 68, borderRadius: 35, alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: green, marginTop: 10 },
  termsBanner: { borderRadius: 12, padding: 8, backgroundColor: "#E8D8CD", marginTop: 10 },
  check: { fontSize: 15, color: dark, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: "#BFC9C1" },
  segment: { flexDirection: "row", borderWidth: 1, borderColor: green, borderRadius: 20, overflow: "hidden", minHeight: 37 },
  segmentOption: { flex: 1, alignItems: "center", justifyContent: "center" },
  segmentOn: { backgroundColor: green },
  segmentText: { fontSize: 15, fontWeight: "700", color: "#153D29" },
});
