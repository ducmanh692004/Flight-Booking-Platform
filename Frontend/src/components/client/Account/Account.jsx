import { use, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'; // Sử dụng ListGroup cho menu bên trái
import Card from 'react-bootstrap/Card'; // Để tạo khung cho menu và nội dung
import {
    NavLink,
    useRouteMatch,
    Switch,
    useHistory,
    Route,
    Redirect,
} from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { MdOutlineEventNote } from 'react-icons/md';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdOutlineLogin } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RiRefund2Fill } from 'react-icons/ri';
import { FaRegTrashCan } from 'react-icons/fa6';
// Import các components con của bạn
import PersonalInfo from './PersonalInfo';
import OrderHistory from './OrderHistory';
import SearchOrder from './SearchOrder';
import OrderRefund from './OrderRefund';
import ChangePassword from './ChangePassword';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RiErrorWarningLine } from 'react-icons/ri';
import { handleLogoutRemoveRerefreshToken } from '../../../services/AuthenticationService';
import { useTranslation } from 'react-i18next';

const AccountInformation = () => {
    const [showLogout, setShowLogout] = useState(false);
    const userName = useSelector((state) => state.user.account.username);
    const userImage = useSelector((state) => state.user.account.image);
    const userEmail = useSelector((state) => state.user.account.email);
    const { t } = useTranslation();

    const handleLogout = () => {
        setShowLogout(true);
    };
    let currentUrl = window.location.pathname;

    const handleCloseModal = () => {
        setShowLogout(false);
    };

    const handleConfirmLogout = async () => {
        const response = await handleLogoutRemoveRerefreshToken();
        if (response && response.EC === 0) {
            setShowLogout(false);
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <Container fluid className="py-4 min-vh-100">
            <Modal show={showLogout} onHide={() => handleCloseModal()} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>{t('account.logout')}</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center align-items-center mt-3 mb-3 gap-2">
                        <RiErrorWarningLine className="text-danger fs-3" />
                        <h6 className="mt-0 mb-0">
                            {t('account.logoutConfirm')}
                        </h6>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => handleConfirmLogout()}
                    >
                        {t('account.confirm')}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => handleCloseModal()}
                    >
                        {t('account.cancel')}
                    </Button>
                </Modal.Footer>
            </Modal>{' '}
            {/* fluid để chiếm toàn bộ chiều rộng, bg-light cho nền xám nhạt, min-vh-100 để chiếm toàn bộ chiều cao màn hình */}
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={10}>
                    {' '}
                    {/* Điều chỉnh kích thước cột tổng thể cho nội dung */}
                    <Row className="g-4">
                        {' '}
                        {/* g-4 tạo khoảng cách giữa các cột */}
                        {/* Sidebar Menu - Cột bên trái */}
                        <Col xs={12} md={4} lg={3}>
                            {' '}
                            {/* Kích thước cột cho menu */}
                            <Card className="shadow-sm h-100">
                                {' '}
                                {/* h-100 để card chiếm toàn bộ chiều cao có sẵn */}
                                <Card.Body>
                                    <div className="d-flex align-items-center justify-content-center mb-4 mt-2">
                                        <div
                                            className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                            }}
                                        >
                                            U
                                        </div>
                                        <div>
                                            <h4 className="fs-6 fw-semibold text-dark mb-0">
                                                {userName.length > 20
                                                    ? userName.slice(0, 19) +
                                                      '...'
                                                    : userName}
                                            </h4>
                                        </div>
                                    </div>
                                    <hr></hr>

                                    <ListGroup
                                        variant="flush"
                                        className="d-flex flex-column align-items-center"
                                    >
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <NavLink
                                                to="/account/user-information"
                                                className="nav-link d-flex justify-content-center align-items-center gap-3 pt-0 pt-md-2 rounded"
                                                style={{
                                                    backgroundColor:
                                                        currentUrl ===
                                                        '/account/user-information'
                                                            ? 'rgba(236, 236, 236, 1)'
                                                            : '',
                                                }}
                                            >
                                                <MdOutlineAccountCircle className="icon fs-4" />
                                                <h6 className="mb-0 text-muted">
                                                    {t('account.personalInfo')}
                                                </h6>
                                            </NavLink>
                                            <NavLink
                                                to="/account/searchOrder"
                                                className="nav-link d-flex justify-content-center align-items-center gap-3 pt-0 pt-md-2 rounded"
                                                style={{
                                                    backgroundColor:
                                                        currentUrl ===
                                                        '/account/searchOrder'
                                                            ? 'rgba(236, 236, 236, 1)'
                                                            : '',
                                                }}
                                            >
                                                <IoSearch className="icon fs-5" />
                                                <h6 className="mb-0 text-muted">
                                                    {t('account.searchOrder')}
                                                </h6>
                                            </NavLink>
                                            <NavLink
                                                to="/account/orderHistory"
                                                className="nav-link d-flex justify-content-center align-items-center gap-3 pt-0 pt-md-2 rounded"
                                                style={{
                                                    backgroundColor:
                                                        currentUrl ===
                                                        '/account/orderHistory'
                                                            ? 'rgba(236, 236, 236, 1)'
                                                            : '',
                                                }}
                                            >
                                                <MdOutlineEventNote className="icon fs-4" />
                                                <h6 className="mb-0 text-muted">
                                                    {t('account.orderHistory')}
                                                </h6>
                                            </NavLink>
                                            <NavLink
                                                to="/account/orderRefund"
                                                className="nav-link d-flex justify-content-center align-items-center gap-3 pt-0 pt-md-2 rounded"
                                                style={{
                                                    backgroundColor:
                                                        currentUrl ===
                                                        '/account/orderRefund'
                                                            ? 'rgba(236, 236, 236, 1)'
                                                            : '',
                                                }}
                                            >
                                                <RiRefund2Fill className="icon fs-4" />
                                                <h6 className="mb-0 text-muted">
                                                    {t('account.orderRefund')}
                                                </h6>
                                            </NavLink>
                                            <NavLink
                                                to="/account/changePassword"
                                                className="nav-link d-flex justify-content-center align-items-center gap-3 pt-0 pt-md-2 rounded"
                                                style={{
                                                    backgroundColor:
                                                        currentUrl ===
                                                        '/account/changePassword'
                                                            ? 'rgba(236, 236, 236, 1)'
                                                            : '',
                                                }}
                                            >
                                                <RiLockPasswordLine className="fs-4" />
                                                <h6 className="mb-0 text-muted">
                                                    {t('account.changePassword')}
                                                </h6>
                                            </NavLink>
                                            <div
                                                className="nav-link d-flex justify-content-center align-items-center gap-3 pt-0 pt-md-2"
                                                onClick={() => handleLogout()}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <MdOutlineLogin className="fs-4" />
                                                <h6 className="mb-0 text-muted">
                                                    {t('account.logout')}
                                                </h6>
                                            </div>
                                        </div>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Main Content - Cột bên phải */}
                        <Col xs={12} md={8} lg={9}>
                            {' '}
                            {/* Kích thước cột cho nội dung chính */}
                            <Card className="shadow-sm h-100">
                                <Card.Body className="p-4">
                                    {' '}
                                    {/* Thêm padding cho nội dung */}
                                    <Switch>
                                        <Route exact path="/account">
                                            <Redirect to="/account/orderHistory" />
                                        </Route>
                                        <Route
                                            path="/account/user-information"
                                            component={PersonalInfo}
                                        />
                                        <Route
                                            path="/account/orderHistory"
                                            component={OrderHistory}
                                        />
                                        <Route
                                            path="/account/changePassword"
                                            component={ChangePassword}
                                        />
                                        <Route
                                            path="/account/searchOrder"
                                            component={SearchOrder}
                                        />
                                        <Route
                                            path="/account/orderRefund"
                                            component={OrderRefund}
                                        />
                                    </Switch>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default AccountInformation;
