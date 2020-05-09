import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "modules/user/UserResolver";
import Express from "express";
import cors from "cors";
import "reflect-metadata";

const main = async () => {
   const schema = await buildSchema({
      resolvers: [UserResolver],
   });

   const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
   });

   const app = Express();

   app.use(
      cors({
         origin: ["http://localhost:3000"],
         credentials: true,
      })
   );

   apolloServer.applyMiddleware({
      app,
      cors: false,
      path: "/graphql",
   });

   const portNum = 4000;

   app.listen(portNum, () => {
      console.log(`BakTrak Server started on port ${portNum}`);
   });
};

main().catch((err) => console.log(err));
