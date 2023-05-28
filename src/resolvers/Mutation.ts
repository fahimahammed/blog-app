import { prisma } from '../index.js'
import { Post, Prisma } from ".prisma/client"

interface IPostCreate {
    post: {
        title?: string;
        content?: string;
    }
}

interface IPostPayload {
    userErrors: {
        message: string
    }[],
    post: Post | Prisma.Prisma__PostClient<Post, never> | null
}

export const Mutation = {
    postCreate: async (parent: any, { post }: IPostCreate, __: any): Promise<IPostPayload> => {
        const { title, content } = post;
        if (!title || !content) {
            return {
                userErrors: [{
                    message: "You must provide title and content to create a post"
                }],
                post: null
            }
        }

        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: 1
                }
            })
        }
    },
    postUpdate: async (_: any, { post, postId }: { postId: string, post: IPostCreate["post"] }, __: any): Promise<IPostPayload> => {
        const { title, content } = post;
        if (!title && !content) {
            return {
                userErrors: [{
                    message: "You must provide title or, content to update a post"
                }],
                post: null
            }
        }
        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!existingPost) {
            return {
                userErrors: [{
                    message: "Post does not found in database!"
                }],
                post: null
            }
        }

        let payloadToUpdate = {
            title,
            content
        }
        if(!title) delete payloadToUpdate.title;
        if(!content) delete payloadToUpdate.content;


        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },
    
    postDelete: async(_:any, {postId}: {postId: string}, __:any): Promise<IPostPayload> => {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!post) {
            return {
                userErrors: [{
                    message: "Post does not found in database!"
                }],
                post: null
            }
        }

        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post
        }
    }
}