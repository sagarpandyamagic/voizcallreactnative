import RNCallKeep from "react-native-callkeep";
import { Inviter, Registerer, RegistererState, SessionState, UserAgent } from "sip.js";
import { RTCPeerConnection, mediaDevices, registerGlobals } from "react-native-webrtc";
import SQLite from 'react-native-sqlite-storage';
import { CallNumberCoundRemove, addSession, removeSession, storeContactNumber, updateSipState } from '../../store/sipSlice';
import { format } from 'date-fns';
import store from "../../store/store";
import { setupRemoteMedia } from "../../hook/utlis";
import { POSTAPICALL } from "../auth";
import { APIURL } from "../../HelperClass/APIURL";
import { IncomingcallPermission } from "./IncomingcallPermission";
import { AppState, NativeModules, Platform } from 'react-native';
import incomingusebyClass from "../Callkeep/incomingusebyClass";
import uuid from 'react-native-uuid';
import BackgroundTimer from 'react-native-background-timer';
import { StorageKey } from "../../HelperClass/Constant";
import { getStorageData } from "../../components/utils/UserData";
import inCallManager from "react-native-incall-manager";

const { AudioModule ,MyNativeModule} = NativeModules; // Assuming you have a native module for audio playback


let sessionCall = null;
let localMediaStream = null;

let testUUID = uuid.v4();


const db = SQLite.openDatabase(
  {
    name: 'myDatabase.db',
    location: 'default',
  },
  () => { console.log('Database opened.'); },
  error => { console.log(error) }
);
registerGlobals()

export const holdUsedSwipTime = async (hold) => {
  try {
    console.info('Hold Request.', store.getState().sip.allSession)
    Object.keys(store.getState().sip.allSession).map(async (key) => {
      const session = store.getState().sip.allSession[key];
      const holdState = (session?.remoteIdentity?.uri?.normal?.user == hold) ? true : false
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

export const getContactTableData = (userNumber) => {
  // console.log("userNumber", userNumber)
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
            store.dispatch(updateSipState({ key: "Caller_Name", value: users[key].name }))
            // setcallerName(users[key].name)
            nameAdd = true
          }
        })

        if (nameAdd == false) {
          store.dispatch(updateSipState({ key: "Caller_Name", value: "Unknown" }))
        }
      },
      (error) => {
        console.error('Error retrieving data:', error);
        store.dispatch(updateSipState({ key: "Caller_Name", value: "Unknown" }))
      }
    );
  });
}

export const CallLogStore = (callLog) => {
  // setCallLogTable(callLog)
  if (store.getState().sip.SessionCount == 1) {
    store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
    store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
  }
}


export const toggelHoldCall = async (state, hold) => {
  try {

    console.info('hold.', hold)

    Object.keys(store.getState().allSession).map(async (key) => {
      const session = store.getState().allSession[key];
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

class SipClinet {
  connect = async () => {
    let timeStore = ""
    const data = new Date()
    try {
      const webSoket = `wss://${store.getState().sip.Server}:${store.getState().sip.Port}`
      const sip_aor = `sip:${store.getState().sip.UserName}@${store.getState().sip.Server}:${store.getState().sip.Port}` //`sip:${"101030"}@${"s1.netcitrus.com:5090"}`
      const registererOptions = {}
      const userAgentOptions = {
        uri: UserAgent.makeURI(sip_aor),
        transportOptions: {
          wsServers: [webSoket],
          traceSip: true
        },
        sessionDescriptionHandlerFactoryOptions: {
          iceGatheringTimeout: 5000,
        },
        displayName: "sagar",
        authorizationPassword: store.getState().sip.Password,//"1010@0101Aa30",
        authorizationUsername: store.getState().sip.UserName,//"101030",
        dtmfType: 'info',
        contactTransport: 'wss',
        noAnswerTimeout: 60,
        displayName: "TEST",
        contactParams: { transport: 'wss' },
        hackIpInContact: true,
        logBuiltinEnabled: false,
      }

      const USERAGENT = new UserAgent(userAgentOptions)
      const registerer = new Registerer(USERAGENT, registererOptions)

      store.dispatch(updateSipState({ key: "userAgent", value: USERAGENT }))
      store.dispatch(updateSipState({ key: "registerer", value: registerer }))
      USERAGENT.start()
        .then(() => {
          registerer.stateChange.addListener(async newState => {
            switch (newState) {
              case RegistererState.Initial:
                // console.log('UserAgent ==> Initial')
                break
              case RegistererState.Registered:
                store.dispatch(updateSipState({ key: "soketConnect", value: true }))
                // console.log('UserAgent ==> Registered')
                const pram = {
                  "aor": `sip:${await getStorageData(StorageKey.instance_id)}-${store.getState().sip.UserName}:${store.getState().sip.Server}`
                }
                POSTAPICALL(APIURL.PCSStatus, pram)
                break
              case RegistererState.Unregistered:
                store.dispatch(updateSipState({ key: "soketConnect", value: false }))
                // console.log('UserAgent ==> Unregistered')
                break
              case RegistererState.Terminated:
                store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))

                // console.log('UserAgent ==> Terminated')
                USERAGENT.stop()
                break
              default:
                // console.log('UserAgent ==> Unidentified')
                break
            }
          })
          registerer
            .register()
            .then(() => {
              setupRemoteMedia(USERAGENT, false)
              // console.log('Successfully sent REGISTER, object is here')
            })
            .catch(error => {
              // console.log('Failed to send REGISTER', error)
            })
        })
        .catch(error => {
          // console.log('Failed to send REGISTER', error)
        })

      /*
       * Setup handling for incoming INVITE requests
       */

      try {
        const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);
      } catch (err) {
        // Handle Error
      };

      USERAGENT.delegate = {
        async onInvite(invitation) {
          store.dispatch(updateSipState({ key: "CallType", value: "InComingCall" }))
          // console.log("store", callinfo)
          const number = invitation?.remoteIdentity?.uri?.user || ''
          // console.log('invitations', invitation)
          // console.log('invitation?.request?.callId', invitation?.request?.callId)
          // console.log('invitation?.request?.callId', invitation?.request?.callId)

          store.dispatch(updateSipState({ key: "session", value: invitation }))
          // invitation.accept()
          // incoming = true

          // getContactTableData(number)
          store.dispatch(updateSipState({ key: "Caller_Name", value: "Unknown" }))
          // store.dispatch(updateSipState({ key: "IncomingScrrenOpen", value: true }))

          const valueDND = await getStorageData(StorageKey.UserDND);
          const CallkeeporNto = await getStorageData(StorageKey.CallKeepORNot);
          console.log('UserAgent2 ==> Unregistered')


          // if (AppState.currentState === "active" && Platform.OS == "android" && valueDND == false && CallkeeporNto == false) {
          //   store.dispatch(updateSipState({ key: "IncomingScrrenOpen", value: true }))
          // }

          // await AppStoreData(StorageKey.CallKeepORNot,false);
          // store.dispatch(storeContactNumber({ key: "phoneNumber", value: number }))
          console.log('UserAgent3 ==> Unregistered')
          store.dispatch(updateSipState({ key: "DialNumber", value: number }))
          console.log("DialNumber", number)

          if (valueDND) {
            invitation.reject();
            return
          }



          const SessionID = invitation?._id
          store.dispatch(addSession({ sessionID: SessionID, session: invitation }))

          // console.log("phoneNumber========test", number)
          sessionCall = invitation
          // console.log("sessionCall========test", sessionCall)

          store.dispatch(updateSipState({ key: "CallAns", value: true }))  // Change TEST

          invitation.delegate = {
            //  Handle incoming onCancel request
            onRefer(referral) {
              // console.log('referral', referral)
            },

            onCancel(message) {
              // console.log('ON CANCEL - message ==> ', message)
              store.dispatch(updateSipState({ key: "CallAns", value: false }))
              store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
              store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))

              // RNCallKeep.clearInitialEvents();
              if (invitation) {
                invitation.dispose()
              }
            }
          }

          invitation.stateChange.addListener(state => {
            store.dispatch(updateSipState({ key: "sesstionState", value: state }))

            console.debug(`Session state changed to ${state}`)
            switch (state) {
              case 'Initial':
                console.log('incomming session state Initial')
                inCallManager.startProximitySensor();

                break
              case 'Establishing':
                // console.log('Incoming Session state Establishing')
                break
              case 'Established':
                timeStore = data
                // TimerAction('start')
                // console.log('Incoming Session state Established')
                setupRemoteMedia(invitation, false)
                break
              case 'Terminating':
                // console.log('Terminating')
                break
              case 'Terminated':
                // console.log('Terminated Call')
                // TimerActio('stop')

                // const callLog = {
                //   "number": number,
                //   "direction": "Incomging",
                //   "duration": callDuration,
                //   "current_time": timeStore != "" ? format(timeStore, 'yyyy-MM-dd kk:mm:ss') : "00:00:00",
                //   "name": store.getState().sip.Caller_Name == "" ? "Unknown" : store.getState().sip.Caller_Name,
                //   "id": `${new Date().getTime()}`
                // }
                // CallLogStore(callLog)
                // console.log('Terminated')
                store.dispatch(updateSipState({ key: "CallAns", value: false }))
                store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
                store.dispatch(updateSipState({ key: "phoneNumber", value: [] }))
                store.dispatch(updateSipState({ key: "ISCallTransfer", value: false }))
                store.dispatch(updateSipState({ key: "ISAttendedTransfer", value: false }))
                store.dispatch(updateSipState({ key: "ISConfrenceTransfer", value: false }))
                store.dispatch(updateSipState({ key: "Caller_Name", value: "" }))
                store.dispatch(removeSession(invitation.id))
                incomingusebyClass.endIncomingcallAnswer();
                inCallManager.stopProximitySensor(); // Disable
                break
              default:
              // console.log('Unknow Incomming Session state')
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
            console.log('trying to reconnect')
          }
        }
      }
    } catch (error) {
      console.debug('userAgent create Error', error)
    }

  }

  makeCall = async (destination, video = false) => {
    try {

      let timeStore = ""
      const data = new Date()
      const sip_aor = `sip:${destination}@${store.getState().sip.Server}`
      const uri = UserAgent.makeURI(sip_aor)//`sip:${destination}@${"s1.netcitrus.com:7443"}`)
      const _headers = []
      const earlyMedia = true
      const inviteOptions = {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: video// Convert video to boolean
          }
        },
        extraHeaders: _headers,
        earlyMedia: earlyMedia,
        from: {
          uri: `sip:9099458674@${store.getState().sip.Server}`,
          displayName: 'Caller Name' // Effective Caller ID name
        }
      }
      console.log("inviteOptions->1", inviteOptions)

      // console.log("sip.userAgent", store.getState().sip.userAgent)
      const session = new Inviter(store.getState().sip.userAgent, uri, inviteOptions)

      store.dispatch(storeContactNumber({ key: "phoneNumber", value: destination }))
      store.dispatch(updateSipState({ key: "DialNumber", value: destination }))

      // console.log("phoneNumber========test", store.getState().sip.phoneNumber)

      // let incomingUser = session.remoteIdentity.displayName;
      // let userNumber = session.remoteIdentity.uri.normal.user

      //  getContactTableData(destination)

      // if (Callcount > 0) {
      //   console.log("Callcount1=======", Callcount)
      //   // toggelHoldCall(true, true)
      //   holdUsedSwipTime(store.getState().phoneNumber[0])
      //   store.dispatch(updateSipState({ key: "newCallAdd", value: 1 }))
      // }

      const SessionID = session?._id
      // console.log("SessionID",SessionID)
      store.dispatch(addSession({ sessionID: SessionID, session: session }))




      // var myCandidateTimeout = null;

      // session.on('icecandidate', function (candidate, ready) {
      //   console.log('getting a candidate' + candidate.candidate.candidate);
      //   if (myCandidateTimeout != null)
      //     clearTimeout(myCandidateTimeout);

      //   myCandidateTimeout = setTimeout(candidate.ready, 2000);
      // })

      session.stateChange.addListener(async newState => {
        store.dispatch(updateSipState({ key: "sesstionState", value: newState }))
        // console.log("newState", newState)
        switch (newState) {
          case SessionState.Establishing:
            if (video == true) {
              store.dispatch(updateSipState({ key: "VideoCallScreenOpen", value: true }))
            } else {
              store.dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
            }

            // timeStore = data
            console.debug('Session is establishing')
            store.dispatch(updateSipState({ key: "CallType", value: "OutGoComingCall" }))
            // if (store.Callcount == 0) {
            // RNCallKeep.startCall(incomingusebyClass.getCurrentCallId(), userNumber, userNumber, "number", false);
            // }
            // Configure outgoing call management
            // incomingusebyClass.setupOutgoingCallHandlers();

            store.dispatch(updateSipState({ key: "CallAns", value: true }))
            break
          case SessionState.Established:
            setupRemoteMedia(session, video)
            console.debug('Session has been ==> Established')
            console.debug('Session has been ==> Established')
            RNCallKeep.startCall(incomingusebyClass.getCurrentCallId(), '1234567890', '1234567890');
            incomingusebyClass.backToForeground()
            BackgroundTimer.setTimeout(() => {
              RNCallKeep.setCurrentCallActive(incomingusebyClass.getCurrentCallId());
            }, 1000);
            inCallManager.startProximitySensor();
            break
          case SessionState.Terminated:
            console.debug('Session Has Been Terminated')
            store.dispatch(updateSipState({ key: "IncomingScrrenOpen", value: false }))
            store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
            store.dispatch(updateSipState({ key: "ISCallTransfer", value: false }))
            store.dispatch(updateSipState({ key: "ISAttendedTransfer", value: false }))
            store.dispatch(updateSipState({ key: "ISConfrenceTransfer", value: false }))
            store.dispatch(updateSipState({ key: "Caller_Name", value: "" }))
            console.log("session.id", session.id)
            store.dispatch(removeSession(session.id))
            incomingusebyClass.endIncomingcallAnswer();
            inCallManager.stopProximitySensor();


            // if (session) {
            //   session.cancel();
            // }
            // const callLog = {
            //   "number": userNumber,
            //   "direction": "OutGoing",
            //   "duration": callDuration,
            //   "current_time": format(timeStore, 'yyyy-MM-dd kk:mm:ss'),
            //   "name": store.getState().sip.Caller_Name,
            //   "id": `${new Date().getTime()}`
            // }

            // CallLogStore(callLog)
            // console.log("newState->", session)
            // if (Callcount == 1) {
            //   store.dispatch(updateSipState({ key: "phoneNumber", value: [] }))
            //   store.dispatch(updateSipState({ key: "allSession", value: {} }))
            //   // incomingusebyClass.endIncomingcallAnswer();
            // } else {
            //   const SessionID = session?._id
            //   store.dispatch(removeSession({ key: SessionID, value: session }))
            // }
            // console.log("phoneNumber->", store.getState.phoneNumber)
            // console.log("allSession->", store.getState.allSession)
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
            store.dispatch(updateSipState({ key: "session", value: session }))
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
            video: video
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
          store.dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
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
    } catch (error) {
      console.log("error", error)
    }
  }

  hangupSession = (sestionID) => {
    const allSession = store.getState().sip.allSession
    const session = allSession[sestionID]
    if (session) {
      session.dispose()
    }
  }

  hangupCall = (phonenumber) => {
    const allSession = store.getState().sip.allSession
    console.log("allSession", allSession)
    if (allSession.length == null) {
      Object.keys(allSession).map(async (key) => {
        const session = allSession[key];
        session.dispose()
      })
    } else {
      Object.keys(allSession).map(async (key) => {
        const session = allSession[key];
        session.dispose()
      })
    }

    store.dispatch(updateSipState({ key: "phoneNumber", value: [] }))
    store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
    store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
    store.dispatch(updateSipState({ key: "ISCallTransfer", value: false }))
    store.dispatch(updateSipState({ key: "ISAttendedTransfer", value: false }))
    store.dispatch(updateSipState({ key: "ISConfrenceTransfer", value: false }))
    store.dispatch(updateSipState({ key: "Caller_Name", value: "" }))
    incomingusebyClass.endIncomingcallAnswer();
  }

  accepctCall = () => {
    console.log("this.sessionCall", sessionCall)
    store.dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
    store.dispatch(updateSipState({ key: "CallAns", value: false }))
  }

  disconnectSocket = () => {
    // store.getState().sip.registerer.unregister()
    // store.getState().sip.userAgent.stop().then(() => {
    //   console.log("UserAgent stopped. Reconnecting...");
    // });
    try {
      // Unregister from the SIP server
      store.getState().sip.registerer.unregister();
      console.log("Unregistration request sent");
      // Stop the UserAgent (this closes the WebSocket connection)
      store.getState().sip.userAgent.stop();
      console.log("UserAgent stopped, socket closed");
    } catch (error) {
      console.error("Error during unregistration or stopping the UserAgent:", error);
    }

  }

  sendDTMF = (digit) => {
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
    const { sessionID, allSession } = store.getState().sip
    if (sessionID) {
      allSession[sessionID]?.info(options)
    }
  }

  toggelHoldCall = async (state, sessionId = "") => {
    try {
      if (sessionId) {
        const { allSession } = store.getState().sip
        await this.HoldUnHoldSession(allSession[sessionId], state)
      }
      else {
        console.log('state', state)
        Object.keys(store.getState().sip.allSession).map(async (key) => {
          const session = store.getState().sip.allSession[key];
          console.log('session', session)
          this.HoldUnHoldSession(session, state)
        })
      }

    } catch (error) {
      console.debug('hold unhold hooks function error', error) // eslint-disable-line  prefer-template
    }
  }

  HoldUnHoldSession = async (session, state) => {
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
              if (state == true) {
                localMediaStream.hold()
              } else {
                localMediaStream.pause()
              }
            } else {
              if (state == true) {
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
  }

  MuteCall = async (state) => {
    try {
      const { sessionID, allSession } = store.getState().sip
      if (sessionID) {
        const session = allSession[sessionID]
        const pc = session.sessionDescriptionHandler.peerConnection
        pc.getSenders().forEach(function (stream) {
          stream.track.enabled = state;
        })
      }
    } catch (error) {
      console.debug('hold unhold hooks function error', error)
    }
  }

  blindTx = async (number) => {
    const allSession = store.getState().sip.allSession
    console.log("allSession", allSession)
    let userSession;
    Object.keys(allSession).map(async (key) => {
      userSession = allSession[key];
    })
    try {
      console.debug('sessiions', userSession)
      // Send an outgoing REFER request
      const transferTarget = UserAgent.makeURI(`sip:${number}@${store.getState().sip.Server}:${store.getState().sip.Port}`)
      console.log('BTXtransfer ==> ', transferTarget)
      if (!transferTarget) {
        throw new Error('Failed to create transfer target URI.')
      }
      userSession.refer(transferTarget, {
        // Example of extra headers in REFER request
        requestOptions: {
          extraHeaders: [`Referred-By : sip:${store.getState().sip.UserName}@${store.getState().sip.Server}:${store.getState().sip.Port}`]
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

  conference() {
    //take all received tracks from the sessions you want to merge
    const receivedTracks = [];
    const Allsessions = store.getState().sip.allSession;
    const sessions = Object.values(Allsessions)
    if (sessions) {
      sessions.forEach(function (session) {
        if (session !== null && session !== undefined) {
          const pc = session.sessionDescriptionHandler.peerConnection
          pc.getReceivers().forEach(function (stream) {
            stream.track.enabled = state;
            receivedTracks.push(stream.track);
          })
        }
      });

      const allReceivedMediaStreams = new MediaStream();

      for (const session of sessions) {
        if (session) {
          // const receivers = session.sipSession?.rtcSession?.connection.getReceivers();
          const receivers = session.sessionDescriptionHandler.peerConnection.getReceivers();
          if (receivers) {
            for (const receiver of receivers) {
              if (receiver.track.kind === 'audio') {
                allReceivedMediaStreams.addTrack(receiver.track);
              }
            }
          }

          // const senders = session.sipSession?.rtcSession?.connection.getSenders();
          const senders = session.sessionDescriptionHandler.peerConnection.getSenders();

          if (senders) {
            for (const sender of senders) {
              if (sender.track.kind === 'audio') {
                allReceivedMediaStreams.addTrack(sender.track);
              }
            }
            if (senders[0]) {
              senders[0].replaceTrack(allReceivedMediaStreams.getTracks()[0]);
            }
          }
        }
      }

      // Play all received streams to you
      // this.playRemote(allReceivedMediaStreams);
      AudioModule.playStream(allReceivedMediaStreams);

    }
    return true;
  }

}
export default SipUA = new SipClinet();
