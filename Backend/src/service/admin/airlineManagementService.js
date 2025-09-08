import airline from '../../models/airline.js';
import flight from '../../models/flight.js';
import clouldinaryConfig from '../../config/cloudinary.js';
import cloudinaryService from '../../utils/clouldinaryUpload.js';

const handleGetAllAirline = async (limit, page) => {
    try {
        const skip = (page - 1) * limit;

        const query = airline
            .find({})
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        const data = await query.exec();

        const totalAirlines = await airline.countDocuments({});

        return {
            EM: 'Get all airlines success!',
            EC: 0,
            DT: {
                airlines: data,
                totalPages: Math.ceil(totalAirlines / limit),
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};

const handleCreateNewAirline = async (
    name,
    country,
    logoBuffer,
    mimetype,
    originalname
) => {
    try {
        // console.log('Service received:', {
        //     name,
        //     country,
        //     bufferSize: logoBuffer.length,
        //     mimetype,
        //     originalname,
        // });

        const cloudinaryResult = await cloudinaryService.uploadToCloudinary(
            logoBuffer,
            mimetype,
            'Flight-booking-platform/airline_logos'
        );

        const logo_url = cloudinaryResult.secure_url;
        const public_id = cloudinaryResult.public_id;

        // console.log('checkkkkkkkkk:', public_id);

        await airline.create({
            name: name,
            country: country,
            logo_url: logo_url,
            cloudinary_public_id: public_id,
        });

        return {
            EM: 'Create new airline success!',
            EC: 0,
            DT: {},
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};

const handleUpdateAirline = async (
    id,
    name,
    country,
    logoBuffer,
    mimetype,
    originalname
) => {
    try {
        // console.log(
        //     'check data: ',
        //     id,
        //     name,
        //     country,
        //     logoBuffer,
        //     mimetype,
        //     originalname
        // );
        // console.log('check image:', logoBuffer, originalname);
        if (logoBuffer === undefined || originalname === undefined) {
            const data = await airline.updateOne(
                {
                    _id: id,
                },
                {
                    name: name,
                    country: country,
                }
            );

            return {
                EM: 'Update airline information successfully!',
                EC: 0,
                DT: {},
            };
        } else {
            const dataAirline = await airline.findById(id);
            if (dataAirline === null) {
                return {
                    EM: 'Can not find airline to update!',
                    EC: '-1',
                    DT: [],
                };
            }

            // console.log('public idd:', dataAirline.cloudinary_public_id);

            const cloudinaryResult = await cloudinaryService.uploadToCloudinary(
                logoBuffer,
                mimetype,
                'Flight-booking-platform/airline_logos',
                dataAirline.cloudinary_public_id
            );

            const logo_url = cloudinaryResult.secure_url;
            // const public_id = cloudinaryResult.public_id;

            await airline.updateOne(
                {
                    _id: id,
                },
                {
                    name: name,
                    country: country,
                    logo_url: logo_url,
                    // cloudinary_public_id: public_id,
                }
            );

            return {
                EM: 'Update airline information successfully!',
                EC: 0,
                DT: {},
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};

const handleDeleteAirline = async (airlineId) => {
    try {
        const data = await flight.findOne({ airline: airlineId });
        // console.log('check data', data);
        if (data) {
            return {
                EM: 'You can not delete this airline because it has been used in flights!',
                EC: 1,
                DT: {},
            };
        } else {
            const data = await airline.findByIdAndDelete(airlineId);

            await cloudinaryService.deleteFromCloudinary(
                data.cloudinary_public_id
            );
            return {
                EM: 'Delete airline successfully!',
                EC: 0,
                DT: {},
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};

export default {
    handleCreateNewAirline,
    handleGetAllAirline,
    handleUpdateAirline,
    handleDeleteAirline,
};
