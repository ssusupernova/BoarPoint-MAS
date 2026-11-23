import { useCallback, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { IosAuthorizationStatus, AndroidImportance } from "expo-notifications";

function permissionLabel(
  permission: Notifications.NotificationPermissionsStatus,
) {
  if (permission.ios?.status === IosAuthorizationStatus.PROVISIONAL)
    return "Quiet delivery";
  if (permission.granted) return "Enabled";
  return permission.canAskAgain ? "Not enabled" : "Denied";
}
export function useNotificationPermission() {
  const [status, setStatus] = useState(
    Platform.OS === "web" ? "Unavailable on web" : "Checking…",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const refresh = useCallback(() => {
    if (Platform.OS === "web") return;
    return Notifications.getPermissionsAsync()
      .then((permission) => setStatus(permissionLabel(permission)))
      .catch(() => setStatus("Unavailable"));
  }, []);
  useEffect(() => {
    void refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);
  async function request() {
    if (busy) return false;
    setBusy(true);
    setError("");
    try {
      if (Platform.OS === "web") {
        setError("Open BoardPoint on your phone to enable notifications.");
        return false;
      }
      if (Platform.OS === "android")
        await Notifications.setNotificationChannelAsync("updates", {
          name: "Booking and negotiation updates",
          importance: AndroidImportance.DEFAULT,
        });
      const permission = await Notifications.requestPermissionsAsync();
      setStatus(permissionLabel(permission));
      if (
        !permission.granted &&
        permission.ios?.status !== IosAuthorizationStatus.PROVISIONAL
      ) {
        setError(
          "Notifications are off. You can continue or allow them in device settings.",
        );
        return false;
      }
      return true;
    } catch {
      setError(
        "Could not request permission. Try again or continue with Not now.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  }
  return { status, busy, error, request };
}
