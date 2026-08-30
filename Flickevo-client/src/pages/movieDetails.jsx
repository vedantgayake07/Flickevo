import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import { getToprated, getPopular, getUpcoming } from "../services/apiClient"
import { PosterSlider } from '../components/PosterSlider';
import { getMediaType } from '../helpers/mediaType'
import './MoviesDetails.css';

const MovieDetails = () => {
    const [toprated, setToprated] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleSuggestion = (movie) => {
        const type = getMediaType(movie); // returns 'movie' or 'tv'
        navigate(`/content/${movie.id}/${type}`);
    };


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
            <PosterSlider title="Popular content" movies={popular} handleSuggestion={handleSuggestion} />
            <PosterSlider title="Top rated content" movies={toprated} handleSuggestion={handleSuggestion} />
            <PosterSlider title="Explore" movies={upcoming} handleSuggestion={handleSuggestion} />
        </div>
    )
}

export default MovieDetails;