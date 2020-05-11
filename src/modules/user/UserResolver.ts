import { Resolver, Query, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";
import { getRepository } from "typeorm";
import { User } from "entity/User";

@Resolver()
export class UserResolver {
   @Query(() => String)
   async UserHello() {
      console.log("Hello");
      return "Hello";
   }

   @Query(() => User)
   async User(
      @Arg("id") id: string,
      @Arg("phoneNo", { nullable: true }) phoneNo: string
   ) {
      const userData = await getRepository(User)
         .createQueryBuilder("user")
         .where("user.id = :id", { id })
         .orWhere("user.phoneNo = :phoneNo", { phoneNo })
         .getOne();

      return userData;
   }

   @Mutation(() => User)
   async loginUser(
      @Arg("phoneNo") phoneNo: string,
      @Arg("password") password: string
   ) {
      const user = await getRepository(User)
         .createQueryBuilder("user")
         .where("user.phoneNo = :phoneNo", { phoneNo })
         .getOne();

      if (user === undefined) {
         throw new Error("PhoneNo does not exist. Please register.");
      }

      const validatePassword = await bcrypt.compare(password, user.password);

      if (!validatePassword) {
         throw new Error("Invalid password");
      }

      return user;
   }

   @Mutation(() => Boolean)
   async createUser(
      @Arg("name") name: string,
      @Arg("phoneNo") phoneNo: string,
      @Arg("email") email: string,
      @Arg("password") password: string,
      @Arg("address") address: string
   ) {
      const currentUser = await getRepository(User)
         .createQueryBuilder("user")
         .where("user.phoneNo = :phoneNo", { phoneNo })
         .getOne();

      if (currentUser !== undefined) {
         throw new Error("Phone number is already in use.");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const createUser = await getRepository(User).save({
         name,
         phoneNo,
         email,
         password: hashedPassword,
         address,
      });

      console.log(createUser);

      return true;
   }

   @Mutation(() => Boolean)
   async updateUser(
      @Arg("name") name: string,
      @Arg("phoneNo") phoneNo: string,
      @Arg("email") email: string,
      @Arg("password") password: string,
      @Arg("address") address: string,
      @Arg("id") id: string
   ) {
      const currentUser = await getRepository(User)
         .createQueryBuilder("user")
         .where("user.phoneNo = :phoneNo", { phoneNo })
         .andWhere("user.id != :id", { id })
         .getOne();

      if (currentUser !== undefined) {
         throw new Error("Phone number is already in use.");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const updateUser = await getRepository(User).save({
         id,
         name,
         phoneNo,
         email,
         password: hashedPassword,
         address,
      });

      console.log(updateUser);

      return true;
   }
}
