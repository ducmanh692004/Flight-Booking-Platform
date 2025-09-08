import airport from '../../models/airport.js';
import cloudinaryService from '../../utils/clouldinaryUpload.js';
import flight from '../../models/flight.js';

const handleGetAllAirport = async (page, limit) => {
    try {
        const data = await airport
            .find(
                {},
                {
                    name: 1,
                    code: 1,
                    country: 1,
                    province: 1,
                    time_zon: 1,
                    image_province: 1,
                }
            )
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalAirport = await airport.countDocuments({});

        return {
            EM: 'Get all airport success!',
            EC: 0,
            DT: {
                airports: data,
                totalPages: Math.ceil(totalAirport / limit),
            },
        };
    } catch (error) {
        console.log(error);
    }
};

const handleCreateNewAirport = async (
    name,
    code,
    country,
    province,
    time_zon,
    imageBuffer,
    mimetype,
    originalname
) => {
    try {
        const data = await airport.find({ code: code });
        if (data.length > 0) {
            return {
                EM: 'Airport code already exists!',
                EC: -1,
                DT: null,
            };
        } else {
            // console.log(
            //     'check all data:',
            //     name,
            //     code,
            //     country,
            //     province,
            //     time_zon,
            //     imageBuffer,
            //     mimetype,
            //     originalname
            // );

            const cloudinaryResult = await cloudinaryService.uploadToCloudinary(
                imageBuffer,
                mimetype,
                'Flight-booking-platform/airport_images'
            );

            const image_url = cloudinaryResult.secure_url;
            const public_id = cloudinaryResult.public_id;

            const newAirport = await airport.create({
                name: name,
                code: code,
                country: country,
                province: province,
                time_zon: time_zon,
                image_province: image_url,
                cloudinary_public_id: public_id,
            });

            return {
                EM: 'Create new airport success! ',
                EC: 0,
                DT: newAirport,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in server!',
            EC: -1,
            DT: null,
        };
    }
};

const handleUpdateAirport = async (
    id,
    name,
    code,
    country,
    province,
    time_zon,
    imageBuffer,
    mimetype,
    originalname
) => {
    try {
        const data = await airport.findById(id);
        if (!data) {
            return {
                EM: 'Airport not found!',
                EC: -1,
                DT: null,
            };
        }

        if (imageBuffer === undefined || originalname === undefined) {
            const updateAirport = await airport.updateOne(
                {
                    _id: id,
                },
                {
                    name: name,
                    code: code,
                    country: country,
                    province: province,
                    time_zon: time_zon,
                }
            );
            return {
                EM: 'Update airport success!',
                EC: 0,
                DT: updateAirport,
            };
        } else {
            const cloudinaryResult = await cloudinaryService.uploadToCloudinary(
                imageBuffer,
                mimetype,
                'Flight-booking-platform/airport_images',
                data.cloudinary_public_id
            );

            const image_url = cloudinaryResult.secure_url;
            // const public_id = cloudinaryResult.public_id;

            const updateAirport = await airport.updateOne(
                {
                    _id: id,
                },
                {
                    name: name,
                    code: code,
                    country: country,
                    province: province,
                    time_zon: time_zon,
                    image_province: image_url,
                    // cloudinary_public_id: cloudinaryResult.public_id,
                }
            );
            return {
                EM: 'Update airport success!',
                EC: 0,
                DT: updateAirport,
            };
        }
    } catch (error) {
        console.log(error);
    }
};

const handleDeleteAirport = async (airportId) => {
    try {
        // const response = await axios.delete('/api/v1/admin/delete-airport');
        const airportExist = await flight
            .findOne({
                $or: [
                    { 'segments.departure_airport_id': airportId },
                    { 'segments.arrival_airport_id': airportId },
                ],
            })
            .limit(1);

        if (airportExist) {
            return {
                EM: 'Airport is using in flight, you can not delete!',
                EC: -1,
                DT: [],
            };
        } else {
            const airportData = await airport.findById(airportId);
            if (airportData.cloudinary_public_id) {
                await cloudinaryService.deleteFromCloudinary(
                    airportData.cloudinary_public_id
                );
            }
            await airport.deleteOne({ _id: airportId });
            return {
                EM: 'Delete airport successfully!',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleGetAllAirport,
    handleCreateNewAirport,
    handleUpdateAirport,
    handleDeleteAirport,
};
