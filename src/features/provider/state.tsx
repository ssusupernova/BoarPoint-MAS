import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
export type Listing = {
  id: string;
  name: string;
  type: string;
  area: string;
  address: string;
  description: string;
  coverUri?: string;
  photo: "sunny" | "garden" | "studio";
  inclusions: string[];
  noSmoking: boolean;
  quiet: string;
  rent: string;
  deposit: string;
  lease: string;
  moveIn: string;
  availableFrom: string;
  availableUntil: string;
  negotiable: string[];
  minRent: string;
  minDeposit: string;
  minLease: string;
  maxLease: string;
  moveUntil: string;
  weights: string[];
};
export const blankListing = (): Listing => ({
  id: "",
  name: "",
  type: "Private room",
  area: "Dapitan City",
  address: "",
  description: "",
  photo: "sunny",
  inclusions: ["Wi-Fi", "Water"],
  noSmoking: true,
  quiet: "22:00",
  rent: "3500",
  deposit: "3500",
  lease: "6",
  moveIn: "2026-12-01",
  availableFrom: "2026-12-01",
  availableUntil: "2027-11-30",
  negotiable: [
    "Monthly rent",
    "Security deposit",
    "Lease duration",
    "Move-in date",
  ],
  minRent: "3200",
  minDeposit: "3000",
  minLease: "6",
  maxLease: "12",
  moveUntil: "2026-12-07",
  weights: ["40", "20", "20", "20"],
});
export const seedListings = (): Listing[] => [
  {
    ...blankListing(),
    id: "sunny",
    name: "Sunny Private Room",
    address: "Dapitan City",
    description: "A bright private room with Wi-Fi and water included.",
  },
  {
    ...blankListing(),
    id: "garden",
    name: "Quiet Garden Room",
    photo: "garden",
    rent: "4200",
    deposit: "4200",
    address: "Dapitan City",
    description: "A peaceful room overlooking the garden.",
  },
  {
    ...blankListing(),
    id: "studio",
    name: "City Studio Room",
    photo: "studio",
    type: "Studio",
    area: "Dapitan City",
    rent: "4800",
    deposit: "4800",
    address: "Dapitan City",
    description: "A convenient studio close to the city center.",
  },
];
export function validateListing(d: Listing, step: string): string {
  const positive = (v: string) => /^\d+(\.\d{1,2})?$/.test(v) && Number(v) > 0;
  const integer = (v: string) => /^\d+$/.test(v) && Number(v) > 0;
  const date = (v: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    !Number.isNaN(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v;
  if (step === "add" || step === "review") {
    if (![d.name, d.area, d.address, d.description].every((v) => v.trim()))
      return "Complete the listing name, area, address and description.";
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(d.quiet))
      return "Use a 24-hour time for quiet hours, such as 22:00.";
  }
  if (step === "terms" || step === "review") {
    if (!positive(d.rent) || !positive(d.deposit) || !integer(d.lease))
      return "Enter positive rent, deposit and a whole number of lease months.";
    if (![d.moveIn, d.availableFrom, d.availableUntil].every(date))
      return "Enter valid dates in YYYY-MM-DD format.";
    if (
      d.availableFrom > d.availableUntil ||
      d.moveIn < d.availableFrom ||
      d.moveIn > d.availableUntil
    )
      return "Move-in must fall within the availability dates.";
  }
  if (step === "agent" || step === "review") {
    if (
      !positive(d.minRent) ||
      Number(d.minRent) > Number(d.rent) ||
      !positive(d.minDeposit) ||
      Number(d.minDeposit) > Number(d.deposit)
    )
      return "Private rent and deposit floors must be positive and no higher than the listed amounts.";
    if (
      !integer(d.minLease) ||
      !integer(d.maxLease) ||
      Number(d.minLease) > Number(d.maxLease) ||
      Number(d.lease) < Number(d.minLease) ||
      Number(d.lease) > Number(d.maxLease)
    )
      return "The preferred lease must be within the minimum and maximum lease.";
    if (
      !date(d.moveUntil) ||
      d.moveUntil < d.moveIn ||
      d.moveUntil > d.availableUntil
    )
      return "Move-in window must end on or after preferred move-in, within availability.";
    if (
      d.weights.some((v) => !/^\d+$/.test(v) || Number(v) > 100) ||
      d.weights.reduce((a, v) => a + Number(v), 0) !== 100
    )
      return "Priority weights must be whole percentages adding up to 100.";
  }
  return "";
}
type Store = {
  listings: Listing[];
  draft: Listing;
  update: (v: Partial<Listing>) => void;
  start: (d?: Listing) => void;
  save: () => string;
  reset: () => void;
};
const Context = createContext<Store | null>(null);
export function ProviderStore({ children }: PropsWithChildren) {
  const [listings, setListings] = useState(seedListings);
  const [draft, setDraft] = useState(blankListing);
  return (
    <Context.Provider
      value={{
        listings,
        draft,
        update: (v) => setDraft((d) => ({ ...d, ...v })),
        start: (d) =>
          setDraft(
            d
              ? {
                  ...d,
                  inclusions: [...d.inclusions],
                  negotiable: [...d.negotiable],
                  weights: [...d.weights],
                }
              : blankListing(),
          ),
        save: () => {
          const id = draft.id || `local-${Date.now()}`;
          const saved = { ...draft, id };
          setListings((old) =>
            old.some((l) => l.id === id)
              ? old.map((l) => (l.id === id ? saved : l))
              : [saved, ...old],
          );
          setDraft(saved);
          return id;
        },
        reset: () => {
          setListings(seedListings());
          setDraft(blankListing());
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProvider() {
  const c = useContext(Context);
  if (!c) throw new Error("ProviderStore missing");
  return c;
}
