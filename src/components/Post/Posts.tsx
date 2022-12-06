import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Community } from '../../atoms/communityAtom';
import { Post } from '../../atoms/postsAtom';
import { auth, firestore } from '../../firebase/clientApp';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';

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
  }, [])

  return (
    <Stack>
      {postStateValue.posts.map((item) => (
        <PostItem 
          post={item}
          userIsCreator={user?.uid === item.creatorId}
          userVoteValue={undefined}
          onVote={onVote}
          onSelectPost={onSelectPost}
          onDeletePost={onDeletePost}
        />
      ))}
    </Stack>
  )
}
export default Post;