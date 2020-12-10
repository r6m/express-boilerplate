import { Router } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { v4 as uuidv4 } from 'uuid'

const router = new Router()

router.use(cookieParser())
router.use(session({
  secret: process.env.SECRET || 'defaultsecret',
  genid: (req) => uuidv4(),
  proxy: true,
  resave: true,
  saveUninitialized: true
}))

router.use(morgan('combined'))
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// load routes here
// router.use(usersRouter)

router.use((err, req, res, next) => {
  console.log("ERROR", err)
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ code: err.code || 400, message: "bad request" });
  }

  if (err.name === "ValidationError") {
    const errors = Object.keys(err.errors).map(field => {
      return { field, message: err.errors[field].message }
    })

    return res.status(400).send({ code: err.code || 400, message: "bad request", errors });
  }

  if (err.name === "MongoError") {
    if (err.message.includes("duplicate key error")) {
      return res.status(400).send({ code: err.code || 400, message: "resource already exists" });
    }
  }

  return res.status(500).json({ code: err.code || 500, error: err.message });
});

export default router;