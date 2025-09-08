import { Switch, Route } from 'react-router-dom';
import HomePage from '../components/client/Home/HomePage';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import PageNotFound from '../components/auth/PageNotFound';
import SocialRegister from '../components/auth/SocialRegister';
import FlightList from '../components/client/FlightList/FlightList';
import Otp from '../components/auth/Otp';
import ConfirmUserInformation from '../components/client/Payment/ConfirmOrderInformation/ConfirmUserInformation';
import PrivateRoute from './private_Route';
import Payment from '../components/client/Payment/PaymentOrder/Payment';
import Account from '../components/client/Account/Account';
import PersonalInfo from '../components/client/Account/PersonalInfo';
import OrderHistory from '../components/client/Account/OrderHistory';
import ChangePassword from '../components/client/Account/ChangePassword';
import OrderRefund from '../components/client/Account/OrderRefund';
import SearchOrder from '../components/client/Account/SearchOrder';
import PaymentSuccess from '../components/client/Payment/PaymentOrder/PaymentSuccess';
import ForgotPasswordForm from '../components/auth/OTP/ForgetPassWord';
import OtpForgetPassword from '../components/auth/OTP/OTPForgetPassword';
import ResetPassword from '../components/auth/OTP/ConfirmNewPassword';
import OtpRegisterAccount from '../components/auth/OTP/OTPRegisterAccount';
import SupportForm from '../components/client/Home/SendSupport';
import PrivateNonAuthenUserRoute from './private_UnauthenUser_Route';
import JetNowIntro from '../components/client/Header/Introduction';
const User_Routes = () => {
    return (
        <>
            <Switch>
                {/* <Route path="/listProduct"><ListProduct /></Route> */}
                {/* <Route path="/detailProduct/:id"><DetailProduct /></Route>
                <PrivateRoute path="/detailProduct/:id" component={DetailProduct} />
                <PrivateRoute path="/payment" component={Payment} />

                <PrivateRoute path="/account" component={Account} />
                <PrivateRoute path="/account/user-information" component={UserInformation} />
                <PrivateRoute path="/account/listOrder" component={ListOrder} />
                <PrivateRoute path="/account/changePassword" component={ChangePassword} /> */}
                {/* <Route path="/payment"><Payment /></Route> */}

                {/* <Route exact path="/">
                    <HomePage />
                </Route> */}
                <PrivateNonAuthenUserRoute
                    exact
                    path="/"
                    component={HomePage}
                />

                <PrivateNonAuthenUserRoute
                    path="/intro-flight"
                    component={JetNowIntro}
                />

                <Route path="/register">
                    <Register />
                </Route>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/otp-register-account">
                    <OtpRegisterAccount />
                </Route>

                <Route path="/forgot-password">
                    <ForgotPasswordForm />
                </Route>

                <Route path="/otp-forget-password">
                    <OtpForgetPassword />
                </Route>

                <Route path="/confirm-new-password">
                    <ResetPassword />
                </Route>

                <Route path="/social-register">
                    <SocialRegister />
                </Route>

                <Route path="/register-otp">
                    <Otp />
                </Route>

                {/* <Route path="/support">
                    <SupportForm />
                </Route> */}
                <PrivateNonAuthenUserRoute
                    path="/support"
                    component={SupportForm}
                />
                {/* 
                <Route path="/flightList">
                    <FlightList />
                </Route> */}

                <PrivateNonAuthenUserRoute
                    path="/flightList"
                    component={FlightList}
                />

                <PrivateRoute
                    path="/confirm-user-information"
                    component={ConfirmUserInformation}
                />

                <PrivateRoute path="/payment" component={Payment} />

                <PrivateRoute
                    path="/payment-success"
                    component={PaymentSuccess}
                />

                <PrivateRoute path="/account" component={Account} />

                <PrivateRoute
                    path="/account/user-information"
                    component={PersonalInfo}
                />

                <PrivateRoute
                    path="/account/orderHistory"
                    component={OrderHistory}
                />

                <PrivateRoute
                    path="/account/changePassword"
                    component={ChangePassword}
                />

                <PrivateRoute
                    path="/account/orderRefund"
                    component={OrderRefund}
                />

                <PrivateRoute
                    path="/account/searchOrder"
                    component={SearchOrder}
                />

                {/* <Route path="/collections"></Route> */}

                <Route>
                    <PageNotFound />
                </Route>
            </Switch>
        </>
    );
};

export default User_Routes;
