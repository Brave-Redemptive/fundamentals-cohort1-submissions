import dotenv from "dotenv";

dotenv.config();
import app from "./app";
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app listening to port http://localhost:${port}`);
});
