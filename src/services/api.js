import db from '../data/db.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchPosts = async () => {
    await delay(1000);
    return db.posts.map(p => ({
        ...p,
        user: db.profiles[p.userHandle]
    }));
};

export const fetchPostById = async (id) => {
    await delay(500);
    const post = db.posts.find(p => p.id === id);
    if (!post) throw new Error('Post not found');
    return {
        ...post,
        user: db.profiles[post.userHandle]
    };
};

export const fetchProfiles = async () => {
    await delay(800);
    return db.profiles;
};

export const fetchNotifications = async () => {
    await delay(700);
    return db.notifications;
};

export const fetchConversations = async () => {
    await delay(1000);
    return db.conversations.map(c => ({
        ...c,
        user: db.profiles[c.userHandle]
    }));
};
