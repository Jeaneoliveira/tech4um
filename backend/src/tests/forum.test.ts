import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app";

let token = "";
let forumId = 1;

describe("Rotas de autenticação", () => {
  it("deve cadastrar um usuário", async () => {
    const uniqueId = Date.now();
  
    const response = await request(app)
      .post("/auth/register")
      .send({
        username: `LoginTeste${uniqueId}`,
        email: `login${uniqueId}@email.com`,
        password: "123456",
      });
  
    expect(response.status).toBe(201);
  
  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");

    token = response.body.token;
  });

  it("deve fazer login", async () => {
    const uniqueId = Date.now();
  
    const email = `login${uniqueId}@email.com`;
  
    await request(app)
      .post("/auth/register")
      .send({
        username: `LoginTeste${uniqueId}`,
        email,
        password: "123456",
      });
  
    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "123456",
      });
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
  
    token = response.body.token;
  });
});

describe("Rotas de fóruns", () => {
  it("deve criar um fórum", async () => {
    const response = await request(app)
      .post("/forums")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `Fórum Teste ${Date.now()}`,
        description: "Fórum criado no teste automatizado",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toContain("Fórum Teste");

    forumId = response.body.id;
  });
});

describe("Rotas de mensagens", () => {
  it("deve listar mensagens de um fórum", async () => {
    const response = await request(app)
      .get(`/messages/${forumId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});