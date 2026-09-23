"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const initialForm = { name: "", email: "", rating: "5", experience: "" };

export default function FeedbackPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Unable to submit feedback.");

      setForm(initialForm);
      setStatus({ type: "success", message: "Thank you. Your private feedback has been sent to our team." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-purple-secondary mb-3">Your voice matters</p>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-primary mb-4">Share your experience</h1>
            <p className="text-gray-600 max-w-xl mx-auto">Tell us about your stay or interaction with Saphire Apartments. Your feedback is sent privately to our team and is never published publicly.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-purple-lighter rounded-2xl shadow-sm p-6 md:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Your name</span>
                <input name="name" value={form.name} onChange={updateField} required maxLength={100} className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-secondary focus:ring-2 focus:ring-purple-lighter" placeholder="Jane Doe" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-2">Email address</span>
                <input type="email" name="email" value={form.email} onChange={updateField} required maxLength={254} className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-secondary focus:ring-2 focus:ring-purple-lighter" placeholder="jane@example.com" />
              </label>
            </div>

            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-3">How would you rate your experience?</legend>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className={`cursor-pointer rounded-lg border px-4 py-3 text-sm transition-colors ${form.rating === String(rating) ? "border-purple-secondary bg-purple-lighter text-purple-primary" : "border-gray-300 text-gray-600 hover:border-purple-light"}`}>
                    <input type="radio" name="rating" value={rating} checked={form.rating === String(rating)} onChange={updateField} className="sr-only" />
                    {rating} {rating === 1 ? "star" : "stars"}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">Your experience</span>
              <textarea name="experience" value={form.experience} onChange={updateField} required maxLength={2000} rows={7} className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-secondary focus:ring-2 focus:ring-purple-lighter" placeholder="What did you enjoy, and what could we improve?" />
            </label>

            {status.message && (
              <p role="status" className={`rounded-lg px-4 py-3 text-sm ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {status.message}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-purple-gradient px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Sending..." : "Send private feedback"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}