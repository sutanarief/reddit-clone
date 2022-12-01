import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { auth } from "../../../firebase/clientApp"
import { FIREBASE_ERROR } from "../../../firebase/firebaseError"

type LoginProps = {
  
};

const Login:React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })

  const [
  signInWithEmailAndPassword,
  user,
  loading,
  error,
] = useSignInWithEmailAndPassword(auth);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { email, password } = loginForm
    signInWithEmailAndPassword(email, password)
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
      <Text textAlign="center" color="red" fontSize="10pt">{FIREBASE_ERROR[error?.message as keyof typeof FIREBASE_ERROR]}</Text>
      <Button
        type="submit"
        width="100%"
        height="36px"
        mt={2}
        mb={2}
      >
        Log In
      </Button>
      <Flex fontSize="9pt" justifyContent="center" mb={2}>
        <Text mr={1}>Forgot your password ?</Text>
        <Text
          color="blue.500" 
          fontSize="9pt" 
          cursor="pointer"
          onClick={() => 
            setAuthModalState((prev) => ({
              ...prev,
              view: "resetPassword"
            }))
          }
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New Here ?</Text>
        <Text
          color="blue.500" 
          fontWeight={700} 
          cursor="pointer"
          onClick={() => 
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup"
            }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  )
}
export default Login;