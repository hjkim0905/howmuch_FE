import React from 'react';
import styled from 'styled-components';
import LoginButton from '../components/LoginButton';
import FloatingFood from '../components/FloatingFood';

const OnboardingPage = () => {
    return (
        <Container>
            <ContentWrapper>
                <SafeZone>
                    <LogoPlaceholder>
                        {/* 로고 이미지를 넣을 자리 */}
                        <LogoText>얼마냐면???</LogoText>
                    </LogoPlaceholder>

                    <WelcomeText>
                        내 주변 맛집
                        <br />
                        가격부터 확인하자!
                    </WelcomeText>

                    <SubText>합리적인 가격의 맛집을 찾고 계신가요?</SubText>

                    <LoginButton />
                </SafeZone>

                <FloatingFoodContainer>
                    {/* 상단 */}
                    <FloatingFood emoji="🍕" delay="0s" size="3.5rem" position="top" index={0} />
                    <FloatingFood emoji="🍜" delay="2s" size="3rem" position="top" index={1} />
                    <FloatingFood emoji="🍣" delay="4s" size="3.2rem" position="top" index={2} />

                    {/* 하단 */}
                    <FloatingFood emoji="🍔" delay="1s" size="3.8rem" position="bottom" index={0} />
                    <FloatingFood emoji="🍱" delay="3s" size="3.4rem" position="bottom" index={1} />
                    <FloatingFood emoji="🌮" delay="5s" size="3.2rem" position="bottom" index={2} />

                    {/* 좌측 */}
                    <FloatingFood emoji="🥪" delay="0.5s" size="3rem" position="left" index={0} />
                    <FloatingFood emoji="🍦" delay="2.5s" size="2.8rem" position="left" index={1} />
                    <FloatingFood emoji="🥨" delay="4.5s" size="2.7rem" position="left" index={2} />

                    {/* 우측 */}
                    <FloatingFood emoji="🍙" delay="1.5s" size="2.9rem" position="right" index={0} />
                    <FloatingFood emoji="🥗" delay="3.5s" size="3.1rem" position="right" index={1} />
                    <FloatingFood emoji="🍤" delay="5.5s" size="3rem" position="right" index={2} />
                </FloatingFoodContainer>
            </ContentWrapper>
        </Container>
    );
};

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #ff8c37 0%, #ff6b1a 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 500px;
    padding: 0 20px;
    position: relative;
    z-index: 1;
`;

const SafeZone = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    padding: 2rem;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    width: 100%;
    position: relative;
    z-index: 2;
`;

const LogoPlaceholder = styled.div`
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
`;

const LogoText = styled.span`
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
`;

const FloatingFoodContainer = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
    top: 0;
    left: 0;
`;

const WelcomeText = styled.h1`
    color: white;
    font-size: 2.5rem;
    text-align: center;
    line-height: 1.5;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    font-weight: bold;
`;

const SubText = styled.p`
    color: white;
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 2rem;
    opacity: 0.9;
`;

export default OnboardingPage;
