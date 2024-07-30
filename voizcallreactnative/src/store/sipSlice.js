import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  soketConnect:false,
  CallAns: false,
  session: {},
  sesstionState: "",
  userAgent: {},
  callDireaction: "",
  CallScreenOpen:false,
  DTMFSCreen:false,
  allSession:{},
  sessionID:"",
  newCallAdd:0,
  VideoCallScreenOpen:true,
  phoneNumber:[],
  remoteStream:"",
  CallLogStore:[],
  UserName:"",
  Password:"",
  Server:"",
  Port:"",
  Caller_Name:"",
  CallType:"",
  removeSession:{},
  IncomingScrrenOpen:false
}
export let Callcount = 0

const counterSlice = createSlice({
  name: 'sipSlice',
  initialState,
  reducers: {
    updateSipState: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value
      if(key == "CallScreenOpen" && value == false && state.allSession == {}){
        Callcount = 0
        newCallAdd = 0
        CallType=""
      }
      console.log("updateSipState")
    },
    addSession:(state,action) =>{
      const { sessionID, session } = action.payload;
      state.allSession[sessionID] = session
      state.sessionID =  sessionID
      Callcount = Callcount + 1 
      console.log("Callcount->=======", Callcount)
    },
    storeContactNumber:(state,action) => {
      const { key, value } = action.payload;
      state[key].push(value)
    },
    CallNumberCoundRemove:(start,action) => {
      Callcount = Callcount - 1 
      console.log("Callcount->=======", Callcount)
    },
    removeSession:(state,action)=>{
      const {sessionID,session } = action.payload;
      state.phoneNumber.filter((prevItem) => prevItem !== session?.remoteIdentity?.uri?.user || '')
      delete state.allSession[sessionID];
      Callcount = Callcount - 1 
    },
    inticalluserData:(state,action) =>{
      const payload = action.payload
      state.UserName = payload.sipusername
      state.Password = payload.password
      state.Server = payload.sipserver
      state.Port = payload.sipport
    }
  }
})

export const { removeSession,updateSipState,addSession,storeContactNumber,CallNumberCoundRemove ,inticalluserData} = counterSlice.actions
export default counterSlice.reducer
