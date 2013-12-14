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
                    assert.equal(event.origin, "watashi-wo-trust-me");
                    assert.equal(event.data, "data-data");
                });
                var messageEvent = new MessageEvent("event-name", {
                    data: "data-data",
                    origin: "watashi-wo-trust-me"
                });
                document.dispatchEvent(messageEvent);
                assert.isTrue(called);
            });
        });
        context("when use postMessage", function () {
            var messageListener;
            afterEach(function () {
                window.removeEventListener("message", messageListener);
            });
            it("should asynchronize work", function (done) {
                messageListener = function (event) {
                    assert.ok(true);
                    assert.equal(event.data, "data-data");
                    done();
                };
                window.addEventListener("message", messageListener, false);
                window.postMessage("data-data", location.protocol + "//" + location.host);
            });
        });
    });
})();
