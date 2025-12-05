import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function PaymentCard({ p }: any) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Payment #{p.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Amount:</strong> ${p.amount}
        </p>
        <p>
          <strong>Status:</strong> {p.status}
        </p>
        <p>
          <strong>Date:</strong> {new Date(p.date).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
