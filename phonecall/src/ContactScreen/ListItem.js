// Access Device’s Contact List in React Native App
// https://aboutreact.com/access-contact-list-react-native/

import React, {memo, useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

import PropTypes from 'prop-types';
import Avatar from './Avatar';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'myDatabase.db',
    location: 'default',
  },
  () => { console.log('Database opened.'); },
  error => { console.log(error) }
);

const getAvatarInitials = (textString) => {
  if (!textString) return '';
  const text = textString.trim();
  const textSplit = text.split(' ');
  if (textSplit.length <= 1) return text.charAt(0);
  const initials =
    textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
  return initials;
};

const ListItem = (props) => {
  const shouldComponentUpdate = () => {
    return false;
  };
  const {item, onPress} = props;
  const [isExist, setisExist] = useState(false);
  const [allcontacts, setallcontacts] = useState([]);

  // console.log("item",item)

  useEffect(()=>{
    getContactTableData()
    setContactUpdateTableData(item)
  },[])

  const getContactTableData = () => {
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
          setisExist(true)
          setallcontacts(users)
          console.log('Data retrieved successfully:', users);
        },
        (error) => { 
          createContactTable()
          console.error('Error retrieving data:', error); 
        }
      );
    });
  }

  const setContactUpdateTableData = async (contactDetail) => {
    if (allcontacts.length > 0 ) {
      const RecordID = contactDetail.recordID
      const name = `${contactDetail.givenName} ${contactDetail.familyName}`
      const phonenumber = contactDetail.phoneNumbers[0].number
      const HasThumbnail = contactDetail.hasThumbnail
      const ThumbnailPath = contactDetail.thumbnailPath
      let sql = 'UPDATE ContactList SET name = ?, number = ?, thumbnail = ?,thumbnailpath = ? WHERE recordid = ?';
      let params = [name, phonenumber,HasThumbnail,ThumbnailPath, RecordID];
      db.executeSql(sql, params, (resultSet) => {
          console.log('Record updated successfully')
      }, (error) => {
          setContactTableData(contactDetail)
          console.log(error);
      });
    }else{
      setContactTableData(contactDetail)
    }
  }

  const setContactTableData = async (contactDetail) => {
    const name = `${contactDetail.givenName} ${contactDetail.familyName}`
    const phonenumber = contactDetail.phoneNumbers[0].number
    const RecordID = contactDetail.recordID
    const HasThumbnail = contactDetail.hasThumbnail
    const ThumbnailPath = contactDetail.thumbnailPath
    const Favourite = ""

    try {
      await db.transaction(async (tx) => {
        tx.executeSql(
          "INSERT INTO ContactList (name, number,recordid,thumbnail,thumbnailpath,isfavourite) VALUES (?,?,?,?,?,?)",
          [name, phonenumber, RecordID, HasThumbnail, ThumbnailPath,Favourite],
          () => { console.log('Data inserted successfully.'); },
          (error) => { console.error('Error inserting data:', error); }
        );
      })
    } catch (error) {
      console.log(error);
    }
  }



  // AllContact(item)
  return (
    <View>
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.leftElementContainer}>
            <Avatar
              img={
                item.hasThumbnail ?
                  {uri: item.thumbnailPath} : undefined
              }
              placeholder={getAvatarInitials(
                `${item.givenName} ${item.familyName}`,
              )}
              width={40}
              height={40}
            />
          </View>
          <View style={styles.rightSectionContainer}>
            <View style={styles.mainTitleContainer}>
              <Text
                style={
                  styles.titleStyle
                }>{`${item.givenName} ${item.familyName}`}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    minHeight: 44,
    height: 55,
  },
  leftElementContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
    paddingLeft: 13,
  },
  rightSectionContainer: {
    marginLeft: 18,
    flexDirection: 'row',
    flex: 20,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#515151',
  },
  mainTitleContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  titleStyle: {
    fontSize: 16,
  },
});

export default memo(ListItem);

ListItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};