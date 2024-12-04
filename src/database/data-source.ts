import "reflect-metadata"
import { DataSource } from 'typeorm';

import { Categories } from "../entities/categories";
import { Batch } from "../entities/batch";
import { Group } from "../entities/group";
import { Product } from "../entities/product";
import { MovementItem } from "../entities/movement_item";
import { Movement } from "../entities/movement";
import { Deposit } from "../entities/deposit";
import { Stock } from "../entities/stock";
import { User } from "../entities/user";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.NODE_ENV?.trim().toUpperCase() === 'TEST' ? 
        "database-test.sqlite" : "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [Batch, Categories, Group, Product, MovementItem, Movement, Deposit, Stock, User],
    subscribers: [],
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: "migration_table_name"
});
