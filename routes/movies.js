const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const UserModel = require("../models/User");
const MovieModel = require("../models/Movie");
const dotenv = require("dotenv");

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
dotenv.config({ path: "C:\\Users\\Admin\\OneDrive\\Desktop\\web development\\Assignment\\Binnys_Backend\\.env.local" })
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get("/", fetchuser, async (req, res) => {
    const { userid } = req;
    const verifyuser = await UserModel.findById(userid);
    if (!verifyuser) {
        return res.status(401).json({ message: "Please login to our platform" })
    }
    const getMovies = await MovieModel.find();
    return res.status(200).json(getMovies);
})

router.get("/sorted", fetchuser, async (req, res) => {
    const { userid } = req;
    const verifyuser = await UserModel.findById(userid);
    if (!verifyuser) {
        return res.status(401).json({ message: "Please login to our platform" })
    }
    const { criteria } = req.query;
    console.log("Criteria", criteria)
    try {
        const getFilteredMovies = await MovieModel.find().sort({ [criteria]: 1 });
        if (getFilteredMovies) {
            return res.status(200).json({ getMovies: getFilteredMovies })
        }
    } catch (error) {

        return res.status(500).json({ message: error.message })
    }
})
router.get("/search", fetchuser, async (req, res) => {
    const { userid } = req;
    const verifyuser = await UserModel.findById(userid);
    if (!verifyuser) {
        return res.status(401).json({ message: "Please login to our platform" })
    }
    const { searchquery } = req.query;
    try {
        const regex = new RegExp(searchquery.replace(/\s+/g, ""), "i");

        const getMovie = await MovieModel.find({
            $or: [
                {
                    $expr: {
                        $regexMatch: {
                            input: { $replaceAll: { input: "$title", find: " ", replacement: "" } },
                            regex
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $replaceAll: { input: "$overview", find: " ", replacement: "" } },
                            regex
                        }
                    }
                }
            ]
        });

        res.status(200).json(getMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", fetchuser, async (req, res) => {
    const { userid, role } = req;
    const verifyuser = await UserModel.findById(userid);
    if (!verifyuser) {
        return res.status(401).json({ message: "Please login to our platform" })
    }
    if (!role === "admin") {
        return res.status(405).json({ message: "Only admin are allowed to add movies" })
    }
    const { title, overview, releaseDate, rating, popularity } = req.body;
    console.log(req.body);
    try {
        const newMovie = new MovieModel({
            title: title,
            overview: overview,
            releaseDate: releaseDate,
            rating: rating,
            popularity: popularity,

        });
        await newMovie.save();
        res.status(201).json({ message: "Movie added successfully", movie: newMovie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// PUT /movies/:id - Edit movie details (admin only)
router.put("/:id", fetchuser, async (req, res) => {
    const { userid, role } = req;
    const verifyuser = await UserModel.findById(userid);
    if (!verifyuser) {
        return res.status(401).json({ message: "Please login to our platform" });
    }
    if (role !== "admin") {
        return res.status(405).json({ message: "Only admins are allowed to edit movies" });
    }

    const { title, overview, releaseDate, rating, popularity } = req.body;

    try {
        const movie = await MovieModel.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        movie.title = title || movie.title;
        movie.overview = overview || movie.overview;
        movie.releaseDate = releaseDate || movie.releaseDate;
        movie.rating = rating || movie.rating;
        movie.popularity = popularity || movie.popularity;

        await movie.save();

        res.status(200).json({ message: "Movie updated successfully", movie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /movies/:id - Delete a movie (admin only)
router.delete("/:id", fetchuser, async (req, res) => {
    const { userid, role } = req;
    const verifyuser = await UserModel.findById(userid);
    if (!verifyuser) {
        return res.status(401).json({ message: "Please login to our platform" });
    }
    if (role !== "admin") {
        return res.status(405).json({ message: "Only admins are allowed to delete movies" });
    }

    try {
        const movie = await MovieModel.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        await movie.remove();

        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;