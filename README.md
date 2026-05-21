# OpenMate

**OpenMate: The 0% Fee, Self-Hosted Platform for Creators**

OpenMate is a powerful, open-source alternative to Topmate.io designed to give creators, mentors, and professionals complete control over their time and earnings. Built with a premium, modern aesthetic, OpenMate empowers you to effortlessly monetize your expertise through 1:1 calls, text queries, and digital products.

Unlike traditional platforms that take a significant cut of your hard-earned revenue, OpenMate operates with **0% platform fees**. You own the platform, you own your data, and you keep 100% of your earnings (minus standard payment gateway fees). 

## Key Features

- 💸 **0% Platform Fees:** Stop giving away your revenue. You keep exactly what you earn. Payments go directly to your Stripe account.
- 🛡️ **Fully Self-Hosted & Open Source:** Deploy OpenMate on your own domain with a single Docker command. Total data ownership and ultimate privacy.
- 🗓️ **Seamless Scheduling & Bookings:** An intuitive public profile lets clients book timeslots, schedule 1:1 calls, and submit queries effortlessly.
- 🎨 **Premium, Dynamic Design:** Out-of-the-box support for sleek glassmorphism, micro-animations, and native dark mode to leave a stunning impression on your visitors.
- 🛠️ **Modern Architecture:** Built on the bleeding edge with Next.js (App Router), Prisma, and SQLite (easily swappable to PostgreSQL), ensuring blazing-fast performance and seamless scalability.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Stripe Account (for processing payments)

### Environment Variables

Create a `.env` file in the root of the project with the following:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database:
   ```bash
   npx prisma db push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
4. Open [http://localhost:3000](http://localhost:3000) with your browser. To login as a creator, simply enter a desired username; a test account will be automatically created.

### Self-Hosting (Docker)

OpenMate comes with a `docker-compose.yml` file for easy deployment.

1. Configure your `.env` variables in `docker-compose.yml` or a `.env` file.
2. Run the following command:
   ```bash
   docker-compose up -d --build
   ```

## License
MIT
