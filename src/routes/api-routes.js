const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");

module.exports = app => {
	app.get("/api/notes", (req, res) => {
		const file = fs.readFileSync(path.join(__dirname, "../../db/db.json"));

		res.json(JSON.parse(file));
	});

	app.post("/api/notes", (req, res) => {
		const note = { ...req.body, id: uuidv4() };
		const file = fs.readFileSync(path.join(__dirname, "../../db/db.json"));
		const fileArray = JSON.parse(file);
		const updatedFileArray = [...fileArray, note];

		fs.writeFile(
			path.join(__dirname, "../../db/db.json"),
			JSON.stringify(updatedFileArray),
			error => {
				error ? console.log(error) : res.status(201).json(note);
			}
		);
	});

	app.delete("/api/notes/:id", (req, res) => {
		const id = req.params.id;
		const file = fs.readFileSync(path.join(__dirname, "../../db/db.json"));
		const fileArray = JSON.parse(file);

		const noteToDelete = _.find(fileArray, note => note.id === id);
		const updatedFileArray = fileArray.filter(
			note => !_.isEqual(note, noteToDelete)
		);

		fs.writeFile(
			path.join(__dirname, "../../db/db.json"),
			JSON.stringify(updatedFileArray),
			error => {
				error ? console.log(error) : res.status(200).json(noteToDelete);
			}
		);
	});
};
