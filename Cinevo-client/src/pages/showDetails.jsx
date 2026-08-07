import { useEffect , useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import {ShowCard} from '../components/showCard'
import { getTopratedShows, getPopularShows , getCurrentShows , searchShowById } from "../services/apiClient"
import { PosterSlider } from '../components/posterSlider';

const ShowDetails = () => {
    const [toprated, setToprated] = useState([]);
    const [popular, setPopular] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchedmovie, setSearchedMovie] = useState({});
    const { id } = useParams();

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

      const handleSuggestion = async (id) => {
        navigate(`/shows/${id}`);
    }

    useEffect(() => {

        if (!id) return;

        async function getMovie() {
            const show = await searchShowById(id);

            if (show) {
                setSearchedMovie(show.data);
            }
        }

        getMovie();

    }, [id]);

    


    if (loading) {
        return <div className="loading-state">Loading shows.....</div>
    }

    return (
        <div className="details-page">
             {searchedmovie.id && (
                <ShowCard show={searchedmovie} />
            )}

            <PosterSlider title="Top rated content" movies={toprated} handleSuggestion={handleSuggestion}/>
            <PosterSlider title="Popular content" movies={popular} />
            <PosterSlider title="Explore" movies={upcoming} />
        </div>
    )
}

export default ShowDetails;