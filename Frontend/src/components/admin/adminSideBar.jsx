import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaPlane,
    FaTags,
    FaClipboardList,
    FaUsers,
    FaHandsHelping,
    FaSignOutAlt,
} from 'react-icons/fa';
import { TbBuildingAirport } from 'react-icons/tb';
import { SiChinaeasternairlines } from 'react-icons/si';
import { PiSeatFill } from 'react-icons/pi';
import { RiRefund2Line } from 'react-icons/ri';
import { RiAdminLine } from 'react-icons/ri';
import { MdOutlineLanguage } from 'react-icons/md';
import LanguageModal from './languageModal';
import { Modal, Button } from 'react-bootstrap';
import { handleLogoutRemoveRerefreshToken } from '../../services/AuthenticationService';
import { toast } from 'react-toastify';
import { HiUserGroup } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AdminSidebar = () => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation
    const location = useLocation();
    const [showLangModal, setShowLangModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isActive = (path) => {
        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    const handleCloseLanguageModal = () => {
        setShowLangModal(false);
    };

    const linkStyle = (path) => ({
        backgroundColor: isActive(path)
            ? 'rgba(255,255,255,0.2)'
            : 'transparent',
        borderRadius: '8px',
        paddingLeft: '12px',
    });

    const handleConfirmLogout = async () => {
        const response = await handleLogoutRemoveRerefreshToken();
        if (response && response.EC === 0) {
            localStorage.clear();
            window.location.reload();
        } else {
            toast.error(response.EM);
        }

        setShowLogoutModal(false);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <div className="container" style={{ height: '100%' }}>
            {showLangModal && (
                <LanguageModal
                    show={showLangModal}
                    handleClose={handleCloseLanguageModal}
                />
            )}

            <div
                className="d-flex flex-column text-white p-0 pt-4 align-items-center"
                style={{ minHeight: '100vh', overflowY: 'auto' }}
            >
                <Modal
                    show={showLogoutModal}
                    onHide={handleCancelLogout}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {t('adminSidebar.confirmLogout')}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {t('adminSidebar.logoutConfirmationText')}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleConfirmLogout}>
                            {t('adminSidebar.logoutButton')}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleCancelLogout}
                        >
                            {t('adminSidebar.cancelButton')}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div className="d-flex align-items-center flex-column gap-2">
                    <div
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                        style={{ height: '50px', width: '50px' }}
                    >
                        <RiAdminLine className="fs-3" />
                    </div>
                    <h5>{t('adminSidebar.adminTitle')}</h5>
                </div>

                <hr
                    className="bg-white mt-1 mb-3"
                    style={{ height: '2px', width: '100%' }}
                />

                <Nav className="flex-column w-100 px-3">
                    <Nav.Link
                        as={Link}
                        to="/admin"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/dashboard')}
                    >
                        <FaHome className="me-2 fs-5" />
                        <span>{t('adminSidebar.dashboard')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/users"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/users')}
                    >
                        <FaUsers className="me-2 fs-5" />
                        <span>{t('adminSidebar.users')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/orders"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/orders')}
                    >
                        <FaClipboardList className="me-2 fs-5" />
                        <span>{t('adminSidebar.orders')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/flights"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/flights')}
                    >
                        <FaPlane className="me-2 fs-5" />
                        <span>{t('adminSidebar.flights')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/seat-classes"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/seat-classes')}
                    >
                        <PiSeatFill className="me-2 fs-5" />
                        <span>{t('adminSidebar.seatClasses')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/discount-codes"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/discount-codes')}
                    >
                        <FaTags className="me-2 fs-5" />
                        <span>{t('adminSidebar.discountCodes')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/airports"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/airports')}
                    >
                        <TbBuildingAirport className="me-2 fs-5" />
                        <span>{t('adminSidebar.airports')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/airlines"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/airlines')}
                    >
                        <SiChinaeasternairlines className="me-2 fs-5" />
                        <span>{t('adminSidebar.airlines')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/refund-requests"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/refund-requests')}
                    >
                        <RiRefund2Line className="me-2 fs-5" />
                        <span>{t('adminSidebar.refundRequests')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/groupRoles"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/groupRoles')}
                    >
                        <HiUserGroup className="me-2 fs-5" />
                        <span>{t('adminSidebar.managePermissions')}</span>
                    </Nav.Link>

                    <Nav.Link
                        as={Link}
                        to="/admin/support-requests"
                        className="text-white my-1 py-2 d-flex align-items-center"
                        style={linkStyle('/admin/support-requests')}
                    >
                        <FaHandsHelping className="me-2 fs-5" />
                        <span>{t('adminSidebar.supportRequests')}</span>
                    </Nav.Link>

                    <Nav.Link
                        className="text-white my-1 py-2 d-flex align-items-center"
                        onClick={() => setShowLangModal(true)}
                    >
                        <MdOutlineLanguage className="me-2 fs-5" />
                        <span>{t('adminSidebar.language')}</span>
                    </Nav.Link>

                    <Nav.Link
                        className="text-white my-1 py-2 d-flex align-items-center"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <FaSignOutAlt className="me-2 fs-5" />
                        <span>{t('adminSidebar.logout')}</span>
                    </Nav.Link>
                </Nav>
            </div>
        </div>
    );
};

export default AdminSidebar;
