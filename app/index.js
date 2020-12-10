import express from "express";
import { graphql } from './graphql';

require("./db/mongoose")

const app = express();

app.use('/graphql', graphql)

app.listen(4000, () => console.log('starting server on http://localhost:4000/graphql'))