const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: String,
    overview: String,
    releaseDate: Date,
    rating: Number,
    popularity: Number,
    posterPath: String
});

const MovieModel = mongoose.model('Movie', movieSchema);
module.exports = MovieModel;