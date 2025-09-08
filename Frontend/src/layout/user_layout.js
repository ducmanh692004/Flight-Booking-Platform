import Header from '../components/client/Header/Header';
import Footer from '../components/client/Footer/Footer';
import User_Routes from '../routes/user_Route';

const User_Layout = () => {
    return (
        <div>
            <Header />

            <main>
                <User_Routes />
            </main>

            <Footer />
        </div>
    );
};

export default User_Layout;
