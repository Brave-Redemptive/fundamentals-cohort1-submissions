
export const swaggerSchemas = {
   securitySchemes: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Enter your JWT token here",
    },
  },
  Transaction: {
    type: "object",
    required: ["id", "userId", "productId", "amountCents", "status", "createdAt"],
    properties: {
      id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
      userId: { type: "string", format: "uuid", example: "user-uuid-1234" },
      productId: { type: "string", format: "uuid", example: "product-uuid-5678" },
      amountCents: { type: "integer", example: 1500 },
      status: { type: "string", enum: ["PENDING", "SUCCESS", "FAILED"], example: "PENDING" },
      createdAt: { type: "string", format: "date-time", example: "2025-11-04T12:34:56.789Z" },
    },
  },

   User: {
    type: "object",
    properties: {
      id: { type: "string", example: "uuid-1234" },
      name: { type: "string", example: "Desmond" },
      email: { type: "string", example: "desmond@example.com" },
      password: {type: "string", example: "Password123"},
      subscription: { type: "string", example: "premium" },
      age: { type: "integer", example: 28 },
      healthGoal: { type: "string", example: "lose weight" },
      role: { type: "string", example: "CLIENT" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },


  CreateUserInput: {
    type: "object",
    required: ["name","email"],
    properties: {
      name: { type: "string", example: "Desmond" },
      email: { type: "string", example: "desmond@example.com" },
      password: {type: "string", example: "Password123"},
      subscription: { type: "string", example: "premium" },
      age: { type: "integer", example: 28 },
      healthGoal: { type: "string", example: "lose weight" },
      role: { type: "string", example: "CLIENT" },
     
      // Fields for login lockout
     loginAttempts: { type: "integer", example: 0, default: 0 },
     lockUntil: { type: "string", format: "date-time", nullable: true, example: "2025-11-05T03:30:00Z" },
    },
  },
};

