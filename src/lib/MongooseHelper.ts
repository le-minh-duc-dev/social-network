import mongoose, { FilterQuery } from "mongoose"

export class MongooseHelper {
  static toObjectId(id: string): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId: " + id)
    }
    return new mongoose.Types.ObjectId(id)
  }

  static buildCacheKey<T>(
    baseKey: string,
    filter: FilterQuery<T> = {}
  ): string {
    const sanitizedEntries = Object.entries(filter)
      .filter(([, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))

    const sanitizedObject = Object.fromEntries(sanitizedEntries)

    return baseKey + JSON.stringify(sanitizedObject)
  }
}
