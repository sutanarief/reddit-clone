import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';
import { Community, CommunitySnippet, communityState } from '../atoms/communityAtom';
import { auth, firestore } from '../firebase/clientApp';


const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)
  const [user] = useAuthState(auth)
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
    if(!user) {
      setAuthModalState({ open: true, view: "login"})
      return
    }

    if(isJoined) {
      leaveCommunity(communityData.id)
      return
    }
    joinCommunity(communityData)
  }

  const getUserSnippets = async () => {
    setLoading(true)
    try {
      const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`))

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }))

      setCommunityStateValue(prev => ({
        ...prev,
        userSnippets: snippets as CommunitySnippet[],
        snippetsFetched: true
      }))
    } catch (error) {
      console.log('getUserSnippets error', error)
    }
    setLoading(false)
  }

  const joinCommunity = async (communityData: Community) => {
    // batch write
      // create a new communitySnippets
      // updating the numberOfMembers in a community
      setLoading(true)
      try {
        const batch = writeBatch(firestore)

        const newSnippet: CommunitySnippet = {
          communityId: communityData.id,
          imageURL: communityData.imageURL || "",
          isModerator: communityData.creatorId === user?.uid
        }

        batch.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id), newSnippet)
        batch.update(doc(firestore, 'communities', communityData.id), {
          numberOfMembers: increment(1)
        })
        await batch.commit()

        // updateing recoil state
        setCommunityStateValue((prev) => ({
          ...prev,
          userSnippets: [...prev.userSnippets, newSnippet]
        }))

      } catch (error: any) {
        console.log("joinCommunity error", error)
        setError(error.message)
      }
      setLoading(false)
  }

  const leaveCommunity = async (communityId: string) => {
    // batch write
    try {
      const batch = writeBatch(firestore)
      
      // delete the communitySnippets from user
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      )

      // updating the numberOfMembers (-1)
      batch.update(
        doc(firestore, "communities", communityId), {
          numberOfMembers: increment(-1)
        }
        )
        
        await batch.commit()
        
      // updating recoil state
      setCommunityStateValue((prev) => ({
        ...prev,
        userSnippets: prev.userSnippets.filter((item) => item.communityId !== communityId)
      }))

      setLoading(false)
    } catch (error: any) {
      console.log("leaveCommunity error", error)
      setError(error.message)
    }

  }

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId)
      const communityDoc = await getDoc(communityDocRef)

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: { id: communityDoc.id, ...communityDoc.data() } as Community
      }))


    } catch (error: any) {
      console.log("getCommunityData error", error.message)
    }
  }

  useEffect(() => {
    const { communityId } = router.query
    
    if(communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string)
    }
  },[router.query, communityStateValue.currentCommunity])

  useEffect(() => {
    if(!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        userSnippets: [],
        snippetsFetched: false
      }))
      return
    }
    getUserSnippets()
  },[user])

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading
  }
}
export default useCommunityData;