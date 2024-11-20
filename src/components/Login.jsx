import React, { useState } from "react";
import styled from "styled-components";
import { db, auth } from "../firebase"; // import Firebase Authentication and Firestore
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"; // Firestore functions
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase sign-in function
import { useNavigate } from "react-router-dom"; // Navigation

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in the user with the new password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // After login, update the Firestore document with the new password
      const usersCollection = collection(db, "Users");
      const q = query(usersCollection, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, "Users", userDoc.id);

        // Update the password field in Firestore with the new password
        await updateDoc(userRef, {
          password: password, // Use the new password entered in the login form
        });
      }

      alert("Login Successful! Password updated in Firestore.");
      navigate("/dashboard"); // Navigate to the next page after successful login

    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid Email or Password! Please try again.");
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
        <TextLink>
          Forgot your password?{" "}
          <a href="/forgot-password">Reset Password</a>
        </TextLink>
        <TextLink>
          Don't have an account? <a href="/signup">Sign Up</a>
        </TextLink>
      </Form>
    </FormContainer>
  );
};

export default Login;
