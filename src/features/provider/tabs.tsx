import { View, Text, Pressable, StyleSheet } from "react-native";
import { router, type Href } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
export function ProviderTabs({ selected = "listings" }: { selected?: string }) {
  const tabs = [
    ["listings", "Listings", "home"],
    ["negotiations", "Negotiations", "repeat"],
    ["bookings", "Bookings", "calendar"],
    ["account", "Account", "user"],
  ] as const;
  return (
    <View style={st.tabs}>
      {tabs.map(([key, label, icon]) => (
        <Pressable
          key={key}
          accessibilityRole="tab"
          accessibilityState={{ selected: selected === key }}
          onPress={() =>
            router.replace(
              (key === "account"
                ? "/account"
                : key === "listings"
                  ? "/provider"
                  : `/provider/${key}`) as Href,
            )
          }
          style={st.tab}
        >
          <Feather
            name={icon}
            size={24}
            color={selected === key ? colors.terracotta : colors.charcoal}
          />
          <Text
            style={[
              st.tabText,
              selected === key && {
                color: colors.terracotta,
                fontWeight: "700",
              },
            ]}
          >
            {label}
          </Text>
          <View
            style={[
              st.indicator,
              {
                backgroundColor:
                  selected === key ? colors.terracotta : "transparent",
              },
            ]}
          />
        </Pressable>
      ))}
    </View>
  );
}
const st = StyleSheet.create({
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
