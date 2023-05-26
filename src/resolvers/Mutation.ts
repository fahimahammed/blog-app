import {prisma} from '../index.js'
import {Post} from ".prisma/client"

interface IPostCreate {
    title: string;
    content: string;
}

interface IPostPayload {
    userErrors: {
        message: string
    }[],
    post: Post | null
}

export const Mutation = {
    postCreate: async (parent:any, {title, content}:IPostCreate, __:any): Promise<IPostPayload> =>  {
        if(!title || !content){
            return {
                userErrors: [{
                    message: "You must provide title and content to create a post"
                }],
                post: null
            }
        }
        
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1
            }
        })

        return {
            userErrors: [],
            post: post
        }
    }
}