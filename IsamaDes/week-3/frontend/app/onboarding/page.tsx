 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [longTermGoals, setLongTermGoals] = useState("");
  const [reason, setReason] = useState("");
  const [timeLine, setTimeLine] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // store in localStorage for now
    localStorage.setItem("longTermGoals", longTermGoals);
    localStorage.setItem("timeLine", timeLine);
    localStorage.setItem("reason", reason);

    // redirect to register page
    router.push("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Tell us about your long-term goals
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={longTermGoals}
            onChange={(e) => setLongTermGoals(e.target.value)}
            placeholder="E.g. Start a business, improve health, learn coding..."
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-400"
            rows={5}
          />
          <textarea 
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why are you setting this Longterm goal"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-400"
            rows={5}/>
            
            <input type="date" value={timeLine} onChange={(e) => setTimeLine(e.target.value)} 
            className="w-full p-3 border rounded-lg focus:ring focus:ring-green-400"/>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl text-lg transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
