const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("../routes/index");

// To use with Postman
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//

app.use(morgan("dev"));
app.use(router);
app.set("port", 3000);

//app.use(express.json);

app.listen(app.get("port"), () => {
  console.log(`Server listen on port ${app.get("port")}`);
});
