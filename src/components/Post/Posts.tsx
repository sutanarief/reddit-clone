import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community } from '../../atoms/communityAtom';
import { Post, postState } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostProps = {
  communityData: Community
};

const Post:React.FC<PostProps> = ({ communityData }) => {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { 
    postStateValue, 
    setPostStateValue,
    onDeletePost,
    onVote,
    onSelectPost
  } = usePosts()


  const getPosts = async () => {
    setLoading(true)
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      )

      const postDocs = await getDocs(postsQuery)
      const posts = postDocs.docs.map((val) => ({ id: val.id, ...val.data() }))

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[]
      }))
      console.log(posts)
    } catch (error: any) {
      console.log("getPosts error", error.message)
    }
    setLoading(false)
  }


  useEffect(() => {
    getPosts()
  }, [communityData])

  return (
    <>
      { loading ? (
      <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((item) => (
            <PostItem 
              key={item.id}
              post={item}
              userIsCreator={user?.uid === item.creatorId}
              userVoteValue={
                postStateValue.postVotes.find((vote) => vote.postId === item.id)?.voteValue
              }
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
        )
      }
    </>
  )
}
export default Post;