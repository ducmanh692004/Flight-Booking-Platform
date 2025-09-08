import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { BiSolidPlaneAlt } from 'react-icons/bi';
import { TbBrand4Chan } from 'react-icons/tb';
import { RiCoupon2Line } from 'react-icons/ri';
import { TbBuildingAirport } from 'react-icons/tb';
import './Header.scss';
import Search from './Search';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
// import { TranslateText } from '../../Translate';
import Language from './Language';
import { PiShoppingCartBold } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { FaRegUser } from 'react-icons/fa6';
import Cart from '../Cart/Cart';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const [user, setUser] = useState('');
    const location = useLocation();
    const [showCart, setShowCart] = useState(false);
    const userInformation = useSelector((state) => state.user);
    const cartItems = useSelector((state) => state.cart);

    const { t } = useTranslation();

    const handleShowCart = () => {
        setShowCart(!showCart);
    };

    const handleCloseCart = () => {
        setShowCart(false);
    };

    const handleDirect = () => {
        // history.push('/account');
    };

    const history = useHistory();

    const handleNavigateSupport = () => {
        history.push('/support');
    };

    const textColor = 'black';
    const textColorGray = 'rgb(84, 84, 85)';
    const background = 'transparent';
    const fontSize = '500';
    const size = '14px';
    return (
        <div
            className="header pb-1 pb-md-0 shadow-sm"
            style={{
                position: 'sticky',
                top: '0',
                zIndex: '100',
                borderBottom: '1px solid rgb(197, 190, 190)',
                backgroundColor: 'white',
            }}
        >
            <div
                className="container header-first-block d-flex flex-column p-2"
                style={{ background: background }}
            >
                <div className="d-flex justify-content-between">
                    <div
                        className="header-title"
                        onClick={() => history.push('/')}
                        style={{ cursor: 'pointer' }}
                    >
                        <FaPaperPlane
                            className="icon-title"
                            style={{ color: '00E7FF' }}
                        />
                        <h4 style={{ color: textColor, fontWeight: fontSize }}>
                            JetNow
                        </h4>
                    </div>

                    <div className="header-feature d-flex">
                        <div className="feature-ultis">
                            <NavLink
                                to="/support"
                                exact
                                className="nav-link d-none d-md-block"
                                style={{
                                    color: textColor,
                                    fontWeight: fontSize,
                                }}
                                // onClick={() => handleNavigateSupport()}
                            >
                                {t('header.support')}
                            </NavLink>
                            <NavLink
                                to="/account/orderHistory"
                                exact
                                className="nav-link d-none d-md-block"
                                style={{
                                    color: textColor,
                                    fontWeight: fontSize,
                                }}
                            >
                                {t('header.myBookings')}
                            </NavLink>

                            <Language
                                textColor={textColor}
                                fontWeight={fontSize}
                            />
                        </div>

                        {userInformation.isAuthenticated ? (
                            <div className="userProfile d-flex justify-content-center align-items-center gap-3">
                                <div
                                    className="d-flex justify-content-between align-items-center"
                                    style={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleShowCart()}
                                >
                                    {' '}
                                    <PiShoppingCartBold
                                        style={{
                                            color: textColor,
                                            fontSize: '25px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                        }}
                                    ></PiShoppingCartBold>
                                    <h6
                                        className="bg-primary rounded-circle px-1"
                                        style={{
                                            position: 'absolute',
                                            marginLeft: '15px',
                                            marginTop: '13px',
                                            fontSize: '11px',
                                            color: 'white',
                                            paddingBottom: '1px',
                                        }}
                                    >
                                        {cartItems.length > 0
                                            ? cartItems.length
                                            : ''}
                                    </h6>
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                    {userInformation.account.image !== '' ? (
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            {/* {' '} */}
                                            <img
                                                src={
                                                    userInformation.account
                                                        .image
                                                }
                                                className="bg-info rounded-circle"
                                                style={{
                                                    height: '30px',
                                                    width: '30px',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() =>
                                                    history.push(
                                                        '/account/orderHistory'
                                                    )
                                                }
                                            />
                                            <h6
                                                className="mb-0"
                                                style={{ color: textColor }}
                                            >
                                                {
                                                    userInformation.account
                                                        .username
                                                }
                                            </h6>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <div
                                                className="bg-primary rounded-circle d-flex justify-content-center align-items-center"
                                                style={{
                                                    height: '30px',
                                                    width: '30px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() =>
                                                    history.push(
                                                        '/account/orderHistory'
                                                    )
                                                }
                                            >
                                                <FaRegUser color="white" />
                                            </div>
                                            <h6
                                                className="mb-0"
                                                style={{ color: textColor }}
                                            >
                                                {
                                                    userInformation.account
                                                        .username
                                                }
                                            </h6>{' '}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="login-register d-flex gap-2">
                                <div
                                    className="d-flex justify-content-between align-items-center"
                                    style={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleShowCart()}
                                >
                                    {' '}
                                    <PiShoppingCartBold
                                        style={{
                                            color: textColor,
                                            fontSize: '25px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                        }}
                                    ></PiShoppingCartBold>
                                    <h6
                                        className="bg-primary rounded-circle px-1"
                                        style={{
                                            position: 'absolute',
                                            marginLeft: '15px',
                                            marginTop: '13px',
                                            fontSize: '11px',
                                            color: 'white',
                                            paddingBottom: '1px',
                                        }}
                                    >
                                        {cartItems.length > 0
                                            ? cartItems.length
                                            : ''}
                                    </h6>
                                </div>

                                <div></div>
                                <button
                                    className="login btn btn-sm btn-light d-flex justify-content-center align-items-center gap-1"
                                    style={{
                                        color: textColor,
                                        border: `1px solid ${textColor}`,
                                    }}
                                    onClick={() => {
                                        history.push('/login');
                                    }}
                                >
                                    <MdOutlinePeopleAlt
                                        className="fs-6"
                                        style={{ color: textColor }}
                                    />
                                    {t('header.login')}
                                </button>
                                <button
                                    className="register btn btn-primary btn-sm"
                                    // style={{ color: textColor }}
                                    onClick={() => history.push('/register')}
                                >
                                    {t('header.register')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {location.pathname !== '/login' &&
                    location.pathname !== '/register' && (
                        <hr
                            className="mb-1 mt-1"
                            style={{ color: textColor }}
                        ></hr>
                    )}
                {location.pathname !== '/login' &&
                    location.pathname !== '/register' && (
                        <div className="select-item">
                            <NavLink
                                to="/intro-flight"
                                className="nav-link d-flex flex-column flex-md-row px-1 px-md-2 px-lg-3"
                                style={{ color: textColorGray }}
                            >
                                <BiSolidPlaneAlt
                                    style={{ color: textColorGray }}
                                    className="iconn"
                                />
                                <h6
                                    className="mb-0"
                                    style={{
                                        fontWeight: fontSize,
                                        fontSize: size,
                                    }}
                                >
                                    {t('header.flightTickets')}
                                </h6>
                            </NavLink>

                            <NavLink
                                to=""
                                className="nav-link d-flex flex-column flex-md-row px-1 px-md-2 px-lg-3"
                                style={{ color: textColorGray }}
                            >
                                <TbBrand4Chan
                                    className="iconn"
                                    style={{ color: textColorGray }}
                                />
                                <h6
                                    className="mb-0"
                                    style={{
                                        fontWeight: fontSize,
                                        fontSize: size,
                                    }}
                                >
                                    {t('header.airlines')}
                                </h6>
                            </NavLink>

                            <NavLink
                                to=""
                                className="nav-link d-flex flex-column flex-md-row px-1 px-md-2 px-lg-3"
                                style={{ color: textColorGray }}
                            >
                                <RiCoupon2Line
                                    className="iconn"
                                    style={{ color: textColorGray }}
                                />
                                <h6 className="mb-0" style={{ fontSize: size }}>
                                    {t('header.coupons')}
                                </h6>
                            </NavLink>

                            <NavLink
                                to=""
                                className="nav-link d-flex flex-column flex-md-row px-1 px-md-2 px-lg-3"
                                style={{ color: textColorGray }}
                            >
                                <TbBuildingAirport
                                    className="iconn"
                                    style={{ color: textColorGray }}
                                />
                                <h6 className="mb-0" style={{ fontSize: size }}>
                                    {t('header.airports')}
                                </h6>
                            </NavLink>
                        </div>
                    )}

                {location.pathname !== '/login' ||
                    location.pathname !== '/register' ||
                    (location.pathname !== '/social-register' && (
                        <hr
                            className="mt-1 mb-0"
                            style={{ color: 'white' }}
                        ></hr>
                    ))}
                {location.pathname == '/' && (
                    <hr
                        className="d-flex d-md-none"
                        style={{ color: 'white' }}
                    ></hr>
                )}
            </div>

            <Cart showCart={showCart} handleCloseCart={handleCloseCart} />
        </div>
    );
};

export default Header;
