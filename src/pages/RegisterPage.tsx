import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { supabase } from "../supabase";
import { Skill } from "../types/user";

type FormData = {
  user_id: string;
  name: string;
  description: string;
  skill_id: string;
  github_id: string;
  qiita_id: string;
  x_id: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase.from("skills").select("*");
      if (data) setSkills(data);
    };
    fetchSkills();
  }, []);

  const onSubmit = async (data: FormData) => {
    const { error: userError } = await supabase.from("users").insert({
      user_id: data.user_id,
      name: data.name,
      description: data.description,
      github_id: data.github_id || null,
      qiita_id: data.qiita_id || null,
      x_id: data.x_id || null,
    });

    if (userError) {
      console.error("ユーザー登録エラー:", userError);
      return;
    }

    if (data.skill_id) {
      const { error: skillError } = await supabase.from("user_skill").insert({
        user_id: data.user_id,
        skill_id: Number(data.skill_id),
      });

      if (skillError) {
        console.error("スキル登録エラー:", skillError);
      }
    }

    navigate("/");
  };

  return (
    <Box maxW="400px" mx="auto" p={4}>
      <Heading as="h1" size="lg" textAlign="center" mb={6}>
        名刺新規登録
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.user_id}>
            <FormLabel>ID</FormLabel>
            <Input
              {...register("user_id", {
                required: "IDは必須です",
                pattern: {
                  value: /^[a-zA-Z0-9-]+$/,
                  message: "英数字とハイフンのみ使用できます",
                },
              })}
              placeholder="英単語を入力してください"
            />
            <FormErrorMessage>{errors.user_id?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.name}>
            <FormLabel>名前</FormLabel>
            <Input
              {...register("name", {
                required: "名前は必須です",
              })}
              placeholder="名前を入力してください"
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel>自己紹介</FormLabel>
            <Textarea
              {...register("description", {
                required: "自己紹介は必須です",
              })}
              placeholder="自己紹介を入力してください（HTMLも使えます）"
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>好きな技術</FormLabel>
            <Select {...register("skill_id")} placeholder="選択してください">
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>GitHub ID</FormLabel>
            <Input {...register("github_id")} placeholder="GitHub ID" />
          </FormControl>

          <FormControl>
            <FormLabel>Qiita ID</FormLabel>
            <Input {...register("qiita_id")} placeholder="Qiita ID" />
          </FormControl>

          <FormControl>
            <FormLabel>X（Twitter）ID</FormLabel>
            <Input {...register("x_id")} placeholder="X ID" />
          </FormControl>

          <Button type="submit" colorScheme="teal" width="100%">
            登録
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterPage;
