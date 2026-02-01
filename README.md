# The Master Gym - Management System

A comprehensive gym management system built with Next.js, MongoDB, and TypeScript. Inspired by GymOwl, this system provides complete management for gym operations including members, enquiries, follow-ups, payments, and staff.

## Features

### Core Modules

- **Dashboard**: 
  - Search bar with "New Sales" creation
  - Quick access buttons for New Sale and New Enquiry
  - Real-time stats cards (Members, Sales, Balance, Follow-ups)
  - Pending follow-ups overview
  
- **Enquiries Module**: 
  - Track all gym enquiries
  - Lead management (Hot/Warm/Cold)
  - Trial booking status
  - Conversion tracking

- **Follow-ups Module**: 
  - Automated follow-up tracking
  - Types: Balance Due, Membership Renewal, General
  - Status management (Hot/Warm/Cold/Done)
  
- **Member Management**: 
  - Complete member database
  - Status tracking (Active/Inactive/Past)
  - Add Personal Training packages to existing members
  - Member search and filtering
  
- **Memberships**: 
  - Package management
  - Multiple training types (General, Personal, Complete Fitness, Group Ex)
  - Dynamic pricing and duration
  - Active member count per package

- **Payments**: 
  - Invoice generation
  - Payment tracking (Cash/Online/Cheque/Wallet)
  - Balance due monitoring
  - Payment status (PAID/PENDING/PARTIAL)

- **Reports**: 
  - **Balance Due Report**: Track outstanding payments
  - **Sales Report**: Revenue analytics with payment breakdowns

- **Teams**: 
  - Employee management
  - Role assignment
  - Salary tracking

### Dynamic Forms

- ✅ **New Sale Form**: Add new members directly from dashboard
- ✅ **New Enquiry Form**: Capture leads with full details
- ✅ **Add Package Form**: Create custom membership packages
- ✅ **Add PT Form**: Add personal training as separate add-on to existing members

### Personal Training Feature

Members can add personal training packages **separately** after joining:
- Independent from main membership
- Creates separate payment record
- Tracks PT sessions independently
- Allows flexible add-ons at any time

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Date Handling**: date-fns
- **Theme**: Dark/Light mode support

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Add your MongoDB connection string in the **Vars** section of the in-chat sidebar:
   - Variable Name: `MONGODB_URI`
   - Value: Your MongoDB connection string
   
   Example: `mongodb://localhost:27017/mastergym` or your MongoDB Atlas URL

3. **Seed the database:**
   ```bash
   npm run seed
   ```
   
   This creates sample data including:
   - 3 members
   - 7 membership packages
   - 3 payments
   - 3 employees
   - 3 follow-ups
   - 3 enquiries
   - 1 personal training session

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Collections

The system uses 8 MongoDB collections:

1. **members** - Member profiles and status
2. **memberships** - Package definitions
3. **payments** - Invoice and payment records
4. **employees** - Staff information
5. **attendance** - Member check-in/out
6. **followups** - Follow-up tasks
7. **enquiries** - Lead management
8. **personaltraining** - PT package add-ons

## API Routes

All API routes are RESTful and located in `app/api/`:

- `POST /api/members` - Create new member
- `POST /api/enquiries` - Create new enquiry
- `POST /api/memberships` - Create new package
- `POST /api/personal-training` - Add PT package to member
- `GET /api/[resource]` - Fetch records

## Color Theme

The application uses a **red and black** color scheme matching "The Master Gym" branding:
- Primary: Red/Crimson tones
- Accent: Black and dark grays
- Supports both light and dark modes
- Consistent design tokens throughout

## Key Features Explained

### Search & Create on Dashboard

The dashboard includes a search bar that allows:
- Searching existing members
- Creating new sales (members)
- Quick access to enquiry creation

### Personal Training as Add-on

Unlike traditional systems, PT packages are **separate add-ons**:
- Member joins with regular membership
- Can add PT at any time (e.g., after 6 months)
- Creates separate payment and tracking
- Allows flexibility for member upgrades

### Dynamic Forms

All forms are modal-based and include:
- Form validation
- Date pickers
- Dropdown selections
- Real-time feedback
- Database integration

## Project Structure

```
app/
├── (dashboard)/
│   ├── dashboard/          # Main dashboard
│   ├── enquiries/          # Enquiry management
│   ├── follow-ups/         # Follow-up tracking
│   ├── members/            # Member list
│   ├── memberships/        # Package management
│   ├── payments/           # Payment tracking
│   ├── reports/
│   │   ├── balance-due/    # Balance report
│   │   └── sales/          # Sales report
│   └── teams/
│       └── employees/      # Staff management
├── api/
│   ├── members/            # Member API
│   ├── enquiries/          # Enquiry API
│   ├── memberships/        # Package API
│   └── personal-training/  # PT API
components/
├── ui/                     # Shadcn components
├── app-sidebar.tsx         # Navigation
├── new-sale-dialog.tsx     # Add member form
├── new-enquiry-dialog.tsx  # Add enquiry form
├── add-package-dialog.tsx  # Add package form
└── add-pt-dialog.tsx       # Add PT form
lib/
├── db/
│   ├── schema.ts           # TypeScript types
│   └── queries.ts          # Database queries
└── mongodb.ts              # DB connection
scripts/
└── seed-mongodb.ts         # Seed script
```

## Contributing

Feel free to contribute by:
1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## Support

For issues or questions:
- Check the code comments
- Review the seed data structure
- Ensure MongoDB connection is properly configured

## License

MIT

---

**Built with ❤️ for The Master Gym**
"# gym" 
"# gym" 
