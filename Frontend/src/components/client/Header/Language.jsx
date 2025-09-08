import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import './Language.scss';
import { useDispatch } from 'react-redux';
import { updateLanguage } from '../../../redux/actions/userAction';
import { useTranslation } from 'react-i18next';

const Language = (props) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = useSelector(
        (state) => state.language.current_language
    );
    const dispatch = useDispatch();

    const handleChangeLanguage = (language) => {
        dispatch(updateLanguage(language));
        i18n.changeLanguage(language);
    };

    return (
        <div
            className="d-flex align-items-center gap-3"
            // style={{ width: '120px' }    }
        >
            {currentLanguage === 'vi' ? (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                    style={{
                        width: '27px',
                        height: '16px',
                        filter: 'none',
                    }}
                ></img>
            ) : (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/0b/English_language.svg"
                    style={{ width: '27px', height: '16px', filter: 'none' }}
                ></img>
            )}

            <div></div>
            <div>
                <NavDropdown
                    title={
                        <span
                            style={{
                                color: props.textColor,
                                fontWeight: props.fontWeight,
                            }}
                        >
                            {currentLanguage === 'vi'
                                ? t('changeLanguage.vi')
                                : t('changeLanguage.en')}
                        </span>
                    }
                    id="basic-nav-dropdown"
                    // style={{ color: props.textColor, fontWeight: props.fontWeight }}
                    className="languages"
                >
                    <NavDropdown.Item
                        onClick={() => handleChangeLanguage('vi')}
                        className="en"
                        style={{ fontWeight: '500' }}
                    >
                        {t('changeLanguage.vi')}
                    </NavDropdown.Item>
                    <NavDropdown.Item
                        onClick={() => handleChangeLanguage('en')}
                        className="vn"
                        style={{ fontWeight: '500' }}
                    >
                        {t('changeLanguage.en')}
                    </NavDropdown.Item>
                </NavDropdown>
            </div>
        </div>
    );
};

export default Language;
