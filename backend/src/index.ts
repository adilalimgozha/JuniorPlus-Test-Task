import express, {Request, Response} from 'express'
import userRouter from "./routes/note.routes"
import logger from './middleware/logger'
import errorhandler from './middleware/errorHandler'

import cors from "cors"

import swaggerJSDoc  from "swagger-jsdoc"
import swaggerUi  from "swagger-ui-express"

const app = express()
const PORT = 3000

app.use(cors())

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes Platform API',
      version: '1.0.0',
      description: 'CRUD operations of Notes Platform',
    },
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(express.json())
app.use(logger)

app.use('/api', userRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorhandler)

app.listen(PORT, () => {
    console.log(`Server in running at http://localhost:${PORT}`)
})