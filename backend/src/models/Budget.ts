import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  spent: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>({
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true,
    maxlength: [100, 'Budget name cannot exceed 100 characters']
  },
  category: {
    type: Schema.Types.ObjectId,
    required: [true, 'Category is required'],
    ref: 'Category'
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0.01, 'Budget amount must be greater than 0']
  },
  period: {
    type: String,
    required: [true, 'Budget period is required'],
    enum: {
      values: ['weekly', 'monthly', 'yearly'],
      message: 'Budget period must be one of: weekly, monthly, yearly'
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(this: IBudget, endDate: Date) {
        return endDate > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

budgetSchema.virtual('remaining').get(function() {
  return this.amount - this.spent;
});

budgetSchema.virtual('percentageUsed').get(function() {
  return this.amount > 0 ? (this.spent / this.amount) * 100 : 0;
});

budgetSchema.index({ category: 1, startDate: -1 });
budgetSchema.index({ isActive: 1, startDate: -1 });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
