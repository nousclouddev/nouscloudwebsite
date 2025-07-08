export interface Webinar {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dateTime: string;
  duration: string;
}

export interface WebinarEnrollment {
  webinarId: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  currentRole: 'Student' | 'Fresher' | 'IT Professional' | 'Other';
  timestamp: Date;
}

export type WebinarFormData = Omit<WebinarEnrollment, 'webinarId' | 'timestamp'>;
