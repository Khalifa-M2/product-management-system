import assert from "node:assert/strict";
import test from "node:test";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

function createResponse() {
    return {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };
}

test("unauthenticated requests cannot access protected endpoints", () => {
    const response = createResponse();
    let continued = false;

    requireAuth({ session: {} }, response, () => {
        continued = true;
    });

    assert.equal(response.statusCode, 401);
    assert.equal(continued, false);
});

test("stakeholders cannot use administrator endpoints", () => {
    const response = createResponse();
    let continued = false;

    requireAdmin({ session: { user: { Role: "stakeholder" } } }, response, () => {
        continued = true;
    });

    assert.equal(response.statusCode, 403);
    assert.equal(continued, false);
});

test("administrators can use administrator endpoints", () => {
    const response = createResponse();
    let continued = false;

    requireAdmin({ session: { user: { Role: "admin" } } }, response, () => {
        continued = true;
    });

    assert.equal(response.statusCode, 200);
    assert.equal(continued, true);
});
