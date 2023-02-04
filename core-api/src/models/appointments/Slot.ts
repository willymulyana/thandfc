import { Field, InputType, ObjectType } from "type-graphql"

@InputType('slotInput')
@ObjectType()
export class Slot {
  public static INTERVAL = 15;

  @Field()
  doctorId: number;

  @Field()
  start: Date;

  @Field()
  end: Date;
}