import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db, auth } from "../firebase"; // Firebase configuration
import { setDoc, doc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
`;

const Form = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #6e8efb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #a777e3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const VerifiedMessage = styled.p`
  color: green;
  font-size: 14px;
  margin: 5px 0;
`;

const TextLink = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: #555;

  a {
    color: #6e8efb;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    // Listen for auth state changes to check if the email is verified
    onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsEmailVerified(true);
      }
    });
  }, []);

  const handleSendVerificationEmail = async () => {
    if (!email) {
      alert("Please enter an email address.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, "temporary_password");
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      alert("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Error: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) {
      alert("Please verify your email before signing up.");
      return;
    }

    try {
      // Add user data to Firestore
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "Users", name); // Use name as the document ID
      await setDoc(userRef, {
        uid: user.uid,
        name,
        email,
      });

      alert("Sign Up Successful! You can now login.");
    } catch (error) {
      console.error("Error signing up:", error);

      // Show detailed error message
      if (error.code === "auth/email-already-in-use") {
        alert("The email address is already in use. Please use a different email.");
      } else if (error.code === "auth/invalid-email") {
        alert("The email address is invalid. Please check the email format.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters long.");
      } else {
        alert("Sign Up Failed! " + error.message);
      }
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="button" onClick={handleSendVerificationEmail} disabled={isEmailVerified}>
            {isEmailVerified ? "Verified" : "Verify"}
          </Button>
        </div>
        {isEmailVerified && <VerifiedMessage>Email is verified!</VerifiedMessage>}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isEmailVerified}
        />
        <Button type="submit" disabled={!isEmailVerified}>
          Sign Up
        </Button>
        <TextLink>
          Already have an account? <a href="/login">Login</a>
        </TextLink>
      </Form>
    </FormContainer>
  );
};

export default SignUp;
