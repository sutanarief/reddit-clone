import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communityAtom';
import About from '../../../components/Community/About';
import PageContent from '../../../components/Layout/PageContent';
import NewPostForm from '../../../components/Post/NewPostForm';
import { auth } from '../../../firebase/clientApp';
import useCommunityData from '../../../hooks/useCommunityData';
import Head from 'next/head'


const SubmitPostPage:React.FC = () => {
  const [user] = useAuthState(auth)
  // const communityStateValue = useRecoilValue(communityState)
  const { communityStateValue } = useCommunityData()
  console.log(communityStateValue)
  return (
    <>
      <Head>
        <title>r/{communityStateValue.currentCommunity?.id}/submit</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PageContent>
        <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white" >
            <Text>Create a Post</Text>
          </Box>
          {user && <NewPostForm user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL} />}
        </>
        <>
          {communityStateValue.currentCommunity && (
            <About communityData={communityStateValue.currentCommunity} />
          )}
        </>
      </PageContent>
    </>
  )
}
export default SubmitPostPage;