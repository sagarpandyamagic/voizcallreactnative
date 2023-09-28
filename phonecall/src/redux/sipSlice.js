import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  soketConnect:false,
  incomingcall: false,
  session: {},
  sesstionState: "",
  userAgent: {},
  callDireaction: "",
  CallScreenOpen:false,
  DTMFSCreen:false,
  allSession:{},
  sessionID:"",
  newCallAdd:0,
  VideoCallScreenOpen:false,
  phoneNumber:[],
  remoteStream:"",
  CallLogStore:[],
  UserName:"",
  Password:"",
  Server:"",
  Port:"",
  Caller_Name:"",
}
export let Callcount = 0

export const counterSlice = createSlice({
  name: 'sipSlice',
  initialState,
  reducers: {
    updateSipState: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value
      if(key == "CallScreenOpen" && value == false){
        Callcount = 0
        newCallAdd = 0
      }
    },
    addSession:(state,action) =>{
      const { sessionID, session } = action.payload;
      state.allSession[sessionID] = session
      Callcount = Callcount + 1 
    },
    storeContactNumber:(state,action) => {
      const { key, value } = action.payload;
      console.log("Phonenumber", value)
      state[key].push(value)
      console.log("Phonenumber1", state[key])
    },
  }
})

export const { updateSipState,addSession,storeContactNumber } = counterSlice.actions
export default counterSlice.reducer
