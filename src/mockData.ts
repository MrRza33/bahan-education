import { SavedAccount } from './types';

export const SAVED_ACCOUNTS: SavedAccount[] = [
  {
    id: 'saved_1',
    username: 'asep_sunandar',
    fullName: 'Asep Sunandar',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    followers: 1240,
    unseenStories: true,
  },
  {
    id: 'saved_2',
    username: 'jessica.m_99',
    fullName: 'Jessica Monica',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    followers: 5820,
    unseenStories: false,
  }
];

export interface MockStory {
  id: string;
  username: string;
  avatarUrl: string;
  isSeen: boolean;
  storyImage: string;
}

export interface MockComment {
  id: string;
  username: string;
  text: string;
  time: string;
}

export interface MockPost {
  id: string;
  username: string;
  userAvatar: string;
  location?: string;
  imageUrl: string;
  caption: string;
  likes: number;
  isLikedCount: boolean;
  timeAgo: string;
  commentsCount: number;
  comments: MockComment[];
}

export const MOCK_STORIES: MockStory[] = [
  {
    id: 'story_1',
    username: 'asep_sunandar',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    isSeen: false,
    storyImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=1000&q=80'
  },
  {
    id: 'story_2',
    username: 'jessica.m_99',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    isSeen: false,
    storyImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&h=1000&q=80'
  },
  {
    id: 'story_3',
    username: 'christopher_k',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    isSeen: true,
    storyImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&h=1000&q=80'
  },
  {
    id: 'story_4',
    username: 'clara_adventurer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    isSeen: false,
    storyImage: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&h=1000&q=80'
  },
  {
    id: 'story_5',
    username: 'budi_hartono',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    isSeen: true,
    storyImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&h=1000&q=80'
  }
];

export const MOCK_POSTS: MockPost[] = [
  {
    id: 'post_1',
    username: 'traveler_globe',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    location: 'Raja Ampat, Indonesia',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=600&q=80',
    caption: 'Menikmati keindahan alam Indonesia yang luar biasa indahnya. Surga dunia di bumi Papua! 🇮🇩✨ #travel #paradise #rajaampat #wonderfullindonesia',
    likes: 1249,
    isLikedCount: false,
    timeAgo: '2 JAM YANG LALU',
    commentsCount: 3,
    comments: [
      {
        id: 'comment_1_1',
        username: 'asep_sunandar',
        text: 'Keren banget sih kang! Kapan-kapan ajak lah kesana haha',
        time: '1j'
      },
      {
        id: 'comment_1_2',
        username: 'jessica.m_99',
        text: 'Oh my God, local paradise! Nabung dulu ah biar bisa kesana 😍',
        time: '50m'
      },
      {
        id: 'comment_1_3',
        username: 'budi_hartono',
        text: 'Airnya jernih banget ya, asli pengen nyebur lgsg',
        time: '20m'
      }
    ]
  },
  {
    id: 'post_2',
    username: 'budi_hartono',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    location: 'Bandung, Jawa Barat',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=600&q=80',
    caption: 'Coffee and coding. Menikmati pagi syahdu di Bandung sambil nyelesaiin project baru! ☕💻 #codinglife #workfromcafe #bandung',
    likes: 85,
    isLikedCount: false,
    timeAgo: '5 JAM YANG LALU',
    commentsCount: 2,
    comments: [
      {
        id: 'comment_2_1',
        username: 'asep_sunandar',
        text: 'Mantap bud, tancap gas terus projekannya!',
        time: '4j'
      },
      {
        id: 'comment_2_2',
        username: 'clara_adventurer',
        text: 'Cafes in Bandung are always top notch 👍',
        time: '3j'
      }
    ]
  }
];
