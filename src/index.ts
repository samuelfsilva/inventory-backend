import "reflect-metadata";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./database/data-source";
import routeUser from "./routes/user";
import routeProduct from "./routes/product";
import routeGroup from "./routes/group";
import routeCategory from "./routes/categories";
import routeBatch from "./routes/batch";
import routeDeposit from "./routes/deposit";
import routeMovement from "./routes/movement";
import routeMovementItem from "./routes/movement_item";
import routeStock from "./routes/stock";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
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
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log(error))
