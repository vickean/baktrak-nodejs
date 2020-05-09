import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "modules/user/UserResolver";
import Express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { LocationResolver } from "modules/location/LocationResolver";
import { UserLocAsgResolver } from "modules/userLocAsg/UserLocAsgResolver";

const main = async () => {
   await createConnection();

   const schema = await buildSchema({
      resolvers: [UserResolver, LocationResolver, UserLocAsgResolver],
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
      console.log(`BakTrak Server started on http://localhost:${portNum}/graphql`);
   });
};

main().catch((err) => console.log(err));
