import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { Community, communityState } from '../../../atoms/communityAtom';
import { firestore } from '../../../firebase/clientApp';
import safeJsonStringify from 'safe-json-stringify'
import NotFound from '../../../components/Community/NotFound'
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent';
import CreatePostLink from '../../../components/Community/CreatePostLink';
import Post from '../../../components/Post/Posts';
import { useSetRecoilState } from 'recoil';
import About from '../../../components/Community/About';
import Head from 'next/head'

type CommunityPageProps = {
  communityData: Community
};

const CommunityPage:React.FC<CommunityPageProps> = ({ communityData }) => {
  const setCommunityStateValue = useSetRecoilState(communityState)

  useEffect(() => {
    setCommunityStateValue(prev => ({
      ...prev,
      currentCommunity: communityData
    }))
  }, [communityData])

  if(!communityData) {
    return  <NotFound />
  }
  
  return (
    <>
      <Head>
        <title>r/{communityData.id}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Post communityData={communityData}/>
        </>
        <>
          <About communityData={communityData}/>
        </>
      </PageContent>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(firestore, "communities", context.query.communityId as string)
    const communityDoc = await getDoc(communityDocRef)

    return {
      props: {
        communityData: communityDoc.exists() ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })) : ""
      }
    }
  } catch (error) {
    console.log("getServerSideProps error", error)
  }
}
export default CommunityPage;