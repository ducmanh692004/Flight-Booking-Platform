import { set } from 'lodash';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { validate } from 'uuid';
import { useTranslation } from 'react-i18next';

const FillUserInformation = (props) => {
    const { t } = useTranslation();

    const titles = ['Ông', 'Bà', 'Cô'];

    const months = [
        `${t('passenger.month')} 1`,
        `${t('passenger.month')} 2`,
        `${t('passenger.month')} 3`,
        `${t('passenger.month')} 4`,
        `${t('passenger.month')} 5`,
        `${t('passenger.month')} 6`,
        `${t('passenger.month')} 7`,
        `${t('passenger.month')} 8`,
        `${t('passenger.month')} 9`,
        `${t('passenger.month')} 10`,
        `${t('passenger.month')} 11`,
        `${t('passenger.month')} 12`,
    ];
    const countries = ['Vietnam', 'United States', 'China', 'Japan', 'Korea'];

    return (
        <div className="mt-4">
            {/* <div className="card"> */}
            <div className="shadow-sm card-header bg-white pt-3 pb-3 border rounded">
                <h5 className="card-title mb-0 text-dark fw-semibold">
                    {t('passenger.info')}
                </h5>
            </div>
            <div className="d-flex flex-column shadow-sm gap-3 mt-2">
                {Array.isArray(props.formAllDataAdult) &&
                    props.formAllDataAdult.map((item, index) => (
                        <div className="border p-3 rounded" key={index}>
                            {/* Passenger 1 Header */}
                            <div
                                className="pt-2 pb-2 px-2 rounded"
                                style={{
                                    backgroundColor: 'rgb(235, 235, 235)',
                                }}
                            >
                                <h6 className="fw-medium mb-0">
                                    {t('passenger.adult')} {index + 1}
                                </h6>
                            </div>

                            {/* Title Field */}
                            <div className="row mb-3 mt-3">
                                <div className="col-md-4">
                                    <label
                                        htmlFor="title"
                                        className="form-label fw-medium"
                                    >
                                        {t('passenger.title')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="title"
                                        value={item.title}
                                        onChange={(e) =>
                                            props.handleChangePassengerInformation(
                                                'adult',
                                                index,
                                                'title',
                                                e.target.value
                                            )
                                        }
                                    >
                                        {titles.map((title) => (
                                            <option key={title} value={title}>
                                                {title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="lastName"
                                        className="form-label fw-medium"
                                    >
                                        {t('passenger.lastName')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${
                                            props.formErrorAdult[index]
                                                ?.lastName
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        id="lastName"
                                        value={item.lastName}
                                        onChange={(e) =>
                                            props.handleChangePassengerInformation(
                                                'adult',
                                                index,
                                                'lastName',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ta"
                                    />
                                    <div className="form-text">
                                        {t('passenger.lastNameExample')}
                                    </div>
                                    {props.formErrorAdult[index]?.lastName && (
                                        <span className="text-danger">
                                            {
                                                props.formErrorAdult[index]
                                                    ?.lastName
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="firstName"
                                        className="form-label fw-medium"
                                    >
                                        {t('passenger.firstName')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${
                                            props.formErrorAdult[index]
                                                ?.firstName
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        id="firstName"
                                        value={item.firstName}
                                        onChange={(e) =>
                                            props.handleChangePassengerInformation(
                                                'adult',
                                                index,
                                                'firstName',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Duc Manh"
                                    />
                                    <div className="form-text">
                                        {t('passenger.firstNameExample')}
                                    </div>
                                    {props.formErrorAdult[index]?.firstName && (
                                        <span className="text-danger">
                                            {
                                                props.formErrorAdult[index]
                                                    ?.firstName
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Birth Date and Nationality */}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">
                                        {t('passenger.birthDate')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <div className="row g-2">
                                        <div className="col-4">
                                            <input
                                                type="number"
                                                className={`form-control ${
                                                    props.formErrorAdult[index]
                                                        ?.birthDay
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                placeholder="22"
                                                min="1"
                                                max="31"
                                                value={item.birthDay}
                                                onChange={(e) =>
                                                    props.handleChangePassengerInformation(
                                                        'adult',
                                                        index,
                                                        'birthDay',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="col-4">
                                            <select
                                                className="form-select"
                                                value={item.birthMonth}
                                                onChange={(e) =>
                                                    props.handleChangePassengerInformation(
                                                        'adult',
                                                        index,
                                                        'birthMonth',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    {t('passenger.month')} 10
                                                </option>
                                                {months.map((month, index) => (
                                                    <option
                                                        key={index}
                                                        value={index + 1}
                                                    >
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <input
                                                type="number"
                                                className={`form-control ${
                                                    props.formErrorAdult[index]
                                                        ?.birthYear
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                placeholder="2004"
                                                min="1900"
                                                max="2024"
                                                value={item.birthYear}
                                                onChange={(e) =>
                                                    props.handleChangePassengerInformation(
                                                        'adult',
                                                        index,
                                                        'birthYear',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="form-text">
                                        {t('passenger.adultNote')}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        {props.formErrorAdult[index]
                                            ?.birthDay && (
                                            <span className="text-danger">
                                                {
                                                    props.formErrorAdult[index]
                                                        ?.birthDay
                                                }
                                            </span>
                                        )}
                                        {props.formErrorAdult[index]
                                            ?.birthYear && (
                                            <span className="text-danger">
                                                {
                                                    props.formErrorAdult[index]
                                                        ?.birthYear
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="nationality"
                                        className="form-label fw-medium"
                                    >
                                        {t('passenger.nationality')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="nationality"
                                        value={item.nationality}
                                        onChange={(e) =>
                                            props.handleChangePassengerInformation(
                                                'adult',
                                                index,
                                                'nationality',
                                                e.target.value
                                            )
                                        }
                                    >
                                        {countries.map((country) => (
                                            <option
                                                key={country}
                                                value={country}
                                            >
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Child Passengers */}
            <div className="d-flex flex-column gap-3 mt-4 shadow-sm">
                {Array.isArray(props.formAllDataChild) &&
                    props.peopleQuantity?.child > 0 &&
                    props.formAllDataChild.map((item, index) => (
                        <div className="border p-3 rounded" key={index}>
                            {/* Passenger 1 Header */}
                            <div
                                className="pt-2 pb-2 px-2 rounded"
                                style={{
                                    backgroundColor: 'rgb(235, 235, 235)',
                                }}
                            >
                                <h6 className="fw-medium mb-0">
                                    {t('passenger.childCount')} {index + 1}
                                </h6>
                            </div>

                            {/* Title Field */}
                            <div className="row mb-3 mt-3">
                                <div className="col-md-4">
                                    <label
                                        htmlFor="title"
                                        className="form-label fw-medium"
                                    >
                                        {t('passenger.title')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="title"
                                        value={item.title}
                                        onChange={(e) =>
                                            props.handleChangePassengerInformation(
                                                'child',
                                                index,
                                                'title',
                                                e.target.value
                                            )
                                        }
                                    >
                                        {titles.map((title) => (
                                            <option key={title} value={title}>
                                                {title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Name Fields */}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="lastName"
                                        className="form-label fw-medium"
                                    >
                                        {t('passenger.lastName')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${
                                            props.formErrorChild[index]
                                                ?.lastName
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        id="lastName"
                                        value={item.lastName}
                                        onChange={(e) =>
                                            props.handleChangePassengerInformation(
                                                'child',
                                                index,
                                                'lastName',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ta"
                                    />
                                    <div className="form-text">
                                        {t('passenger.lastNameNote')}
                                    </div>
                                    {props.formErrorChild[index]?.firstName && (
                                        <span className="text-danger">
                                            {
                                                props.formErrorChild[index]
                                                    ?.firstName
                                            }
                                        </span>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="firstName"
                                        className="form-label fw-medium"
                                    >
                                        {t('passenger.firstName')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${
                                            props.formErrorChild[index]
                                                ?.firstName
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                        id="firstName"
                                        value={item.firstName}
                                        onChange={(e) =>
                                            props.handleChangePassengerInformation(
                                                'child',
                                                index,
                                                'firstName',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Duc Manh"
                                    />
                                    <div className="form-text">
                                        {t('passenger.firstNameExample')}
                                    </div>
                                    {props.formErrorChild[index]?.lastName && (
                                        <span className="text-danger">
                                            {
                                                props.formErrorChild[index]
                                                    ?.lastName
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Birth Date and Nationality */}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">
                                        {t('passenger.birthDate')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <div className="row g-2">
                                        <div className="col-4">
                                            <input
                                                type="number"
                                                className={`form-control ${
                                                    props.formErrorChild[index]
                                                        ?.birthDay
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                placeholder="22"
                                                min="1"
                                                max="31"
                                                value={item.birthDay}
                                                onChange={(e) =>
                                                    props.handleChangePassengerInformation(
                                                        'child',
                                                        index,
                                                        'birthDay',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="col-4">
                                            <select
                                                className="form-control"
                                                value={item.birthMonth}
                                                onChange={(e) =>
                                                    props.handleChangePassengerInformation(
                                                        'child',
                                                        index,
                                                        'birthMonth',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    {t('passenger.month')} 10
                                                </option>
                                                {months.map((month, index) => (
                                                    <option
                                                        key={index}
                                                        value={index + 1}
                                                    >
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-4">
                                            <input
                                                type="number"
                                                className={`form-control ${
                                                    props.formErrorChild[index]
                                                        ?.birthYear
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                placeholder="2004"
                                                min="1900"
                                                max="2024"
                                                value={item.birthYear}
                                                onChange={(e) =>
                                                    props.handleChangePassengerInformation(
                                                        'child',
                                                        index,
                                                        'birthYear',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="form-text">
                                        {t('passenger.childNote')}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        {props.formErrorChild[index]
                                            ?.birthDay && (
                                            <span className="text-danger">
                                                {
                                                    props.formErrorChild[index]
                                                        ?.birthDay
                                                }
                                            </span>
                                        )}
                                        {props.formErrorChild[index]
                                            ?.birthYear && (
                                            <span className="text-danger">
                                                {
                                                    props.formErrorChild[index]
                                                        ?.birthYear
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="nationality"
                                        className="form-label fw-medium"
                                    >
                                        {t('passenger.nationality')}
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="nationality"
                                        value={item.nationality}
                                        onChange={(e) =>
                                            props.handleChangePassengerInformation(
                                                'child',
                                                index,
                                                'nationality',
                                                e.target.value
                                            )
                                        }
                                    >
                                        {countries.map((country) => (
                                            <option
                                                key={country}
                                                value={country}
                                            >
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            {/* </div> */}
        </div>
    );
};

export default FillUserInformation;
