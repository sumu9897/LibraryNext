import { model, Schema } from "mongoose";
import { IBooks, IBookStaticMethod } from "../interfaces/books.interface";

const booksSchema = new Schema<IBooks>(
  {
    title: {
      type: String,
      required: true,
      max: [20, "Title -> {VALUE} should not longer than 20 character"],
      min: [1, "Title -> {VALUE} should not shorter than 1 character"],
      unique: [true, "Title -> {VALUE} should be unique; Maybe {VALUE} already exists on the database"],
    },
    author: {
      type: String,
      required: true,
      minlength: [1, "Author -> {VALUE} should not be shorter than 1 character"],
      maxlength: [20, "Author -> {VALUE} should not be longer than 20 characters"],
    },
    genre: {
      type: String,
      required: true,
      uppercase: true,
      enum: {
        values: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
        message: "Genre -> {VALUE} is not supported. Please use one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
      },
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "No description provided",
      minlength: [10, "Description -> {VALUE} should not be shorter than 8 characters"],
      maxlength: [120, "Description -> {VALUE} should not be longer than 100 characters"],
    },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies -> {VALUE} should not be a non-negative number"],
    },
    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware: Ensure availability status is accurate before save
booksSchema.pre("save", function (next) {
  if (this.copies === 0) {
    this.availability = false;
  } else {
    this.availability = true;
  }
  next();
});

// Post-save middleware: Log creation
booksSchema.post("save", function (doc) {
  console.log(`A new book titled "${doc.title}" was saved with ID: ${doc._id}`);
});

// Pre-findOneAndUpdate middleware: Access data before update
booksSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IBooks>;
  if (update && typeof update.copies === "number") {
    update.availability = update.copies > 0;
    this.setUpdate(update);
  }
  next();
});

// Post-findOneAndUpdate middleware: Log update
booksSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    console.log(`Book with ID: ${doc._id} has been updated`);
  }
});

// Static method: Adjust copies after borrowing
booksSchema.static("adjustCopiesAfterBorrow", async function (bookId: string, quantity: number): Promise<boolean> {
  const book = await this.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  if (book.copies < quantity) {
    throw new Error("Not enough copies available");
  }

  book.copies -= quantity;
  if (book.copies === 0) {
    book.availability = false;
  }

  await book.save();
  return true;
});

export const Books = model<IBooks, IBookStaticMethod>("Books", booksSchema);
