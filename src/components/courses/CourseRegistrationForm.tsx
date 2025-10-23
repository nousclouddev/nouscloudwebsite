import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Course } from "@/types/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "@/components/ui/sonner";
import * as z from "zod";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "<SITE_KEY>";
const API_BASE_URL = "https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod";
const API_KEY = "PGrUWFrsgk5QxhzbBL9622BHtWaST5DR9cvQXHVO";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().optional(),
  role: z.string().optional(),
});

interface CourseRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const CourseRegistrationForm = ({ isOpen, onClose, course }: CourseRegistrationFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      role: "",
    },
  });

  const [captcha, setCaptcha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const isFree = !course.price || Number(course.price) === 0;

  // Load Razorpay script
  useEffect(() => {
    if (!isFree && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isFree]);

  const verifyPayment = async (
    razorpayResponse: RazorpayResponse,
    email: string,
    courseId: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          email: email,
          course_id: courseId,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success("Payment verified! Registration confirmed. Check your email for details.");
        onClose();
        form.reset();
        setCaptcha("");
        recaptchaRef.current?.reset();
      } else {
        toast.error(result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Failed to verify payment. Please contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRazorpayCheckout = (orderData: any, formValues: z.infer<typeof formSchema>) => {
    const options = {
      key: orderData.razorpay_key,
      amount: orderData.amount * 100,
      currency: "INR",
      name: "NousCloud",
      description: course.course_name,
      order_id: orderData.order_id,
      prefill: {
        name: formValues.name,
        email: formValues.email,
        contact: formValues.phone,
      },
      theme: {
        color: "#3b82f6",
      },
      handler: async function (response: RazorpayResponse) {
        await verifyPayment(response, formValues.email, course.course_id);
      },
      modal: {
        ondismiss: function () {
          setIsSubmitting(false);
          toast.info("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!captcha) {
      toast.error("Please complete the captcha");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      course_name: course.course_name,
      course_id: course.course_id,
      amount: Number(course.price) || 0,
      date: course.start_date,
      time: course.start_time,
      duration: course.duration,
      webinar_name: course.course_name,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
        setIsSubmitting(false);
        return;
      }

      // For paid courses, open Razorpay checkout
      if (!isFree && data.order_id) {
        openRazorpayCheckout(data, values);
      } else {
        // For free courses, registration is complete
        toast.success("You are successfully registered! Check your email for details.");
        onClose();
        form.reset();
        setCaptcha("");
        recaptchaRef.current?.reset();
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for {course.course_name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="you@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your role" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={SITE_KEY}
              onChange={value => setCaptcha(value || "")}
              className="mx-auto"
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : isFree ? "Register" : "Proceed to Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseRegistrationForm;
