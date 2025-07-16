const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./authRoutes');
const quartosRoutes = require('./quartosRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/quartos', quartosRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
