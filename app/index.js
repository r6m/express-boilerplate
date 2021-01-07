import './config'
import express from "express";
import { graphql } from './graphql';
import cors from 'cors'
import router from './router'

const PORT = process.env.PORT || 4000

require("./db/mongoose")

const app = express();

app.use(cors())
app.use('/graphql', graphql)
app.use('/', router)

app.listen(PORT, () => console.log(`starting server on http://localhost:${PORT}`))
