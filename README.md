# 🚨 Disaster Management System

A comprehensive real-time disaster management and emergency response platform built with Next.js 15, designed to coordinate emergency operations, monitor environmental conditions, and manage resources during crisis situations.

## 🌟 Features

### 🏠 **Core Functionality**

- **Real-time Dashboard** - Central command center with live data monitoring
- **Emergency Alerts** - Automated alert generation and broadcasting system
- **Resource Management** - Track and allocate emergency resources efficiently
- **Evacuation Coordination** - Manage evacuation zones, routes, and shelters
- **Communication Center** - Multi-channel emergency communication system
- **Sensor Network** - Environmental monitoring with IoT sensor integration

### 📊 **Advanced Capabilities**

- **Analytics & Reporting** - Performance metrics and disaster analysis
- **Data Management** - Comprehensive data storage and backup systems
- **Emergency Protocols** - Standard operating procedures management
- **System Settings** - Configurable thresholds and user management

### 🔧 **Technical Features**

- Real-time data updates and monitoring
- Responsive design for desktop, tablet, and mobile
- Role-based access control and security
- Database integration with automated backups
- RESTful API for external system integration
- Export capabilities for reports and data analysis

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Neon PostgreSQL
- **Authentication**: JWT-based authentication
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Neon PostgreSQL database account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/disaster-management-system.git
   cd disaster-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   DATABASE_URL="your_neon_database_url"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**

   Run the database setup scripts:

   ```bash
   # Execute the SQL scripts in order
   npm run db:setup
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open Application**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
disaster-management-system/
├── app/                          # Next.js App Router pages
│   ├── alerts/                   # Emergency alerts management
│   ├── analytics/                # Analytics and reporting
│   ├── communication/            # Communication center
│   ├── data/                     # Data management
│   ├── evacuation/               # Evacuation coordination
│   ├── monitoring/               # Real-time monitoring
│   ├── protocols/                # Emergency protocols
│   ├── resources/                # Resource management
│   ├── sensors/                  # Sensor network management
│   ├── settings/                 # System settings
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard (home page)
├── components/                   # Reusable React components
│   ├── ui/                       # shadcn/ui components
│   └── ...                       # Custom components
├── lib/                          # Utility functions and configurations
│   ├── actions.ts                # Server actions for database operations
│   ├── db.ts                     # Database connection
│   └── utils.ts                  # Utility functions
├── scripts/                      # Database setup and utility scripts
│   ├── setup-database.sql        # Initial database schema
│   ├── seed-data.sql             # Sample data insertion
│   └── ...                       # Additional setup scripts
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
└── README.md                     # This file
```

## 🗄️ Database Schema

The system uses the following main tables:

- **alerts** - Emergency alerts and warnings
- **sensors** - Environmental monitoring sensors
- **sensor_readings** - Real-time sensor data
- **resources** - Emergency resource inventory
- **resource_allocations** - Resource deployment tracking
- **evacuation_zones** - Evacuation area management
- **evacuation_routes** - Evacuation route planning
- **shelters** - Emergency shelter information
- **messages** - Communication and broadcast messages
- **system_logs** - System activity logging
- **users** - User management and authentication

## 🎯 Usage Guide

### 🏠 **Dashboard**

- Monitor real-time system status
- View active alerts and warnings
- Check resource availability
- Track evacuation progress

### 🚨 **Emergency Response**

1. **Create Alert**: Navigate to Alerts page → Create New Alert
2. **Allocate Resources**: Go to Resources → Allocate to affected areas
3. **Coordinate Evacuation**: Use Evacuation page to manage zones and routes
4. **Broadcast Communications**: Send updates via Communication Center

### 📊 **Monitoring & Analytics**

- View sensor data in real-time on Monitoring page
- Generate reports from Analytics page
- Export data for external analysis
- Track system performance metrics

## 🔧 Configuration

### Alert Thresholds

Configure automatic alert generation thresholds in Settings:

- Temperature extremes
- Water level warnings
- Air quality alerts
- Seismic activity thresholds

### User Roles

- **Administrator**: Full system access
- **Emergency Coordinator**: Alert and resource management
- **Operator**: Monitoring and basic operations
- **Viewer**: Read-only access to dashboards

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**

   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Environment Variables**
   Add your environment variables in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add appropriate loading states
- Write descriptive commit messages
- Test thoroughly before submitting PRs

## 📝 API Documentation

### Server Actions

The system uses Next.js Server Actions for database operations:

- `getAlerts()` - Fetch emergency alerts
- `createAlert(data)` - Create new alert
- `getSensors()` - Get sensor network status
- `getResources()` - Fetch resource inventory
- `allocateResource(data)` - Allocate resources
- `getEvacuationZones()` - Get evacuation information

### External Integrations

- Weather API integration for meteorological data
- Government emergency systems connectivity
- Mobile carrier integration for SMS alerts
- Social media platform APIs for public communication

## 🔒 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- HTTPS enforcement in production
- Regular security audits recommended

## 📊 Performance

- Server-side rendering for optimal performance
- Database query optimization
- Caching strategies for frequently accessed data
- Responsive design for all device types
- Progressive Web App (PWA) capabilities

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**

- Verify DATABASE_URL in environment variables
- Check Neon database status and connectivity
- Ensure database schema is properly set up

**Authentication Problems**

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

**Build Errors**

- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npm run type-check`
- Verify environment variables are properly set

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Neon](https://neon.tech/) - PostgreSQL database platform
- [Lucide](https://lucide.dev/) - Icon library
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for emergency response and disaster management**
