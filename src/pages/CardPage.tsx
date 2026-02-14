import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  VStack,
  HStack,
  Tag,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiQiita } from "react-icons/si";
import DOMPurify from "dompurify";
import { supabase } from "../supabase";
import { User, Skill, createUser } from "../types/user";

const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", id)
        .single();

      if (!userData) return;

      const { data: userSkills } = await supabase
        .from("user_skill")
        .select("skill_id")
        .eq("user_id", id);

      let skills: Skill[] = [];
      if (userSkills && userSkills.length > 0) {
        const skillIds = userSkills.map((us) => us.skill_id);
        const { data: skillsData } = await supabase
          .from("skills")
          .select("*")
          .in("id", skillIds);
        skills = skillsData || [];
      }

      const user = createUser(userData, skills);
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  if (loading || !user) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box maxW="400px" mx="auto" p={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg" textAlign="center">
          {user.name}
        </Heading>

        <Box
          p={4}
          borderWidth="1px"
          borderRadius="md"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(user.description),
          }}
        />

        {user.skills.length > 0 && (
          <HStack spacing={2} flexWrap="wrap">
            {user.skills.map((skill) => (
              <Tag key={skill.id} colorScheme="teal" size="lg">
                {skill.name}
              </Tag>
            ))}
          </HStack>
        )}

        <HStack spacing={4} justify="center">
          {user.githubUrl && (
            <IconButton
              as="a"
              href={user.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              icon={<FaGithub />}
              size="lg"
              variant="ghost"
            />
          )}
          {user.qiitaUrl && (
            <IconButton
              as="a"
              href={user.qiitaUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Qiita"
              icon={<SiQiita />}
              size="lg"
              variant="ghost"
            />
          )}
          {user.xUrl && (
            <IconButton
              as="a"
              href={user.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              icon={<FaXTwitter />}
              size="lg"
              variant="ghost"
            />
          )}
        </HStack>

        <Button onClick={() => navigate("/")} colorScheme="teal" variant="outline">
          戻る
        </Button>
      </VStack>
    </Box>
  );
};

export default CardPage;
