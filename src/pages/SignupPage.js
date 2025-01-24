import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import APIService from '../services/APIService';
import { useAuth } from '../hooks/useAuth';

const SignupPage = () => {
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { uid, email } = location.state || {};
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = {
                uid,
                email,
                nickname,
            };
            const response = await APIService.auth.signup(userData);

            if (response.exists && response.user) {
                login(response.user);
                navigate('/main');
            } else {
                throw new Error('Signup failed: Invalid response format');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            navigate('/', {
                state: {
                    error: '회원가입에 실패했습니다. 다시 시도해주세요.',
                },
            });
        }
    };

    return (
        <Container>
            <FormWrapper>
                <LogoText>얼마냐면???</LogoText>
                <Title>닉네임을 입력해주세요</Title>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임"
                        required
                        maxLength={10}
                    />
                    <SubmitButton type="submit" disabled={!nickname.trim()}>
                        시작하기
                    </SubmitButton>
                </Form>
            </FormWrapper>
            <FloatingFoodContainer>
                <FloatingFood>🍕</FloatingFood>
                <FloatingFood delay="2s">🍜</FloatingFood>
                <FloatingFood delay="4s">🍣</FloatingFood>
                <FloatingFood delay="1s">🍔</FloatingFood>
                <FloatingFood delay="3s">🍱</FloatingFood>
            </FloatingFoodContainer>
        </Container>
    );
};

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
`;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #ff8c37 0%, #ff6b1a 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
`;

const FormWrapper = styled.div`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    padding: 2rem;
    border-radius: 24px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: ${fadeIn} 0.6s ease-out;
    z-index: 1;
`;

const LogoText = styled.h1`
    color: white;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: bold;
`;

const Title = styled.h2`
    color: white;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Input = styled.input`
    padding: 1rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transition: background-color 0.2s;

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.3);
    }
`;

const SubmitButton = styled.button`
    padding: 1rem;
    border: none;
    border-radius: 12px;
    background-color: white;
    color: #ff6b1a;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    &:not(:disabled):hover {
        transform: translateY(-2px);
    }
`;

const FloatingFoodContainer = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    top: 0;
    left: 0;
    overflow: hidden;
`;

const FloatingFood = styled.div`
    position: absolute;
    font-size: 2rem;
    animation: ${float} 3s ease-in-out infinite;
    animation-delay: ${(props) => props.delay || '0s'};

    &:nth-child(1) {
        top: 20%;
        left: 20%;
    }
    &:nth-child(2) {
        top: 30%;
        right: 20%;
    }
    &:nth-child(3) {
        bottom: 30%;
        left: 30%;
    }
    &:nth-child(4) {
        bottom: 20%;
        right: 30%;
    }
    &:nth-child(5) {
        top: 50%;
        left: 50%;
    }
`;

export default SignupPage;
