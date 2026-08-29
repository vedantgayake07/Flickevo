import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { MovieCard } from '../components/MovieCard'
import { getToprated, getPopular, getUpcoming, searchById } from "../services/apiClient"
import { PosterSlider } from '../components/posterSlider';
import './MoviesDetails.css';

const MovieDetails = () => {
    const [toprated, setToprated] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedmovie, setSearchedMovie] = useState({});
    const { id } = useParams();

    const navigate = useNavigate();

    const handleSuggestion = async (id) => {
        navigate(`/movies/${id}`);
    }

    useEffect(() => {

        if (!id) return;

        async function getMovie() {
            const movie = await searchById(id);

            if (movie) {
                setSearchedMovie(movie.data);
            }
        }

        getMovie();

    }, [id]);

    useEffect(() => {
        async function getLists() {
            const [top, pop, up] = await Promise.all([
                getToprated(),
                getPopular(),
                getUpcoming(),
            ]);

            setToprated(top.results);
            setPopular(pop.results);
            setUpcoming(up.results);

            setLoading(false);
        }

        getLists();
    }, []);


    if (loading) {
        return <div className="loading-state">Loading movies…</div>
    }

    return (
        <div className="details-page">
            {searchedmovie.id && (
                <MovieCard movie={searchedmovie} />
            )}
            <PosterSlider title="Popular content" movies={popular} handleSuggestion={handleSuggestion} />
            <PosterSlider title="Top rated content" movies={toprated} handleSuggestion={handleSuggestion} />
            <PosterSlider title="Explore" movies={upcoming} handleSuggestion={handleSuggestion} />
        </div>
    )
}

export default MovieDetails;