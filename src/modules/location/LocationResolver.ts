import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { getRepository, Brackets } from "typeorm";
import { Location } from "entity/Location";
import bcrypt from "bcryptjs";

@Resolver()
export class LocationResolver {
   @Query(() => String)
   async LocationHello() {
      console.log("Location Hello");
      return "Location Hello";
   }

   @Query(() => Location)
   async Location(@Arg("id") id: string) {
      const locationData = await getRepository(Location)
         .createQueryBuilder("loc")
         .where("loc.id = :id", { id })
         .getOne();

      return locationData;
   }

   @Query(() => Boolean)
   async isIdPhraseTaken(@Arg("idPhrase") idPhrase: string) {
      const idCheck = await getRepository(Location)
         .createQueryBuilder("loc")
         .select("loc.idPhrase")
         .where("loc.idPhrase = :idPhrase", { idPhrase })
         .getOne();

      console.log("taken>>> ", idCheck);

      return idCheck !== undefined;
   }

   @Mutation(() => Location)
   async loginLocation(
      @Arg("phoneNo") phoneNo: string,
      @Arg("password") password: string
   ) {
      const location = await getRepository(Location)
         .createQueryBuilder("loc")
         .where("loc.phoneNo = :phoneNo", { phoneNo })
         .getOne();

      if (location === undefined) {
         throw new Error("PhoneNo does not exist. Please register.");
      }

      const validatePassword = await bcrypt.compare(password, location.password);

      if (!validatePassword) {
         throw new Error("Invalid password");
      }

      return location;
   }

   @Mutation(() => Boolean)
   async createLocation(
      @Arg("name") name: string,
      @Arg("phoneNo") phoneNo: string,
      @Arg("email") email: string,
      @Arg("password") password: string,
      @Arg("address") address: string,
      @Arg("idPhrase") idPhrase: string
   ) {
      const currentLocation = await getRepository(Location)
         .createQueryBuilder("loc")
         .where("loc.address = :address", { address })
         .orWhere("loc.idPhrase = :idPhrase", { idPhrase })
         .orWhere("loc.phoneNo = :phoneNo", { phoneNo })
         .getOne();

      if (currentLocation !== undefined) {
         throw new Error("Address or idPhrase or phoneNo is already in use.");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const createLocation = await getRepository(Location).save({
         name,
         phoneNo,
         email,
         password: hashedPassword,
         address,
         idPhrase,
      });

      console.log(createLocation);

      return true;
   }

   @Mutation(() => Boolean)
   async updateLocation(
      @Arg("name") name: string,
      @Arg("phoneNo") phoneNo: string,
      @Arg("email") email: string,
      @Arg("password") password: string,
      @Arg("address") address: string,
      @Arg("idPhrase") idPhrase: string,
      @Arg("id") id: string
   ) {
      const currentLocation = await getRepository(Location)
         .createQueryBuilder("loc")
         .where("loc.id != :id", { id })
         .andWhere(
            new Brackets((qb) => {
               qb.where("loc.address = :address", {
                  address,
               })
                  .orWhere("loc.idPhrase = :idPhrase", { idPhrase })
                  .orWhere("loc.phoneNo = :phoneNo", { phoneNo });
            })
         )
         .getOne();

      if (currentLocation !== undefined) {
         throw new Error("Address or idPhrase is already in use.");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const updateLocation = await getRepository(Location).save({
         id,
         name,
         phoneNo,
         email,
         password: hashedPassword,
         address,
         idPhrase,
      });

      console.log(updateLocation);

      return true;
   }
}
