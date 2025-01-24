import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingSpinner = () => {
    return (
        <Container>
            <SpinnerWrapper>
                <Spinner />
            </SpinnerWrapper>
            <LoadingText>
                <MainText>맛있는 메뉴를 찾고 있습니다</MainText>
                <SubText>최대 2분이 소요될 수 있습니다</SubText>
            </LoadingText>
            <FloatingEmojis>
                <FloatingEmoji delay="0s">🍜</FloatingEmoji>
                <FloatingEmoji delay="0.5s">🍕</FloatingEmoji>
                <FloatingEmoji delay="1s">🍔</FloatingEmoji>
                <FloatingEmoji delay="1.5s">🍱</FloatingEmoji>
            </FloatingEmojis>
        </Container>
    );
};

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: 1000;
    animation: ${fadeIn} 0.3s ease-out;
`;

const SpinnerWrapper = styled.div`
    width: 80px;
    height: 80px;
    margin-bottom: 2rem;
    padding: 1rem;
    border-radius: 50%;
`;

const Spinner = styled.div`
    width: 100%;
    height: 100%;
    border: 8px solid #ffe5d6;
    border-top: 8px solid #ff6b1a;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
    text-align: center;
    animation: ${fadeIn} 0.3s ease-out 0.3s both;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem 2rem;
    border-radius: 12px;
    backdrop-filter: blur(5px);
`;

const MainText = styled.div`
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
`;

const SubText = styled.div`
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
`;

const FloatingEmojis = styled.div`
    position: absolute;
    width: 200px;
    height: 200px;
`;

const FloatingEmoji = styled.div`
    position: absolute;
    font-size: 2rem;
    animation: ${float} 2s ease-in-out infinite;
    animation-delay: ${(props) => props.delay};
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));

    &:nth-child(1) {
        top: -50px;
        left: -50px;
    }
    &:nth-child(2) {
        top: -50px;
        right: -50px;
    }
    &:nth-child(3) {
        bottom: -50px;
        left: -50px;
    }
    &:nth-child(4) {
        bottom: -50px;
        right: -50px;
    }
`;

export default LoadingSpinner;
