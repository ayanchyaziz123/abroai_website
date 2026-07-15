export type Profile = {
  handle: string;
  home_country: string;
  country_flag: string;
  lives_in: string;
  avatar_url?: string | null;
  bio?: string;
  is_verified?: boolean;
};

export type User = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: Profile;
};

export type CatalogCategory = {
  key: string;
  label: string;
  icon?: string;
  emoji?: string;
};

export type CatalogPlan = {
  key: string;
  label: string;
  price: string;
  price_cents: number;
  color: string;
  badge: string;
  features: string[];
  active_days: number;
  edit_limit: number | null;
};

export type CatalogMeta = {
  categories: CatalogCategory[];
  plans: CatalogPlan[];
  employment_types?: { key: string; label: string }[];
  bedroom_options?: { key: string; label: string }[];
  amenities?: { label: string }[];
};

export type ListingType = "job" | "housing" | "marketplace" | "event";

type ListingBase = {
  id: string; // UUID — Listing.public_id, not the internal integer pk
  title: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  category: string;
  description: string;
  image_url: string | null;
  image_urls: string[];
  gallery: { id: number; url: string }[];
  created_at: string;
  is_saved?: boolean;
  edit_count?: number;
};

export type JobListing = ListingBase & {
  poster: string;
  poster_id: number;
  company: string;
  posted_from?: string;
  employment_type: string;
  salary_min: string | null;
  salary_max: string | null;
  salary_period: string;
  plan: string;
  is_hot: boolean;
  is_active: boolean;
};

export type HousingListing = ListingBase & {
  poster: string;
  poster_id: number;
  price: string;
  posted_from?: string;
  bedrooms: number | null;
  bathrooms: string | null;
  sqft: number | null;
  move_in_date: string | null;
  amenities: string;
  plan: string;
  is_featured: boolean;
  is_active: boolean;
  average_rating: number;
  review_count: number;
};

export type MarketplaceListing = ListingBase & {
  poster: string;
  poster_id: number;
  price: string;
  plan: string;
  is_hot: boolean;
  is_active: boolean;
  average_rating: number;
  review_count: number;
};

export type EventListing = ListingBase & {
  posted_by_name: string;
  posted_by_id: number;
  date: string;
  is_free: boolean;
  price: string | null;
  link: string;
  rsvp_count: number;
  is_rsvped: boolean;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
