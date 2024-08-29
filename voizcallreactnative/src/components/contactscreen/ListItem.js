// Access Device’s Contact List in React Native App
// https://aboutreact.com/access-contact-list-react-native/

import React, { memo, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';
import Avatar from './Avatar';
import SQLite from 'react-native-sqlite-storage';
import { AppCommon_Font } from '../../HelperClass/Constant';

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
  const { item, onPress,textColor } = props;
  const [isExist, setisExist] = useState(false);
  const [allcontacts, setallcontacts] = useState([]);

  const settextColor = (textColor == "W") ? 'white' : '#000000';

  useEffect(() => {
    getContactTableData()
  }, [])

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
          setContactUpdateTableData(item)

        },
        (error) => {
          console.error('Error retrieving data:', error);
        }
      );
    });
  }

  const setContactUpdateTableData = async (contactDetail) => {
    const RecordID = contactDetail.recordID
    const name = `${contactDetail.givenName} ${contactDetail.familyName}`
    const phonenumber = contactDetail.phoneNumbers[0].number
    const HasThumbnail = contactDetail.hasThumbnail
    const ThumbnailPath = contactDetail.thumbnailPath
    let sql = 'UPDATE ContactList SET name = ?, number = ?, thumbnail = ?,thumbnailpath = ? WHERE recordid = ?';
    let params = [name, phonenumber, HasThumbnail, ThumbnailPath, RecordID];
  
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE ContactList SET name = ?, number = ?, thumbnail = ?, thumbnailpath = ? WHERE recordid = ?',
        [name, phonenumber, HasThumbnail, ThumbnailPath, RecordID],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            // console.log('Update successful');
          } else {
            setContactTableData(contactDetail)
            console.log('No rows updated');
          }
        },
        (error) => {
          setContactTableData(contactDetail)
          console.error('Error updating contact:', error);
        }
      );
    });

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
          [name, phonenumber, RecordID, HasThumbnail, ThumbnailPath, Favourite],
          () => {
            console.log('Data inserted successfully.');
          },
          (error) => { console.error('Error inserting data:', error); }
        );
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={styles.itemContainer}>
          <View style={styles.leftElementContainer}>
            <Avatar
              img={
                item.hasThumbnail ?
                  { uri: item.thumbnailPath } : undefined
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
                style={[styles.titleStyle,{color:settextColor}] }
                >{`${item.givenName} ${item.familyName}`}</Text>
                <Text
                style={
                  [styles.titleStyle,{color:settextColor}]
                }>{item.phoneNumbers[0]?.number.replace(/\D/g, '')}</Text>
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
    height: 60,
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
    borderColor: '#515151',
  },
  mainTitleContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  titleStyle: {
    fontSize: 15,
    fontFamily:AppCommon_Font.Font,
  },
});

export default memo(ListItem);

ListItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
  textColor: PropTypes.string,
};