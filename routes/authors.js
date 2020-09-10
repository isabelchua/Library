const express = require("express");

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
	} catch {
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
		res.redirect(`authors/${newAuthor.id}`);

		//res.redirect(`authors/`);
	} catch (err) {
		res.render("authors/new", {
			author: author,
			errorMessage: "Error creating Author"
		});
	}
	// //res.send(req.body.name);
});

router.get("/:id", (req, res) => {
	res.send("Show Author" + req.params.id);
});

router.get("/:id/edit", async (req, res) => {
	try {
		const author = await Author.findById(req.params.id);
		res.render("authors/edit", { author: author });
	} catch {
		res.redirect("/authors");
	}

	res.send("Edit Author " + req.params.id);
});

router.put("/:id", async (req, res) => {
	let author;
	try {
		author = await Author.findById(req.params.id);
		author.name = req.body.name;
		await author.save();
		res.redirect(`/authors/${author.id}`);
	} catch {
		if (author == null) {
			res.redirect("/");
		} else {
			res.render("authors/edit", {
				author: author,
				errorMessage: "Error updating Author"
			});
		}
	}
});

router.delete("/:id", async (req, res) => {
	//res.send("Delete Author " + req.params.id);
	let author;
	try {
		author = await Author.findById(req.params.id);
		await author.remove();
		res.redirect(`/authors`);
	} catch {
		if (author == null) {
			res.redirect("/");
		} else {
			res.redirect(`/authors/${author.id}`);
		}
	}
});

module.exports = router;
