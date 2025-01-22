import React from 'react';
import styled, { keyframes } from 'styled-components';

const FloatingFood = ({ emoji, delay, size, position, index }) => {
    return (
        <FoodEmoji delay={delay} size={size} position={position} index={index}>
            {emoji}
        </FoodEmoji>
    );
};

const float = keyframes`
    0% {
        transform: translateY(0) rotate(0deg) translateX(0);
    }
    33% {
        transform: translateY(-15px) rotate(8deg) translateX(10px);
    }
    66% {
        transform: translateY(12px) rotate(-5deg) translateX(-8px);
    }
    100% {
        transform: translateY(0) rotate(0deg) translateX(0);
    }
`;

const getPosition = (position, index) => {
    switch (position) {
        case 'top':
            return {
                left: `${10 + index * 35}%`,
                top: `${index % 2 === 0 ? 8 : 18}%`,
            };
        case 'bottom':
            return {
                left: `${25 + index * 35}%`,
                top: `${index % 2 === 0 ? 75 : 85}%`,
            };
        case 'left':
            return {
                left: `${index % 2 === 0 ? 15 : 25}%`,
                top: `${15 + index * 30}%`,
            };
        case 'right':
            return {
                left: `${index % 2 === 0 ? 75 : 85}%`,
                top: `${30 + index * 30}%`,
            };
        default:
            return {
                left: '0%',
                top: '0%',
            };
    }
};

const FoodEmoji = styled.span`
    position: fixed;
    font-size: ${(props) => props.size || '2rem'};
    animation: ${float} 8s ease-in-out infinite;
    animation-delay: ${(props) => props.delay};
    left: ${(props) => getPosition(props.position, props.index).left};
    top: ${(props) => getPosition(props.position, props.index).top};
    transition: transform 0.3s ease;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));

    &:hover {
        transform: scale(1.2) rotate(10deg);
    }
`;

export default FloatingFood;
