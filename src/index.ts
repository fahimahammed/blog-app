import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema.js';
import { Query } from './resolvers/Query.js';
import { Mutation } from './resolvers/Mutation.js';
import { PrismaClient, Prisma } from "@prisma/client"

interface MyContext {
    token?: string;
    //prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
}

const app = express();
const httpServer = http.createServer(app);

export const prisma = new PrismaClient();

const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers:{
        Query,
        Mutation
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({ 
            token: req.headers.token
         }),
    }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);