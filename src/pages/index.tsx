import { Stack } from '@chakra-ui/react'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { communityState } from '../atoms/communityAtom'
import { Post, PostVote } from '../atoms/postsAtom'
import CreatePostLink from '../components/Community/CreatePostLink'
import PersonalHome from '../components/Community/PersonalHome'
import Premium from '../components/Community/Premium'
import Recommendation from '../components/Community/Recommendation'
import PageContent from '../components/Layout/PageContent'
import PostItem from '../components/Post/PostItem'
import PostLoader from '../components/Post/PostLoader'
import { auth, firestore } from '../firebase/clientApp'
import useCommunityData from '../hooks/useCommunityData'
import usePosts from '../hooks/usePosts'

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { postStateValue, setPostStateValue, onSelectPost, onDeletePost, onVote } = usePosts()
  const { communityStateValue } = useCommunityData()

  const buildUserHomeFeed = async () => {
    setLoading(true)
    try {
      if(communityStateValue.userSnippets.length) {
        const userCommunityIds = communityStateValue.userSnippets.map(
          (snippet) => snippet.communityId
        )

        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", userCommunityIds),
          limit(10)
        )
        
        const postDocs = await getDocs(postQuery)
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setPostStateValue(prev => ({
          ...prev,
          posts: posts as Post[]
        }))
      } else {
        buildNoUserHomeFeed()
      }
    } catch (error: any) {
      console.log("buildUserHomeFeed error", error.message)
    }
    setLoading(false)
  }

  const buildNoUserHomeFeed = async () => {
    setLoading(true)
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      )

      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[]
      }))
    } catch (error:any) {
      console.log("buildNoUserHomeFeed error", error.message)
    }
    setLoading(false)
  }

  const getUserPostVotes = async () => {

    try {
      const postIds = postStateValue.posts.map(post => post.id)
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', "in", postIds)
      )

      const postVoteDocs = await getDocs(postVotesQuery)
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      console.log(postVotes, 'ini post votetete')
      setPostStateValue(prev => ({
        ...prev,
        postVotes: postVotes as PostVote[]
      }))
    } catch (error: any) {
      console.log("getUserPostVotes error", error.message)
    }
  }
  

  useEffect(() => {
    if(!user && !loadingUser) buildNoUserHomeFeed()
  }, [user, loadingUser])

  useEffect(() => {
    if(communityStateValue.snippetsFetched) buildUserHomeFeed()
  }, [communityStateValue.snippetsFetched])

  useEffect(() => {
    if(user && postStateValue.posts.length) getUserPostVotes()

    return () => {
      setPostStateValue(prev => ({
        ...prev,
        postVotes: []
      }))
    }
  },[user, postStateValue.posts])

  return (
    <PageContent>
      <>
        <CreatePostLink/>
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map(post => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={postStateValue.postVotes.find(
                  item => item.postId === post.id
                )?.voteValue}
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <Stack spacing={5}>
        <Recommendation/>
        <Premium />
        <PersonalHome />
      </Stack>
    </PageContent>
  )
}

export default Home
