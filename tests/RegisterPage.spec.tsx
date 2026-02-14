import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockInsert = jest.fn().mockResolvedValue({ error: null });

jest.mock("../src/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "skills") {
        return {
          select: () =>
            Promise.resolve({
              data: [
                { id: 1, name: "React" },
                { id: 2, name: "TypeScript" },
                { id: 3, name: "Github" },
              ],
            }),
        };
      }
      return {
        insert: mockInsert,
      };
    },
  },
}));

import RegisterPage from "../src/pages/RegisterPage";
import { BrowserRouter } from "react-router-dom";

describe("RegisterPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockInsert.mockClear();
    mockInsert.mockResolvedValue({ error: null });
  });

  it("タイトルが表示されている", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
    expect(screen.getByText("名刺新規登録")).toBeInTheDocument();
  });

  it("全項目入力して登録ボタンを押すと/に遷移する", async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByPlaceholderText("英単語を入力してください"), "test-user");
    await userEvent.type(screen.getByPlaceholderText("名前を入力してください"), "テストユーザー");
    await userEvent.type(
      screen.getByPlaceholderText("自己紹介を入力してください（HTMLも使えます）"),
      "自己紹介です"
    );
    await userEvent.type(screen.getByPlaceholderText("GitHub ID"), "my-github");
    await userEvent.type(screen.getByPlaceholderText("Qiita ID"), "my-qiita");
    await userEvent.type(screen.getByPlaceholderText("X ID"), "my-x");

    await userEvent.click(screen.getByText("登録"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("IDがないときにエラーメッセージがでる", async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByPlaceholderText("名前を入力してください"), "テスト");
    await userEvent.type(
      screen.getByPlaceholderText("自己紹介を入力してください（HTMLも使えます）"),
      "紹介"
    );

    await userEvent.click(screen.getByText("登録"));

    expect(await screen.findByText("IDは必須です")).toBeInTheDocument();
  });

  it("名前がないときにエラーメッセージがでる", async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByPlaceholderText("英単語を入力してください"), "test-id");
    await userEvent.type(
      screen.getByPlaceholderText("自己紹介を入力してください（HTMLも使えます）"),
      "紹介"
    );

    await userEvent.click(screen.getByText("登録"));

    expect(await screen.findByText("名前は必須です")).toBeInTheDocument();
  });

  it("紹介文がないときにエラーメッセージがでる", async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByPlaceholderText("英単語を入力してください"), "test-id");
    await userEvent.type(screen.getByPlaceholderText("名前を入力してください"), "テスト");

    await userEvent.click(screen.getByText("登録"));

    expect(await screen.findByText("自己紹介は必須です")).toBeInTheDocument();
  });

  it("オプションを入力しなくても登録ができる", async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByPlaceholderText("英単語を入力してください"), "test-id");
    await userEvent.type(screen.getByPlaceholderText("名前を入力してください"), "テスト");
    await userEvent.type(
      screen.getByPlaceholderText("自己紹介を入力してください（HTMLも使えます）"),
      "紹介文です"
    );

    await userEvent.click(screen.getByText("登録"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
