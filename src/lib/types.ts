export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  city: string;
  total_acres: number;
  phase_acres: number;
  plot_count: number;
  plot_size_min: number;
  plot_size_max: number;
  starting_price: number;
  dtcp_number: string | null;
  rera_number: string | null;
  possession_status: string;
  description: string | null;
  hero_image: string | null;
  master_plan_image: string | null;
  status: string;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
}

export interface Plot {
  id: string;
  project_id: string;
  plot_number: string;
  size_sqft: number;
  facing_direction: string;
  price: number;
  status: 'available' | 'sold' | 'hold';
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Amenity {
  id: string;
  project_id: string;
  icon_name: string;
  title: string;
  description: string | null;
}

export interface Landmark {
  id: string;
  project_id: string;
  name: string;
  category: string;
  distance_km: number;
  drive_time_mins: number;
}

export interface GalleryImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  photo_url: string | null;
  rating: number;
  text: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  preferred_date: string | null;
  project_id: string | null;
  message: string | null;
  status: string;
  created_at: string;
}
