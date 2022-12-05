import React, { useContext, useState } from "react";

// Chakra Layout
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
// chakra Component
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";

// chakra Hooks
import { useDisclosure } from "@chakra-ui/hooks";
// App Components
import ProfileModal from "./ProfileModal";
// React Accs
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatContext } from "../../Context/ChatContext";

import { useNavigate } from "react-router-dom";
import axios from "../../axios.js";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    chats,
    setChats,
    setNotification,
  } = useContext(ChatContext);

  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // logout function handler
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // search users function
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // access/create a chat
  const accessChat = async (userId) => {
    console.log("user id from selected user ", userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      onClose();
      setLoadingChat(false);
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        direction='row'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        fontSize={{ lg: "24px", md: "18px", sm: "12px" }}
        borderWidth='5px'>
        <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
          <Button
            variant='ghost'
            onClick={onOpen}
            fontSize={{ lg: "24px", md: "18px", sm: "12px" }}>
            <i className='fas fa-search'></i>
            <Text dispaly={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        {/* center navbar */}
        <Text
          fontSize={{ lg: "24px", md: "18px", sm: "12px" }}
          fontFamily='Work sans'>
          Talk-A-Tive
        </Text>
        {/* Right hand side navbar */}
        <div>
          <Menu>
            <MenuButton p={1} fontSize={{ lg: "24px", md: "18px", sm: "12px" }}>
              <Box display='flex'>
                <BellIcon m={1} />
                <Text>({notification.length})</Text>
                {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              /> */}
              </Box>
            </MenuButton>
            <MenuList pl={{ md: "2", sm: "0.5" }}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}>
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu fontSize={{ lg: "24px", md: "18px", sm: "12px" }}>
            <MenuButton as={Button} bg='white' rightIcon={<ChevronDownIcon />}>
              <Avatar
                size='sm'
                cursor='pointer'
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            {/* dropdown */}
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <>
                {searchResult &&
                  searchResult.map((user) => (
                    <UserListItem
                      key={user._id}
                      person={user}
                      handleClick={() => accessChat(user._id)}
                    />
                  ))}
              </>
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
