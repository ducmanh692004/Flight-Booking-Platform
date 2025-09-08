import axios from '../config/axios';

// user management
const adminGetAllUser = () => {
    return axios.get('/api/v1/admin/get-users-information');
};

const adminUpdateUserInformation = (formData) => {
    return axios.put('/api/v1/admin/update-user-information', {
        formData,
    });
};

const adminDeleteUser = (userId) => {
    return axios.delete(`/api/v1/admin/delete-user?userId=${userId}`);
};

const adminGetAllGroup = (userId) => {
    return axios.get('/api/v1/admin/get-all-group');
};

const adminAddNewUser = (formData) => {
    return axios.post('/api/v1/admin/create-new-user', {
        formData,
    });
};

// airline management
const adminGetAllAirline = (currentLimit, currentPage) => {
    return axios.get(
        `/api/v1/admin/get-all-airline?currentLimit=${currentLimit}&currentPage=${currentPage}`
    );
};
const adminAddAirline = (formData) => {
    return axios.post('/api/v1/admin/create-new-airline', formData);
};
const adminUpdateAirline = (formData) => {
    return axios.put('/api/v1/admin/update-airline', formData);
};
const adminDeleteAirline = (airlineId) => {
    return axios.delete(`/api/v1/admin/delete-airline?airlineId=${airlineId}`);
};

// airport management
const adminGetAllAirport = (currentLimit, currentPage) => {
    return axios.get(
        `/api/v1/admin/get-all-airport?currentLimit=${currentLimit}&currentPage=${currentPage}`
    );
};

const adminAddAirport = (formData) => {
    return axios.post('/api/v1/admin/create-new-airport', formData);
};

const adminUpdateAirport = (formData) => {
    return axios.put('/api/v1/admin/update-airport', formData);
};

const adminDeleteAirport = (airportId) => {
    return axios.delete(`/api/v1/admin/delete-airport?airportId=${airportId}`);
};

// coupon management
const adminGetAllCoupons = (currentLimit, currentPage) => {
    return axios.get(
        `/api/v1/admin/get-all-coupon?currentLimit=${currentLimit}&currentPage=${currentPage}`
    );
};

const adminAddCoupon = (formData) => {
    return axios.post('/api/v1/admin/create-new-coupon', { formData });
};

const adminUpdateCoupon = (formData) => {
    return axios.put('/api/v1/admin/update-coupon', { formData });
};

const adminDeleteCoupon = (couponId) => {
    return axios.delete(`/api/v1/admin/delete-coupon?couponId=${couponId}`);
};

// seatClass management
const adminGetAllSeatClass = () => {
    return axios.get('/api/v1/admin/get-all-seat-class');
};

const adminAddSeatClass = (formData) => {
    return axios.post('/api/v1/admin/create-new-seat-class', formData);
};

const adminUpdateSeatClass = (formData) => {
    return axios.put('/api/v1/admin/update-seat-class', formData);
};

const adminDeleteSeatClass = (seatClassId) => {
    return axios.delete(
        `/api/v1/admin/delete-seat-class?seatClassId=${seatClassId}`
    );
};

// order management
const adminGetOrder = (currentLimit, currentPage, status) => {
    return axios.get(
        `/api/v1/admin/get-all-order?currentLimit=${currentLimit}&currentPage=${currentPage}&status=${status}`
    );
};

const adminDeleteOrder = (orderId) => {
    return axios.delete(`/api/v1/admin/delete-order?orderId=${orderId}`);
};

// flight management
const adminGetAllFlight = (currentLimit, currentPage) => {
    return axios.get(
        `/api/v1/admin/get-all-flight?currentLimit=${currentLimit}&currentPage=${currentPage}`
    );
};

const adminGetFlightDataToUpdate = async (flightId) => {
    return axios.get(
        `/api/v1/admin/get-flight-data-to-update?flightId=${flightId}`
    );
};

const adminGetDetailFlight = (flightId) => {
    return axios.get(`/api/v1/admin/get-detail-flight?flightId=${flightId}`);
};

const adminAddFlight = (formData) => {
    return axios.post('/api/v1/admin/create-new-flight', { formData });
};

const adminUpdateFlight = (formData) => {
    return axios.put('/api/v1/admin/update-flight', { formData });
};

const adminDeleteFlight = (flightId) => {
    return axios.delete(`/api/v1/admin/delete-flight?flightId=${flightId}`);
};

const adminSearchDestinationSuggestion = (keyword) => {
    return axios.get(
        `/api/v1/admin/search-destination-suggestion?keyword=${keyword}`
    );
};

const adminSearcgAirlineSuggestion = (keyword) => {
    return axios.get(
        `/api/v1/admin/search-airline-suggestion?keyword=${keyword}`
    );
};

const adminFetchAllSeatClass = () => {
    return axios.get('/api/v1/admin/get-all-seatClass');
};

const adminGetAllUtils = () => {
    return axios.get('/api/v1/admin/get-all-utils');
};

// refund request management
const adminGetRefundRequests = (currentLimit, currentPage) => {
    return axios.get(
        `/api/v1/admin/get-refund-requests?currentLimit=${currentLimit}&currentPage=${currentPage}`
    );
};

const adminIgnoreRefund = (refundId) => {
    return axios.put('/api/v1/admin/ignore-refund', { refundId });
};

const adminProcessRefund = (refundId) => {
    return axios.put(`/api/v1/admin/process-refund?refundId=${refundId}`);
};

// groupRole management
const adminGetAllRole = async () => {
    return axios.get('/api/v1/admin/get-all-role');
};

const adminGetAllRoleOfGroup = async (groupId) => {
    return axios.get(`/api/v1/admin/get-all-role-of-group?groupId=${groupId}`);
};

const adminCreateRole = (formData) => {
    return axios.post('/api/v1/admin/create-new-role', { formData });
};
// const adminGetAllGroup = async () => {
//     return axios.get('/api/v1/admin/get-all-group');
// };

const adminUpdateRoleOfGroup = (groupId, listRoles) => {
    return axios.put('/api/v1/admin/update-role-of-group', {
        groupId,
        listRoles,
    });
};

const adminUpdateRole = (formData) => {
    return axios.put('/api/v1/admin/update-role', { formData });
};

const adminDeleteRole = (roleId) => {
    return axios.delete(`/api/v1/admin/delete-role?roleId=${roleId}`);
};

const adminCreateGroup = (formData) => {
    return axios.post('/api/v1/admin/create-new-group', { formData });
};

// support management
const adminGetSupport = (currentLimit, currentPage) => {
    return axios.get(
        `/api/v1/admin/get-all-support?currentLimit=${currentLimit}&currentPage=${currentPage}`
    );
};

const adminDeleteSupport = (supportId) => {
    return axios.delete(`/api/v1/admin/delete-support?supportId=${supportId}`);
};

// dashbroad management
const adminGetInformationOfRevenue = () => {
    return axios.get('/api/v1/admin/get-information-of-revenue');
};

export {
    adminGetAllUser,
    adminUpdateUserInformation,
    adminDeleteUser,
    adminGetAllGroup,
    adminAddNewUser,
    adminGetAllAirline,
    adminAddAirline,
    adminUpdateAirline,
    adminDeleteAirline,
    adminGetAllAirport,
    adminAddAirport,
    adminUpdateAirport,
    adminDeleteAirport,
    adminGetAllCoupons,
    adminAddCoupon,
    adminUpdateCoupon,
    adminDeleteCoupon,
    adminGetAllSeatClass,
    adminAddSeatClass,
    adminUpdateSeatClass,
    adminDeleteSeatClass,
    adminGetOrder,
    adminDeleteOrder,
    adminGetAllFlight,
    adminGetDetailFlight,
    adminAddFlight,
    adminUpdateFlight,
    adminDeleteFlight,
    adminGetFlightDataToUpdate,
    adminSearchDestinationSuggestion,
    adminSearcgAirlineSuggestion,
    adminFetchAllSeatClass,
    adminGetAllUtils,
    adminGetRefundRequests,
    adminProcessRefund,
    adminIgnoreRefund,
    adminGetAllRole,
    adminGetAllRoleOfGroup,
    adminCreateRole,
    adminCreateGroup,
    adminUpdateRoleOfGroup,
    adminUpdateRole,
    adminDeleteRole,
    adminGetSupport,
    adminDeleteSupport,
    adminGetInformationOfRevenue,
};
