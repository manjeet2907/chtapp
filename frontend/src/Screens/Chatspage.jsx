import React, { useContext, useState } from "react";
// Chakra Layout
// chakra Component
import { Box } from "@chakra-ui/react";
// chakra Hooks
// App Components
import Chatbox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
// React Accs
import { ChatContext } from "../Context/ChatContext";

const Chatspage = () => {
  const { user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatspage;
