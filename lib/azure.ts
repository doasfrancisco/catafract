import { BlobServiceClient } from "@azure/storage-blob";
import { CosmosClient } from "@azure/cosmos";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING || ""
);

const cosmosClient = new CosmosClient(
  process.env.AZURE_COSMOS_CONNECTION_STRING || ""
);

const containerName = "catafract";
const databaseName = "catafract";

const usersContainer = "users";
const projectsContainer = "projects";
const canvasesContainer = "canvas";
const generationsContainer = "generations";
const templatesContainer = "templates";
const tiktokPromptsContainer = "tiktok_prompts";

export async function uploadToBlob(file: Buffer, filename: string, mimeType: string): Promise<string> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: mimeType }
  });

  return blockBlobClient.url;
}

export async function uploadTemplate(template: any) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(templatesContainer);

  const { resource } = await container.items.create({
    id: crypto.randomUUID(),
    ...template
  });
  return resource;
}

export async function listTemplates() {
  const database = cosmosClient.database(databaseName);
  const container = database.container(templatesContainer);

  const { resources } = await container.items.readAll().fetchAll();
  return resources;
}

export async function saveToCosmos(item: any) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(generationsContainer);

  const { resource } = await container.items.create(item);
  return resource;
}

export async function createUser(user: any) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(usersContainer);

  const newUser = { ...user, id: crypto.randomUUID() }
  const { resource } = await container.items.create(newUser);
  return resource;
}

export async function getUser(email: string) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(usersContainer);

  try {
    const { resources } = await container.items.query({
      query: "SELECT * FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email }]
    }, { partitionKey: email }).fetchAll();

    if (resources.length > 0) {
      return resources[0];
    }

    return null;
  } catch (error) {
    console.log("Error finding user:", error);
    return null;
  }
}

export async function updateUser(id: string, data: any) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(usersContainer);

  const { resources } = await container.items.query({
    query: "SELECT * FROM c WHERE c.id = @id",
    parameters: [{ name: "@id", value: id }]
  }).fetchAll();

  if (resources.length > 0) {
    const existingUser = resources[0];
    const updatedUser = { ...existingUser, ...data };

    const { resource } = await container.item(id, existingUser.email).replace(updatedUser);
    return resource;
  }
  if (data.email && id) {
    const { resource } = await container.items.create({
      id,
      ...data
    });
    return resource;
  }
  console.error(`Cannot create user ${id} without email (partition key)`);
  return null;
}

export async function createProject(project: any) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(projectsContainer);

  const { resource } = await container.items.create(project);
  return resource;
}

export async function getProjects(userId: string) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(projectsContainer);

  try {
    const { resources } = await container.items.query({
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: userId }]
    }).fetchAll();

    return resources;
  } catch (error) {
    console.log("Error finding projects:", error);
    return [];
  }
}

export async function saveCanvas(canvas: any) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(canvasesContainer);

  const { resource } = await container.items.upsert(canvas);
  return resource;
}

export async function getCanvas(projectId: string) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(canvasesContainer);

  try {
    const { resources } = await container.items.query({
      query: "SELECT * FROM c WHERE c.projectId = @projectId",
      parameters: [{ name: "@projectId", value: projectId }]
    }).fetchAll();

    if (resources.length > 0) {
      return resources[0];
    }

    return null;
  } catch (error) {
    console.log("Error finding canvas:", error);
    return null;
  }
}

export async function getTiktokPrompt(userId: string) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(tiktokPromptsContainer);

  try {
    const { resources } = await container.items.query({
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: userId }]
    }).fetchAll();

    if (resources.length > 0) {
      console.log("Found tiktok prompt:", resources[0]);
      return resources[0];
    }

    return null;
  } catch (error) {
    console.log("Error finding tiktok prompt:", error);
    return null;
  }
}

export async function saveTiktokPrompt(data: any) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(tiktokPromptsContainer);

  const { resource } = await container.items.upsert(data);
  return resource;
}
