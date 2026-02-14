import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

import HomePage from "../src/pages/HomePage";
import { BrowserRouter } from "react-router-dom";

describe("HomePage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("タイトルが表示されている", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByText("デジタル名刺")).toBeInTheDocument();
  });

  it("IDを入力してボタンを押すと/cards/:idに遷移する", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await userEvent.type(
      screen.getByPlaceholderText("IDを入力してください"),
      "sample-id"
    );
    await userEvent.click(screen.getByText("名刺をみる"));

    expect(mockNavigate).toHaveBeenCalledWith("/cards/sample-id");
  });

  it("IDを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await userEvent.click(screen.getByText("名刺をみる"));

    expect(screen.getByText("IDを入力してください")).toBeInTheDocument();
  });

  it("新規登録はこちらを押すと/cards/registerに遷移する", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const link = screen.getByText("新規登録はこちら");
    expect(link.closest("a")).toHaveAttribute("href", "/cards/register");
  });
});
