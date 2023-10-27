import RNCallKeep from "react-native-callkeep";
import { Inviter, Registerer, RegistererState, SessionState, UserAgent } from "sip.js";
import { RTCPeerConnection, mediaDevices } from "react-native-webrtc";
import store from "./redux/store";
import { setupRemoteMedia } from "./hook/utlis";
import SQLite from 'react-native-sqlite-storage';
import { createCallLogTable, setCallLogTable } from "./CallLog/DBCallLog";
import { addSession, storeContactNumber, updateSipState } from './redux/sipSlice';
import { callDuration } from "./CallTimer";
import { format } from 'date-fns';
import incomingusebyClass from "./incomingusebyClass";


let sessionCall = null;

const db = SQLite.openDatabase(
  {
    name: 'myDatabase.db',
    location: 'default',
  },
  () => { console.log('Database opened.'); },
  error => { console.log(error) }
);

class skoect {

  

  connect = async () => {
    createCallLogTable()
    
    let timeStore = ""
    const data = new Date()
    try {
      const webSoket = `wss://${store.getState().sip.Server}:${store.getState().sip.Port}`
      const sip_aor = `sip:${store.getState().sip.UserName}@${store.getState().sip.Server}:${store.getState().sip.Port}` //`sip:${"101030"}@${"s1.netcitrus.com:5090"}`
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
        authorizationPassword: store.getState().sip.Password,//"1010@0101Aa30",
        authorizationUsername: store.getState().sip.UserName,//"101030",
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

      store.dispatch(updateSipState({ key: "userAgent", value: USERAGENT }))

      USERAGENT.start()
        .then(() => {
          registerer.stateChange.addListener(newState => {
            switch (newState) {
              case RegistererState.Initial:
                console.log('UserAgent ==> Initial')
                break
              case RegistererState.Registered:
                store.dispatch(updateSipState({ key: "soketConnect", value: true }))

                console.log('UserAgent ==> Registered')
                break
              case RegistererState.Unregistered:
                store.dispatch(updateSipState({ key: "soketConnect", value: false }))

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
          console.log('invitations', invitation)
          console.log('invitation?.request?.callId', invitation?.request?.callId)
          console.log('invitation?.request?.callId', invitation?.request?.callId)

          store.dispatch(updateSipState({ key: "session", value: invitation }))

          // incoming = true

          getContactTableData(number)
          store.dispatch(updateSipState({ key: "Caller_Name", value: "Unknown" }))


          store.dispatch(storeContactNumber({ key: "phoneNumber", value: number }))
          const SessionID = invitation?._id
          store.dispatch(addSession({ sessionID: SessionID, session: invitation }))

          console.log("phoneNumber========test", number)
          sessionCall = invitation
          console.log("sessionCall========test", sessionCall)

          invitation.delegate = {
            //  Handle incoming onCancel request
            onRefer(referral) {
              console.log('referral', referral)
            },

            onCancel(message) {
              console.log('ON CANCEL - message ==> ', message)
              store.dispatch(updateSipState({ key: "incomingcall", value: false }))
              store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
              store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))

              RNCallKeep.clearInitialEvents();
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
                break
              case 'Establishing':
                console.log('Incoming Session state Establishing')
                break
              case 'Established':
                timeStore = data
                // TimerAction('start')
                console.log('Incoming Session state Established')
                setupRemoteMedia(invitation, false)
                break
              case 'Terminating':
                console.log('Terminating')
                break
              case 'Terminated':
                console.log('Terminated Call')
                // TimerActio('stop')

                const callLog = {
                  "number": number,
                  "direction": "Incomging",
                  "duration": callDuration,
                  "current_time": timeStore != "" ? format(timeStore, 'yyyy-MM-dd kk:mm:ss') : "00:00:00",
                  "name": store.getState().sip.Caller_Name == "" ? "Unknown" : store.getState().sip.Caller_Name,
                  "id": `${new Date().getTime()}`
                }
                CallLogStore(callLog)
                console.log('Terminated')

                store.dispatch(updateSipState({ key: "incomingcall", value: false }))
                store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
                store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
                store.dispatch(updateSipState({ key: "phoneNumber", value: [] }))
                store.dispatch(updateSipState({ key: "allSession", value: {} }))
                incomingusebyClass.endIncomingcallAnswer();
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

    const CallLogStore = (callLog) => {
      setCallLogTable(callLog)
      store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
      store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
    }
  }


  makeCall = async (destination) => {
    let timeStore = ""
    const data = new Date()
    let localMediaStream;


   

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

    const CallLogStore = (callLog) => {
      setCallLogTable(callLog)
      store.dispatch(updateSipState({ key: "newCallAdd", value: 0 }))
      store.dispatch(updateSipState({ key: "CallScreenOpen", value: false }))
    }

    const video = false
    const sip_aor = `sip:${destination}@${store.getState().sip.Server}${store.getState().sip.Port}`

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
    const session = new Inviter(store.getState().sip.userAgent, uri, inviteOptions)

    store.dispatch(storeContactNumber({ key: "phoneNumber", value: destination }))

    let incomingUser = session.remoteIdentity.displayName;
    let userNumber = session.remoteIdentity.uri.normal.user

    getContactTableData(destination)

    console.log("userNumber", userNumber)

    // if (Callcount > 0) {
    //   toggelHoldCall(true, true)
    //   store.dispatch(updateSipState({ key: "newCallAdd", value: 1 }))
    //   console.log("newCallAdd1", newCallAdd)
    // }

    // console.log("newCallAdd", newCallAdd)
    const SessionID = session?._id
    store.dispatch(addSession({ sessionID: SessionID, session: session }))

    session.stateChange.addListener(newState => {
      store.dispatch(updateSipState({ key: "sesstionState", value: newState }))
      switch (newState) {
        case SessionState.Establishing:
          if (video == true) {
            store.dispatch(updateSipState({ key: "VideoCallScreenOpen", value: true }))
          } else {
            store.dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
          }
          timeStore = data
          // TimerAction('start')
          console.debug('Session is establishing')
          store.dispatch(updateSipState({ key: "CallType", value: "OutGoComingCall" }))
          // RNCallKeep.setCurrentCallActive("cb499f3e-1521-4467-a51b-ceea76ee92b6");
          RNCallKeep.startCall(incomingusebyClass.getCurrentCallId(), userNumber, userNumber, "number", false);
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
          // TimerAction('stop')


          const callLog = {
            "number": userNumber,
            "direction": "OutGoing",
            "duration": callDuration,
            "current_time": format(timeStore, 'yyyy-MM-dd kk:mm:ss'),
            "name": store.getState().sip.Caller_Name,
            "id": `${new Date().getTime()}`
          }

          CallLogStore(callLog)
          store.dispatch(updateSipState({ key: "phoneNumber", value: [] }))
          store.dispatch(updateSipState({ key: "allSession", value: {} }))
          incomingusebyClass.endIncomingcallAnswer();
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
    store.dispatch(updateSipState({ key: "remoteStream", value: localMediaStream })) // Video Call Time Used
  }


  hangupCall = () => {
    const allSession = store.getState().sip.allSession
    console.log("allSession", allSession)
    if (allSession.length == null) {
      const session = allSession[Object.keys(allSession)];
      session.dispose()
    } else {
      Object.keys(allSession).map(async (key) => {
        const session = allSession[key];
        session.dispose()
      })
    }
  }



  accepctCall = () => {
    console.log("this.sessionCall", sessionCall)
    store.dispatch(updateSipState({ key: "CallScreenOpen", value: true }))
    store.dispatch(updateSipState({ key: "incomingcall", value: false }))
  }

}
export default skoectcall = new skoect();
