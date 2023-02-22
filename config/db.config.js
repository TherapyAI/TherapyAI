const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.info(`Connected to the Database ${MONGODB_URI}`);
  })
  .catch((error) => {
    console.error(
      `An error ocurrred trying to connect to the Database ${MONGODB_URI}`,
      error
    );
  });
