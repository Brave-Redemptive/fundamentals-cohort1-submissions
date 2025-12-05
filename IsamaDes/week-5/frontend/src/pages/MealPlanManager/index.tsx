import { useEffect, useState } from "react";
import type{FormEvent} from 'react'
import type{ User } from "../../types/User";
import {
  createMealPlan,
  getAllMealPlans,
} from "../../services/nutritionistService";
import type{MealPlanData} from "../../services/nutritionistService" 

interface ClientProfileProps {
  user?: User | null;
}

export default function MealPlanManager({ user }: ClientProfileProps) {
  const [mealPlans, setMealPlans] = useState<MealPlanData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MealPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controlled form data
  const [formData, setFormData] = useState<MealPlanData>({
    patientId: "",
    patientName: "",
    doctorName: user?.name || "Admin User",
    healthGoal: "",
    nutritionalRequirement: "",
    dateRange: { start: "", end: "" },
    assignedDoctor: "",
    numberOfWeeks: 1,
    weeklyMealPlans: [],
   
  });

  // Fetch all meal plans when component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await getAllMealPlans();
        setMealPlans(res.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch meal plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Handle input changes (including nested dateRange)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      setFormData((prev) => ({
        ...prev,
        dateRange: { ...prev.dateRange, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create new meal plan
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await createMealPlan(formData);
      setMealPlans((prev) => [...prev, res.data]);
      alert("Meal plan created successfully!");
      // Reset form
      setFormData({
        patientId: "",
        patientName: "",
        doctorName: user?.name || "Admin User",
        healthGoal: "",
        nutritionalRequirement: "",
        dateRange: { start: "", end: "" },
         assignedDoctor: "",
        numberOfWeeks: 1,
        weeklyMealPlans: [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to create meal plan");
    }
  };

  const isNutritionist = user?.role?.toLowerCase() === "nutritionist";

  return (
    <div className=" p-6">
        
      {isNutritionist ? (
        <h2 className="text-2xl font-semibold mb-4">Meal Plan Management</h2>
      ):
      <h2 className="text-2xl font-semibold mb-4"> See your mealplan</h2>
        
      }

      {/* === Create Meal Plan Form === */}
       {isNutritionist && (
      <form
        onSubmit={handleCreate}
        className="mb-6 p-4 border rounded bg-gray-50 space-y-3"
      >
        <h3 className="text-lg font-semibold mb-2">Create New Meal Plan</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            placeholder="Client ID"
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Client Name"
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            placeholder="Nutritionist Name"
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            name="healthGoal"
            value={formData.healthGoal}
            onChange={handleChange}
            placeholder="Health Goal"
            className="border p-2 rounded w-full"
            required
          />

          <textarea
            name="nutritionalRequirement"
            value={formData.nutritionalRequirement}
            onChange={handleChange}
            placeholder="Nutritional Requirements"
            className="border p-2 rounded sm:col-span-2"
            required
          />

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Start Date</label>
            <input
              type="date"
              name="start"
              value={formData.dateRange.start}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">End Date</label>
            <input
              type="date"
              name="end"
              value={formData.dateRange.end}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Number of Weeks</label>
            <input
              type="number"
              name="numberOfWeeks"
              value={formData.numberOfWeeks}
              onChange={handleChange}
              min={1}
              className="border p-2 rounded"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Meal Plan
        </button>
      </form>
       )}

      {/* === List of Meal Plans === */}
      <ul className="space-y-3">
        {mealPlans.length === 0 && (
          <p className="text-gray-500">No meal plans available yet.</p>
        )}
        {mealPlans.map((plan, index) => (
          <li
            key={index}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{plan.patientName}</p>
              <p className="text-sm text-gray-500">{plan.healthGoal}</p>
            </div>
            <button
              onClick={() => setSelectedPlan(plan)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              View
            </button>
          </li>
        ))}
      </ul>

      {/* === Selected Plan Details === */}
      {selectedPlan && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold text-lg mb-2">
            Meal Plan for {selectedPlan.patientName}
          </h3>
          <p>
            <strong>Goal:</strong> {selectedPlan.healthGoal}
          </p>
          <p>
            <strong>Nutritional Needs:</strong>{" "}
            {selectedPlan.nutritionalRequirement}
          </p>
          <p>
            <strong>Date Range:</strong>{" "}
            {selectedPlan.dateRange.start} → {selectedPlan.dateRange.end}
          </p>
          <p>
            <strong>Weeks:</strong> {selectedPlan.numberOfWeeks}
          </p>
        </div>
      )}
    </div>
  );
}
