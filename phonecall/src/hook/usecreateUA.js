import { useState } from 'react';
import { Inviter, Registerer, RegistererState, SessionState, UserAgent } from "sip.js";
const { v4: uuidv4 } = require('uuid');

import {
  MediaStream,
  RTCPeerConnection,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';
import { useDispatch, useSelector } from 'react-redux';
import { Callcount, addSession, storeContactNumber, updateSipState } from '../redux/sipSlice';
import { setupRemoteMedia } from './utlis';
import { useCallTimerContext } from './useCallTimer';
import { callDuration } from '../CallTimer';
import { getDataCallLog, storeData } from '../redux/callLogStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import RNCallKeep from 'react-native-callkeep'
import SQLite from 'react-native-sqlite-storage';
import { createCallLogTable, setCallLogTable } from '../CallLog/DBCallLog';

const reconnectionAttempts = 3
// Number of seconds to wait between reconnection attempts
const reconnectionDelay = 4
// Used to guard against overlapping reconnection attempts
let attemptingReconnection = false
// If false, reconnection attempts will be discontinued or otherwise prevented
const shouldBeConnected = true

const SipUsername = '1011';
const SipPassword = '1011@1101Aa';
const targetUsername = 'User1';

let Lines = [];
let newLineNumber = 1;
let removeCallCount = 0
const TransportReconnectionAttempts = 999;
export let localMediaStream;
let mediaConstraints = {
  audio: true,
  video: false
};
registerGlobals();

const db = SQLite.openDatabase(
  {
    name: 'myDatabase.db',
    location: 'default',
  },
  () => { console.log('Database opened.'); },
  error => { console.log(error) }
);


function usecreateUA() {
  const dispatch = useDispatch()
  const [recording, setRecording] = useState();
  const { TimerAction, callTimer, seconds } = useCallTimerContext()
  const { userAgent, session, allSession, newCallAdd, UserName, Password, Server, Port, Caller_Name, phoneNumber } = useSelector((state) => state.sip)
  const data = new Date()
  let timeStore = ""
  const [callerName, setcallerName] = useState("Unknown");

  const connect = async () => {
    try {
      createCallLogTable()
      const webSoket = `wss://${Server}:${Port}`
      const sip_aor = `sip:${UserName}@${Server}:${Port}` //`sip:${"101030"}@${"s1.netcitrus.com:5090"}`
      const registererOptions = {}
      const userAgentOptions = {
        uri: UserAgent.makeURI(sip_aor),
        transportOptions: {
          wsServers: [webSoket], //["wss://s1.netcitrus.com:5090"],
          traceSip: true
        },
        sessionDescriptionHandlerFactoryOptions: {
          iceGatheringTimeout: 5000,
        },
        displayName: "sagar",
        authorizationPassword: Password,//"1010@0101Aa30",
        authorizationUsername: UserName,//"101030",
        dtmfType: 'info',
        contactTransport: 'wss',
        noAnswerTimeout: 60,
        displayName: "TEST",
        contactParams: { transport: 'wss' },
        hackIpInContact: true,
        logBuiltinEnabled: true

      }

      const USERAGENT = new UserAgent(userAgentOptions)
      const registerer = new Registerer(USERAGENT, registererOptions)

      dispatch(updateSipState({ key: "userAgent", value: USERAGENT }))

      USERAGENT.start()
        .then(() => {
          registerer.stateChange.addListener(newState => {
            switch (newState) {
              case RegistererState.Initial:
                console.log('UserAgent ==> Initial')
                break
              case RegistererState.Registered:
                dispatch(updateSipState({ key: "soketConnect", value: true }))
                console.log('UserAgent ==> Registered')
                break
              case RegistererState.Unregistered:
                dispatch(updateSipState({ key: "soketConnect", value: false }))
                console.log('UserAgent ==> Unregistered')
                break
              case RegistererState.Terminated:
                console.log('UserAgent ==> Terminated')
                USERAGENT.stop()
                break
              default:
                console.log('UserAgent ==> Unidentified')
                break
            }
          })
          registerer
            .register()
            .then(() => {
              setupRemoteMedia(USERAGENT, false)
              console.log('Successfully sent REGISTER, object is here')
            })
            .catch(error => {
              console.log('Failed to send REGISTER', error)
            })
        })
        .catch(error => {
          console.log('Failed to send REGISTER', error)
        })

      /*
       * Setup handling for incoming INVITE requests
       */
      let isVoiceOnly = true;

      try {
        const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
        // if ( isVoiceOnly ) {
        //   let videoTrack = mediaStream.getVideoTracks()[0];
        //   videoTrack.enabled = false;
        // };
        localMediaStream = mediaStream;


      } catch (err) {
        // Handle Error
      };





      USERAGENT.delegate = {
        async onInvite(invitation) {
          const number = invitation?.remoteIdentity?.uri?.user || ''
          console.log('invitations', invitation)
          console.log('invitation?.request?.callId', invitation?.request?.callId)
          console.log('invitation?.request?.callId', invitation?.request?.callId)
          dispatch(updateSipState({ key: "session", value: invitation }))

          incoming = true

          dispatch(storeContactNumber({ key: "phoneNumber", value: number }))

          

          getContactTableData(number)

          const SessionID = invitation?._id
          dispatch(addSession({ sessionID: SessionID, session: invitation }))

          console.log("incoming========", incoming)


          dispatch(updateSipState({ key: "incomingcall", value: true }))


          invitation.delegate = {
            //  Handle incoming onCancel request
            onRefer(referral) {
              console.log('referral', referral)
            },

            onCancel(message) {
              console.log('ON CANCEL - message ==> ', message)
              dispatch(updateSipState({ key: "incomingcall", value: false }))
              dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
              dispatch(updateSipState({ key: "newCallAdd", value: 0 }))


              RNCallKeep.endAllCalls();

              if (invitation) {
                invitation.dispose()
              }
            }
          }

          invitation.stateChange.addListener(state => {
            dispatch(updateSipState({ key: "sesstionState", value: state }))

            console.debug(`Session state changed to ${state}`)
            switch (state) {
              case 'Initial':
                console.log('incomming session state Initial')
                break
              case 'Establishing':
                console.log('Incoming Session state Establishing')
                break
              case 'Established':
                timeStore = data
                TimerAction('start')
                console.log('Incoming Session state Established')
                setupRemoteMedia(invitation, false)

                break
              case 'Terminating':
                console.log('Terminating')
                break
              case 'Terminated':
                TimerAction('stop')

                const callLog = {
                  "number": number,
                  "direction": "Incomging",
                  "duration": callDuration,
                  "current_time": format(timeStore, 'yyyy-MM-dd kk:mm:ss'),
                  "name": Caller_Name == "" ? "Unknown" : Caller_Name,
                  "id": `${new Date().getTime()}`
                }
                CallLogStore(callLog)
                console.log('Terminated')

                dispatch(updateSipState({ key: "incomingcall", value: false }))
                dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
                dispatch(updateSipState({ key: "phoneNumber", value: [] }))
                dispatch(updateSipState({ key: "allSession", value: {} }))
                RNCallKeep.endAllCalls();
                break
              default:
                console.log('Unknow Incomming Session state')
            }
          })
        },
        onConnect() {
          console.log("IS Connected..")
        },
        onDisconnect(error) {
          registerer
            .unregister()
            .then(() => {
              console.log('onDisconnect - Unregistered event success')

            })
            .catch(e => {
              console.log(`onDisconnect - Unregister failed with cause ${e}`)
            })
          if (error) {
            // attemptReconnection();
            console.log('trying to reconnect')
          }
        }
      }
    } catch (error) {
      console.debug('userAgent create Error', error)
      dispatch(updateSipState({ key: "incomingcall", value: false }))
    }

  }



  const getContactTableData = (userNumber) => {
    console.log("userNumber", userNumber)
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ContactList',
        [],
        (tx, results) => {
          const rows = results.rows;
          const users = [];
          for (let i = 0; i < rows.length; i++) {
            const user = rows.item(i);
            users.push(user);
          }
          let nameAdd = false

          Object.keys(users).map(async (key) => {
            const str = users[key].number.replace(/[^a-z0-9,. ]/gi, '');
            if (userNumber.includes(str.replace(/ /g, ''))) {
              dispatch(updateSipState({ key: "Caller_Name", value: users[key].name }))
              // console.log("key->", users[key].name)
              setcallerName(users[key].name)
              nameAdd = true
            }
          })

          if (nameAdd == false) {
            dispatch(updateSipState({ key: "Caller_Name", value: "Unknown" }))
          }
        },
        (error) => {
          console.error('Error retrieving data:', error);
          dispatch(updateSipState({ key: "Caller_Name", value: "Unknown" }))
        }
      );
    });
  }

  const makeCall = async (destination) => {
    const video = false
    const sip_aor = `sip:${destination}@${Server}${Port}`

    const uri = UserAgent.makeURI(sip_aor)//`sip:${destination}@${"s1.netcitrus.com:7443"}`)
    const _headers = []
    const earlyMedia = true
    const inviteOptions = {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video
        }
      },
      extraHeaders: _headers,
    }
    const session = new Inviter(userAgent, uri, inviteOptions)

    dispatch(storeContactNumber({ key: "phoneNumber", value: destination }))

    let incomingUser = session.remoteIdentity.displayName;
    let userNumber = session.remoteIdentity.uri.normal.user

    getContactTableData(destination)

    console.log("userNumber", userNumber)

    if (Callcount > 0) {
      toggelHoldCall(true, true)
      dispatch(updateSipState({ key: "newCallAdd", value: 1 }))
      console.log("newCallAdd1", newCallAdd)
    }

    console.log("newCallAdd", newCallAdd)
    const SessionID = session?._id
    dispatch(addSession({ sessionID: SessionID, session: session }))

    session.stateChange.addListener(newState => {
      dispatch(updateSipState({ key: "sesstionState", value: newState }))
      switch (newState) {
        case SessionState.Establishing:
          if (video == true) {
            dispatch(updateSipState({ key: "VideoCallScreenOpen", value: true }))
          } else {
            dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
          }
          timeStore = data
          TimerAction('start')
          console.debug('Session is establishing')
          RNCallKeep.startCall("cb499f3e-1521-4467-a51b-ceea76ee92b6", userNumber, userNumber, "number", false);
          break
        case SessionState.Established:
          setupRemoteMedia(session, false)
          console.debug('Session has been ==> Established')
          break
        case SessionState.Terminated:
          console.debug('Session Has Been Terminated')
          if (session) {
            session.cancel();
          }
          TimerAction('stop')

          console.log('Data retrieved successfully:', Caller_Name);

          const callLog = {
            "number": userNumber,
            "direction": "OutGoing",
            "duration": callDuration,
            "current_time": format(timeStore, 'yyyy-MM-dd kk:mm:ss'),
            "name": callerName,
            "id": `${new Date().getTime()}`
          }

          CallLogStore(callLog)
          dispatch(updateSipState({ key: "phoneNumber", value: [] }))
          dispatch(updateSipState({ key: "allSession", value: {} }))
          RNCallKeep.endAllCalls();

          break
        default:
          break
      }
    })

    // Setup outgoing session delegate
    session.delegate = {
      // Handle outgoing REFER request
      onRefer(referral) {
        // console.log("Handle outgoing REFER request");
        referral.accept().then(() => {
          referral.makeInviter().invite()
        })
      }
    }

    // Options including delegate to capture response messages
    const inviteOptionsOB = {
      requestDelegate: {
        onReject: () => {
        },
        onAccept: () => {
          console.debug('Session Request Is Accepted <===>')
        },
        onProgress: () => {
          console.debug('onpogress Session <===>')
          //  dispatch(toggleConnectingCall(true));
          // console.debug('onpogressing session=========================')
        },
        onCancel: () => {
          console.debug('cancel session====')
        }
      },


      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false
        },
        sessionDescriptionHandlerModifiers: [sessionDescriptionHandler => {
          sessionDescriptionHandler.peerConnection.addStream(MediaStream);
        }]
      }
    }

    // Send invitation
    session
      .invite(inviteOptionsOB)
      .then(() => {
        console.log('Successfully sent INVITE ....')
        // console.log(request);
      })
      .catch(error => {
        console.log('Failed to send INVITE ==> ', error)
      })

    let peerConstraints = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    };

    let peerConnection = new RTCPeerConnection(peerConstraints);

    peerConnection.addEventListener('connectionstatechange', event => { });
    peerConnection.addEventListener('icecandidate', event => { });
    peerConnection.addEventListener('icecandidateerror', event => { });
    peerConnection.addEventListener('iceconnectionstatechange', event => { });
    peerConnection.addEventListener('icegatheringstatechange', event => { });
    peerConnection.addEventListener('negotiationneeded', event => { });
    peerConnection.addEventListener('signalingstatechange', event => { });
    peerConnection.addEventListener('track', event => { });

    localMediaStream.getTracks().forEach(
      track => peerConnection.addTrack(track, localMediaStream)
    );
    dispatch(updateSipState({ key: "remoteStream", value: localMediaStream })) // Video Call Time Used
  }

  const CallLogStore = async (callLog) => {
    setCallLogTable(callLog)
    dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
    dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
  }


  const sendDTMF = (digit) => {
    console.debug(`DTMF Call Event Called with digit${digit}`)
    const options = {
      requestOptions: {
        body: {
          contentDisposition: 'render',
          contentType: 'application/dtmf-relay',
          content: `Signal=${digit}\r\nDuration=1000`
        }
      }
    }
    session.info(options)
  }

  const blindTx = async (number) => {
    try {
      const userSession = session//sessions[sessionId]
      console.debug('sessiions', userSession)
      // Send an outgoing REFER request
      const transferTarget = UserAgent.makeURI(`sip:${number}@${"s2.netcitrus.com:7443"}`)
      console.log('BTXtransfer ==> ', transferTarget)
      if (!transferTarget) {
        throw new Error('Failed to create transfer target URI.')
      }
      userSession.refer(transferTarget, {
        // Example of extra headers in REFER request
        requestOptions: {
          extraHeaders: [`Referred-By : sip:${"919898225566"}@${"s2.netcitrus.com:7443"}`]
        },
        requestDelegate: {
          onAccept() {
            console.log('BTXtransfer accepted')
            // callHangUp();
          },
          onReject: () => {
            console.debug('BTXtransfer  Rejected')
          }
        }
      })
    } catch (error) {
      console.log('CATCH found - blindTx ==> ', error)
    }
  }

  const toggelHoldCall = async (state, hold) => {
    try {

      console.info('sessionUserHold.', session?.remoteIdentity?.uri?.normal?.user)
      console.info('hold.', hold)

      Object.keys(allSession).map(async (key) => {
        const session = allSession[key];
        if (session) {
          session.sessionDescriptionHandlerOptionsReInvite = {
            hold: state, // true for hold call and false for unhold for call
            mute: state
          }
          const options = {
            requestDelegate: {
              onAccept: () => {
                if (state) {
                  // session is on hold
                  console.info('Hold Request Accepted.')
                  if (hold == true) {
                    localMediaStream.hold()
                  } else {
                    localMediaStream.pause()
                  }
                } else {
                  if (hold == true) {
                    localMediaStream.unhold()
                  }
                  else {
                    localMediaStream.play()
                  }
                  console.info('Unhold Request Accepted.')
                }
              },
              onReject: () => {
                // setHoldCall(false)
                if (state) {
                  // session is on hold
                  console.debug('Hold Request Rejected.')
                } else {
                  // session is on unhold
                  console.debug('Unhold Request Accepted.')
                }
                // re-invite request was rejected, call not on unhold
                console.debug('Unhold Request Rejected.')
              }
            }
          }
          await session
            .invite(options)
            .then(() => {
              console.debug('hold / unhold invite send successfully')
            })
            .catch((error) => {
              console.debug(`Hold Error: ${error}`)
            })
        }
      })

    } catch (error) {
      console.debug('hold unhold hooks function error', error) // eslint-disable-line  prefer-template
    }
  }

  const MuteCall = async (state) => {
    try {
      Object.keys(allSession).map(async (key) => {
        const session = allSession[key];
        console.info('MuteCall.', session?.remoteIdentity?.uri?.normal?.user)
        const pc = session.sessionDescriptionHandler.peerConnection
        pc.getSenders().forEach(function (stream) {
          stream.track.enabled = state;
        })
      })
    } catch (error) {
      console.debug('hold unhold hooks function error', error) // eslint-disable-line  prefer-template
    }

  }


  const holdUsedSwipTime = async (hold) => {
    try {
      console.info('Hold Request.', allSession)
      Object.keys(allSession).map(async (key) => {
        const session = allSession[key];
        const holdState = (session?.remoteIdentity?.uri?.normal?.user == hold) ? true : false
        // console.log("holdstat", holdState)
        // console.log("holdstatsession", session)
        if (session) {
          session.sessionDescriptionHandlerOptionsReInvite = {
            hold: holdState
          }
          const options = {
            requestDelegate: {
              onAccept: () => {
                console.info('Hold Request Accepted.')
              },
              onReject: () => {
                // setHoldCall(false)
                if (state) {
                  // session is on hold
                  console.debug('Hold Request Rejected.')
                } else {
                  // session is on unhold
                  console.debug('Unhold Request Accepted.')
                }
                // re-invite request was rejected, call not on unhold
                console.debug('Unhold Request Rejected.')
              }
            }
          }
          await session
            .invite(options)
            .then(() => {
              console.debug('hold / unhold invite send successfully')
            })
            .catch((error) => {
              console.debug(`Hold Error: ${error}`)
            })
        }
      })

    } catch (error) {
      console.debug('hold unhold hooks function error', error) // eslint-disable-line  prefer-template
    }
  }

  const CallRecoding = async () => {
    makeCall("3641375153")
  }

  const CallRecodingStop = async () => {
  }

  const Callhangup = () => {
    console.log("allSession", allSession)
    if (allSession.length == null) {
      const session = allSession[Object.keys(allSession)];
      session&&session.dispose()
    } else {
      Object.keys(allSession).map(async (key) => {
        const session = allSession[key];
        session&&session.dispose()
      })
    }

  }
  return { connect, makeCall, sendDTMF, blindTx, toggelHoldCall, CallRecoding, CallRecodingStop, Callhangup, holdUsedSwipTime, MuteCall }
}

export default usecreateUA
