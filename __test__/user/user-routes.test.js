const path = require('path');
const MOCK_PATH  = path.resolve(__dirname , '../mocks/utils/tools');
const request = require('supertest')
const app = require("../../app")
const jwt = require("../../utils/jwt")
const env = require("dotenv")
env.config()


describe("GET /api/profile", () => {
    describe("User get profile", () => {
        it('it should respond with 401 when not authenticated', async () => {
            const response = await request(app).get('/api/profile');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Access denied. No token provided.");
        });
        it('it should respond with 404 when user not found', async () => {
            jest.setTimeout(10 * 1000)
            let token = jwt.generateToken({_id: "654cd690afaf59881f298712", roles: ["user"]})
            const response = await request(app)
                .get('/api/profile')
                .set({ Authorization:  "Bearer " + token});
        
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toContain("The user is not found!");
        }, 30000);
    })
})