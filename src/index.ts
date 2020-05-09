import { buildSchema } from "type-graphql";
import { UserResolver } from "modules/user/UserResolver";
import "reflect-metadata";

const main = async () => {
   const schema = await buildSchema({
      resolvers: [UserResolver],
   });
};

main().catch((err) => console.log(err));
