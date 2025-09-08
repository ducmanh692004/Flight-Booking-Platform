import { Switch, Route } from 'react-router-dom';
import ViewFLights from '../components/admin/flightManagement/viewFlights';
import ViewUsers from '../components/admin/userManagement/viewUsers';
import ViewAirline from '../components/admin/airlineManagement/viewAirlines';
import ViewAirports from '../components/admin/airportManagement/viewAirports';
import ViewCoupons from '../components/admin/couponManagement/viewCoupons';
import ViewSeatClasses from '../components/admin/seatClassManagement/viewSeatClass';
import ViewOrder from '../components/admin/orderManagement/viewOrders';
import ViewFlights from '../components/admin/flightManagement/viewFlights';
import ViewRefundRequests from '../components/admin/refundMoneyManagement/viewRefundMoney';
// import PrivateAdminRoute from './private_Route';
import PrivateAdminRoute from './private_Admin_Route';
import ViewListRole from '../components/admin/groupRoleManagement/viewRole';
import ViewSupportRequests from '../components/admin/viewSupportRequest';
import RevenueDashboard from '../components/admin/dashboard';

const User_Routes = () => {
    return (
        <>
            <Switch>
                <PrivateAdminRoute
                    exact
                    path="/admin"
                    component={RevenueDashboard}
                />

                <PrivateAdminRoute
                    path="/admin/flights"
                    component={ViewFLights}
                />

                <PrivateAdminRoute path="/admin/users" component={ViewUsers} />

                <PrivateAdminRoute
                    path="/admin/airlines"
                    component={ViewAirline}
                />

                <PrivateAdminRoute
                    path="/admin/airports"
                    component={ViewAirports}
                />

                <PrivateAdminRoute
                    path="/admin/discount-codes"
                    component={ViewCoupons}
                />

                <PrivateAdminRoute
                    path="/admin/seat-classes"
                    component={ViewSeatClasses}
                />

                <PrivateAdminRoute path="/admin/orders" component={ViewOrder} />

                <PrivateAdminRoute
                    path="/admin/flights"
                    component={ViewFlights}
                />

                <PrivateAdminRoute
                    path="/admin/refund-requests"
                    component={ViewRefundRequests}
                />

                <PrivateAdminRoute
                    path="/admin/groupRoles"
                    component={ViewListRole}
                />
                {/* <Route path="/admin/groupRoles">
                    <ViewListRole />
                </Route> */}

                <PrivateAdminRoute
                    path="/admin/support-requests"
                    component={ViewSupportRequests}
                />
            </Switch>
        </>
    );
};

export default User_Routes;
