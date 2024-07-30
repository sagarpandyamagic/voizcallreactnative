
export const setupRemoteMedia = async (session, has_video = false) => {
  const remoteStream = new MediaStream()
  // const stream = await navigator.mediaDevices.getUserMedia({ video: has_video, audio: true });
  // if (stream && session && has_video) {
  //   stream.getTracks().forEach(track => {
  //     console.debug('Adding track:', track);
  //     session?.sessionDescriptionHandler?.peerConnection?.addTrack(track, stream);
  //   });
  // }
  session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
    if (receiver.track) {
      remoteStream.addTrack(receiver.track)
    }      
  })
}



