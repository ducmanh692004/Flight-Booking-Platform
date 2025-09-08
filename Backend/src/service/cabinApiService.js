import cabin from '../models/cabin.js';
import mongoose from 'mongoose';

const handleTakeCabinInformation = async (flightId, seatClassId) => {
    try {
        const data = await cabin.find({
            flight_id: flightId,
            seat_class_id: seatClassId,
        });
        if (data) {
            return {
                EM: 'Get detail seat class successfully!',
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: 'Can not get detail seat class!',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleUpdateSeatDetailPosition = async (
    flightId,
    seatClassId,
    seatClassDetailChild,
    seatClassDetailAdult
) => {
    try {
        const updateResult = await cabin.updateMany({});
    } catch (error) {
        console.log(error);
    }
};

// const handleTest = async () => {
//     try {
//         const updateResult = await cabin.updateMany({}, [
//             {
//                 $set: {
//                     cabin_map: {
//                         $map: {
//                             input: '$cabin_map',
//                             as: 'row',
//                             in: {
//                                 $mergeObjects: [
//                                     '$$row',
//                                     {
//                                         seats: {
//                                             $map: {
//                                                 input: '$$row.seats',
//                                                 as: 'seat',
//                                                 in: {
//                                                     $mergeObjects: [
//                                                         '$$seat',
//                                                         {
//                                                             seat_number: {
//                                                                 $let: {
//                                                                     vars: {
//                                                                         // Chuyển seat_number thành chuỗi và xử lý null/undefined thành chuỗi rỗng
//                                                                         // Sử dụng $ifNull để biến null/undefined thành chuỗi rỗng trước khi $toString
//                                                                         normalizedSeatNumber:
//                                                                             {
//                                                                                 $toString:
//                                                                                     {
//                                                                                         $ifNull:
//                                                                                             [
//                                                                                                 '$$seat.seat_number',
//                                                                                                 '',
//                                                                                             ],
//                                                                                     },
//                                                                             },
//                                                                     },
//                                                                     in: {
//                                                                         $cond: {
//                                                                             // Kiểm tra nếu chuỗi đã được chuẩn hóa là rỗng
//                                                                             if: {
//                                                                                 $eq: [
//                                                                                     '$$normalizedSeatNumber',
//                                                                                     '',
//                                                                                 ],
//                                                                             },
//                                                                             then: '', // Trả về chuỗi rỗng
//                                                                             else: {
//                                                                                 // Ngược lại, thực hiện logic loại bỏ số
//                                                                                 $reduce:
//                                                                                     {
//                                                                                         input: {
//                                                                                             $split: [
//                                                                                                 '$$normalizedSeatNumber',
//                                                                                                 '',
//                                                                                             ],
//                                                                                         },
//                                                                                         initialValue:
//                                                                                             '',
//                                                                                         in: {
//                                                                                             $cond: {
//                                                                                                 if: {
//                                                                                                     $regexMatch:
//                                                                                                         {
//                                                                                                             input: '$$this',
//                                                                                                             regex: /^[0-9]$/,
//                                                                                                         },
//                                                                                                 },
//                                                                                                 then: '$$value',
//                                                                                                 else: {
//                                                                                                     $concat:
//                                                                                                         [
//                                                                                                             '$$value',
//                                                                                                             '$$this',
//                                                                                                         ],
//                                                                                                 },
//                                                                                             },
//                                                                                         },
//                                                                                     },
//                                                                             },
//                                                                         },
//                                                                     },
//                                                                 },
//                                                             },
//                                                         },
//                                                     ],
//                                                 },
//                                             },
//                                         },
//                                     },
//                                 ],
//                             },
//                         },
//                     },
//                 },
//             },
//         ]);

//         console.log(`Cập nhật hoàn tất cho collection 'cabin'.`);
//         console.log(`Số lượng tài liệu đã khớp: ${updateResult.matchedCount}`);
//         console.log(
//             `Số lượng tài liệu đã thay đổi: ${updateResult.modifiedCount}`
//         );

//         return {
//             EM: 'Seat numbers updated successfully!',
//             EC: 0,
//             DT: {
//                 matchedCount: updateResult.matchedCount,
//                 modifiedCount: updateResult.modifiedCount,
//             },
//         };
//     } catch (error) {
//         console.error('Lỗi trong quá trình cập nhật seat numbers:', error);
//         return {
//             EM: 'Something wrong in service while updating seat numbers!',
//             EC: -1,
//             DT: [],
//         };
//     }
// };

const assignSeatsForPassengers = async (
    flightId,
    seatClassId,
    userId,
    passengerSeatRequests
) => {
    const flightObjectId = new mongoose.Types.ObjectId(flightId);
    const seatClassObjectId = new mongoose.Types.ObjectId(seatClassId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Tách các ghế đã chọn thủ công và các ghế để hệ thống gán
    const results = [];
    const autoAssignRequests = [];

    passengerSeatRequests.forEach((req, index) => {
        const requestWithIndex = { ...req, _originalIndex: index };

        // Nếu có đầy đủ thông tin ghế => là ghế được người dùng chọn
        if (req.rowId && req.seat_id && req.seatNumber && req.row > 0) {
            results.push(requestWithIndex);
        } else {
            // Ghế chưa chọn => thêm vào danh sách cần auto gán
            autoAssignRequests.push(requestWithIndex);
            results.push(requestWithIndex); // vẫn cần để giữ thứ tự ban đầu
        }
    });

    // --- Gán những ghế người dùng đã chọn ---
    for (const seatReq of results) {
        if (
            seatReq.rowId &&
            seatReq.seat_id &&
            seatReq.seatNumber &&
            seatReq.row > 0
        ) {
            const rowObjectId = new mongoose.Types.ObjectId(seatReq.rowId);
            const seatObjectId = new mongoose.Types.ObjectId(seatReq.seat_id);

            const updateResult = await cabin.updateOne(
                {
                    flight_id: flightObjectId,
                    seat_class_id: seatClassObjectId,
                },
                {
                    $set: {
                        // Gán trạng thái là 'booked' và lưu passenger_id
                        'cabin_map.$[rowElem].seats.$[seatElem].status':
                            'booked',
                        'cabin_map.$[rowElem].seats.$[seatElem].passenger_id':
                            userObjectId,
                    },
                },
                {
                    arrayFilters: [
                        { 'rowElem._id': rowObjectId }, // Điều kiện xác định hàng ghế
                        {
                            'seatElem._id': seatObjectId,
                            'seatElem.status': { $ne: 'booked' },
                        }, // Điều kiện xác định ghế chưa bị đặt
                    ],
                }
            );

            // console.log('Update result:', updateResult);
            // Nếu không cập nhật được => có thể ghế đã bị người khác giữ
            if (updateResult.modifiedCount === 0) {
                console.warn(
                    `Không thể cập nhật ghế đã chọn: row ${seatReq.row}, seat ${seatReq.seatNumber}`
                );
            }
        }
    }

    // --- Gán tự động các ghế còn lại ---
    if (autoAssignRequests.length > 0) {
        const cabinDoc = await cabin
            .findOne(
                { flight_id: flightObjectId, seat_class_id: seatClassObjectId },
                { cabin_map: 1 }
            )
            .lean();

        let autoIndex = 0;

        for (const row of cabinDoc.cabin_map) {
            for (const seat of row.seats) {
                if (seat.status !== 'booked') {
                    const currentReq = autoAssignRequests[autoIndex];
                    const rowObjectId = row._id;
                    const seatObjectId = seat._id;

                    const updateResult = await cabin.updateOne(
                        {
                            flight_id: flightObjectId,
                            seat_class_id: seatClassObjectId,
                        },
                        {
                            $set: {
                                'cabin_map.$[rowElem].seats.$[seatElem].status':
                                    'booked',
                                'cabin_map.$[rowElem].seats.$[seatElem].passenger_id':
                                    userObjectId,
                            },
                        },
                        {
                            arrayFilters: [
                                { 'rowElem._id': rowObjectId },
                                {
                                    'seatElem._id': seatObjectId,
                                    'seatElem.status': { $ne: 'booked' },
                                },
                            ],
                        }
                    );

                    // Nếu gán thành công thì cập nhật vào kết quả
                    if (updateResult.modifiedCount > 0) {
                        const indexInResults = currentReq._originalIndex;
                        results[indexInResults] = {
                            ...results[indexInResults],
                            rowId: row._id.toString(),
                            seat_id: seat._id.toString(),
                            seatNumber: seat.seat_number,
                            row: row.row,
                        };

                        autoIndex++;

                        // Nếu đã gán hết thì dừng
                        if (autoIndex >= autoAssignRequests.length) break;
                    }
                }
            }

            // Nếu đã gán hết thì dừng
            if (autoIndex >= autoAssignRequests.length) break;
        }
    }

    // Loại bỏ _originalIndex trước khi trả về
    return results.map(({ _originalIndex, ...rest }) => rest);

    // return { cleanResults };
};

const createNewCabin = async (
    layout,
    seatClassId,
    flightId,
    chooseSeatPrice,
    totalSeat
) => {
    try {
        const formatApla = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
        ];
        let totalSeatOfRow = 0;
        for (let i = 0; i < layout.length; i++) {
            totalSeatOfRow += layout[i];
        }

        const totalRow = Math.ceil(totalSeat / totalSeatOfRow);
        const totalSeatFinalRow = totalSeat % totalSeatOfRow;

        // console.log('totalRow:', totalRow);
        // console.log('totalSeatFinalRow:', totalSeat);
        // console.log(`totalSeatOfRow: ${totalSeatOfRow}`);

        const cabin_map = [];
        for (let j = 0; j < totalRow; j++) {
            let currentRow = [];
            if (j === totalRow - 1) {
                for (let n = 0; n < totalSeatFinalRow; n++) {
                    currentRow.push({
                        seat_number: formatApla[n],
                        status: 'available',
                    });
                }
                cabin_map.push({
                    row: j + 1,
                    seats: currentRow,
                });
            } else {
                for (let m = 0; m < totalSeatOfRow; m++) {
                    currentRow.push({
                        seat_number: formatApla[m],
                        status: 'available',
                    });
                }
                cabin_map.push({
                    row: j + 1,
                    seats: currentRow,
                });
            }
        }
        await cabin.create({
            flight_id: flightId,
            seat_class_id: seatClassId,
            layout: layout,
            price_normal_seat: chooseSeatPrice.price_normal_seat,
            price_window_seat: chooseSeatPrice.price_window_seat,
            cabin_map: cabin_map,
        });
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleTakeCabinInformation,
    assignSeatsForPassengers,
    createNewCabin,
};
