import {prisma} from '../index.js';
export const Query = {
    posts: async () =>{
        const posts = await prisma.post.findMany({
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ]
        })
        return posts;
    }
}