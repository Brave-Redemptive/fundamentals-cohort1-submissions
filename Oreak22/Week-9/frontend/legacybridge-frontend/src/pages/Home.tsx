import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">LegacyBridge Dashboard</h1>
      <p className="text-gray-600">
        View transformed payments from legacy PHP system.
      </p>

      <Link to="/payments">
        <Button>View Payments</Button>
      </Link>
    </div>
  );
}
