import { Button, Flex, Image, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { auth, firestore } from "../../../firebase/clientApp"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

type OAuthButtonProps = {
  
};

const OAuthButton:React.FC<OAuthButtonProps> = () => {
  const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth)

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid)
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
  }

  useEffect(() => {
    if(userCred) {
      createUserDocument(userCred.user)
    }
  }, [userCred])


  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image src="/images/googlelogo.png" height="20px" mr={2}/>
        Continue with Google
      </Button>
      <Button variant={"oauth"}>Others</Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  )
}
export default OAuthButton;