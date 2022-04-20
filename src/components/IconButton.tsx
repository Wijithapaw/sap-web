import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
  icon: IconProp; // Only font awesome solid icons are supported at the moment
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  className?: string;
  color?: string;
}

export default function IconButton({icon, onClick, className, color}: Props) {
  return <FontAwesomeIcon 
    className={className} 
    icon={icon} 
    onClick={onClick} 
    style={{cursor:'pointer'}}
    color={color} />
}
