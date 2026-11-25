import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

export type Role = "renter" | "provider";
type PreviewUser = { email: string; role: Role };
type Session = {
  user: PreviewUser | null;
  enterPreview: (email: string, role: Role) => void;
  logout: () => void;
};
const Context = createContext<Session | null>(null);

// Temporary UI preview only. Replace with Supabase session state at integration.
// Passwords are never stored in this context or written to disk.
export function PreviewSessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<PreviewUser | null>(null);
  function logout() {
    setUser(null);
  }
  return (
    <Context.Provider
      value={{
        user,
        logout,
        enterPreview: (email, role) => setUser({ email: email.trim(), role }),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePreviewSession() {
  const value = useContext(Context);
  if (!value) throw new Error("PreviewSessionProvider is required.");
  return value;
}
