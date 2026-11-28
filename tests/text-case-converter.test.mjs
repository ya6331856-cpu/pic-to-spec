import test from "node:test";
import assert from "node:assert/strict";
import { convertTextCase } from "../lib/text-case-converter.mjs";

test("upper and lower case handle Unicode text", () => {
  assert.equal(convertTextCase("Hello İstanbul", "upper"), "HELLO İSTANBUL");
  assert.equal(convertTextCase("HELLO WORLD", "lower"), "hello world");
});

test("title, capitalized and sentence case are distinct", () => {
  assert.equal(convertTextCase("the lord of the rings", "title"), "The Lord of the Rings");
  assert.equal(convertTextCase("the lord of the rings", "capitalize"), "The Lord Of The Rings");
  assert.equal(convertTextCase("THE QUICK. THE FOX!", "sentence"), "The quick. The fox!");
});

test("toggle and alternating case preserve punctuation and spaces", () => {
  assert.equal(convertTextCase("hELLO, wORLD!", "toggle"), "Hello, World!");
  assert.equal(convertTextCase("hello world", "alternating"), "HeLlO wOrLd");
});

test("developer formats split camel case and acronym boundaries", () => {
  assert.equal(convertTextCase("myHTTPServer name", "camel"), "myHttpServerName");
  assert.equal(convertTextCase("myHTTPServer name", "pascal"), "MyHttpServerName");
  assert.equal(convertTextCase("myHTTPServer name", "snake"), "my_http_server_name");
  assert.equal(convertTextCase("myHTTPServer name", "kebab"), "my-http-server-name");
  assert.equal(convertTextCase("myHTTPServer name", "constant"), "MY_HTTP_SERVER_NAME");
});

test("space cleanup collapses repeated horizontal whitespace but keeps new lines", () => {
  assert.equal(convertTextCase("  hello   world  \n\n  next\tline  ", "spaces"), "hello world\n\nnext line");
});

test("empty input is safe and unsupported modes are rejected", () => {
  assert.equal(convertTextCase("", "upper"), "");
  assert.throws(() => convertTextCase("text", "unknown"), RangeError);
});
