export interface Course {
  course_name: string;
  description: string;
  start_date: string;
  start_time: string;
  duration: string;
  price: string;
  key_areas: string[];
  details?: string[];
  course_type?: string;
  host_details?: string;
  course_id?: string;
  join_link?: string;
  seat_limit?: number;
  registered_count?: number;
  // optional fields from API
  registration_open?: boolean;
  actual_participants?: number;
  max_participants?: number;
}
