const express = require("express");
const author = require("../models/author");
const router = express.Router();
const Author = require("../models/author");

//All authors Route
router.get("/", async (req, res) => {
	let searchOptions = {};
	if (req.query.name != null && req.query.name !== "") {
		// i for case sensitive
		searchOptions.name = new RegExp(req.query.name, "i");
	}
	//res.render("authors/index");
	try {
		const authors = await Author.find(searchOptions);
		res.render("authors/index", {
			authors: authors,
			searchOptions: req.query
		});
	} catch (err) {
		res.redirect("/");
	}
});

//New Author Route
router.get("/new", (req, res) => {
	res.render("authors/new", { author: new Author() });
});

// Create Author Route
router.post("/", async (req, res) => {
	//res.send("Create");
	const author = new Author({
		name: req.body.name
	});
	try {
		const newAuthor = await author.save();
		//res.redirect(`authors/${newAuthor.id}`)

		res.redirect(`authors/`);
	} catch (err) {
		res.render("authors/new", {
			author: author,
			errorMessage: "Error creating Author"
		});
	}
	// //res.send(req.body.name);
});

module.exports = router;
