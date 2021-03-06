import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { getRepository, Between } from "typeorm";
import { UserLocAsg, UserListOutput } from "entity/UserLocAsg";
import { Order } from "entity/Base";
import { Location } from "entity/Location";

@Resolver()
export class UserLocAsgResolver {
   @Query(() => String)
   async UserLocAsgHello(
      @Arg("name", { nullable: true }) name: string,
      @Arg("age", { nullable: true }) age: string
   ) {
      console.log("UserLocAsg Hello>> ", name, age);
      return "UserLocAsg Hello";
   }

   @Query(() => [UserListOutput])
   async UserLocAsgList(@Arg("userId") userId: string) {
      const history = await getRepository(UserLocAsg)
         .createQueryBuilder("asg")
         .select("asg.dateTime", "dateTime")
         .addSelect("loc.name", "name")
         .addSelect("loc.address", "address")
         .innerJoin(Location, "loc", "asg.locationId = loc.id")
         .where("asg.userId = :userId", { userId })
         .orderBy("asg.dateTime", "DESC")
         .limit(20)
         .getRawMany();

      // console.log("LIST>>> ", history);

      return history;
   }

   @Query(() => [UserLocAsg])
   async UserLocAsg(
      @Arg("userId", { nullable: true }) userId: string,
      @Arg("locationId", { nullable: true }) locationId: string,
      @Arg("startDate") startDate: string,
      @Arg("endDate") endDate: string,
      @Arg("first", { nullable: true }) first: number, //find-options take
      @Arg("offset", { nullable: true }) offset: number, //find-options skip
      @Arg("order", () => Order) order: Order // by dateTime
   ) {
      let whereObj = { dateTime: Between(startDate, endDate) };
      let otherProps = {};

      if (
         (locationId === undefined || locationId === "") &&
         (userId === undefined || userId === "")
      ) {
      } else if (
         (locationId === undefined || locationId === "") &&
         userId !== undefined &&
         userId !== ""
      ) {
         whereObj["userId"] = userId;
      } else if (
         (userId === undefined || userId === "") &&
         locationId !== undefined &&
         locationId !== ""
      ) {
         whereObj["locationId"] = locationId;
      } else {
         whereObj["userId"] = userId;
         whereObj["locationId"] = locationId;
      }

      if (first !== undefined) {
         otherProps["take"] = first;
      }

      if (offset !== undefined) {
         otherProps["skip"] = offset;
      }

      console.log(otherProps);

      const searchResults = await getRepository(UserLocAsg).find({
         where: whereObj,
         order: {
            dateTime: order,
         },
         ...otherProps,
      });

      return searchResults;
   }

   @Mutation(() => Boolean)
   async createUserLocAsg(
      @Arg("userId") userId: string,
      @Arg("locationId") locationId: string
   ) {
      const createUserLocAsg = await getRepository(UserLocAsg).save({
         userId,
         locationId,
      });

      console.log(createUserLocAsg);

      return true;
   }
}
