import { Entity, Column } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { EntityBase } from "./Base";

@ObjectType({ implements: EntityBase })
@Entity({ name: "c_user" })
export class User extends EntityBase {
   @Column()
   @Field()
   isAdmin: boolean;
}
