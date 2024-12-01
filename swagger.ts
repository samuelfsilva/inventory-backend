import swaggerAutogen from 'swagger-autogen';
import dotenv from "dotenv";

dotenv.config();

const doc = {
  info: {
    swagger: '2.0',
    openapi: '3.1.0',
    title: 'Inventary API',
    description: 'Description of the inventary API'
  },
  host: 'localhost:' + process.env.PORT?.trim(),
  servers: [
    {
      url: 'http://localhost:' + process.env.PORT?.trim(),
      description: 'Local server'
    },
    {
      url: 'https://localhost:' + process.env.PORT?.trim(),
      description: 'Local server with HTTPS'
    }
  ],
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Batch', description: 'Batch endpoints' },
    { name: 'Categories', description: 'Categories endpoints' },
    { name: 'Deposit', description: 'Deposit endpoints' },
    { name: 'Group', description: 'Group endpoints' },
    { name: 'Movement', description: 'Movement endpoints' },
    { name: 'MovementItem', description: 'MovementItem endpoints' },
    { name: 'Product', description: 'Product endpoints' },
    { name: 'Stock', description: 'Stock endpoints' },
    { name: 'User', description: 'User endpoints' }
  ],
  definitions: {
    Batch: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'any' },
        quantity: { type: 'number', example: 100 },
        expirationDate: { type: 'string', example: 'any' }
      },
      required: ['productId', 'quantity', 'expirationDate']
    },
    Categories: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'any' }
      },
      required: ['name']
    },
    Deposit: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'any' },
        quantity: { type: 'number', example: 100 }
      },
      required: ['productId', 'quantity']
    },
    Group: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'any' }
      },
      required: ['name']
    },
    Movement: {
      type: 'object',
      properties: {
        movementType: { type: 'string', example: 'any' },
        movementDate: { type: 'string', example: 'any' },
        movementId: { type: 'string', example: 'any' }
      },
      required: ['movementType', 'movementDate', 'movementId']
    },
    MovementItem: {
      type: 'object',
      properties: {
        details: { type: 'string', example: 'any' },
        price: { type: 'number', example: 100 },
        quantity: { type: 'number', example: 100 },
        movementId: { type: 'string', example: 'any' }
      },
      required: ['details', 'price', 'quantity', 'movementId']
    },
    Product: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Product Name' },
        description: { type: 'string', example: 'Product Description' },
        isActive: { type: 'boolean', example: true }
      },
      required: ['name', 'description', 'isActive']
    },
    Stock: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: 'any' },
        quantity: { type: 'number', example: 100 }
      },
      required: ['productId', 'quantity']
    },
    User: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        password: { type: 'string', example: 'password123' }
      },
      required: ['firstName', 'lastName', 'email', 'password']
    }
  }
};

const outputFile = './swagger.json';
const routes = ['./src/index.ts'];

swaggerAutogen({ openapi: '3.1.0' })(outputFile, routes, doc).then(() => {
  console.log('Swagger file generated');
});
