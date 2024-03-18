const { describe, it } = require("node:test");
const assert = require("node:assert");
const { parseToRequest, parse } = require("../../../protocol88/parser");

describe("Testing parser functions", () => {
  describe("parseToRequest()", () => {
    it("should return a valid request object from a text request", () => {
      const request = parseToRequest(
        "****content-type:text;****\n****Hello!****"
      );

      assert.strictEqual(request.headers.contentType, "text");
      assert.strictEqual(request.body, "Hello!");
    });

    it("should return a valid request object from a json request", () => {
      const message = {
        sender: "user",
        content: "Hey!",
      };

      const request = parseToRequest(
        `****content-type:json;****\n****${JSON.stringify(message)}****`
      );

      assert.strictEqual(request.headers.contentType, "json");
      assert.deepStrictEqual(request.body, message);
    });

    it("should extract all headers from the request", () => {
      const request = parseToRequest(
        "****content-type:text;addition-header:value1;****\n********"
      );

      assert.strictEqual(request.headers.contentType, "text");
      assert.strictEqual(request.headers.additionHeader, "value1");
    });

    it("should throw a bad request error", () => {
      assert.throws(
        () => {
          parseToRequest("****header:value;****");
        },
        {
          message: "Bad Request!",
        }
      );
    });
  });

  describe("parse()", () => {
    it("should parse to a valid text request", () => {
      const request = {
        headers: {
          contentType: "text",
        },
        body: "This is a message!",
      };

      const parsedRequest = parse(request);

      assert.strictEqual(
        parsedRequest,
        "****content-type:text;****\n****This is a message!****"
      );
    });

    it("should parse to a valid json request", () => {
      const request = {
        headers: {
          contentType: "json",
        },
        body: {
          sender: "user",
          message: "Hello!",
        },
      };

      const parsedRequest = parse(request);

      assert.strictEqual(
        parsedRequest,
        `****content-type:json;****\n****${JSON.stringify(request.body)}****`
      );
    });
  });
});
