import dotenv from "dotenv";
import swaggerAutogen from "swagger-autogen";

dotenv.config();

const doc = {
  info: {
    swagger: "2.0",
    openapi: "3.1.0",
    title: "Inventary API",
    description: "Description of the inventary API",
  },
  host: "localhost:" + process.env.API_PORT?.trim(),
  servers: [
    {
      url: "http://localhost:" + process.env.API_PORT?.trim(),
      description: "Local server",
    },
    {
      url: "https://localhost:" + process.env.API_PORT?.trim(),
      description: "Local server with HTTPS",
    },
  ],
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    { name: "Batch", description: "Batch endpoints" },
    { name: "Category", description: "Category endpoints" },
    { name: "Deposit", description: "Deposit endpoints" },
    { name: "Group", description: "Group endpoints" },
    { name: "Movement", description: "Movement endpoints" },
    { name: "MovementItem", description: "MovementItem endpoints" },
    { name: "Product", description: "Product endpoints" },
    { name: "Stock", description: "Stock endpoints" },
    { name: "User", description: "User endpoints" },
  ],
  definitions: {
    Batch: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
        quantity: { type: "number", example: 100 },
        expirationDate: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00Z",
        },
      },
      required: ["productId", "quantity", "expirationDate"],
    },
    Category: {
      type: "object",
      properties: {
        description: { type: "string", example: "Laticínios" },
        status: { type: "boolean", example: true },
      },
      required: ["description", "status"],
    },
    Deposit: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
        quantity: { type: "number", example: 100 },
      },
      required: ["productId", "quantity"],
    },
    Group: {
      type: "object",
      properties: {
        description: { type: "string", example: "Compra de Natal" },
      },
      required: ["description"],
    },
    Movement: {
      type: "object",
      properties: {
        movementType: { type: "string", example: "E" },
        movementDate: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00Z",
        },
        movementId: {
          type: "string",
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      },
      required: ["movementType", "movementDate", "movementId"],
    },
    MovementItem: {
      type: "object",
      properties: {
        details: { type: "string", example: "Comprar sabor x" },
        price: { type: "number", example: 100 },
        quantity: { type: "number", example: 100 },
        movementId: {
          type: "string",
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      },
      required: ["details", "price", "quantity", "movementId"],
    },
    Product: {
      type: "object",
      properties: {
        name: { type: "string", example: "Product Name" },
        description: { type: "string", example: "Product Description" },
        status: { type: "boolean", example: true },
      },
      required: ["name", "description", "status"],
    },
    Stock: {
      type: "object",
      properties: {
        productId: {
          type: "string",
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
        quantity: { type: "number", example: 100 },
      },
      required: ["productId", "quantity"],
    },
    User: {
      type: "object",
      properties: {
        firstName: { type: "string", example: "John" },
        lastName: { type: "string", example: "Doe" },
        email: { type: "string", example: "john.doe@example.com" },
        password: { type: "string", example: "password123" },
      },
      required: ["firstName", "lastName", "email", "password"],
    },
  },
  components: {
    schemas: {
      Batch: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          },
          quantity: { type: "number", example: 100 },
          expirationDate: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00Z",
          },
        },
        required: ["productId", "quantity", "expirationDate"],
      },
      Category: {
        type: "object",
        properties: {
          description: { type: "string", example: "Laticínios" },
          status: { type: "boolean", example: true },
        },
        required: ["description", "status"],
      },
      Deposit: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          },
          quantity: { type: "number", example: 100 },
        },
        required: ["productId", "quantity"],
      },
      Group: {
        type: "object",
        properties: {
          description: { type: "string", example: "Compra de Natal" },
        },
        required: ["description"],
      },
      Movement: {
        type: "object",
        properties: {
          movementType: { type: "string", example: "E" },
          movementDate: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00Z",
          },
          movementId: {
            type: "string",
            example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          },
        },
        required: ["movementType", "movementDate", "movementId"],
      },
      MovementItem: {
        type: "object",
        properties: {
          details: { type: "string", example: "Comprar sabor x" },
          price: { type: "number", example: 100 },
          quantity: { type: "number", example: 100 },
          movementId: {
            type: "string",
            example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          },
        },
        required: ["details", "price", "quantity", "movementId"],
      },
      Product: {
        type: "object",
        properties: {
          name: { type: "string", example: "Product Name" },
          description: { type: "string", example: "Product Description" },
          status: { type: "boolean", example: true },
        },
        required: ["name", "description", "status"],
      },
      Stock: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          },
          quantity: { type: "number", example: 100 },
        },
        required: ["productId", "quantity"],
      },
      User: {
        type: "object",
        properties: {
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Doe" },
          email: { type: "string", example: "john.doe@example.com" },
          password: { type: "string", example: "password123" },
        },
        required: ["firstName", "lastName", "email", "password"],
      },
    },
  },
};

const outputFile = "./swagger.json";
const routes = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.1.0" })(outputFile, routes, doc).then(() => {
  console.log("Swagger file generated");
});
