import { isObjectId, toObjectId } from "../utils";
import { Model } from "mongoose";

export interface IQueryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPopulateOption {
  from: string;
  localField: string;
  foreignField: string;
  as?: string;
  unwind?: boolean; // whether to use $unwind for a single populated doc
}

export class QueryBuilder<T> {
  private model: Model<T>;
  pipeline: any[];
  private queryObj: Record<string, any>;
  private static defaultLimit = 50;
  private static defaultPage = 1;

  constructor(model: Model<T>, queryObj: Record<string, any>) {
    this.model = model;
    this.pipeline = [];
    this.queryObj = queryObj;
  }

  // Add a single computed field
  // ======================
  addField(fieldPath: string, value: any): this {
    this.pipeline.push({
      $addFields: { [fieldPath]: value },
    });

    return this;
  }

  // Select or projection
  // ======================
  select(fields: string): this {
    if (!fields) return this;

    const fieldArr = fields
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const projection: Record<string, 1 | 0> = {};

    let inclusionCount = 0;
    let exclusionCount = 0;

    for (const field of fieldArr) {
      const isExcluded = field.startsWith("-");
      const cleanField = field.replace(/^-/, "");

      if (cleanField !== "_id") {
        isExcluded ? exclusionCount++ : inclusionCount++;
      }

      projection[cleanField] = isExcluded ? 0 : 1;
    }

    // Validate: can't mix inclusion and exclusion (except for _id)
    if (inclusionCount > 0 && exclusionCount > 0) {
      throw new Error(
        "Cannot mix inclusion and exclusion in projection, except excluding _id.",
      );
    }

    this.pipeline.push({ $project: projection });
    return this;
  }

  // Pick one element from array
  // ======================
  extractFromArray(arrayField: string, newField: string, index: number): this {
    this.pipeline.push({
      $addFields: {
        [newField]: { $arrayElemAt: [`$${arrayField}`, index] },
      },
    });

    return this;
  }

  // ReplaceRoot
  // ======================
  replaceRoot(newRootField: string): this {
    this.pipeline.push({
      $replaceRoot: { newRoot: `$${newRootField}` },
    });
    return this;
  }

  // Remove a single field
  // ======================
  removeField(field: string): this {
    this.pipeline.push({
      $project: {
        [field]: 0,
      },
    });

    return this;
  }

  // Filter
  // ======================
  filter(additionalFields: string[] = []): this {
    const queryObj = { ...this.queryObj };
    const excludeFields = [
      "page",
      "sort",
      "limit",
      "limitFields",
      "search",
      ...additionalFields,
    ];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Convert operators to MongoDB format (e.g., gte -> $gte)
    const operatorPattern = /\b(gte|gt|lte|lt|ne|in|nin|regex)\b/g;
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(operatorPattern, (match) => `$${match}`);

    // Convert to object
    const mongoQueryObject = JSON.parse(queryStr);

    const convertToArrayOperators = ["$in", "$nin"];

    for (const key in mongoQueryObject) {
      const value = mongoQueryObject[key];

      // Convert to ObjectId if it's a valid ObjectId string
      if (typeof value === "string" && isObjectId(value)) {
        mongoQueryObject[key] = toObjectId(value);
      }

      // Handle $in/$nin string-to-array conversion
      else if (typeof value === "object") {
        for (const keyInValueObj in value) {
          if (
            convertToArrayOperators.includes(keyInValueObj) &&
            typeof value[keyInValueObj] === "string"
          ) {
            value[keyInValueObj] = value[keyInValueObj].split(",");
          } else if (
            typeof value[keyInValueObj] === "string" &&
            isObjectId(value[keyInValueObj])
          ) {
            value[keyInValueObj] = toObjectId(value[keyInValueObj]);
          }
        }
      }

      // Convert string booleans to actual booleans
      else if (value === "true" || value === "false") {
        mongoQueryObject[key] = value === "true";
      }
    }

    this.pipeline.push({ $match: mongoQueryObject });
    return this;
  }

  // if custom mongo needed
  customMethod(pipelineStages: Record<string, any>[]): this {
    this.pipeline.push(...pipelineStages);
    return this;
  }

  // unwind
  // ======================
  unwind(field: string): this {
    this.pipeline.push({ $unwind: `$${field}` });
    return this;
  }

  // Sort
  // ======================
  sort(): this {
    const sortBy = this.queryObj.sort || "-createdAt";
    const sortFields: Record<string, 1 | -1> = {};

    sortBy.split(",").forEach((field: string) => {
      const trimmed = field.trim();
      sortFields[trimmed.replace("-", "")] = trimmed.startsWith("-") ? -1 : 1;
    });

    this.pipeline.push({ $sort: sortFields });
    return this;
  }

  // Limit fields
  // ======================
  limitFields(): this {
    if (this.queryObj.limitFields) {
      const fields = this.queryObj.limitFields
        .split(",")
        .reduce((acc: any, field: string) => {
          acc[field.trim()] = 1;
          return acc;
        }, {});

      this.pipeline.push({ $project: { ...fields } });
    } else {
      this.pipeline.push({ $project: { __v: 0 } });
    }

    return this;
  }

  // Paginate
  // ======================
  paginate(): this {
    const page = parseInt(this.queryObj.page, 10) || QueryBuilder.defaultPage;
    const limit =
      parseInt(this.queryObj.limit, 10) || QueryBuilder.defaultLimit;
    const skip = (page - 1) * limit;

    this.pipeline.push({ $skip: skip }, { $limit: limit });

    return this;
  }

  countArrayLength(arrayField: string, newField: string): this {
    this.pipeline.push({
      $addFields: {
        [newField]: {
          $cond: {
            if: { $isArray: `$${arrayField}` },
            then: { $size: `$${arrayField}` },
            else: 0,
          },
        },
      },
    });

    return this;
  }

  // search
  // supports only 1 level deep nested arrays
  // ======================
  search(searchFields: string[]): this {
    const searchText = this.queryObj.search;

    if (searchText && searchFields.length > 0) {
      const unwindPaths = new Set();
      const matchConditions = [];

      // Step 1: Prepare unwind stages and match conditions
      for (const field of searchFields) {
        const parts = field.split(".");
        if (parts.length > 1) {
          unwindPaths.add(parts[0]);
        }

        matchConditions.push({
          [field]: { $regex: searchText, $options: "i" },
        });
      }

      // Add __original field to preserve the full document
      this.pipeline.push({
        $addFields: { __original: "$$ROOT" },
      });

      // Step 2: Add unwind stages
      for (const path of [...unwindPaths]) {
        this.pipeline.push({
          $unwind: { path: `$${path}`, preserveNullAndEmptyArrays: true },
        });
      }

      // Step 3: Add match stage
      this.pipeline.push({
        $match: { $or: matchConditions },
      });

      // Rewind original document
      this.pipeline.push(
        {
          $group: {
            _id: "$_id",
            fullDoc: { $first: "$__original" },
          },
        },
        {
          $replaceRoot: { newRoot: "$fullDoc" },
        },
      );
    }
    return this;
  }

  // match
  // ======================
  match(conditions: Record<string, any>): this {
    this.pipeline.push({ $match: conditions });
    return this;
  }

  // populate
  // ======================
  populate({
    localField,
    from,
    as,
    foreignField,
    unwind = false,
  }: IPopulateOption): this {
    const asField = as || localField;

    this.pipeline.push({
      $lookup: {
        from: from,
        localField: localField,
        foreignField: foreignField,
        as: asField,
      },
    });

    if (unwind) {
      this.pipeline.push({
        $unwind: {
          path: `$${asField}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    }

    return this;
  }

  // Meta
  // ======================
  async getQueryMeta(): Promise<IQueryMeta> {
    const countPipeline = this.pipeline.filter(
      (stage) =>
        !("$skip" in stage || "$limit" in stage || "$project" in stage),
    );

    countPipeline.push({ $count: "total" });

    const result = await this.model.aggregate(countPipeline);
    const total = result[0]?.total || 0;

    const limit = Number(this.queryObj.limit) || QueryBuilder.defaultLimit;
    const page = Number(this.queryObj.page) || QueryBuilder.defaultPage;
    const totalPages = Math.ceil(total / limit);

    return { total, page, limit, totalPages };
  }

  // Execute pipeline
  // ======================
  async exec(): Promise<T[]> {
    return await this.model.aggregate(this.pipeline);
  }
}
