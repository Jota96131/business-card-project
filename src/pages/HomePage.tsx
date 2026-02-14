import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Link,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!userId.trim()) {
      setError("IDを入力してください");
      return;
    }
    setError("");
    navigate(`/cards/${userId}`);
  };

  return (
    <Box maxW="400px" mx="auto" p={4}>
      <VStack spacing={6}>
        <Heading as="h1" size="lg" textAlign="center">
          デジタル名刺
        </Heading>

        <FormControl isInvalid={!!error}>
          <Input
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setError("");
            }}
            placeholder="IDを入力してください"
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>

        <Button onClick={handleSubmit} colorScheme="teal" width="100%">
          名刺をみる
        </Button>

        <Link as={RouterLink} to="/cards/register" color="teal.500">
          新規登録はこちら
        </Link>
      </VStack>
    </Box>
  );
};

export default HomePage;
