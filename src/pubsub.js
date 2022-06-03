const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-bf269abf-0dfa-4cc2-b8ea-388b93315e21",
  subscribeKey: "sub-c-ca0285d4-614a-4857-9e89-4f3071f3fc7f",
  uuid: "sec-c-ZmQ1MGYxOGYtZDI3YS00YzdhLTkzOGYtYmM5YWIzMDBlY2Y0",
};

const CHANNELS = {
  TEST: "TEST",
};

class PubSub {
  constructor() {
    this.pubnub = new PubNub(credentials);

    // Used Object.values() so this array accomodates any new channel
    // added to CHANNELS
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

    this.pubnub.addListener(this.listener());
  }

  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject;

        console.log(
          `Message received. Channel: ${channel}. Message: ${message}`
        );
      },
    };
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
}

const testPubSub = new PubSub();
testPubSub.publish({
  channel: CHANNELS.TEST,
  message: "This is a test message",
});

module.exports = PubSub;
