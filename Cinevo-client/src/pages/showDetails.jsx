import { useEffect , useState } from "react"
import { getTopratedShows, getPopularShows , getCurrentShows } from "../services/apiClient"
import { PosterSlider } from '../components/posterSlider';

const ShowDetails = () => {
    const [toprated, setToprated] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="loading-state">Loading shows.....</div>
    }

    return (
        <div className="details-page">
            <PosterSlider title="Popular content" movies={popular} />
            <PosterSlider title="Top rated content" movies={toprated} />
            <PosterSlider title="Explore" movies={upcoming} />
        </div>
    )
}

export default ShowDetails;