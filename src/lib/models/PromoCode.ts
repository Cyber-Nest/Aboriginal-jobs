import { Schema, model, models } from "mongoose";

const PromoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    packageName: {
      type: String,
      required: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    maxUses: {
      type: Number,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

PromoCodeSchema.index({
  code: 1,
});

export const PromoCode =
  models.PromoCode || model("PromoCode", PromoCodeSchema);
