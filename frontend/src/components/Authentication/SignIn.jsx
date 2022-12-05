import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import axios from "../../axios.js";
import { useNavigate } from "react-router-dom";

// default formFields
const defaultFormFields = {
  email: "",
  password: "",
};

const guestCredentials = {
  email: "guest@example.com",
  password: "123456",
};

const SignIn = () => {
  // to enable the show password option
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  //   hooks to components
  const toast = useToast();
  const navigate = useNavigate();

  //   states to manage
  const [formField, setFormField] = useState(defaultFormFields);
  const { email, password } = formField;
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormField({ ...formField, [name]: value });
  };

  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("chats");
    } catch (error) {
      toast({
        title: "Error Occured here! ",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing='10px'>
      <FormControl id='email' isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          name='email'
          value={email}
          type='email'
          placeholder='Enter Your Email Address'
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            name='password'
            value={password}
            onChange={handleChange}
            type={show ? "text" : "password"}
            placeholder='Enter password'
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}>
        Login
      </Button>
      <Button
        variant='solid'
        colorScheme='red'
        width='100%'
        onClick={() => {
          setFormField(guestCredentials);
        }}>
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default SignIn;
