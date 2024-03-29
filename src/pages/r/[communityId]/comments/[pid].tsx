import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community, communityState } from '../../../../atoms/communityAtom';
import { Post } from '../../../../atoms/postsAtom';
import About from '../../../../components/Community/About';
import NotFound from '../../../../components/Community/NotFound';
import PageContent from '../../../../components/Layout/PageContent';
import Comments from '../../../../components/Post/Comments/Comments';
import PostItem from '../../../../components/Post/PostItem';
import { auth, firestore } from '../../../../firebase/clientApp';
import useCommunityData from '../../../../hooks/useCommunityData';
import usePosts from '../../../../hooks/usePosts';

const PostPage:React.FC = () => {
  const [user] = useAuthState(auth)
  const { postStateValue, onDeletePost, setPostStateValue, onVote} = usePosts()
  const router = useRouter()
  const { communityStateValue } = useCommunityData()

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, "posts", postId)
      const postDoc = await getDoc(postDocRef)

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post
      }))
    } catch (error: any) {
      console.log("fetchPost error", error.message)
    }
  }

  useEffect(() => {
    const { pid } = router.query
    if(pid && !postStateValue.selectedPost) {
      fetchPost(pid as string)
    }
  },[router.query, postStateValue.selectedPost])

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem 
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        <Comments user={user as User} selectedPost={postStateValue.selectedPost} communityId={postStateValue.selectedPost?.communityId as string} />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  )
}
export default PostPage;