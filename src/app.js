const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Repository ID.' });
  }

  return next();
}

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();
  const repository = { id, title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { params, body} = request;
  const { id } = params;
  const { title, url, techs } = body;

  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0 ) {
    return response.status(400).json({ error: 'Repository nod found.' });
  }

  const repository = repositories[index];
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0 ) {
    return response.status(400).json({ error: 'Repository nod found.' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repository = repositories[index];
  repository.likes += 1;

  return response.json(repository);

});

module.exports = app;
