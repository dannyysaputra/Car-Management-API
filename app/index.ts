import dotenv from 'dotenv';

// Load environment variables based on the current environment
const envPath = process.env.NODE_ENV === 'development' ? 
  '.env' : `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });

import express, { Express, Request, Response } from "express";
import cors from "cors";
import { router } from "../router";
import { Model } from 'objection';
import Knex from 'knex';
import configs from '../knexfile';

const app: Express = express();

const environment = process.env.NODE_ENV || 'development';
const knexConfig = configs[environment];

const knexInstance = Knex(knexConfig);

Model.knex(knexInstance);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/api/v1', router);

// routing
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

export default app;