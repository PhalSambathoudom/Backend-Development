import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import db from './models/index.js';
import exercisesRoutes from './routes/exercises.routes.js';
import reportsRoutes from './routes/reports.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Week 9: Academic Performance & Sequelizing API',
      version: '1.0.0',
      description: 'API Endpoints for Week 9 Sequelize Database Practice & Academic Performance Reports'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development Server'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Week 9 Database Sequelizing & Academic Performance API',
    swagger_documentation: `http://localhost:${PORT}/api-docs`,
    exercises_endpoints: {
      ex1_high_performing: `/api/exercises/ex1`,
      ex2_score_range: `/api/exercises/ex2`,
      ex3_search: `/api/exercises/ex3?keyword=dara&minScore=70`,
      ex4_full_report: `/api/exercises/ex4`,
      ex5_average_scores: `/api/exercises/ex5`
    },
    part2_report_endpoints: {
      search_scores: `/api/reports/scores?keyword=dara&minScore=70`,
      student_performance: `/api/reports/student-performance`,
      course_performance: `/api/reports/course-performance`,
      major_performance: `/api/reports/major-performance`,
      top_students: `/api/reports/top-students`,
      at_risk_students: `/api/reports/at-risk-students`,
      pass_rate: `/api/reports/pass-rate`
    }
  });
});

// Register routes
app.use('/api/exercises', exercisesRoutes);
app.use('/api/reports', reportsRoutes);

// Sync Database & Start Server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');
    await db.sequelize.sync();
    console.log('Database synced successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
