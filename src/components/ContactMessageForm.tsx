
import { useState, useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "<SITE_KEY>";
const API_URL = "https://5zt0gybyx1.execute-api.ap-south-1.amazonaws.com/prod/send";
const API_KEY = "DWNWK4r9jO10yqWZJDV6g4V1DwnOUKWm8FEw0Qyu";
const RATE_LIMIT_MS = 10000;


const ContactMessageForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const last = Number(localStorage.getItem("lastContactMsgTime"));
    if (Date.now() - last < RATE_LIMIT_MS) {
      alert("Please wait before sending another request.");
      return;
    }
    if (!captcha) {
      alert("Please complete the captcha");
      return;
    }
    setLoading(true);
    sendEmail(captcha);
  };

  const sendEmail = (token: string) => {
    const payload = {
      to: "info@nouscloud.tech",
      from: email,
      subject: "Contact Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      recaptchaToken: token
    };
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(payload),
    })
      .then(async res => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
        if (
          (data && data.message && data.message.toLowerCase().includes("success")) ||
          res.ok
        ) {
          setSent(true);
          setName("");
          setEmail("");
          setMessage("");
          setCaptcha("");
          recaptchaRef.current?.reset();
          localStorage.setItem("lastContactMsgTime", Date.now().toString());
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">Send us a message</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          className="min-h-[100px]"
        />
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={SITE_KEY}
          onChange={value => setCaptcha(value || "")}
          className="mx-auto"
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
      {sent && <p className="mt-2 text-green-600">Thanks! We'll reach out soon.</p>}
    </div>
  );
};

export default ContactMessageForm;
