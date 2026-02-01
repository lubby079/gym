import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  username: string
  password: string // hashed password
  name: string
  email?: string
  role: "admin"
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Member {
  _id?: ObjectId
  clientId: string
  name: string
  phone: string
  email?: string
  gender: "Male" | "Female" | "Other"
  status: "Active" | "Inactive" | "Past"
  membershipId?: ObjectId
  joiningDate: Date
  expiryDate?: Date
  address?: string
  emergencyContact?: string
  createdAt: Date
  updatedAt: Date
}

export interface Membership {
  _id?: ObjectId
  packageName: string
  duration: number // in months
  sessions: number
  price: number
  type: "General Training" | "Personal Training" | "Complete Fitness" | "Group Ex"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  _id?: ObjectId
  memberId: ObjectId
  invoiceNumber: string
  invoiceDate: Date
  planTotal: number
  discount: number
  total: number
  paid: number
  balance: number
  paymentMode: "Cash" | "Online" | "Cheque" | "Wallet" | "Other"
  status: "PAID" | "PENDING" | "PARTIAL"
  dueDate?: Date
  membershipId: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  _id?: ObjectId
  employeeId: string
  name: string
  phone: string
  email?: string
  role: string
  joiningDate: Date
  salary?: number
  status: "Active" | "Inactive"
  createdAt: Date
  updatedAt: Date
}

export interface Attendance {
  _id?: ObjectId
  memberId: ObjectId
  date: Date
  checkInTime: Date
  checkOutTime?: Date
  createdAt: Date
}

export interface FollowUp {
  _id?: ObjectId
  memberId: ObjectId
  type: "Balance Due" | "Membership Renewal" | "General"
  dueDate: Date
  status: "Hot" | "Warm" | "Cold" | "Done"
  comment: string
  createdAt: Date
  updatedAt: Date
}

export interface Enquiry {
  _id?: ObjectId
  enquiryNo: string
  enquiryDate: Date
  name: string
  phone: string
  email?: string
  gender: "Male" | "Female" | "Other"
  birthDate?: Date
  address?: string
  referredBy?: string
  remark?: string
  status: "Open" | "Close" | "Not Interested" | "Call Done" | "Call Not Connected"
  leadType?: "Hot" | "Warm" | "Cold"
  trialBooked: boolean
  handleBy?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PersonalTraining {
  _id?: ObjectId
  memberId: ObjectId
  packageName: string
  duration: number // in months
  sessions: number
  price: number
  startDate: Date
  endDate: Date
  status: "Active" | "Expired"
  createdAt: Date
  updatedAt: Date
}
