import React from 'react';
import styled from 'styled-components';

const LoginButton = () => {
    return <StyledButton>카카오로 시작하기</StyledButton>;
};

const StyledButton = styled.button`
    padding: 1rem 2rem;
    font-size: 1.1rem;
    background-color: #fee500;
    border: none;
    border-radius: 12px;
    color: #000000;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`;

export default LoginButton;
