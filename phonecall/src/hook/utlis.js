
export const setupRemoteMedia = (session, has_video = false) => {
    const remoteStream = new MediaStream()
    session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track)
      }      
    })
  }

  

