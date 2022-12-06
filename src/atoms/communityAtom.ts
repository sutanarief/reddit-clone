import { Timestamp } from "firebase/firestore"
import { atom } from "recoil"

export interface Community {
  id: string,
  creatorId: string,
  numberOfMembers: number,
  privacyType: 'public' | 'restricted' | 'private',
  createdAt?: Timestamp,
  imageUrl?: string
}

export interface CommunitySnippet {
  communityId: string,
  isModerator?: boolean,
  imageUrl?: string
}

interface CommunityState {
  userSnippets: CommunitySnippet[],
  // visitedCommunities
}

const defaultCommunityState: CommunityState = {
  userSnippets: []
}

export const communityState = atom<CommunityState>({
  key: "communitiesState",
  default: defaultCommunityState
})