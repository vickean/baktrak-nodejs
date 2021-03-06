import { Entity, Column, Unique } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { EntityBase } from "./Base";

@ObjectType({ implements: EntityBase })
@Entity({ name: "c_user" })
@Unique(["phoneNo"])
export class User extends EntityBase {
   @Column({ default: false })
   @Field()
   isAdmin: boolean;
}
