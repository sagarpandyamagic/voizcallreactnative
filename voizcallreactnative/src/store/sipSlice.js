import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  soketConnect: false,
  CallAns: false,
  session: {},
  sesstionState: "",
  userAgent: {},
  callDireaction: "",
  CallScreenOpen: false,
  DTMFSCreen: false,
  allSession: {},
  sessionID: "",
  newCallAdd: 0,
  VideoCallScreenOpen: true,
  phoneNumber: [],
  remoteStream: "",
  CallLogStore: [],
  UserName: "",
  Password: "",
  Server: "",
  Port: "",
  Caller_Name: "",
  CallType: "",
  removeSession: {},
  IncomingScrrenOpen: false,
  ISCallTransfer: false,
  ISAttendedTransfer: false,
  ISConfrenceTransfer: false,
  DialNumber: "",
  SessionCount: 0,
  AppISBackGround:false,
  registerer:{},
  UserActive:true,
  UserDND:false,
  AppOpenTimeRootChange:"SplashScreen",
}

const counterSlice = createSlice({
  name: 'sipSlice',
  initialState,
  reducers: {
    updateSipState: (state, action) => {
      const { key, value } = action.payload;
      console.log("key", key)
      console.log("value", value)

      state[key] = value
      if (key == "CallScreenOpen" && value == false && state.allSession == {}) {
        newCallAdd = 0
        CallType = ""
      }
      state.SessionCount = Object.keys(state.allSession).length
      console.log("updateSipState")
    },
    addSession: (state, action) => {
      const { sessionID, session } = action.payload;
      state.allSession[sessionID] = session
      state.sessionID = sessionID
      state.SessionCount = Object.keys(state.allSession).length
    },
    storeContactNumber: (state, action) => {
      const { key, value } = action.payload;
      state[key].push(value)
    },
    CallNumberCoundRemove: (state, action) => {
      state.SessionCount = Object.keys(state.allSession).length
    },
    removeSession: (state, action) => {
      const sessionID = action.payload;
      console.log("allSession----", state.allSession);

      const allSession = Object.assign({...state.allSession})
      const session = allSession[sessionID]
      // Update phone numbers immutably
      state.phoneNumber = state.phoneNumber.filter(
        (prevItem) => prevItem !== (session?.remoteIdentity?.uri?.user || '')
      );
    
      console.log("removeitme----", allSession[`${sessionID}`]);

      // Delete session immutably
      delete allSession[`${sessionID}`];
    
      // Update session count
      state.SessionCount = Object.keys(allSession).length;
    
      // Update DialNumber if there are remaining sessions
      const keys = Object.keys(allSession);
      if (keys.length > 0) {
        const lastSession = allSession[keys[keys.length - 1]];
        state.DialNumber = lastSession?.remoteIdentity?.uri?.user || '';
      } else {
        state.DialNumber = '';
      }
      state.allSession = allSession
      console.log("keys.length----", keys.length);
      console.log("number----", state.DialNumber);
      console.log("allSession----", allSession);
    },
    inticalluserData: (state, action) => {
      const payload = action.payload
      state.UserName = payload.sipusername
      state.Password = payload.password
      state.Server = payload.sipserver
      state.Port = payload.sipport
    }
  }
})

export const { removeSession, updateSipState, addSession, storeContactNumber, CallNumberCoundRemove, inticalluserData } = counterSlice.actions
export default counterSlice.reducer
