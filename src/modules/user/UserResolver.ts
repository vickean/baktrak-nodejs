import { Resolver, Query } from "type-graphql";

@Resolver()
export class UserResolver {
   @Query(() => String)
   async UserHello() {
      console.log("Hello");
      return "Hello";
   }
}
