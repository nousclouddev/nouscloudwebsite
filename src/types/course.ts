export interface Course {
  course_name: string;
  description: string;
  start_date: string;
  start_time: string;
  duration: string;
  price: string;
  key_areas: string[];
  course_type?: string;
  host_details?: string;
  course_id?: string;
  join_link?: string;
}
