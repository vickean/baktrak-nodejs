import { ObjectType, Field } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity({ name: "c_userlocasg" })
export class UserLocAsg {
   @PrimaryGeneratedColumn("uuid")
   @Field()
   id: string;

   @Column()
   @Field()
   userId: string;

   @Column()
   @Field()
   locationId: string;

   @Column({ default: new Date().toISOString() })
   @Field()
   dateTime: Date;
}
