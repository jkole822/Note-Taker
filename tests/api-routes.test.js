const request = require("supertest");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");

const app = require("../src/index");
const db = require("../db/db.json");

const originalDB = _.clone(db);

test("GET request to `/api/notes' returns db file contents as JSON", async () => {
	const res = await request(app)
		.get("/api/notes")
		.send()
		.expect("Content-Type", /json/)
		.expect(200);

	expect(res.body.length).toBe(db.length);
});

test("POST request to `/api/notes` returns the note submitted by the user as JSON", async () => {
	const note = { title: "Test Title", text: "Test Text" };

	const res = await request(app)
		.post("/api/notes")
		.send(note)
		.expect("Content-Type", /json/)
		.expect(201);

	expect(res.body).toMatchObject(note);

	// Undo test changes to DB
	fs.writeFileSync(
		path.join(__dirname, "../db/db.json"),
		JSON.stringify(originalDB)
	);
});

test("POST request to `/api/notes` applies an unique ID to the note submitted by the user", async () => {
	const originalIDs = _.map(originalDB, ({ id }) => id);
	const note = { title: "Test Title", text: "Test Text" };

	const res = await request(app).post("/api/notes").send(note);

	expect(originalIDs).not.toContain(res.body.id);

	// Undo test changes to DB
	fs.writeFileSync(
		path.join(__dirname, "../db/db.json"),
		JSON.stringify(originalDB)
	);
});

test("DELETE request to `/api/notes/:id` deletes the note with the specified ID", async () => {
	const note = { title: "Test Title", text: "Test Text" };
	const postRes = await request(app).post("/api/notes").send(note);
	const id = postRes.body.id;

	const deleteRes = await request(app)
		.delete(`/api/notes/${id}`)
		.send()
		.expect("Content-Type", /json/)
		.expect(200);

	expect(deleteRes.body).toMatchObject(note);
	expect(db).not.toContainEqual(postRes.body);
});
