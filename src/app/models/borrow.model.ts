import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import { Books } from "./books.model"; 

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


borrowSchema.pre("save", async function (next) {
  const book = await Books.findById(this.book);
  if (!book) {
    return next(new Error("Book not found"));
  }

  if (book.copies < this.quantity) {
    return next(new Error("Not enough copies available to borrow"));
  }

  book.copies -= this.quantity;
  book.availability = book.copies > 0;
  await book.save();
  next();
});


borrowSchema.post("save", function (doc) {
  console.log(`📚 Borrow record created for book ID: ${doc.book} with quantity: ${doc.quantity}`);
});


borrowSchema.pre("findOneAndDelete", async function (next) {
  const docToDelete = await this.model.findOne(this.getFilter());
  if (docToDelete) {
    const book = await Books.findById(docToDelete.book);
    if (book) {
      book.copies += docToDelete.quantity;
      book.availability = true;
      await book.save();
    }
  }
  next();
});


borrowSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    console.log(`🗑️ Borrow record deleted for book ID: ${doc.book}, restored quantity: ${doc.quantity}`);
  }
});


export const Borrow = model<IBorrow>("Borrow", borrowSchema);
