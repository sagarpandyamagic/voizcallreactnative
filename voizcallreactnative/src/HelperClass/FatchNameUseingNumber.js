import { useCallback } from "react";
import Contacts from 'react-native-contacts';

export const findContactByNumber = useCallback(async (phoneNumber) => {
    try {
        const contacts = await Contacts.getAll();
        const foundContact = contacts.find(contact => 
            contact.phoneNumbers.some(phone => 
                phone.number.replace(/[^0-9]/g, '').includes(phoneNumber.replace(/[^0-9]/g, ''))
            )
        );
        if (foundContact) {
            return (foundContact.familyName + " " + foundContact.givenName);
        } else {
            return 'Unknown'
        }
    } catch (e) {
        return 'Unknown'
    }
}, []);
