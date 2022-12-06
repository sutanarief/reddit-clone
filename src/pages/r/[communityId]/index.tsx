import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { Community } from '../../../atoms/communityAtom';
import { firestore } from '../../../firebase/clientApp';
import safeJsonStringify from 'safe-json-stringify'
import NotFound from '../../../components/Community/NotFound'
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent';
import CreatePostLink from '../../../components/Community/CreatePostLink';
import Post from '../../../components/Post/Posts';

type CommunityPageProps = {
  communityData: Community
};

const CommunityPage:React.FC<CommunityPageProps> = ({ communityData }) => {
  if(!communityData) {
    return  <NotFound />
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Post communityData={communityData}/>
        </>
        <>
          <div>RHS</div>
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