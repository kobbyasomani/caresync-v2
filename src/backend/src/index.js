const mongoose = require("mongoose");
const app = require("./server");
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    mongoose.set("strictQuery", false);
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  console.log("Server Started");
});
