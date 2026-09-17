process.env.SESSION_SECRET = "test-session-secret";

const app = require("../app");

let server;

beforeAll((done) => {
    server = app.listen(0, "127.0.0.1", done);
});

afterAll((done) => {
    server.close(done);
});

test("GET /test returns the application status", async () => {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/test`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
        status: "ok",
        message: "BookMyStay is running"
    });
});
