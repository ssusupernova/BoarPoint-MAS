import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {
  Brand,
  Button,
  Field,
  Heading,
  Notice,
  Screen,
  TextAction,
  s,
} from "@/components/access/ui";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { usePreviewSession, type Role } from "./preview-session";

type Mode = "login" | "signup" | "forgot" | "reset";
const content = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to find your next room.",
    button: "Log in",
  },
  signup: {
    title: "Create an account",
    subtitle: "Choose how you’ll use the app.",
    button: "Create account",
  },
  forgot: {
    title: "Forgot your password?",
    subtitle: "Enter your account email to request a reset link.",
    button: "Send reset link",
  },
  reset: {
    title: "Set a new password",
    subtitle: "Choose a new password for your account.",
    button: "Update password",
  },
};
export function AuthScreen({ mode }: { mode: Mode }) {
  const session = usePreviewSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [role, setRole] = useState<Role>("renter");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const current = content[mode];
  function edit(setter: (value: string) => void, value: string) {
    setter(value);
    setError("");
    setSubmitted(false);
  }
  function submit() {
    setError("");
    if (mode !== "reset" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode !== "forgot" && !password) {
      setError("Enter your password.");
      return;
    }
    if ((mode === "signup" || mode === "reset") && password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if ((mode === "signup" || mode === "reset") && password !== confirmation) {
      setError("Your passwords must match.");
      return;
    }
    setPassword("");
    setConfirmation("");
    if (mode === "login" || mode === "signup") {
      session.enterPreview(email, role);
      router.replace("/notifications");
      return;
    }
    setSubmitted(true);
  }
  return (
    <Screen>
      <Brand back={mode !== "login"} />
      {mode === "login" && (
        <Image
          source={require("../../../assets/images/boardpoint-login.png")}
          resizeMode="contain"
          style={styles.photo}
        />
      )}
      {(mode === "forgot" || mode === "reset") && (
        <View style={styles.symbol}>
          <Feather
            name={mode === "forgot" ? "mail" : "lock"}
            size={64}
            color={colors.terracotta}
          />
        </View>
      )}
      <Heading
        title={current.title}
        subtitle={current.subtitle}
        centered={mode === "forgot" || mode === "reset"}
      />
      {mode === "login" && <View style={styles.accent} />}
      {(mode === "signup" || mode === "login") && (
        <View style={styles.roles}>
          {(["renter", "provider"] as const).map((option) => (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ checked: role === option }}
              onPress={() => setRole(option)}
              style={[styles.role, role === option && styles.selectedRole]}
            >
              <Feather
                name={option === "renter" ? "key" : "home"}
                size={30}
                color={colors.charcoal}
              />
              <Text style={styles.roleText}>
                {option === "renter" ? "Renter" : "Provider"}
              </Text>
              <Text style={s.body}>
                {role === option ? "Selected" : "Select"}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
      {mode !== "reset" && (
        <Field
          label="Email address"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={(value) => edit(setEmail, value)}
        />
      )}
      {mode !== "forgot" && (
        <Field
          label={mode === "reset" ? "New password" : "Password"}
          password
          placeholder="Enter your password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChangeText={(value) => edit(setPassword, value)}
        />
      )}
      {(mode === "signup" || mode === "reset") && (
        <>
          <Field
            label="Confirm password"
            password
            placeholder="Re-enter your password"
            autoComplete="new-password"
            value={confirmation}
            onChangeText={(value) => edit(setConfirmation, value)}
          />
          <Text style={styles.hint}>Use at least 8 characters.</Text>
        </>
      )}
      {mode === "login" && (
        <TextAction
          title="Forgot password?"
          onPress={() => router.push("/auth/forgot-password")}
        />
      )}
      {!!error && <Notice error>{error}</Notice>}
      <Button title={current.button} onPress={submit} disabled={submitted} />
      {submitted && (
        <Notice>
          {mode === "forgot"
            ? "Preview complete. Email delivery will be connected with Supabase."
            : "Password form validated. Password updates will be connected with Supabase."}
        </Notice>
      )}
      {mode === "forgot" && submitted && (
        <Button
          secondary
          title="Preview reset-password screen"
          onPress={() => router.push("/auth/reset-password")}
        />
      )}
      {mode === "login" ? (
        <TextAction
          title="New here? Create an account"
          onPress={() => router.push("/auth/signup")}
        />
      ) : (
        <TextAction
          title="Back to log in"
          onPress={() => router.replace("/auth/login")}
        />
      )}
      <Text style={styles.preview}>
        Frontend preview · Use sample details. Authentication is pending.
      </Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  symbol: {
    alignSelf: "center",
    padding: 30,
    borderRadius: 80,
    backgroundColor: "#EDE1D9",
    marginVertical: 20,
  },
  photo: { width: "100%", height: 180, borderRadius: 20 },
  accent: {
    width: 44,
    height: 4,
    backgroundColor: colors.terracotta,
    marginBottom: 8,
    borderRadius: 2,
  },
  roles: { flexDirection: "row", gap: 12, marginVertical: 12 },
  role: {
    flex: 1,
    minHeight: 108,
    backgroundColor: "#EDE1D9",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  selectedRole: { backgroundColor: "#DFE3DA", borderColor: colors.evergreen },
  roleText: { fontSize: 20, fontWeight: "700", color: colors.charcoal },
  hint: { color: "#59615B", marginTop: 12, fontSize: 14 },
  preview: {
    color: "#59615B",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 16,
  },
});
