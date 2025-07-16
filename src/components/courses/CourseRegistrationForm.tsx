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
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "@/components/ui/sonner";
import * as z from "zod";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "<SITE_KEY>";

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
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!captcha) {
      alert("Please complete the captcha");
      return;
    }

    const payload = {
      ...values,
      course_name: course.course_name,
      course_id: course.course_id,
      date: course.start_date,
      time: course.start_time,
      duration: course.duration,
    };
    try {
      await fetch(
        "https://ycwwkk23x7.execute-api.ap-south-1.amazonaws.com/prod/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "PGrUWFrsgk5QxhzbBL9622BHtWaST5DR9cvQXHVO",
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (e) {
      // ignore errors, best effort only
    } finally {
      onClose();
      form.reset();
      setCaptcha("");
      recaptchaRef.current?.reset();
      toast("You are successfully Registered, please check the mail for details");
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
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseRegistrationForm;
