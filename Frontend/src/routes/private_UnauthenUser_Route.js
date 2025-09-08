import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
// import { useSelector } from 'react-redux';

const PrivateNonAuthenUserRoute = (props) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const group = useSelector((state) => state.user.account.group);

    if (isAuthenticated === true && group === 'admin') {
        return <Redirect to="/admin" />;
    } else {
        return <Route path={props.path} component={props.component} />;
    }
};

export default PrivateNonAuthenUserRoute;
