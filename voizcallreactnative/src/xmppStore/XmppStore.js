import { useState, useEffect } from 'react';
const { client, xml } = require("@xmpp/client");
const debug = require("@xmpp/debug");

import { Client } from "@xmpp/client";
// import debug from "@xmpp/debug";

class XMPPService {
  constructor() {
    this.xmpp = new Client({
      service: "",
      domain: "xmpp.voizcall.com",
      resource: "",
      username: "sagar1@xmpp.voizcall.com",
      password: "123456",
    });

    // debug(this.xmpp, true);

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.xmpp.on("error", this.handleError);
    this.xmpp.on("offline", this.handleOffline);
    this.xmpp.on("stanza", this.handleStanza);
    this.xmpp.on("online", this.handleOnline);
  }

  handleError = (err) => {
    console.error(err);
  };

  handleOffline = () => {
    console.log("offline");
  };

  handleStanza = async (stanza) => {
    if (stanza.is("message")) {
      await this.xmpp.send(xml("presence", { type: "unavailable" }));
      await this.xmpp.stop();
    }
  };

  handleOnline = async (address) => {
    await this.xmpp.send(xml("presence"));

    const message = xml(
      "message",
      { type: "chat", to: address },
      xml("body", {}, "hello world")
    );
    await this.xmpp.send(message);
  };

  start() {
    this.xmpp.start().catch(console.error);
  }

  // Add voice call specific methods here
  initiateVoiceCall(recipient) {
    // Implement voice call initiation logic
  }

  endVoiceCall() {
    // Implement voice call termination logic
  }

  // Add other voice call related methods as needed
}

export const xmppService = new XMPPService();