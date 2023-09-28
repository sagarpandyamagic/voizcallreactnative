import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
  Modal, Pressable, FlatList
} from 'react-native';
import { React, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { timeDifferenceCalculator } from 'time-difference-calculator';
import usecreateUA from './hook/usecreateUA';
import { useSelector } from 'react-redux';
import CallLogTimeFistLetterFind from './CallLogTimeFistLetterFind';
import CallLogTimeNameFind from './CallLogTimeNameFind';


import ic_Block from '../Assets/ic_next_arrow.png';
import ic_call from '../Assets/ic_call.png';
import ic_add_new_contact from '../Assets/ic_add_new_contact.png';
import ic_delete from '../Assets/ic_delete.png';

const getUiqueCallHistory = (allHistory) => {
  let numberMange = ""
  let d = []
  let groupUser = []
  allHistory.map((his) => {
    console.log("his", his)
    if (numberMange != "" && numberMange != (his["number"])) {
      groupUser.push({ [numberMange]: d })
      console.log("groupUser", groupUser)
      d = []
      numberMange = (his["number"])
      d.push(his)
      console.log("d", d)
    } else {
      numberMange = (his["number"])
      d.push(his)
      console.log("d", d)
    }
  })
  groupUser.push({ [numberMange]: d })
  console.log("groupUser", groupUser)
  return groupUser
}

const CallLogs = ({ navigation }) => {

  const [logData, setlogData] = useState()
  const [logInfoModal, setlogInfoModal] = useState(false)
  const [logInfoName, setlogInfoName] = useState()
  const [logInfoNumber, setlogInfoNumber] = useState([])
  const [logkey, setkey] = useState([])
  const { makeCall } = usecreateUA()
  const { newCallAdd } = useSelector((state) => state.sip)
  const [hideAddcontact, sethideAddcontact] = useState(false)

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      CallDataGet();
    });
  }, [navigation]);

  const CallDataGet = async () => {
    try {
      const value = await AsyncStorage.getItem("callLog");
      if (value !== null) {
        console.warn(value)
      }
      let AllCallLogs = value
      AllCallLogs = JSON.parse(AllCallLogs)
      console.log("Alluserlog", AllCallLogs)
      if (AllCallLogs.length > 0) {
        const formateLog = getUiqueCallHistory(AllCallLogs)
        setlogData(formateLog)
      } else {
        setlogData([])
      }
    } catch (e) {
    }
  }

  const deleteCallHistory = async () => {
    try {
      const value = await AsyncStorage.getItem("callLog");
      if (value !== null) {
        console.warn(value)
      }
      console.log("value", value)

      let AllCallLogs = value
      AllCallLogs = JSON.parse(AllCallLogs)
      let reaminHistory = AllCallLogs.filter((his) => {
        console.log("his", his)
        if (!logkey.includes(his.id)) {
          return his
        }
      })
      console.log("reaminHistory", reaminHistory)

      try {
        await AsyncStorage.setItem("callLog", JSON.stringify(reaminHistory));
        CallDataGet()
        setlogInfoModal(!logInfoModal)
      } catch (e) {
        // saving error
      }
    } catch (e) {
    }
  }

  const ModelContactInfo = () => {
    return (
      <View>
        <View style={styleModle.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={logInfoModal}
            onRequestClose={() => {
              alert('Modal has been closed.');
            }}>

            <View style={styleModle.centeredView}>
              <View style={styleModle.modalView}>
                <CallLogTimeNameFind number={logInfoNumber} sethideAddcontact={sethideAddcontact} />
                <Text style={styleModle.modalText}>{logInfoNumber}</Text>
                <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                  <Pressable
                    style={{ flexDirection: 'row', paddingTop: 15 }}
                    onPress={() => {
                      // const str = logInfoNumber.replace(/[^a-z0-9,. ]/gi, '');
                      // makeCall(str.replace(/ /g, ''))
                      // navigation.navigate('Dialpad')
                      setlogInfoModal(!logInfoModal)
                    }
                    }>
                    <View style={{ flex: 1, flexDirection: 'row', height: 40 }}>
                      <View style={{ paddingLeft: 10, paddingRight: 30 }}>
                        <Image source={ic_call} style={{ height: 25, width: 25 }}></Image>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styleModle.textStyle}>Call</Text>
                      </View>
                    </View>
                  </Pressable>
                  {
                    hideAddcontact == false && <Pressable
                      style={{ flexDirection: 'row', paddingTop: 15 }}
                      onPress={() => setlogInfoModal(!logInfoModal)
                      }>
                      <View style={{ flex: 1, flexDirection: 'row', height: 40 }}>
                        <View style={{ paddingLeft: 10, paddingRight: 20 }}>
                          <Image source={ic_add_new_contact} style={{ height: 25, width: 35 }}></Image>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styleModle.textStyle}>Add Contact</Text>
                        </View>
                      </View>
                    </Pressable>
                  }

                  <Pressable
                    style={{ flexDirection: 'row', paddingTop: 15 }}
                    onPress={deleteCallHistory}>
                    <View style={{ flex: 1, flexDirection: 'row', height: 40 }}>
                      <View style={{ paddingLeft: 10, paddingRight: 30 }}>
                        <Image source={ic_delete} style={{ height: 25, width: 25, tintColor: 'red' }}></Image>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styleModle.textStyle, { color: 'red' }]}>Delete History</Text>
                      </View>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>

    )
  }

  const CallTimeFind = (DateorTime) => {
    const myObject = DateorTime;
    console.log("myObject", myObject.Date)
    const date1 = new Date(myObject.Date)
    const date2 = format(new Date(), 'yyyy-MM-dd kk:mm:ss'); // Assuming it's the current dat
    return <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 15, marginBottom: 10 }}>
      {timeDifferenceCalculator(date2, date1)}
    </Text>
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {
          logData && logData.length > 0 ?
            <FlatList
              data={logData}
              renderItem={({ item }) =>
                <View style={{ backgroundColor: 'rgb(233,240,250)', margin: 5, borderRadius: 10 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                      setlogInfoModal(true)
                      setlogInfoName(item[Object.keys(item)[0]][0]?.name)
                      let allkeys = []
                      item[Object.keys(item)].map((key) => {
                        allkeys.push(key.id)
                      })
                      setkey(allkeys)
                      setlogInfoNumber(Object.keys(item)[0])
                    }
                    }>
                      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#4591ed', marginLeft: 10, height: 40, width: 40, borderRadius: 20 }}>
                        <CallLogTimeFistLetterFind number={Object.keys(item)[0]} isFontSizeBig={25} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <CallLogTimeNameFind number={Object.keys(item)[0]} count={item[Object.keys(item)[0]].length > 1 && ` (${item[Object.keys(item)[0]].length})`}  />
                        <Text style={{ fontSize: 12, color: 'black', marginTop: 5, marginLeft: 15, marginBottom: 10 }}>{Object.keys(item)[0]} </Text>
                      </View>
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 5, height: 40, borderRadius: 20, resizeMode: 'contain', flexDirection: 'row' }}>
                        < CallTimeFind Date={item[Object.keys(item)[0]][item[Object.keys(item)[0]].length - 1].current_time} />
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => {
                          navigation.navigate('CallLogDetails', { data: item })
                        }}>
                          <Image style={{ resizeMode: 'contain', height: 25, width: 25 }} tintColor={'black'} source={ic_Block}></Image>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              }
            /> : <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}> Data Not Found </Text>
            </View>
        }

      </View>
      <View>
        <ModelContactInfo />
      </View>
    </View>
  )
}

const styleModle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "60%",
  },
  buttonOpen: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    borderColor: 'rgba(16,94,174,1)',
    borderWidth: 1,
    width: "50%",
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight: 20,
    alignSelf: 'baseline',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  }
})

const style = StyleSheet.create({
  container: {
    // flex: 1,
    marginHorizontal: 16
  },
  item: {
    padding: 5,
    marginVertical: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    fontSize: 12,
    backgroundColor: "#d3d3d3",
    padding: 5,
    fontWeight: 'normal',
    paddingLeft: 15
  },
  title: {
    fontSize: 13,
    marginLeft: 15
  }
})

export default CallLogs