import swaggerJsDoc from "swagger-jsdoc";
import { swaggerSchemas } from "./swaggerSchemas.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FlowServe Backend API",
      version: "1.0.0",
      description: "API documentation for FlowServe",
    },
     components: {
      schemas: swaggerSchemas,
      securitySchemes: swaggerSchemas.securitySchemes,  
    },
     security: [ 
    {
      BearerAuth: [],
    },
  ],
  },
  apis: ["./src/controllers/**/*.ts"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;


