import "mocha";
import dotenv from "dotenv";
import * as assert from "assert";

dotenv.config();

describe("Main", () => {
    let x = "";

    before(async () => {

    });

    it("should be able to run tests", async () => {
        assert.equal(x, "");
    })

    after (async() => {

    });
});