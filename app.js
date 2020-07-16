require("dotenv").config();

const express = require("express");
const app = express();

const User = require("./models/user.model");
const adsRouter = require("./routes/ads");
const userRouter = require("./routes/user");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(express.json());

async function authorizationMiddleware(req, res, next){
  const authorization = (req.headers.authorization || "").split(" ")[1];
  if (authorization) {
    const [username, password] = authorization.split(":");
    req.user = await User.findOne({ username, password });
    next();
  } else {
    res.status(400).send('AUTHORIZATION ERROR');
  }
}

app.put('*', authorizationMiddleware);
app.post('*', authorizationMiddleware);
app.delete('*', authorizationMiddleware);

app.use("/ads", adsRouter);
app.use("/users", userRouter);

app.listen(4000, () => console.log("server started!"));
