import express from "express";

const app = express();
app.use(express.json());

const payments = [
  {
    id: 1,
    amount: "100.50",
    currency: "usd",
    status: "paid",
    customer_id: 1,
    created_at: "2023-09-01T12:00:00",
  },
  {
    id: 2,
    amount: 75,
    currency: "USD",
    status: "failed",
    customer_id: 2,
    created_at: "2023-09-02T10:00:00",
  },
];

const customers = [
  {
    id: 1,
    first_name: "Jane",
    last_name: "Doe",
    email: "jane@example.com",
    meta: { legacyId: "L-111" },
    created_at: "2020-01-01T00:00:00",
  },
  {
    id: 2,
    first_name: "John",
    last_name: "Smith",
    email: "john@example.com",
    created_at: "2020-05-05T00:00:00",
  },
];

app.get("/legacy/payments", (req, res) => res.json(payments));
app.get("/legacy/payments/:id", (req, res) => {
  const p = payments.find((x) => String(x.id) === req.params.id);
  if (!p) return res.status(404).json({ error: "not found" });
  return res.json(p);
});
app.get("/legacy/customers", (req, res) => res.json(customers));

const port = 4000;
app.listen(port, () => console.log(`legacy-mock running on ${port}`));
