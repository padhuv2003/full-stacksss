
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');


const authRoutes = require('./routes/auth.routes'); 
const employeeRoutes = require('./routes/employee.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const errorMiddleware = require('./middlewares/error.middleware');


const swaggerDocument = YAML.load(path.join(__dirname ,"..",'docs', 'openapi.yaml')); 

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use(errorMiddleware);

module.exports = app;

