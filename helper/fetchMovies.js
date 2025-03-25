const axios = require('axios');
const mongoose = require('mongoose');
const MovieModel = require('../models/Movie');
const dotenv = require('dotenv');


dotenv.config({ path: "C:\\Users\\Admin\\OneDrive\\Desktop\\web development\\Assignment\\Binnys_Backend\\.env.local" })
const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/top_rated';

const fetchMovies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        let page = 1;
        let totalPages = 13;

        while (page <= totalPages) {
            const response = await axios.get(TMDB_API_URL, {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: 'en-US',
                    page
                }
            });

            const movies = response.data.results;

            movies.map(async (movie) => {
                const existingMovie = await MovieModel.findOne({ title: movie.title });
                if (!existingMovie) {
                    await MovieModel.create({
                        title: movie.title,
                        overview: movie.overview,
                        releaseDate: movie.release_date,
                        rating: movie.vote_average,
                        popularity: movie.popularity,
                        posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    });
                }
            });
            page++;
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

fetchMovies();
