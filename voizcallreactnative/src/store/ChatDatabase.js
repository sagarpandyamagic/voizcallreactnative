import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'chat.db', location: 'default' });

const createTables = () => {
    // Create a promise to ensure table creation is synchronous
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            // Create Users Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Users (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );`,
                [],
                (tx, result) => console.log('Users table created successfully!'),
                (tx, error) => {
                    console.error('Error creating Users table', error);
                    reject(error);
                }
            );

            // Create Media Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Media (
                    media_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    media_type TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    file_size INTEGER,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(user_id) REFERENCES Users(user_id)
                );`,
                [],
                (tx, result) => console.log('Media table created successfully!'),
                (tx, error) => {
                    console.error('Error creating Media table', error);
                    reject(error);
                }
            );

            // Create Messages Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Messages (
                    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sender_id INTEGER,
                    receiver_id INTEGER,
                    message_text TEXT,
                    media_id INTEGER,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_read INTEGER DEFAULT 0,
                    FOREIGN KEY(sender_id) REFERENCES Users(user_id),
                    FOREIGN KEY(receiver_id) REFERENCES Users(user_id),
                    FOREIGN KEY(media_id) REFERENCES Media(media_id)
                );`,
                [],
                (tx, result) => {
                    console.log('Messages table created successfully!');
                    resolve(result); // Resolve the promise after successful creation
                },
                (tx, error) => {
                    console.error('Error creating Messages table', error);
                    reject(error);
                }
            );
        });
    });
};

// Call this function during app initialization
export const initializeDatabaseForChat = async () => {
    try {
        await createTables();
        console.log('All tables are initialized.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export const insertMedia = (userId, mediaType, filePath, fileSize) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO Media (user_id, media_type, file_path, file_size) VALUES (?, ?, ?, ?)',
            [userId, mediaType, filePath, fileSize],
            (tx, result) => console.log('Media inserted successfully!', result),
            (tx, error) => console.error('Error inserting media', error)
        );
    });
};


export const insertMessage = (senderId, receiverId, messageText, mediaId) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO Messages (sender_id, receiver_id, message_text, media_id) VALUES (?, ?, ?, ?)',
            [senderId, receiverId, messageText, mediaId],
            (tx, result) => console.log('Message inserted successfully!', result),
            (tx, error) => console.error('Error inserting message', error)
        );
    });
};

export const fetchMessagesWithMedia = (userId) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT m.message_id, m.message_text, m.timestamp, media.file_path, media.media_type ' +
            'FROM Messages m LEFT JOIN Media media ON m.media_id = media.media_id ' +
            'WHERE m.receiver_id = ? OR m.sender_id = ?',
            [userId, userId],
            (tx, results) => {
                const messages = [];
                for (let i = 0; i < results.rows.length; i++) {
                    messages.push(results.rows.item(i));
                }
                console.log('Fetched messages with media:', messages);
            },
            (tx, error) => console.error('Error fetching messages', error)
        );
    });
};
