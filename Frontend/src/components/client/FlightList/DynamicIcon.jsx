import React from 'react';
import { ICON_BY_NAME } from '../../../utils/iconMap';
import { FaQuestionCircle } from 'react-icons/fa'; // icon mặc định nếu không tìm thấy

const DynamicIcon = ({ iconName, size = 24, color = 'black' }) => {
    const IconComponent = ICON_BY_NAME[iconName] || FaQuestionCircle;

    return <IconComponent size={size} color={color} />;
};

export default DynamicIcon;
