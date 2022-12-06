import { Alert, AlertDescription, AlertIcon, AlertTitle, CloseButton, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { BiPoll } from 'react-icons/bi'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Post } from '../../atoms/postsAtom';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

type NewPostFormProps = {
  user: User
};

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Image & Video",
    icon: IoImageOutline
  },
  {
    title: "Link",
    icon: BsLink45Deg
  },
  {
    title: "Poll",
    icon: BiPoll
  },
  {
    title: "Talk",
    icon: BsMic
  }
]

export type TabItem = {
  title: string,
  icon: typeof Icon.arguments
}

const NewPostForm:React.FC<NewPostFormProps> = ({ user }) => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
  const [textInputs, setTextInputs] = useState({ title: "", body: ""})
  const [selectedFile, setSelectedFIle] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleCreatePost = async () => {
    const { communityId } = router.query

    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.displayName || user.email!.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp
    }

    setLoading(true)
    try {
      // store the post in db
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost)

      // check for selectedFile
      if(selectedFile) {
        // store in storage => getDownloadURL (return imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
        await uploadString(imageRef, selectedFile, "data_url")
        const downloadUrl = await getDownloadURL(imageRef)

        // update post doc by adding imageUrl 
        await updateDoc(postDocRef, {
          imageUrl: downloadUrl
        })
      }
    } catch (error: any) {
      console.log("handleCreatePost error", error.message)
      setError(true)
    }
    setLoading(false)
  }

  const onSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    
    if(e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0])
    } 

    reader.onload = (readerEvent) => {
      if(readerEvent.target?.result) {
        setSelectedFIle(readerEvent.target.result as string )
      }
    }
  }

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target: { name, value }} = e

    setTextInputs((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <>
            <TabItem item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab} />
          </>
        ))}
      </Flex>
        <Flex p={4}>
          {selectedTab === "Post" && (
            <TextInputs 
              textInputs={textInputs}
              handleCreatePost={handleCreatePost}
              onChange={onTextChange}
              loading={loading}
            />
          )}
          {selectedTab === "Image & Video" && (
            <ImageUpload
              selectedFile={selectedFile}
              onSelectImage={onSelectImage}
              setSelectedTab={setSelectedTab}
              setSelectedFile={setSelectedFIle}
            />
          )}
        </Flex>
        {error && (
          <Alert status="error">
            <AlertIcon/>
            <Text mr={2}>Error creating post.</Text>
          </Alert>
        )}
    </Flex>
  )
}
export default NewPostForm;