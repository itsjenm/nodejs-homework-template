const { login, emptyDB, startDB, closeDB } = require("./contactsController");

describe("MongoDB crub suites", () => {
  beforeAll(async () => {
    await startDB();
  });
  afterAll(async () => {
    await emptyDB();
    closeDB();
  });

  test("Should return status code 200 with a Success message", async () => {
    const userData = { email: "jenny@test.com", password: "cocolove"};
    const response = await login(userData)
    expect(response).toBe("success");
      
  });
});
