import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
export type Room = {
  id: string;
  name: string;
  rent: number;
  deposit: number;
  area: string;
  amenities: string[];
  available: string;
  type: string;
};
export const rooms: Room[] = [
  {
    id: "sunny",
    name: "Sunny Private Room",
    rent: 3500,
    deposit: 3500,
    area: "Dapitan City",
    amenities: ["Wi-Fi", "Water", "Kitchen"],
    available: "Dec 1",
    type: "Private room",
  },
  {
    id: "garden",
    name: "Quiet Garden Room",
    rent: 4200,
    deposit: 4200,
    area: "Dapitan City",
    amenities: ["Wi-Fi", "Water"],
    available: "Dec 1",
    type: "Private room",
  },
  {
    id: "studio",
    name: "City Studio Room",
    rent: 4800,
    deposit: 4800,
    area: "Dapitan City",
    amenities: ["Wi-Fi", "Electricity"],
    available: "Dec 1",
    type: "Studio",
  },
];
type Requirements = {
  area: string;
  type: string;
  min: string;
  max: string;
  date: string;
  months: string;
  amenities: string[];
  rentLimit: string;
  depositLimit: string;
  priorities: Record<string, number>;
  minLease: string;
  maxLease: string;
  moveWindow: string;
  timeLimit: string;
};
const initial: Requirements = {
  area: "Dapitan City",
  type: "Private room",
  min: "3500",
  max: "5000",
  date: "Dec 1, 2026",
  months: "6",
  amenities: ["Wi-Fi", "Water"],
  rentLimit: "5000",
  depositLimit: "3500",
  minLease: "6",
  maxLease: "12",
  moveWindow: "Dec 1–7, 2026",
  timeLimit: "5 minutes",
  priorities: { "Monthly rent": 40, Deposit: 20, "Lease duration": 20, Inclusions: 20 },
};
type State = {
  requirements: Requirements;
  update: (changes: Partial<Requirements>) => void;
  selected: Room;
  select: (room: Room) => void;
  booking: boolean;
  negotiation: "idle" | "active" | "validating" | "confirmed";
  startNegotiation: () => void;
  startValidation: () => void;
  confirm: () => void;
  reset: () => void;
};
const Context = createContext<State | null>(null);
export function RenterProvider({ children }: PropsWithChildren) {
  const [requirements, setRequirements] = useState(initial);
  const [selected, select] = useState(rooms[0]);
  const [booking, setBooking] = useState(false);
  const [negotiation, setNegotiation] = useState<State["negotiation"]>("idle");
  return (
    <Context.Provider
      value={{
        requirements,
        update: (changes) =>
          setRequirements((previous) => ({ ...previous, ...changes })),
        selected,
        select,
        booking,
        negotiation,
        startNegotiation: () => { setBooking(false); setNegotiation("active"); },
        startValidation: () => setNegotiation("validating"),
        confirm: () => { setBooking(true); setNegotiation("confirmed"); },
        reset: () => {
          setRequirements(initial);
          select(rooms[0]);
          setBooking(false);
          setNegotiation("idle");
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useRenter() {
  const value = useContext(Context);
  if (!value) throw new Error("RenterProvider is required");
  return value;
}
export const peso = (amount: number) => `₱${amount.toLocaleString("en-PH")}`;
