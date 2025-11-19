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
const containerId = "generations";

export async function uploadToBlob(file: Buffer, filename: string, mimeType: string): Promise<string> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: mimeType }
  });

  return blockBlobClient.url;
}

export async function saveToCosmos(item: any) {
  const database = cosmosClient.database(databaseName);
  const container = database.container(containerId);

  const { resource } = await container.items.create(item);
  return resource;
}
