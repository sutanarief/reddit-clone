import { collection, doc, getDocs, increment, writeBatch } from 'firebase/firestore';
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
        userSnippets: snippets as CommunitySnippet[]
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
          imageUrl: communityData.imageUrl || ""
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
        userSnippets: prev.userSnippets.filter((item) => item.communityId !== communityId)
      }))

      setLoading(false)
    } catch (error: any) {
      console.log("leaveCommunity error", error)
      setError(error.message)
    }

  }

  useEffect(() => {
    if(!user) return
    getUserSnippets()
  },[user])

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading
  }
}
export default useCommunityData;