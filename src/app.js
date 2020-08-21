const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * middleware that validate if 'id' params exists
 */
const validateId = (req, res, next) => {
  const { id } = req.params;

  // validate if exists
  const idx = repositories.findIndex((repo) => repo.id === id);
  if (idx < 0) {
    return res.status(400).json({ error: 'data not found' });
  }

  // continue
  return next();
};
app.use('/repositories/:id', validateId);

/**
 * GET /repositories: Rota que lista todos os repositórios;
 */
app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

/**
 * POST /repositories: A rota deve receber
 * title, url e techs dentro do corpo da requisição,
 * sendo a URL o link para o github desse repositório.
 * Ao cadastrar um novo projeto, ele deve ser armazenado
 * dentro de um objeto no seguinte formato:
 * {
 *    id: "uuid",
 *    title: 'Desafio Node.js',
 *    url: 'http://github.com/...',
 *    techs: ["Node.js", "..."],
 *    likes: 0
 * };
 * Certifique-se que o ID seja um UUID, e de
 * sempre iniciar os likes como 0.
 */
app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuidv4(), title, url, techs, likes: 0 };

  repositories.push(repo);

  return response.json(repo);
});

/**
 * PUT /repositories/:id: A rota deve alterar
 * apenas o title, a url e as techs do repositório
 * que possua o id igual ao id presente nos parâmetros da rota;
 */
app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const idx = repositories.findIndex((repo) => repo.id === id);

  const { title, url, techs } = request.body;

  const repo = {
    ...repositories[idx],
    title,
    url,
    techs,
  };

  repositories[idx] = repo;

  return response.json(repo);
});

/**
 * DELETE /repositories/:id: A rota deve deletar o repositório
 * com o id presente nos parâmetros da rota;
 */
app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const idx = repositories.findIndex((repo) => repo.id === id);
  repositories.splice(idx, 1);
  return response.status(204).send();
});

/**
 * POST /repositories/:id/like: A rota deve aumentar o número de likes
 * do repositório específico escolhido através do id
 * presente nos parâmetros da rota, a cada chamada dessa
 * rota, o número de likes deve ser aumentado em 1;
 */
app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repo = repositories.find((repo) => repo.id === id);
  repo.likes++;
  return response.json(repo);
});

module.exports = app;
