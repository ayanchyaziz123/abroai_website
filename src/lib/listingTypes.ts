// Config-driven listing types — mirrors the mobile app's
// src/config/listingTypes.js pattern, scoped to the web MVP: browse, view,
// post, and edit the 5 self-serve Listing-backed types. Professionals and
// events aren't included in this first pass.

export type FieldKind = "text" | "textarea" | "number" | "select";

export type ExtraField = {
  key: string; // matches the serializer's write field name
  label: string;
  kind: FieldKind;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // for kind: "select"
};

export type ListingTypeConfig = {
  key: "job" | "housing" | "marketplace" | "service" | "rideshare";
  catalogType: string; // value sent to /catalog/meta/?type=
  apiBase: string; // e.g. "/jobs/"
  label: string;
  labelPlural: string;
  accent: string; // matches --cat-* tokens in globals.css
  hasCategory: boolean;
  hasPrice: boolean; // marketplace/service/rideshare have a flat `price`
  priceLabel?: string;
  extraFields: ExtraField[];
};

export const LISTING_TYPES: ListingTypeConfig[] = [
  {
    key: "job",
    catalogType: "job",
    apiBase: "/jobs/",
    label: "Job",
    labelPlural: "Jobs",
    accent: "var(--cat-job)",
    hasCategory: true,
    hasPrice: false,
    extraFields: [
      { key: "company", label: "Company", kind: "text", required: true },
      { key: "salary_min", label: "Salary (min)", kind: "number" },
      { key: "salary_max", label: "Salary (max)", kind: "number" },
      {
        key: "salary_period",
        label: "Salary period",
        kind: "select",
        options: [
          { value: "hr", label: "Per hour" },
          { value: "yr", label: "Per year" },
        ],
      },
    ],
  },
  {
    key: "housing",
    catalogType: "housing",
    apiBase: "/housing/",
    label: "Housing",
    labelPlural: "Housing",
    accent: "var(--cat-housing)",
    hasCategory: true,
    hasPrice: true,
    priceLabel: "Rent (monthly)",
    extraFields: [
      { key: "bedrooms", label: "Bedrooms", kind: "number" },
      { key: "bathrooms", label: "Bathrooms", kind: "number" },
      { key: "sqft", label: "Square feet", kind: "number" },
    ],
  },
  {
    key: "marketplace",
    catalogType: "marketplace",
    apiBase: "/marketplace/",
    label: "Marketplace item",
    labelPlural: "Marketplace",
    accent: "var(--cat-market)",
    hasCategory: true,
    hasPrice: true,
    priceLabel: "Price",
    extraFields: [],
  },
  {
    key: "service",
    catalogType: "service",
    apiBase: "/services/",
    label: "Service",
    labelPlural: "Services",
    accent: "var(--cat-market)",
    hasCategory: false,
    hasPrice: true,
    priceLabel: "Price",
    extraFields: [],
  },
  {
    key: "rideshare",
    catalogType: "rideshare",
    apiBase: "/rideshare/",
    label: "Rideshare",
    labelPlural: "Rideshare",
    accent: "var(--cat-ride)",
    hasCategory: false,
    hasPrice: true,
    priceLabel: "Price",
    extraFields: [],
  },
];

export function getListingType(key: string) {
  return LISTING_TYPES.find((t) => t.key === key);
}
