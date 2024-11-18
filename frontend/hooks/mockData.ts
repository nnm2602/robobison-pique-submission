export interface User {
    _id: string;
    firebaseUID: string;
    username: string;
    distance?: string;
    profile: {
      imageUri?: string;
      firstName?: string;
      lastName?: string;
      bio?: string;
    };
  }
  
  export const hardcodedUsers: User[] = [
    {
      _id: '1',
      firebaseUID: 'firebaseUID1',
      username: 'user1',
      distance: '50 m',
      profile: {
        imageUri: require('../assets/profile_pictures/profile1.jpeg'),
        firstName: 'Sophia',
        lastName: 'Williams',
        bio: 'Avid reader, tea lover, and amateur painter. Always exploring new things.',
      },
    },
    {
      _id: '2',
      firebaseUID: 'firebaseUID2',
      username: 'user2',
      distance: '80 m',
      profile: {
        imageUri: require('../assets/profile_pictures/profile2.jpeg'),
        firstName: 'Emily',
        lastName: 'Johnson',
        bio: 'A chef in the making. Let’s talk food, art, and travel!',
      },
    },
    {
      _id: '3',
      firebaseUID: 'firebaseUID3',
      username: 'user3',
      distance: '100 m',
      profile: {
        imageUri: require('../assets/profile_pictures/profile3.jpeg'),
        firstName: 'James',
        lastName: 'Brown',
        bio: 'Tech enthusiast, cyclist, and nature lover. Always up for an adventure.',
      },
    },
    {
      _id: '4',
      firebaseUID: 'firebaseUID4',
      username: 'user4',
      distance: '30 m',
      profile: {
        imageUri: require('../assets/profile_pictures/profile4.jpeg'),
        firstName: 'Olivia',
        lastName: 'Martinez',
        bio: 'Writer and dreamer. Let’s chat about books and creativity!',
      },
    },
    {
      _id: '5',
      firebaseUID: 'firebaseUID5',
      username: 'user5',
      distance: '20 m',
      profile: {
        imageUri: require('../assets/profile_pictures/profile5.jpeg'),
        firstName: 'Isabella',
        lastName: 'Garcia',
        bio: 'Music is my life. Guitar player and occasional singer.',
      },
    },
  ];