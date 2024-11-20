import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// Keyframes for animations
const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  50% { border-color: transparent; }
`;

// Styled components
const SplashContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #4a00e0, #8e2de2);
  color: white;
  font-family: "Poppins", sans-serif;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #ff9a9e, #fad0c4, #fbc2eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Subline = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  color: #f0f0f0;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid white;
  width: 0;
  margin-top: 1rem;
  animation: 
    ${typewriter} 3s steps(40, end) 1 forwards,
    ${blink} 0.5s step-end infinite;
`;

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showSubline, setShowSubline] = useState(false);

  useEffect(() => {
    // Show subline after 1 second
    const sublineTimer = setTimeout(() => {
      setShowSubline(true);
    }, 1000);

    // Redirect to login page after 4 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 4000);

    return () => {
      clearTimeout(sublineTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <SplashContainer>
      <Title>Welcome to QUIZIO</Title>
      {showSubline && (
        <Subline>
          A free online platform for creating, taking, and managing quizzes and tests.
        </Subline>
      )}
    </SplashContainer>
  );
};

export default SplashScreen;
