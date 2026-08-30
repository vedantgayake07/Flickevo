import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { getTopratedShows, getPopularShows, getCurrentShows } from "../services/apiClient"
import { PosterSlider } from '../components/PosterSlider';
import { getMediaType } from '../helpers/mediaType'

const ShowDetails = () => {
    const [toprated, setToprated] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function getApiResponse() {
            const response = await getTopratedShows();
            const popularresponse = await getPopularShows();
            const upcomingresponse = await getCurrentShows();

            setToprated(response.results);
            setPopular(popularresponse.results);
            setUpcoming(upcomingresponse.results);
            setLoading(false);
        }
        getApiResponse();
    }, []);

    const handleSuggestion = (movie) => {
        const type = getMediaType(movie); // returns 'movie' or 'tv'
        navigate(`/content/${movie.id}/${type}`);
    };


    if (loading) {
        return <div className="loading-state">Loading shows.....</div>
    }

    return (
        <div className="details-page">

            <PosterSlider title="Top rated content" movies={toprated} handleSuggestion={handleSuggestion} />
            <PosterSlider title="Popular content" movies={popular} handleSuggestion={handleSuggestion} />
            <PosterSlider title="Explore" movies={upcoming} handleSuggestion={handleSuggestion} />
        </div>
    )
}

export default ShowDetails;