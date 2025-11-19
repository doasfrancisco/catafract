import { expect, test } from "bun:test";
import { uploadToBlob, saveToCosmos } from '../lib/azure';

test("Azure Blob Storage upload", async () => {
    const testContent = Buffer.from('Hello Azure!');
    const timestamp = Date.now();
    const filename = `test-${timestamp}.txt`;

    const blobUrl = await uploadToBlob(testContent, filename, 'text/plain');

    expect(blobUrl).toBeDefined();
    expect(typeof blobUrl).toBe('string');
    expect(blobUrl).toContain('blob.core.windows.net');
});

test("Azure Cosmos DB write", async () => {
    const timestamp = Date.now();
    const testItem = {
        id: `test-${timestamp}`,
        type: 'verification-test',
        timestamp: new Date().toISOString(),
        blobUrl: 'https://catafract.blob.core.windows.net/catafract/test.txt'
    };

    const savedItem = await saveToCosmos(testItem);

    expect(savedItem).toBeDefined();
    expect(savedItem.id).toBe(testItem.id);
    expect(savedItem.type).toBe('verification-test');
});

// TODO: Remove this test after verifying CI/CD pipeline blocks deployment on failure
test("Intentional failure test", () => {
    expect(1 + 1).toBe(4); // This will fail on purpose
});

