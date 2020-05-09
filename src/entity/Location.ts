import { Entity, Column, Unique } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { EntityBase } from "./Base";

@ObjectType({ implements: EntityBase })
@Entity({ name: "c_location" })
@Unique(["address", "idPhrase"])
export class Location extends EntityBase {
   @Column()
   @Field()
   idPhrase: string;
}
