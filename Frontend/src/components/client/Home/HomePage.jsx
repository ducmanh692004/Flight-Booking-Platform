import { use, useEffect, useState } from 'react';
// import './HomePage.scss';
import ListCoupon from './ListCoupon';
import IntroBrand from './IntroBrand';
import PopularDestination from './PopularDestination';
import NearByDestination from './NearByDestinations';
import { getAccount } from '../../../services/AuthenticationService';
import Search from '../Header/Search';
import { handleFetchFlightHomePage } from '../../../services/UserFlightList';

const HomePage = () => {
    const [arr1, setArr1] = useState([]);
    const [arr2, setArr2] = useState([]);

    const handleCheckAuthen = async () => {
        await getAccount();
    };

    const handleFetchData = async () => {
        try {
            const response = await handleFetchFlightHomePage();
            if (response && response.EC === 0) {
                setArr1(response.DT.arr1);
                setArr2(response.DT.arr2);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleCheckAuthen();
        handleFetchData();
    }, []);

    return (
        <div className="d-flex flex-column gap-5">
            <div className="container mt-4">
                <Search />
            </div>
            <div className="homepage-body container mb-5">
                {' '}
                <NearByDestination arr={arr1} />
                <PopularDestination arr={arr2} />
                <ListCoupon />
                <IntroBrand />
            </div>
        </div>
    );
};

export default HomePage;
