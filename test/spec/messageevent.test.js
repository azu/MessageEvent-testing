/* global describe, it */

(function () {
    'use strict';
    describe("MessageEvent", function () {
        context("when use MessageEvent constructor", function () {
            var called = false;
            var messageListener;
            // helper
            var addMessageEvent = function (listner) {
                messageListener = listner;
                document.addEventListener("event-name", listner);
            };
            beforeEach(function () {
                called = false;
            });
            afterEach(function () {
                document.removeEventListener("event-name", messageListener);
            });
            it("should synchronize work", function () {
                addMessageEvent(function (event) {
                    called = true;
                });
                var messageEvent = new MessageEvent("event-name", {});
                document.dispatchEvent(messageEvent);
                assert.isTrue(called);
            });
            it("should passing data", function () {
                addMessageEvent(function (event) {
                    called = true;
                    assert.strictEqual(event.origin, "watashi-wo-trust-me");
                    assert.strictEqual(event.data, "data-data");
                    assert.strictEqual(event.source, window);
                });
                var messageEvent = new MessageEvent("event-name", {
                    data: "data-data",
                    origin: "watashi-wo-trust-me",
                    source: window
                });
                document.dispatchEvent(messageEvent);
                console.log("messageEvent", messageEvent);
                assert.isTrue(called);
            });
            it("should synchronously fire 'message' event ", function () {
                messageListener = function (event) {
                    called = true;
                    assert.strictEqual(event.data, "data-data");
                    assert.strictEqual(event.origin, "watashi-wo-trust-me")
                };
                window.addEventListener("message", messageListener, false);
                var messageEvent = new MessageEvent("message", {
                    data: "data-data",
                    origin: "watashi-wo-trust-me"
                });
                window.dispatchEvent(messageEvent);
                assert.isTrue(called);// sync
                window.removeEventListener("message", messageListener);
            });
        });
        context("when use postMessage", function () {
            var messageListener;
            afterEach(function () {
                window.removeEventListener("message", messageListener);
            });
            it("should asynchronize work", function (done) {
                messageListener = function (event) {
                    assert.strictEqual(event.source, window);
                    assert.strictEqual(event.origin, location.protocol + "//" + location.host)
                    assert.strictEqual(event.data, "data-data");
                    done();
                };
                window.addEventListener("message", messageListener, false);
                window.postMessage("data-data", location.protocol + "//" + location.host);
            });
        });
    });
})();
