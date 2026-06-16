import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import { Login } from "./Login";
import { AppProvider } from "../contexts/AppContext";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

test("faz login ao preencher email e senha", async () => {
  vi.mocked(api.post).mockResolvedValueOnce({
    data: {
      token: "token-fake",
      user: {
        id: 1,
        username: "Aline",
        email: "aline@email.com",
      },
    },
  });

  render(
    <AppProvider>
      <Login />
    </AppProvider>
  );

  fireEvent.change(screen.getByPlaceholderText("Digite seu e-mail"), {
    target: { value: "aline@email.com" },
  });

  fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

  await waitFor(() => {
    
    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "aline@email.com",
      password: "123456",
    });
  });
});