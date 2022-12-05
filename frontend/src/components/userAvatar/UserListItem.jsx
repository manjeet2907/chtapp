import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import React from "react";

const UserListItem = ({ person, handleClick }) => {
  return (
    <Box
      onClick={handleClick}
      cursor='pointer'
      bg='#E8E8E8'
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w='100%'
      display='flex'
      alignItems='center'
      color='black'
      px={3}
      py={2}
      mb={2}
      borderRadius='lg'>
      <Avatar
        mr={2}
        size='sm'
        cursor='pointer'
        name={person.name}
        src={person.pic}
      />
      <Box>
        <Text>{person.name}</Text>
        <Text fontSize='xs'>
          <b>Email : </b>
          {person.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
