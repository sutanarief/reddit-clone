import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Flex,
  Icon,
  MenuDivider
} from "@chakra-ui/react"
import { signOut, User } from "firebase/auth"
import { FaRedditSquare } from "react-icons/fa"
import { VscAccount } from "react-icons/vsc"
import { IoSparkles } from "react-icons/io5";
import { CgProfile } from "react-icons/cg"
import { MdOutlineLogin } from "react-icons/md"
import { auth } from "../../../firebase/clientApp";
import React from "react"
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";


type UserMenuProps = {
  user?: User | null
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const setAuthModalState = useSetRecoilState(authModalState)
  return (
    <Menu>
      <MenuButton>
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon 
                  fontSize={24}
                  mr={1}
                  color="gray.300"
                  as={FaRedditSquare}
                />
              </>
            ) : (
              <Icon fontSize={24} color="gray.400" mr={1} as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem 
              fontSize="10pt" 
              fontWeight={700}
              _hover={{bg: "blue.500", color: "white"}}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={CgProfile} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem 
              fontSize="10pt" 
              fontWeight={700}
              _hover={{bg: "blue.500", color: "white"}}
              onClick={() => signOut(auth)}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Logout
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem 
              fontSize="10pt" 
              fontWeight={700}
              _hover={{bg: "blue.500", color: "white"}}
              onClick={() => setAuthModalState({ open: true, view: "login" })}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  )
}

export default UserMenu