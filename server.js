const app = require("./app");
const Port = "3000";
app.listen(Port, () => {
  console.log(`Server is running. Use our API on port: ${Port}`);
});
