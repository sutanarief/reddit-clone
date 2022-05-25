import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';

type LoginProps = {
  
};

const Login:React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: [e.target.value]
    }))
  }

  const onSubmit = () => {

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
      <Button
        type="submit"
        width="100%"
        height="36px"
        mt={2}
        mb={2}
      >
        Log In
      </Button>
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