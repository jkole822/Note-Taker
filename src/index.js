const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

require("./routes/html-routes")(app);
// require("./routes/api-routes")(app);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
