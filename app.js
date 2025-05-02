import express from "express";
import bodyParser from "body-parser";
import { main } from "./routes/mainRoutes.js";
import { secret } from "./routes/secretRoutes.js";
import session from "express-session";

const app = express();
const port = process.env.PORT || 3000;

app.use(session({
  secret: 'folaSecretKeyzaaa1090', 
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
  });  

app.use(express.static('public'));
app.set('view engine', 'ejs');
main(app);
//secret(app);

app.listen(port, ()=> {
    console.log('Hello World from port 3000')
});