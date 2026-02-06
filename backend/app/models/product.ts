import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  size?: string[];
  color?: string[];
  image: string;
  desc?: string;
  category: string;
  price: number;
  isDeleted: boolean;

  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    size: [{
        type: String,
    }],
    color: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        default: "default.png"
    },
    desc: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        default: 0
    },

     isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
}, {
    timestamps: true
});

export default mongoose.model<IProduct>("Product", productSchema);
