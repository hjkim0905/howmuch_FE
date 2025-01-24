import React from 'react';
import styled from 'styled-components';
import { KAKAO_AUTH_URL } from '../constants/kakaoAuth';

const LoginButton = () => {
    const handleLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    return <StyledButton onClick={handleLogin}>카카오로 시작하기</StyledButton>;
};

const StyledButton = styled.button`
    background-color: #fee500;
    color: #000000;
    border: none;
    border-radius: 12px;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    max-width: 320px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #fdd835;
    }
`;

export default LoginButton;
