import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger.json";
import { AppDataSource } from "./database/data-source";
import routeBatch from "./routes/batch";
import routeCategory from "./routes/category";
import routeDeposit from "./routes/deposit";
import routeGroup from "./routes/group";
import routeMovement from "./routes/movement";
import routeMovementItem from "./routes/movement_item";
import routeProduct from "./routes/product";
import routeStock from "./routes/stock";
import routeUser from "./routes/user";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const allowedOrigins =
  process.env.FRONTEND_URLS?.split(",").map((origin) => origin) || [];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  //  #swagger.ignore = true
  res.send("Express + TypeScript Server");
});

app.use("/user", routeUser);
app.use("/batch", routeBatch);
app.use("/deposit", routeDeposit);
app.use("/movement", routeMovement);
app.use("/movement_item", routeMovementItem);
app.use("/product", routeProduct);
app.use("/group", routeGroup);
app.use("/stock", routeStock);
app.use("/category", routeCategory);

AppDataSource.initialize()
  .then(() => {
    app.use(bodyParser.json());
    app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error));
