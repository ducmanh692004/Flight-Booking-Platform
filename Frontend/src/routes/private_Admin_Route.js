import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
// import { useSelector } from 'react-redux';

const PrivateAdminRoute = (props) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const group = useSelector((state) => state.user.account.group);

    if (isAuthenticated === true && group === 'admin') {
        return <Route path={props.path} component={props.component} />;
    } else if (isAuthenticated === true && group === 'client') {
        return <Redirect to="/" />;
    } else {
        return <Redirect to="/login" />;
    }
};

export default PrivateAdminRoute;
