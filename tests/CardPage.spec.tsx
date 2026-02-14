import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "sample-id" }),
  useNavigate: () => mockNavigate,
}));

jest.mock("dompurify", () => ({
  __esModule: true,
  default: {
    sanitize: (html: string) => html,
  },
}));

jest.mock("../src/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "users") {
        return {
          select: () => ({
            eq: () => ({
              single: () =>
                Promise.resolve({
                  data: {
                    user_id: "sample-id",
                    name: "テスト太郎",
                    description: "<h1>テスト太郎の自己紹介</h1>",
                    github_id: "test-github",
                    qiita_id: "test-qiita",
                    x_id: "test-x",
                  },
                }),
            }),
          }),
        };
      }
      if (table === "user_skill") {
        return {
          select: () => ({
            eq: () =>
              Promise.resolve({
                data: [{ skill_id: 1 }],
              }),
          }),
        };
      }
      if (table === "skills") {
        return {
          select: () => ({
            in: () =>
              Promise.resolve({
                data: [{ id: 1, name: "React" }],
              }),
          }),
        };
      }
      return {};
    },
  },
}));

import CardPage from "../src/pages/CardPage";
import { BrowserRouter } from "react-router-dom";

describe("CardPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("名前が表示されている", async () => {
    render(
      <BrowserRouter>
        <CardPage />
      </BrowserRouter>
    );
    expect(await screen.findByText("テスト太郎")).toBeInTheDocument();
  });

  it("自己紹介が表示されている", async () => {
    render(
      <BrowserRouter>
        <CardPage />
      </BrowserRouter>
    );
    expect(
      await screen.findByText("テスト太郎の自己紹介")
    ).toBeInTheDocument();
  });

  it("技術が表示されている", async () => {
    render(
      <BrowserRouter>
        <CardPage />
      </BrowserRouter>
    );
    expect(await screen.findByText("React")).toBeInTheDocument();
  });

  it("Githubアイコンが表示されている", async () => {
    render(
      <BrowserRouter>
        <CardPage />
      </BrowserRouter>
    );
    expect(await screen.findByLabelText("GitHub")).toBeInTheDocument();
  });

  it("Qiitaのアイコンが表示されている", async () => {
    render(
      <BrowserRouter>
        <CardPage />
      </BrowserRouter>
    );
    expect(await screen.findByLabelText("Qiita")).toBeInTheDocument();
  });

  it("Xのアイコンが表示されている", async () => {
    render(
      <BrowserRouter>
        <CardPage />
      </BrowserRouter>
    );
    expect(await screen.findByLabelText("X")).toBeInTheDocument();
  });

  it("戻るボタンをクリックすると/に遷移する", async () => {
    render(
      <BrowserRouter>
        <CardPage />
      </BrowserRouter>
    );
    const backButton = await screen.findByText("戻る");
    await userEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
