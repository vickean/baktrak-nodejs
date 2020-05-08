import { Field, InterfaceType } from "type-graphql";
import { PrimaryGeneratedColumn, Column } from "typeorm";

@InterfaceType()
export abstract class EntityBase {
   @PrimaryGeneratedColumn("uuid")
   @Field()
   id: string;

   @Column()
   @Field()
   name: string;

   @Column()
   @Field()
   phoneNo: string;

   @Column()
   @Field()
   email: string;

   @Column()
   @Field()
   password: string;

   @Column()
   @Field()
   address: string;
}
