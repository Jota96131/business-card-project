export type Skill = {
  id: number;
  name: string;
};

export type User = {
  user_id: string;
  name: string;
  description: string;
  github_id: string | null;
  qiita_id: string | null;
  x_id: string | null;
  skills: Skill[];
  githubUrl: string | null;
  qiitaUrl: string | null;
  xUrl: string | null;
};

export const createUser = (
  userData: {
    user_id: string;
    name: string;
    description: string;
    github_id: string | null;
    qiita_id: string | null;
    x_id: string | null;
  },
  skills: Skill[]
): User => {
  return {
    ...userData,
    skills,
    githubUrl: userData.github_id
      ? `https://github.com/${userData.github_id}`
      : null,
    qiitaUrl: userData.qiita_id
      ? `https://qiita.com/${userData.qiita_id}`
      : null,
    xUrl: userData.x_id ? `https://x.com/${userData.x_id}` : null,
  };
};
