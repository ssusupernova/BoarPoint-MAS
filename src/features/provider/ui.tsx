import { useState, type PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

export function Screen({ children, footer }: PropsWithChildren<{ footer?: React.ReactNode }>) {
  return (
    <SafeAreaView style={s.page}>
      <KeyboardAvoidingView
        style={s.page}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
        >
          {children}
        </ScrollView>
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Heading({
  title,
  subtitle,
  centered = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <View style={s.heading}>
      <Text accessibilityRole="header" style={[s.title, centered && s.center]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[s.body, centered && s.center]}>{subtitle}</Text>
      )}
    </View>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (pressed || disabled) && s.dim,
      ]}
    >
      <Text style={[s.buttonText, secondary && s.secondaryText]}>{title}</Text>
    </Pressable>
  );
}
export function TextAction({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={s.textAction}
    >
      <Text style={s.link}>{title}</Text>
    </Pressable>
  );
}
export function Field({
  label,
  password = false,
  ...props
}: TextInputProps & { label: string; password?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputRow, focused && s.focused]}>
        <TextInput
          {...props}
          accessibilityLabel={label}
          style={s.input}
          placeholderTextColor="#747A74"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={password && !visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? "Hide password" : "Show password"}
            onPress={() => setVisible(!visible)}
            style={s.toggle}
          >
            <Feather
              name={visible ? "eye-off" : "eye"}
              size={22}
              color={colors.charcoal}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
export function Notice({
  children,
  error = false,
}: PropsWithChildren<{ error?: boolean }>) {
  return (
    <View style={[s.notice, error && s.errorBox]}>
      <Text
        accessibilityRole={error ? "alert" : undefined}
        style={[s.noticeText, error && s.errorText]}
      >
        {children}
      </Text>
    </View>
  );
}
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ivory },
  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    padding: 13,
    paddingBottom: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 44,
    marginBottom: 20,
  },
  brand: { color: colors.evergreen, fontSize: 24, fontWeight: "700" },
  back: {
    position: "absolute",
    left: 0,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
  },
  backText: { fontSize: 28, color: colors.charcoal },
  heading: { marginVertical: 8, gap: 3 },
  title: { fontSize: 27, fontWeight: "700", color: colors.charcoal },
  body: { fontSize: 13, lineHeight: 18, color: "#59615B" },
  center: { textAlign: "center" },
  button: {
    minHeight: 39,
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.evergreen,
    marginTop: 8,
  },
  buttonText: { color: "white", fontSize: 15, fontWeight: "700" },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.evergreen,
  },
  secondaryText: { color: colors.charcoal },
  dim: { opacity: 0.6 },
  textAction: {
    minHeight: 48,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    color: "#955D49",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  field: { marginTop: 8, gap: 4 },
  label: { color: colors.charcoal, fontSize: 15, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.sage,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  focused: { borderColor: colors.evergreen, borderWidth: 2 },
  input: {
    flex: 1,
    minHeight: 34,
    paddingHorizontal: 14,
    paddingVertical: 5,
    color: colors.charcoal,
    fontSize: 16,
  },
  toggle: { minHeight: 48, paddingHorizontal: 12, justifyContent: "center" },
  notice: {
    backgroundColor: "#EDE1D9",
    padding: 8,
    borderRadius: 14,
    marginTop: 8,
  },
  noticeText: { color: colors.charcoal, lineHeight: 17, fontSize: 14 },
  errorBox: { backgroundColor: "#F7E5DF" },
  errorText: { color: "#963C2C" },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 11,
    marginTop: 8,
    gap: 4,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: colors.charcoal },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EDE1D9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: colors.charcoal,
    textTransform: "capitalize",
  },
});
