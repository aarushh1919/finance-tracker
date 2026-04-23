import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  date: Date;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['income', 'expense'],
      message: 'Transaction type must be either income or expense'
    }
  },
  category: {
    type: Schema.Types.ObjectId,
    required: [true, 'Category is required'],
    ref: 'Category'
  },
  account: {
    type: Schema.Types.ObjectId,
    required: [true, 'Account is required'],
    ref: 'Account'
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1, date: -1 });
transactionSchema.index({ account: 1, date: -1 });
transactionSchema.index({ type: 1, date: -1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
