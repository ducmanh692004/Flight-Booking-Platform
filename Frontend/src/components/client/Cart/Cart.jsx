import CartContent from './CartContent';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormatter } from '../../hooks/useFomatter';
import { useTranslation } from 'react-i18next';

const Cart = (props) => {
    const { t } = useTranslation();
    const [total, setTotal] = useState(0);
    const { formatCurrency } = useFormatter();
    const [itemSelect, setItemSelect] = useState({});
    const history = useHistory();
    const handleSetItemSelect = (value) => {
        setItemSelect(value);
    };

    const handleSetTotal = (value) => {
        setTotal(value);
    };

    const handleNavigate = () => {
        if (Object.keys(itemSelect).length > 0) {
            history.push(
                `/confirm-user-information?flightDepartureId=${
                    itemSelect.dataFlightDeparture._id
                }&flightComebackId=${
                    itemSelect.dataFlightComeback._id
                }&seatClassId=${
                    itemSelect.dataFlightDeparture.seats_quantity[0]
                        .seat_class_id._id
                }&seatClassName=${
                    itemSelect.dataFlightDeparture.seats_quantity[0]
                        .seat_class_id.name
                }&peopleQuantity=${JSON.stringify(
                    itemSelect.peopleQuantity
                )}&cartItemId=${itemSelect.id}`
            );
            props.handleCloseCart();
        }
    };

    return (
        <>
            <Offcanvas
                show={props.showCart}
                onHide={props.handleCloseCart}
                placement="end"
                style={{ width: '800px' }}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{t('cart.cart')}</Offcanvas.Title>
                </Offcanvas.Header>
                <hr className="mt-0 mb-0"></hr>
                <Offcanvas.Body>
                    <CartContent
                        total={total}
                        handleSetTotal={handleSetTotal}
                        handleSetItemSelect={handleSetItemSelect}
                    />
                </Offcanvas.Body>
                <div
                    className="d-flex justify-content-between p-2 px-3 align-items-center"
                    style={{ borderTop: '1px solid rgb(192, 191, 191)' }}
                >
                    <h5 className="text-primary mb-0">
                        {t('cart.total')} {formatCurrency(total)}
                    </h5>
                    <button
                        className="btn btn-primary"
                        style={{ fontWeight: '500' }}
                        disabled={total === 0 ? true : false}
                        onClick={() => handleNavigate()}
                    >
                        {t('cart.continue')}
                    </button>
                </div>
            </Offcanvas>
        </>
    );
};

export default Cart;
