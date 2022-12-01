import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from "react-firebase-hooks/auth"
import { auth } from "../../../firebase/clientApp"
import { FIREBASE_ERROR } from "../../../firebase/firebaseError"

type SignupProps = {
  
};

const Signup:React.FC<SignupProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: ""
  })
  const [error, setError] = useState("")
  const [updateProfile, updating, errorProfile] = useUpdateProfile(auth);
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    userError,
  ] = useCreateUserWithEmailAndPassword(auth);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { password, confirmPassword, username } = signupForm
    console.log(password, confirmPassword)
    if(password !== confirmPassword) {
      setError("Password do not match")
      return
    }
    await createUserWithEmailAndPassword(signupForm.email, signupForm.password)
    await updateProfile({displayName: username, photoURL: "" })
  }
  
  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="Email"
        type="email"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500"}}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500"
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500"
        }}
        bg="gray.50"
      />
      <Input
        required
        name="username"
        placeholder="Username"
        type="text"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500"}}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500"
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500"
        }}
        bg="gray.50"
      />
      <Input
        required
        name="password"
        placeholder="Password"
        type="password"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500"}}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500"
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500"
        }}
        bg="gray.50"
      />
      <Input
        required
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500"}}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500"
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500"
        }}
        bg="gray.50"
      />
      <Text textAlign="center" color="red" fontSize="10pt">{error || FIREBASE_ERROR[userError?.message as keyof typeof FIREBASE_ERROR]}</Text>
      <Button
        type="submit"
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already a redditor ?</Text>
        <Text
          color="blue.500" 
          fontWeight={700} 
          cursor="pointer"
          onClick={() => 
            setAuthModalState((prev) => ({
              ...prev,
              view: "login"
            }))
          }
        >
        LOGIN
        </Text>
      </Flex>
    </form>
  )
}
export default Signup;